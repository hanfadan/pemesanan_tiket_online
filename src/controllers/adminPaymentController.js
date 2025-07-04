const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/payments.json');
let payments = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const { authenticate, isAdmin } = require('../controllers/userController');

router.use(authenticate, isAdmin);

exports.getPayments = (req, res) => {
  res.json(payments);
};

exports.getPaymentById = (req, res) => {
  const id = +req.params.paymentId;
  const p = payments.find(x => x.id === id);
  if (!p) return res.status(404).json({ message: 'Payment not found' });
  res.json(p);
};

exports.getPaymentQr = (req, res) => {
  const id = +req.params.paymentId;
  const p = payments.find(x => x.id === id);
  if (!p) return res.status(404).json({ message: 'Payment not found' });
  res.json({ qrUrl: p.qrUrl });
};
