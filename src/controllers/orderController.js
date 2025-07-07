// src/controllers/orderController.js
const pool = require('../db');

/**
 * POST /api/orders
 * Creates a new order with default status 'pending'
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { eventId, userId, quantity, ticketType } = req.body;

    // 1) Ambil harga dari events
    const [[event]] = await pool.query(
      'SELECT regular_price, vip_price FROM events WHERE id = ?',
      [eventId]
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // 2) Pilih harga sesuai kategori
    const unitPrice = ticketType === 'vip'
      ? event.vip_price
      : event.regular_price;

    // 3) Hitung total
    const totalPrice = unitPrice * quantity;

    // 4) Simpan order dengan semua detail
    const [result] = await pool.query(
      `INSERT INTO orders
         (event_id, user_id, quantity, ticket_type, ticket_price, total_price, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [eventId, userId, quantity, ticketType, unitPrice, totalPrice]
    );

    const orderId = result.insertId;
    const [[order]] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.status(201).json(order);

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
    let sql, params;

    if (req.user.role === 'admin') {
      sql    = 'SELECT * FROM orders';
      params = [];
      if (status) {
        sql   += ' WHERE status = ?';
        params.push(status);
      }
    } else {
      sql    = 'SELECT * FROM orders WHERE user_id = ?';
      params = [req.user.id];
      if (status) {
        sql   += ' AND status = ?';
        params.push(status);
      }
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
