// src/controllers/userController.js
const pool = require('../db');
const jwt  = require('jsonwebtoken');

// Middleware untuk memverifikasi JWT
exports.authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }
  const token = auth.slice(7); // hapus "Bearer "
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware untuk cek role admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admins only' });
  }
  next();
};

// GET /api/user — ambil profil user
exports.getProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/user — update profil user
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    await pool.query(
      'UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?',
      [name, email, req.user.id]
    );
    const [rows] = await pool.query(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};
