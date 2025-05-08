const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

router.get('/', clientesController.getTodosClientes);
router.get('/:id', clientesController.getClienteID);
router.post('/', clientesController.createCliente);
router.put('/:id', clientesController.updateCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;
