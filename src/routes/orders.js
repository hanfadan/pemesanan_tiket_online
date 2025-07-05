// src/routes/orders.js
const router = require('express').Router();
const { authenticate } = require('../controllers/userController');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// POST /api/orders         → buat order baru (default status: pending)
router.post('/', authenticate, createOrder);

// GET /api/orders          → daftar order milik user (opsional filter ?status=paid|pending|...)
router.get('/', authenticate, getOrders);

// GET /api/orders/:orderId → detail order
router.get('/:orderId', authenticate, getOrderById);

// PATCH /api/orders/:orderId/status → update status order (pending, paid, cancelled)
router.patch('/:orderId/status', authenticate, updateOrderStatus);

// DELETE /api/orders/:orderId → batalkan order
router.delete('/:orderId', authenticate, deleteOrder);

module.exports = router;
