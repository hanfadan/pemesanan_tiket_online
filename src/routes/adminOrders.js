// adminOrders.js
const router = require('express').Router();
const { authenticate, isAdmin } = require('../controllers/userController');
const {
  getOrders,
  getEntryQr
} = require('../controllers/adminOrderController');

router.use(authenticate, isAdmin);

// GET /api/admin/orders
router.get('/', getOrders);

// GET /api/admin/orders/:orderId/entry-qr
router.get('/:orderId/entry-qr', getEntryQr);

module.exports = router;
