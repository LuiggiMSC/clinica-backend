const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const autenticar = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.registrar);
router.get('/me', autenticar, authController.getMe);
router.put('/me', autenticar, authController.updateMe);

module.exports = router;
