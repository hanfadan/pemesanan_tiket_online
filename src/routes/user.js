const router = require('express').Router();
const { authenticate, getProfile, updateProfile } = require('../controllers/userController');

// semua route di sini butuh token
router.use(authenticate);

// GET /api/user
router.get('/', getProfile);

// PUT /api/user
router.put('/', updateProfile);

module.exports = router;
