const express = require('express');
const router = express.Router();
const animaisController = require('../controllers/animaisController');
const autenticar = require('../middlewares/authMiddleware');

router.get('/', autenticar, animaisController.getTodosAnimal);
router.get('/:id', autenticar, animaisController.getAnimalID);
router.post('/', autenticar, animaisController.createAnimal);
router.put('/:id', autenticar, animaisController.updateAnimal);
router.delete('/:id', autenticar, animaisController.deleteAnimal);

module.exports = router;
