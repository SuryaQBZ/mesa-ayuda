const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const requireAuth = require('../middlewares/auth.middleware');

router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/perfil', requireAuth, authController.perfil);

module.exports = router;