// src/controllers/userController.js
const pool = require('../db');
const jwt = require('jsonwebtoken');

/** Middleware: Verify JWT token **/
exports.authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/** Middleware: Check admin role **/
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admins only' });
  }
  next();
};

/** GET /api/user **/
exports.getProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, name, role, username, phone, profile_url, created_at, updated_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/user **/
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, username, phone } = req.body;
    const fields = [];
    const params = [];

    if (name)     { fields.push('name = ?');     params.push(name); }
    if (email)    { fields.push('email = ?');    params.push(email); }
    if (username) { fields.push('username = ?'); params.push(username); }
    if (phone)    { fields.push('phone = ?');    params.push(phone); }

    if (req.file) {
      fields.push('profile_url = ?');
      params.push(`/uploads/${req.file.filename}`);
    }

    if (!fields.length) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const sql = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = ?
    `;
    params.push(userId);

    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [rows] = await pool.query(
      `SELECT id, email, name, role, username, phone, profile_url, created_at, updated_at
       FROM users WHERE id = ?`,
      [userId]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};
