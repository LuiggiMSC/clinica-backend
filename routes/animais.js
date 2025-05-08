const express = require('express');
const router = express.Router();
const animaisController = require('../controllers/animaisController');

router.get('/', animaisController.getTodosAnimal);
router.get('/:id', animaisController.getAnimalID);
router.post('/', animaisController.createAnimal);
router.put('/:id', animaisController.updateAnimal);
router.delete('/:id', animaisController.deleteAnimal);

module.exports = router;
