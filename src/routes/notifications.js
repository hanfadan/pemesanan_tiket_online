// src/routes/notifications.js
const router = require('express').Router();
const { authenticate } = require('../controllers/userController');
const {
  sendEmail,
  sendSms
} = require('../controllers/notificationController');

// POST /api/notifications/email → queue & send email
router.post('/email', authenticate, async (req, res, next) => {
  try {
    const info = await sendEmail(req.body);
    res.status(202).json({ message: 'Email queued', info });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/sms → queue & send SMS
router.post('/sms', authenticate, async (req, res, next) => {
  try {
    const info = await sendSms(req.body);
    res.status(202).json({ message: 'SMS queued', info });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
