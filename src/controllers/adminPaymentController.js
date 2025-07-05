// src/controllers/paymentController.js
const pool = require('../db');

/**
 * GET /api/payments
 */
exports.getPayments = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payments');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payments/:paymentId
 */
exports.getPaymentById = async (req, res, next) => {
  try {
    const paymentId = parseInt(req.params.paymentId, 10);
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE id = ?',
      [paymentId]
    );
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
