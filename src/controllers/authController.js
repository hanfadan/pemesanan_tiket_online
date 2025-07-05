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
    // Ambil semua field yang sekarang ada di tabel
    const { email, username, phone, profile_url, password, name } = req.body;

    // 1. Cek apakah email sudah terdaftar
    const [emailExists] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (emailExists.length) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // (Opsional) 2. Cek apakah username sudah dipakai
    const [userExists] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (userExists.length) {
      return res.status(400).json({ message: 'Username sudah dipakai' });
    }

    // 3. Hash password
    const hash = await bcrypt.hash(password, 10);

    // 4. Insert user baru, sertakan semua kolom yang diperlukan
    const [result] = await pool.query(
      `INSERT INTO users 
        (email, username, phone, profile_url, password, name, role)
      VALUES (?,?,?,?,?,?,?)`,
      [email, username, phone || null, profile_url || null, hash, name, 'user']
    );
    const userId = result.insertId;

    // 5. Ambil data user yang baru dibuat (kecuali password)
    const [rows] = await pool.query(
      `SELECT id, email, username, phone, profile_url, name, role, created_at, updated_at
       FROM users
       WHERE id = ?`,
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
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });  } catch (err) {
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
