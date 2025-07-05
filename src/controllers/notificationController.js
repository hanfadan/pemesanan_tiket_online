const fs   = require('fs');
const path = require('path');
const queuePath = path.join(__dirname, '../data/emailQueue.json');

// pastikan file ini ada dan berisi "[]" saat kosong
if (!fs.existsSync(queuePath)) fs.writeFileSync(queuePath, '[]');

/**
 * POST /api/notifications/email
 * Queue email ke file
 */
exports.sendEmail = (req, res, next) => {
  try {
    const { to, subject, body } = req.body;
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    queue.push({ to, subject, body, createdAt: new Date().toISOString() });
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
    res.status(202).json({ message: 'Email queued' });
  } catch (err) {
    next(err);
  }
};
