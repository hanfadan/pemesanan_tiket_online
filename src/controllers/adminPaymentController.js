// src/controllers/paymentController.js (Admin Payment Controller)
const pool = require('../db');
const { sendEmail } = require('./notificationController');

/**
 * GET /api/admin/payments
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
 * GET /api/admin/payments/:paymentId
 */
exports.getPaymentById = async (req, res, next) => {
  try {
    const paymentId = parseInt(req.params.paymentId, 10);
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
    if (!rows.length) return res.status(404).json({ message: 'Payment not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/payments/:paymentId/qr
 */
exports.getPaymentQr = async (req, res, next) => {
  try {
    const paymentId = parseInt(req.params.paymentId, 10);
    const [rows] = await pool.query('SELECT qr_url AS qrUrl FROM payments WHERE id = ?', [paymentId]);
    if (!rows.length) return res.status(404).json({ message: 'Payment not found' });
    res.json({ qrUrl: rows[0].qrUrl });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/payments/:paymentId
 * Approve or reject a payment, and notify user if approved
 */
exports.updatePaymentStatus = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const paymentId = parseInt(req.params.paymentId, 10);
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    // Update payment status
    const [pRes] = await conn.query(
      'UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, paymentId]
    );
    if (pRes.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Payment not found' });
    }
    // If approved, update order status and send notification
    if (status === 'approved') {
      const [[orderRow]] = await conn.query(
        'SELECT order_id FROM payments WHERE id = ?',
        [paymentId]
      );
      const orderId = orderRow.order_id;
      await conn.query(
        'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
        ['paid', orderId]
      );
      const [[userRow]] = await conn.query(
        `SELECT u.email FROM users u
         JOIN orders o ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId]
      );
      if (userRow?.email) {
        await sendEmail({
          to: userRow.email,
          subject: 'Payment Approved',
          body: `Pembayaran untuk Order #${orderId} telah disetujui.`
        });
      }
    }
    await conn.commit();
    // Return updated payment
    const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
    res.json(rows[0]);
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};
