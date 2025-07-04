const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/orders.json');

let orders = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

/**
 * Helper: save ke JSON file
 */
function saveOrders() {
  fs.writeFileSync(dataPath, JSON.stringify(orders, null, 2));
}

/**
 * POST /api/orders
 */
exports.createOrder = (req, res) => {
  const { eventId, userId, quantity, totalPrice, status = 'pending' } = req.body;
  const newId = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  const newOrder = {
    id: newId,
    eventId,
    userId,
    quantity,
    totalPrice,
    status,
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  saveOrders();
  res.status(201).json(newOrder);
};

/**
 * GET /api/orders
 */
exports.getOrders = (req, res) => {
  const { status } = req.query;
  let result = orders;
  if (status) {
    result = result.filter(o => o.status === status);
  }
  res.json(result);
};

/**
 * GET /api/orders/:orderId
 */
exports.getOrderById = (req, res) => {
  const id = +req.params.orderId;
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

/**
 * DELETE /api/orders/:orderId
 */
exports.deleteOrder = (req, res) => {
  const id = +req.params.orderId;
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Order not found' });
  orders.splice(idx, 1);
  saveOrders();
  res.status(204).end();
};
