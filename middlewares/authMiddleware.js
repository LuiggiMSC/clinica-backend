const jwt = require('jsonwebtoken');
const pool = require('../db'); // acessaro banco
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ erro: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await pool.query(
      'SELECT id, email, nome, telefone, tipo FROM usuarios WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'USUARIO NAO ENCONTRADO' });
    }

    req.usuario = result.rows[0]; 
    next();
  } catch (err) {
    res.status(401).json({ erro: 'Token invalido/expirado' });
  }
};
