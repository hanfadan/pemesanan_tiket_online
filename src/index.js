require('dotenv').config();
// di bagian atas:
const eventsRouter = require('./routes/events');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const paymentsRouter = require('./routes/payments');
const notificationsRouter = require('./routes/notifications');
const adminUsersRouter   = require('./routes/adminUsers');
const adminEventsRouter  = require('./routes/adminEvents');
const adminReportsRouter = require('./routes/adminReports');
const adminPaymentsRouter= require('./routes/adminPayments');
const adminOrdersRouter  = require('./routes/adminOrders');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(port, () =>
  console.log(`🚀 Backend running at http://localhost:${port}`)
);
app.use('/api/events', eventsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', authRouter);
app.use('/api/user', userRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin/users',   adminUsersRouter);
app.use('/api/admin/events',  adminEventsRouter);
app.use('/api/admin/reports', adminReportsRouter);
app.use('/api/admin/payments',adminPaymentsRouter);
app.use('/api/admin/orders',  adminOrdersRouter);
app.get('/', (req, res) => {
  res.json({ status: 'running', now: new Date().toISOString() });
});

