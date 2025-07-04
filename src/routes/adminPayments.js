const router = require('express').Router();
const { authenticate, isAdmin } = require('../controllers/userController');
const {
  getPayments,
  getPaymentById,
  getPaymentQr
} = require('../controllers/adminPaymentController');

router.use(authenticate, isAdmin);

// GET /api/admin/payments
router.get('/', getPayments);

// GET /api/admin/payments/:paymentId
router.get('/:paymentId', getPaymentById);

// GET /api/admin/payments/:paymentId/qr
router.get('/:paymentId/qr', getPaymentQr);

module.exports = router;
