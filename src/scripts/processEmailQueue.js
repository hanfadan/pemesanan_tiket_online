// scripts/processEmailQueue.js
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const queuePath = path.join(__dirname, '../data/emailQueue.json');

// Setup sendmail transport (memanggil binary sendmail)
const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail'
});

(async () => {
  let queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const remaining = [];

  for (const msg of queue) {
    try {
      await transporter.sendMail({
        from: 'no-reply@yourdomain.com',
        to: msg.to,
        subject: msg.subject,
        text: msg.body
      });
      console.log(`Sent email to ${msg.to}`);
    } catch (err) {
      console.error(`Failed email to ${msg.to}:`, err);
      remaining.push(msg); // keep in queue if gagal
    }
  }

  fs.writeFileSync(queuePath, JSON.stringify(remaining, null, 2));
  process.exit(0);
})();
