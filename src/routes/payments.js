// src/routes/payments.js
const router    = require('express').Router();
const path      = require('path');
const multer    = require('multer');
const { authenticate } = require('../controllers/userController');
const {
  getPaymentOptions,
  initiatePayment,
  getPaymentById,
  getPaymentQr
} = require('../controllers/paymentController');

// 1. Setup storage Multer dengan ekstensi asli
const storagePayment = multer.diskStorage({
  destination: (req, file, cb) => {
    // sesuaikan folder uploads-mu
    cb(null, path.join(__dirname, '../../public/uploads/payments'));
  },
  filename: (req, file, cb) => {
    // ambil extension dari originalname
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random()*1e9);
    cb(null, name + ext);
  }
});
const uploadPayment = multer({ storage: storagePayment });

// Public
router.get('/options', getPaymentOptions);

// Authenticated
router.post(
  '/initiate',
  authenticate,
  uploadPayment.single('proof'),   // ← pastikan front-end kirim field 'proof'
  initiatePayment
);
router.get('/:paymentId',       authenticate, getPaymentById);
router.get('/:paymentId/qr',    authenticate, getPaymentQr);

module.exports = router;
