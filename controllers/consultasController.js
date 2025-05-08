const pool = require('../db');

exports.getTodosConsultas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM consultas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.getConsultaID = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM consultas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'CONSULTA NÃO ENCONTRADA' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.createConsulta = async (req, res) => {
  const { animal_id, data_consulta, descricao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO consultas (animal_id, data_consulta, descricao) VALUES ($1, $2, $3) RETURNING *',
      [animal_id, data_consulta, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.updateConsulta = async (req, res) => {
  const { id } = req.params;
  const { animal_id, data_consulta, descricao } = req.body;
  try {
    const result = await pool.query(
      'UPDATE consultas SET animal_id = $1, data_consulta = $2, descricao = $3 WHERE id = $4 RETURNING *',
      [animal_id, data_consulta, descricao, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'CONSULTA NÃO ENCONTRADA' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.deleteConsulta = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM consultas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'CONSULTA NÃO ENCONTRADA' });
    res.json({ mensagem: 'Consulta deletada !' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
