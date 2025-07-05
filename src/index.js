require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// 1) Import semua routers
const eventsRouter       = require('./routes/events');
const ordersRouter       = require('./routes/orders');
const authRouter         = require('./routes/auth');
const userRouter         = require('./routes/user');
const paymentsRouter     = require('./routes/payments');
const notificationsRouter= require('./routes/notifications');
const adminUsersRouter   = require('./routes/adminUsers');
const adminEventsRouter  = require('./routes/adminEvents');
const adminReportsRouter = require('./routes/adminReports');
const adminPaymentsRouter= require('./routes/adminPayments');
const adminOrdersRouter  = require('./routes/adminOrders');

// 2) Global middleware
app.use(cors());
app.use(express.json());

// 3) Strip prefix "/api-ticket" (karena cPanel tidak otomatis menghapusnya)
app.use((req, res, next) => {
  const prefix = '/api-ticket';
  if (req.url.startsWith(prefix)) {
    // potong "/api-ticket" dari req.url
    req.url = req.url.slice(prefix.length) || '/';
  }
  next();
});

// 4) Definisikan routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/events', eventsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', authRouter);
app.use('/api/user', userRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/notifications', notificationsRouter);

// admin
app.use('/api/admin/users',   adminUsersRouter);
app.use('/api/admin/events',  adminEventsRouter);
app.use('/api/admin/reports', adminReportsRouter);
app.use('/api/admin/payments',adminPaymentsRouter);
app.use('/api/admin/orders',  adminOrdersRouter);

// 5) Default root supaya GET /api-ticket/ tidak 503
app.get('/', (req, res) => {
  res.json({ status: 'running', now: new Date().toISOString() });
});

// 6) Terakhir start server setelah semua route terdaftar
app.listen(port, () =>
  console.log(`🚀 Backend running on port ${port}`)
);
