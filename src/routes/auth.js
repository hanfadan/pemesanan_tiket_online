const router = require('express').Router();
const { register, login, logout } = require('../controllers/authController');

// POST /api/register
router.post('/register', register);

// POST /api/login
router.post('/login', login);

// POST /api/logout
router.post('/logout', logout);

module.exports = router;
