const express = require('express');
const router = express.Router();
const consultasController = require('../controllers/consultasController');

router.get('/', consultasController.getTodosConsultas);
router.get('/:id', consultasController.getConsultaID);
router.post('/', consultasController.createConsulta);
router.put('/:id', consultasController.updateConsulta);
router.delete('/:id', consultasController.deleteConsulta);

module.exports = router;
