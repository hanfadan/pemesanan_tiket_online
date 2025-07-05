// src/controllers/adminUserController.js
const pool   = require('../db');
const bcrypt = require('bcrypt');

/**
 * GET /api/admin/users
 */
exports.getUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, name, role FROM users'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/users
 */
exports.createUser = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    // hash password
    const hash = await bcrypt.hash(password, 10);
    // insert ke DB
    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hash, name, role]
    );
    // ambil lagi data tanpa password
    const [rows] = await pool.query(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/users/:userId/role
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { role } = req.body;
    const [result] = await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const [rows] = await pool.query(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [userId]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};
