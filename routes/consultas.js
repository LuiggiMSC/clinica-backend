const express = require('express');
const router = express.Router();
const consultasController = require('../controllers/consultasController');
const autenticar = require('../middlewares/authMiddleware');

router.get('/', autenticar, consultasController.getTodosConsultas);
router.get('/:id', autenticar, consultasController.getConsultaID);
router.post('/', autenticar, consultasController.createConsulta);
router.put('/:id', autenticar, consultasController.updateConsulta);
router.delete('/:id', autenticar, consultasController.deleteConsulta);

module.exports = router;
