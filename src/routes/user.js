// src/routes/user.js
const router = require('express').Router();
const { authenticate } = require('../controllers/userController');
const { getProfile, updateProfile } = require('../controllers/userController');
const multer = require('multer');
const path  = require('path');

// pastikan path ini menunjuk ke folder public/uploads
const upload = multer({
  dest: path.join(__dirname, '../../public/uploads')
});

// semua route di sini butuh token
router.use(authenticate);

// GET /api/user
router.get('/', getProfile);

// PUT /api/user
// form-data: name, email, username, phone, profile (file)
router.put(
  '/',
  upload.single('profile'),
  updateProfile
);

module.exports = router;
