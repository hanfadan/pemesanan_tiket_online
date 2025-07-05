// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

/**
 * POST /api/register
 * Register a new user
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hash, name, 'user']
    );
    const userId = result.insertId;
    // Retrieve new user (excluding password)
    const [rows] = await pool.query(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/login
 * Authenticate user and return JWT
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Fetch user by email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Sign JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/logout
 * Dummy endpoint for logout
 */
exports.logout = (req, res) => {
  // Client can simply discard the token
  res.status(204).end();
};
