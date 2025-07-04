// dummy sales report
exports.getSalesReport = (req, res) => {

const { authenticate, isAdmin } = require('../controllers/userController');

router.use(authenticate, isAdmin);
  // TODO: gabungkan data orders/payments
  res.json({
    totalRevenue: 1000000,
    totalOrders: 120,
    perEvent: []
  });
};
