const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const clientesRoutes = require('./routes/clientes');
const animaisRoutes = require('./routes/animais');
const consultasRoutes = require('./routes/consultas');

app.use(cors());
app.use(express.json());

app.use('/clientes', clientesRoutes);
app.use('/animais', animaisRoutes);
app.use('/consultas', consultasRoutes);

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});
