const pool = require('../db');

exports.getTodosClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.getClienteID = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'CLIENTE NÃO ENCONTRADO' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.createCliente = async (req, res) => {
  const { nome, telefone, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clientes (nome, telefone, email) VALUES ($1, $2, $3) RETURNING *',
      [nome, telefone, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE clientes SET nome = $1, telefone = $2, email = $3 WHERE id = $4 RETURNING *',
      [nome, telefone, email, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'CLIENTE NÃO ENCONTRADO' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.usuario.tipo !== 'admin') {
      return res.status(403).json({ erro: 'Apenas administradores podem remover registros.' });
    }
    else {
      const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ mensagem: 'CLIENTE NÃO ENCONTRADO' });
      res.json({ mensagem: 'Cliente deletado !' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
