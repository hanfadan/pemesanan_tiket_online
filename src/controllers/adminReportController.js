// src/controllers/adminReportController.js
const pool = require('../db');

/**
 * GET /api/admin/reports/sales
 */
exports.getSalesReport = async (req, res, next) => {
  try {
    // 1) Hitung total revenue dari semua pembayaran yang sudah 'paid'
    const [[{ totalRevenue }]] = await pool.query(
      'SELECT COALESCE(SUM(amount),0) AS totalRevenue FROM payments WHERE status = ?',
      ['paid']
    );

    // 2) Hitung total orders
    const [[{ totalOrders }]] = await pool.query(
      'SELECT COUNT(*) AS totalOrders FROM orders'
    );

    // 3) Detail per event: jumlah order dan revenue per event
    const [perEvent] = await pool.query(`
      SELECT
        e.id,
        e.name,
        COUNT(o.id)       AS totalOrders,
        COALESCE(SUM(p.amount),0) AS totalRevenue
      FROM events e
      LEFT JOIN orders o ON o.event_id = e.id
      LEFT JOIN payments p 
        ON p.order_id = o.id AND p.status = 'paid'
      GROUP BY e.id, e.name
    `);

    res.json({
      totalRevenue,
      totalOrders,
      perEvent
    });
  } catch (err) {
    next(err);
  }
};
