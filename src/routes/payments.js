// src/routes/payments.js
const router = require('express').Router();
const { authenticate } = require('../controllers/userController');
const {
  getPaymentOptions,
  initiatePayment,
  getPaymentById,
  getPaymentQr
} = require('../controllers/paymentController');

// GET /api/payments/options → list metode pembayaran (public)
router.get('/options', getPaymentOptions);

// POST /api/payments/initiate → buat payment (pending) & generate QR (auth required)
router.post('/initiate', authenticate, initiatePayment);

// GET /api/payments/:paymentId → detail payment (auth required)
router.get('/:paymentId', authenticate, getPaymentById);

// GET /api/payments/:paymentId/qr → ambil QR URL (auth required)
router.get('/:paymentId/qr', authenticate, getPaymentQr);

module.exports = router;
