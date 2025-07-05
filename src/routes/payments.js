const router    = require('express').Router();
const { authenticate } = require('../controllers/userController');
const {
  getPaymentOptions,
  initiatePayment,
  getPaymentById,
  getPaymentQr
} = require('../controllers/paymentController');

// Public
router.get('/options', getPaymentOptions);

// Authenticated
router.post('/initiate', authenticate, initiatePayment);
router.get('/:paymentId',    authenticate, getPaymentById);
router.get('/:paymentId/qr', authenticate, getPaymentQr);

module.exports = router;
