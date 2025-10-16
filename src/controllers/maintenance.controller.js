const pool = require('../config/database');

exports.list = async (req, res) => {
  const { property_id } = req.query;
  try {
    let query = `SELECT m.*, p.name as property_name FROM maintenances m
                 LEFT JOIN properties p ON m.property_id = p.id WHERE 1=1`;
    const params = [];

    if (property_id) {
      params.push(property_id);
      query += ` AND m.property_id = $${params.length}`;
    }

    if (req.userType === 'owner') {
      params.push(req.userId);
      query += ` AND p.owner_id = $${params.length}`;
    } else {
      params.push(req.userId);
      query += ` AND p.builder_id = $${params.length}`;
    }

    query += ` ORDER BY m.next_date ASC`;
    const result = await pool.query(query, params);
    res.json({ maintenances: result.rows });
  } catch (error) {
    console.error('Erro ao listar manutenções:', error);
    res.status(500).json({ error: 'Erro ao listar manutenções' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT m.*, p.name as property_name, p.owner_id, p.builder_id
       FROM maintenances m LEFT JOIN properties p ON m.property_id = p.id WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }

    const maintenance = result.rows[0];
    if (req.userType === 'owner' && maintenance.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    if (req.userType === 'builder' && maintenance.builder_id !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json({ maintenance });
  } catch (error) {
    console.error('Erro ao buscar manutenção:', error);
    res.status(500).json({ error: 'Erro ao buscar manutenção' });
  }
};

exports.create = async (req, res) => {
  const { property_id, item_name, description, frequency_months, last_date, next_date, priority, instructions } = req.body;
  try {
    const property = await pool.query('SELECT * FROM properties WHERE id = $1', [property_id]);
    
    if (property.rows.length === 0) {
      return res.status(404).json({ error: 'Propriedade não encontrada' });
    }

    if (req.userType === 'builder' && property.rows[0].builder_id !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await pool.query(
      `INSERT INTO maintenances (property_id, item_name, description, frequency_months, last_date, next_date, priority, status, instructions, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, NOW(), NOW()) RETURNING *`,
      [property_id, item_name, description, frequency_months, last_date, next_date, priority, instructions]
    );

    res.status(201).json({ message: 'Manutenção criada com sucesso', maintenance: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar manutenção:', error);
    res.status(500).json({ error: 'Erro ao criar manutenção' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { item_name, description, frequency_months, last_date, next_date, priority, status, instructions } = req.body;
  try {
    const checkMaintenance = await pool.query(
      `SELECT m.*, p.builder_id FROM maintenances m LEFT JOIN properties p ON m.property_id = p.id WHERE m.id = $1`,
      [id]
    );

    if (checkMaintenance.rows.length === 0) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }

    if (req.userType === 'builder' && checkMaintenance.rows[0].builder_id !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await pool.query(
      `UPDATE maintenances SET item_name = COALESCE($1, item_name), description = COALESCE($2, description),
       frequency_months = COALESCE($3, frequency_months), last_date = COALESCE($4, last_date), next_date = COALESCE($5, next_date),
       priority = COALESCE($6, priority), status = COALESCE($7, status), instructions = COALESCE($8, instructions), updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [item_name, description, frequency_months, last_date, next_date, priority, status, instructions, id]
    );

    res.json({ message: 'Manutenção atualizada com sucesso', maintenance: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar manutenção:', error);
    res.status(500).json({ error: 'Erro ao atualizar manutenção' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const checkMaintenance = await pool.query(
      `SELECT m.*, p.builder_id FROM maintenances m LEFT JOIN properties p ON m.property_id = p.id WHERE m.id = $1`,
      [id]
    );

    if (checkMaintenance.rows.length === 0) {
      return res.status(404).json({ error: 'Manutenção não encontrada' });
    }

    if (req.userType === 'builder' && checkMaintenance.rows[0].builder_id !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await pool.query('DELETE FROM maintenances WHERE id = $1', [id]);
    res.json({ message: 'Manutenção deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar manutenção:', error);
    res.status(500).json({ error: 'Erro ao deletar manutenção' });
  }
};
