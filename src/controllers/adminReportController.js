// dummy sales report
exports.getSalesReport = (req, res) => {

  // TODO: gabungkan data orders/payments
  res.json({
    totalRevenue: 1000000,
    totalOrders: 120,
    perEvent: []
  });
};
