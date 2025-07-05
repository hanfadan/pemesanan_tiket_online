// src/controllers/adminOrderController.js
const pool = require('../db');

/**
 * GET /api/admin/orders
 */
exports.getOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/orders/:orderId/entry-qr
 */
exports.getEntryQr = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);

    // Jika Anda menyimpan kolom entry_qr_url di tabel orders:
    const [rows] = await pool.query(
      'SELECT entry_qr_url AS entryQrUrl FROM orders WHERE id = ?',
      [orderId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ entryQrUrl: rows[0].entryQrUrl });
  } catch (err) {
    next(err);
  }
};
