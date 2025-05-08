const pool = require('../db');

// GET todos bichinhos
exports.getTodosAnimal = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*, 
        c.nome AS cliente_nome, 
        c.telefone AS cliente_telefone, 
        c.email AS cliente_email
      FROM animais a
      JOIN clientes c ON a.cliente_id = c.id
    `); //se n fica impossivel de ler

    // mapear resultado p agrupar dados do cliente
    const animaisComCliente = result.rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      especie: row.especie,
      idade: row.idade,
      cliente_id: row.cliente_id,
      cliente: {
        nome: row.cliente_nome,
        telefone: row.cliente_telefone,
        email: row.cliente_email,
      }
    }));

    res.json(animaisComCliente);
  } catch (err) {
    console.error('ERRO BUSCAR ANIMAIS COM CLIENTE : ', err);
    res.status(500).json({ error: 'ERRO AO BUSCAR ANIMAIS' });
  }
};

exports.getAnimalID = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM animais WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'NÃO ENCONTRADO' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.createAnimal = async (req, res) => {
  const { nome, especie, idade, cliente_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO animais (nome, especie, idade, cliente_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, especie, idade, cliente_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.updateAnimal = async (req, res) => {
  const { id } = req.params;
  const { nome, especie, idade, cliente_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE animais SET nome = $1, especie = $2, idade = $3, cliente_id = $4 WHERE id = $5 RETURNING *',
      [nome, especie, idade, cliente_id, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'NÃO ENCONTRADO' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.deleteAnimal = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM animais WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ mensagem: 'NÃO ENCONTRADO' });
    res.json({ mensagem: 'Animal deletado ' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
