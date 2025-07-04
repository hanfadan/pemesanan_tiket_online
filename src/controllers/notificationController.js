/**
 * Dummy notifications controller
 */

exports.sendEmail = (req, res) => {
  const { to, subject, body } = req.body;
  // TODO: integrate dengan service email (SendGrid, Nodemailer, dsb)
  console.log(`Email to=${to} subject=${subject} body=${body}`);
  res.status(202).json({ message: 'Email queued', to, subject });
};

exports.sendSms = (req, res) => {
  const { to, message } = req.body;
  // TODO: integrate dengan SMS gateway (Twilio, etc)
  console.log(`SMS to=${to} message=${message}`);
  res.status(202).json({ message: 'SMS queued', to });
};
