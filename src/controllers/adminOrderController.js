// adminOrderController.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/orders.json');
let orders = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const { authenticate, isAdmin } = require('../controllers/userController');

router.use(authenticate, isAdmin);

exports.getOrders = (req, res) => {
  res.json(orders);
};

exports.getEntryQr = (req, res) => {
  const id = +req.params.orderId;
  const o = orders.find(x => x.id === id);
  if (!o) return res.status(404).json({ message: 'Order not found' });
  // dummy entry QR
  res.json({ entryQrUrl: `https://example.com/entry/${id}` });
};
