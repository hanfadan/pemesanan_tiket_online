// src/controllers/paymentController.js
const pool = require('../db');

/**
 * GET /api/payments/options
 * Returns static list of payment methods
 */
exports.getPaymentOptions = (req, res) => {
  res.json([
    { code: 'VA_BCA', name: 'Virtual Account BCA' },
    { code: 'VA_MANDIRI', name: 'Virtual Account Mandiri' },
    { code: 'QRIS', name: 'QRIS' }
  ]);
};

/**
 * POST /api/payments/initiate
 * Creates a new payment record linked to an order
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { orderId, amount, method } = req.body;
    const [result] = await pool.query(
      `INSERT INTO payments (order_id, amount, method)
       VALUES (?, ?, ?)`,
      [orderId, amount, method]
    );
    const paymentId = result.insertId;
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payments/:paymentId
 * Retrieves payment by ID
 */
exports.getPaymentById = async (req, res, next) => {
  try {
    const paymentId = parseInt(req.params.paymentId, 10);
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payments/:paymentId/qr
 * Returns QR code URL for a payment
 */
exports.getPaymentQr = async (req, res, next) => {
  try {
    const paymentId = parseInt(req.params.paymentId, 10);
    const [rows] = await pool.query(
      'SELECT qr_url AS qrUrl FROM payments WHERE id = ?',
      [paymentId]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ qrUrl: rows[0].qrUrl });
  } catch (err) {
    next(err);
  }
};
