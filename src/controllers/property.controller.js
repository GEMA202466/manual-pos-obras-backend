const pool = require('../config/database');

exports.list = async (req, res) => {
  try {
    let query, params;

    if (req.userType === 'owner') {
      query = `SELECT p.*, u.name as owner_name FROM properties p
               LEFT JOIN users u ON p.owner_id = u.id
               WHERE p.owner_id = $1 ORDER BY p.created_at DESC`;
      params = [req.userId];
    } else {
      query = `SELECT p.*, u.name as owner_name FROM properties p
               LEFT JOIN users u ON p.owner_id = u.id
               WHERE p.builder_id = $1 ORDER BY p.created_at DESC`;
      params = [req.userId];
    }

    const result = await pool.query(query, params);
    res.json({ properties: result.rows });
  } catch (error) {
    console.error('Erro ao listar propriedades:', error);
    res.status(500).json({ error: 'Erro ao listar propriedades' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.*, u.name as owner_name, u.email as owner_email
       FROM properties p
       LEFT JOIN users u ON p.owner_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Propriedade não encontrada' });
    }

    const property = result.rows[0];

    if (req.userType === 'owner' && property.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    if (req.userType === 'builder' && property.builder_id !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json({ property });
  } catch (error) {
    console.error('Erro ao buscar propriedade:', error);
    res.status(500).json({ error: 'Erro ao buscar propriedade' });
  }
};

exports.create = async (req, res) => {
  if (req.userType !== 'builder') {
    return res.status(403).json({ error: 'Apenas construtoras podem criar propriedades' });
  }

  const { owner_id, name, address, property_type, construction_year, total_area, built_area, description, specifications } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO properties (owner_id, builder_id, name, address, property_type, construction_year, total_area, built_area, description, specifications, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING *`,
      [owner_id, req.userId, name, address, property_type, construction_year, total_area, built_area, description, JSON.stringify(specifications || {})]
    );

    res.status(201).json({ message: 'Propriedade criada com sucesso', property: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar propriedade:', error);
    res.status(500).json({ error: 'Erro ao criar propriedade' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, address, property_type, construction_year, total_area, built_area, description, specifications } = req.body;

  try {
    const checkProperty = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    
    if (checkProperty.rows.length === 0) {
      return res.status(404).json({ error: 'Propriedade não encontrada' });
    }

    if (req.userType === 'builder' && checkProperty.rows[0].builder_id !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await pool.query(
      `UPDATE properties SET name = COALESCE($1, name), address = COALESCE($2, address), property_type = COALESCE($3, property_type),
       construction_year = COALESCE($4, construction_year), total_area = COALESCE($5, total_area), built_area = COALESCE($6, built_area),
       description = COALESCE($7, description), specifications = COALESCE($8, specifications), updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [name, address, property_type, construction_year, total_area, built_area, description, specifications ? JSON.stringify(specifications) : null, id]
    );

    res.json({ message: 'Propriedade atualizada com sucesso', property: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar propriedade:', error);
    res.status(500).json({ error: 'Erro ao atualizar propriedade' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (req.userType !== 'builder') {
    return res.status(403).json({ error: 'Apenas construtoras podem deletar propriedades' });
  }

  try {
    const checkProperty = await pool.query('SELECT * FROM properties WHERE id = $1 AND builder_id = $2', [id, req.userId]);

    if (checkProperty.rows.length === 0) {
      return res.status(404).json({ error: 'Propriedade não encontrada' });
    }

    await pool.query('DELETE FROM properties WHERE id = $1', [id]);
    res.json({ message: 'Propriedade deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar propriedade:', error);
    res.status(500).json({ error: 'Erro ao deletar propriedade' });
  }
};

