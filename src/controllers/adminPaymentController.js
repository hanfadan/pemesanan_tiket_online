// src/controllers/adminPaymentController.js
const pool = require('../db');
const { sendEmail } = require('./notificationController');

/* ---------------------------------------------------------- */
/* GET /api/admin/payments                                    */
/* ---------------------------------------------------------- */
exports.getPayments = async (req, res, next) => {
  try {
    const { status } = req.query;
    let   sql    = 'SELECT * FROM payments';
    const params = [];
    if (status) { sql += ' WHERE status = ?'; params.push(status); }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) { next(err); }
};

/* ---------------------------------------------------------- */
/* GET /api/admin/payments/:paymentId                         */
/* ---------------------------------------------------------- */
exports.getPaymentById = async (req, res, next) => {
  try {
    const id      = Number(req.params.paymentId);
    const [[row]] = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ message: 'Payment not found' });
    res.json(row);
  } catch (err) { next(err); }
};

/* ---------------------------------------------------------- */
/* GET /api/admin/payments/:paymentId/qr                      */
/* ---------------------------------------------------------- */
exports.getPaymentQr = async (req, res, next) => {
  try {
    const id      = Number(req.params.paymentId);
    const [[row]] = await pool.query(
      'SELECT qr_url AS qrUrl FROM payments WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ message: 'Payment not found' });
    res.json({ qrUrl: row.qrUrl });
  } catch (err) { next(err); }
};

/* ---------------------------------------------------------- */
/* PATCH /api/admin/payments/:paymentId  { action }           */
/* action: "approve" | "reject"                               */
/* ---------------------------------------------------------- */
exports.updatePaymentStatus = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const id     = Number(req.params.paymentId);
    const action = String(req.body.action).toLowerCase();

    if (!['approve', 'reject'].includes(action)) {
      await conn.rollback();
      return res.status(400).json({ message: 'action must be approve|reject' });
    }

    /* 1) Lock row & ambil info */
    const [[payment]] = await conn.query(
      `SELECT p.*, o.user_id
         FROM payments p
         JOIN orders o ON o.id = p.order_id
       WHERE p.id = ? FOR UPDATE`,
      [id]
    );
    if (!payment) {
      await conn.rollback();
      return res.status(404).json({ message: 'Payment not found' });
    }
    if (payment.status !== 'pending') {
      await conn.rollback();
      return res.status(409).json({ message: 'Payment already processed' });
    }

    /* 2) Tentukan status baru */
    const newPayStatus = action === 'approve' ? 'approved' : 'rejected';
    const newOrdStatus = action === 'approve' ? 'paid'     : 'cancelled';

    /* 3) Update tabel */
    await conn.query(
      'UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?',
      [newPayStatus, id]);
    await conn.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [newOrdStatus, payment.order_id]);

    /* 4) Kirim email notifikasi (opsional) */
    // const [[user]] = await conn.query(
    //   'SELECT email FROM users WHERE id = ?', [payment.user_id]);
    // if (user?.email) {
    //   const subj = `Payment ${newPayStatus}`;
    //   const body = `Pembayaran untuk Order #${payment.order_id} telah ${newPayStatus}.`;
    //   await sendEmail({ to: user.email, subject: subj, body });
    // }

    await conn.commit();

    /* 5) Ambil versi terbaru */
    const [[updated]] = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
    res.json(updated);

  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};
