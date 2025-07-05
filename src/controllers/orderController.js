// src/controllers/orderController.js
const pool = require('../db');

/**
 * POST /api/orders
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { eventId, userId, quantity, totalPrice } = req.body;
    const [result] = await pool.query(
      `INSERT INTO orders (event_id, user_id, quantity, total_price)
       VALUES (?, ?, ?, ?)`,
      [eventId, userId, quantity, totalPrice]
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
