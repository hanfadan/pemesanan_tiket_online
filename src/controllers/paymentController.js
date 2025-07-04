const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/payments.json');

let payments = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function savePayments() {
  fs.writeFileSync(dataPath, JSON.stringify(payments, null, 2));
}

/**
 * GET /api/payments/options
 * (dummy: static list)
 */
exports.getPaymentOptions = (req, res) => {
  res.json([
    { code: 'VA_BCA', name: 'Virtual Account BCA' },
    { code: 'VA_MANDIRI', name: 'Virtual Account Mandiri' },
    { code: 'QRIS', name: 'QRIS' }
  ]);
};

/**
 * POST /api/payments/initiate
 */
exports.initiatePayment = (req, res) => {
  const { orderId, amount, method } = req.body;
  const newId = payments.length ? Math.max(...payments.map(p => p.id)) + 1 : 1;
  const newPayment = {
    id: newId,
    orderId,
    amount,
    method,
    status: 'pending',
    createdAt: new Date().toISOString(),
    // dummy QR URL
    qrUrl: `https://example.com/qr/${newId}`
  };
  payments.push(newPayment);
  savePayments();
  res.status(201).json(newPayment);
};

/**
 * GET /api/payments/:paymentId
 */
exports.getPaymentById = (req, res) => {
  const id = +req.params.paymentId;
  const pay = payments.find(p => p.id === id);
  if (!pay) return res.status(404).json({ message: 'Payment not found' });
  res.json(pay);
};

/**
 * GET /api/payments/:paymentId/qr
 */
exports.getPaymentQr = (req, res) => {
  const id = +req.params.paymentId;
  const pay = payments.find(p => p.id === id);
  if (!pay) return res.status(404).json({ message: 'Payment not found' });
  // redirect atau kirim URL QR
  res.json({ qrUrl: pay.qrUrl });
};
