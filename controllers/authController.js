const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'EMAIL E SENHA SAO OBRIGATORIOS' });
  }

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];

    if (!usuario) return res.status(401).json({ erro: 'NÃO ENCONTRADO' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Senha invalida' });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
      expiresIn: '300s',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.registrar = async (req, res) => {
  const { email, senha, nome, telefone } = req.body;
    console.log('Recebido no cadastro:', { email, senha, nome, telefone });

  try {
    const hash = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (email, senha, nome, telefone) VALUES ($1, $2, $3, $4) RETURNING id, email, nome, telefone',
      [email, hash, nome, telefone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
  //console.log('RECEBIDO:', { email, senha, nome, telefone });
};


exports.getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, nome, telefone FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ erro: 'NÃO ENCONTRADO' });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


exports.updateMe = async (req, res) => {
  const { email, senha, nome, telefone } = req.body;

  //if (!email && !senha && !nome && !telefone) {
  //  return res.status(400).json({ erro: 'informe um dado pra atualizar' });
  //}

  try {
    const valores = [];
    const campos = [];
    let paramIndex = 1;

    if (email && email.trim() !== '') {
      const existe = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id <> $2',
        [email, req.usuario.id]
      );
      if (existe.rows.length > 0) {
        return res.status(400).json({ erro: 'EMAIL JA EM USO.' });
      }
      campos.push(`email = $${paramIndex++}`);
      valores.push(email);
    }

    if (senha && senha.trim() !== '') {
      const hash = await bcrypt.hash(senha, 10);
      campos.push(`senha = $${paramIndex++}`);
      valores.push(hash);
    }

    if (nome && nome.trim() !== '') {
      campos.push(`nome = $${paramIndex++}`);
      valores.push(nome);
    }

    if (telefone && telefone.trim() !== '') {
      campos.push(`telefone = $${paramIndex++}`);
      valores.push(telefone);
    }

    valores.push(req.usuario.id);

    const query = `
      UPDATE usuarios
      SET ${campos.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, nome, telefone
    `;

    const result = await pool.query(query, valores);
    res.json({ mensagem: 'Dados atualizados!', usuario: result.rows[0] });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


