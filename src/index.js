require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 1) Import semua routers
const eventsRouter        = require('./routes/events');
const ordersRouter        = require('./routes/orders');
const authRouter          = require('./routes/auth');
const userRouter          = require('./routes/user');
const paymentsRouter      = require('./routes/payments');
const notificationsRouter = require('./routes/notifications');
const adminUsersRouter    = require('./routes/adminUsers');
const adminEventsRouter   = require('./routes/adminEvents');
const adminReportsRouter  = require('./routes/adminReports');
const adminPaymentsRouter = require('./routes/adminPayments');
const adminOrdersRouter   = require('./routes/adminOrders');
const qrcodeRouter        = require('./routes/qrcode');

// 2) Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3) Serve static files for uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../public/uploads'))
);

// 4) Strip prefix "/api-ticket" (cPanel)
app.use((req, res, next) => {
  const prefix = '/api-ticket';
  if (req.url.startsWith(prefix)) {
    req.url = req.url.slice(prefix.length) || '/';
  }
  next();
});

// 5) Define routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});
app.use('/api/events', eventsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', authRouter);
app.use('/api/user', userRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/notifications', notificationsRouter);

// Admin routes
app.use('/api/admin/users',   adminUsersRouter);
app.use('/api/admin/events',  adminEventsRouter);
app.use('/api/admin/reports', adminReportsRouter);
app.use('/api/admin/payments',adminPaymentsRouter);
app.use('/api/admin/orders',  adminOrdersRouter);

// QR code route
app.use('/api/qrcode', qrcodeRouter);

// 6) Default root
app.get('/', (req, res) => {
  res.json({ status: 'running', now: new Date().toISOString() });
});

// Global error handler (JSON)
app.use((err, req, res, next) => {
  console.error('❌ ERROR', err);
  res.status(err.status || 500).json({
    message: err.message,
    ...(process.env.NODE_ENV === 'production' && { stack: err.stack })
  });
});

// 7) Start server
app.listen(port, () => console.log(`🚀 Backend running on port ${port}`));
