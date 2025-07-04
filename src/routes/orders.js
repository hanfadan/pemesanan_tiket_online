const router = require('express').Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder
} = require('../controllers/orderController');

// POST /api/orders         → buat order baru
router.post('/', createOrder);

// GET /api/orders          → daftar order milik user (opsional filter ?status=paid|pending|...)
router.get('/', getOrders);

// GET /api/orders/:orderId → detail order
router.get('/:orderId', getOrderById);

// DELETE /api/orders/:orderId → batalkan order
router.delete('/:orderId', deleteOrder);

module.exports = router;
