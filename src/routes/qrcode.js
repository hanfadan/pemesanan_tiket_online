// src/routes/qrcode.js
const router = require('express').Router();
const { generateQr } = require('../controllers/qrcodeController');

// Tidak perlu auth, karena dummy
router.get('/', generateQr);

module.exports = router;
