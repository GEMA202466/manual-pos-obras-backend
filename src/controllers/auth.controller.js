const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.register = async (req, res) => {
  const { name, email, password, user_type, company_name, phone } = req.body;

  try {
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, user_type, company_name, phone, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, name, email, user_type, company_name, phone, created_at`,
      [name, email, hashedPassword, user_type, company_name, phone]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.user_type);

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
        company_name: user.company_name,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(user.id, user.user_type);

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
        company_name: user.company_name,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, user_type, company_name, phone, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, phone, company_name } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           company_name = COALESCE($3, company_name),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, user_type, company_name, phone`,
      [name, phone, company_name, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' });
};

exports.getCurrentUser = exports.getProfile;

exports.refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.userId, req.userType);
    res.json({ token });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
};

exports.forgotPassword = async (req, res) => {
  res.status(501).json({ message: 'Funcionalidade em desenvolvimento' });
};

exports.resetPassword = async (req, res) => {
  res.status(501).json({ message: 'Funcionalidade em desenvolvimento' });
};

