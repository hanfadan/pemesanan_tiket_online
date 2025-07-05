const pool   = require('../db');
const QRCode = require('qrcode');    // npm install qrcode
const path   = require('path');

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
 * generates a QR code image file and stores its URL in the record.
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { orderId, amount, method } = req.body;

    // 1. Insert payment record (status pending)
    const [result] = await pool.query(
      `INSERT INTO payments
         (order_id, amount, method, status, created_at)
       VALUES (?,        ?,      ?,      ?,      NOW())`,
      [orderId, amount, method, 'pending']
    );
    const paymentId = result.insertId;

    // 2. Generate QR image file
    const qrText     = `payment-${paymentId}`;
    const qrFilename = `payment-${paymentId}-${Date.now()}.png`;
    const uploadDir  = path.join(__dirname, '../../public/uploads/payments');
    const qrFilepath = path.join(uploadDir, qrFilename);

    // Pastikan folder upload ada
    // fs.mkdirSync(uploadDir, { recursive: true });

    await QRCode.toFile(qrFilepath, qrText);
    const qrUrl = `/uploads/payments/${qrFilename}`;

    // 3. Update record with qr_url
    await pool.query(
      `UPDATE payments
         SET qr_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [qrUrl, paymentId]
    );

    // 4. Fetch and return full record
    const [[payment]] = await pool.query(
      `SELECT id, order_id, amount, method, status, qr_url AS qrUrl, created_at, updated_at
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
      `SELECT id, order_id, amount, method, status, qr_url AS qrUrl, created_at, updated_at
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
