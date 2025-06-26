const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const autenticar = require('../middlewares/authMiddleware');

router.get('/', autenticar, clientesController.getTodosClientes);
router.get('/:id', autenticar, clientesController.getClienteID);
router.post('/', autenticar, clientesController.createCliente);
router.put('/:id', autenticar, clientesController.updateCliente);
router.delete('/:id', autenticar, clientesController.deleteCliente);

module.exports = router;
