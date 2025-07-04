const router = require('express').Router();
const {
  getPaymentOptions,
  initiatePayment,
  getPaymentById,
  getPaymentQr
} = require('../controllers/paymentController');

// GET /api/payments/options
router.get('/options', getPaymentOptions);

// POST /api/payments/initiate
router.post('/initiate', initiatePayment);

// GET /api/payments/:paymentId
router.get('/:paymentId', getPaymentById);

// GET /api/payments/:paymentId/qr
router.get('/:paymentId/qr', getPaymentQr);

module.exports = router;
