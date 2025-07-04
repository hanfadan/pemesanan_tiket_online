const router = require('express').Router();
const { sendEmail, sendSms } = require('../controllers/notificationController');
const { authenticate } = require('../controllers/userController');

// semua notifikasi butuh auth
router.use(authenticate);

// POST /api/notifications/email
router.post('/email', sendEmail);

// POST /api/notifications/sms
router.post('/sms', sendSms);

module.exports = router;
