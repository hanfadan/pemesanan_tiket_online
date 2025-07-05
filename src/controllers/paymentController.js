// src/controllers/paymentController.js
const pool = require('../db');

/**
 * GET /api/payments/options
 * Returns static list of payment methods
 */
exports.getPaymentOptions = (req, res) => {
  res.json([
    { code: 'VA_BCA',     name: 'Virtual Account BCA' },
    { code: 'VA_MANDIRI', name: 'Virtual Account Mandiri' },
    { code: 'QRIS',       name: 'QRIS' }
  ]);
};

/**
 * POST /api/payments/initiate
 * Creates a new payment record linked to an order, default status 'pending',
 * stores uploaded proof file (proof_url), and generates a QR URL.
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    // 1. Ambil data dari body + file
    const { orderId, amount, method } = req.body;
    const proofUrl = req.file
      ? `/uploads/payments/${req.file.filename}`
      : null;

    // 2. Masukkan record baru dengan proof_url
    const [result] = await pool.query(
      `INSERT INTO payments
         (order_id, amount, method, proof_url, status, created_at)
       VALUES (?,        ?,      ?,      ?,         ?,      NOW())`,
      [orderId, amount, method, proofUrl, 'pending']
    );
    const paymentId = result.insertId;

    // 3. Generate QR URL
    const qrText = `payment-${paymentId}`;
    const qrUrl  = `/api/qrcode?text=${encodeURIComponent(qrText)}`;
    await pool.query(
      `UPDATE payments
         SET qr_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [qrUrl, paymentId]
    );

    // 4. Ambil kembali full record untuk response
    const [[payment]] = await pool.query(
      `SELECT id, order_id, amount, method, proof_url, status, qr_url, created_at, updated_at
         FROM payments
       WHERE id = ?`,
      [paymentId]
    );

    res.status(201).json(payment);
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
    const [rows] = await pool.query(
      `SELECT id, order_id, amount, method, proof_url, status, qr_url, created_at, updated_at
         FROM payments
       WHERE id = ?`,
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
 * Returns QR code URL for a payment
 */
exports.getPaymentQr = async (req, res, next) => {
  try {
    const paymentId = parseInt(req.params.paymentId, 10);
    const [rows] = await pool.query(
      `SELECT qr_url AS qrUrl
         FROM payments
       WHERE id = ?`,
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
