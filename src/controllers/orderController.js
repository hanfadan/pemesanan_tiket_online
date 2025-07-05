// src/controllers/orderController.js
const pool = require('../db');

/**
 * POST /api/orders
 * Creates a new order with default status 'pending'
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { eventId, userId, quantity, totalPrice } = req.body;
    const [result] = await pool.query(
      `INSERT INTO orders (event_id, user_id, quantity, total_price, status)
       VALUES (?, ?, ?, ?, ?)`,
      [eventId, userId, quantity, totalPrice, 'pending']
    );
    const orderId = result.insertId;
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders
 * Optionally filter by status
 */
exports.getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/:orderId
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/orders/:orderId/status
 * Update order status to one of: pending, paid, cancelled
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { status } = req.body;
    const allowed = ['pending', 'paid', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }
    const [result] = await pool.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/orders/:orderId
 */
exports.deleteOrder = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
