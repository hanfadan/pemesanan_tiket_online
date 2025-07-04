const router = require('express').Router();
const { authenticate, isAdmin } = require('../controllers/userController');
const { getSalesReport } = require('../controllers/adminReportController');

router.use(authenticate, isAdmin);

// GET /api/admin/reports/sales
router.get('/sales', getSalesReport);

module.exports = router;
