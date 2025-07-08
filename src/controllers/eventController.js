// src/controllers/userController.js
const pool = require('../db');
const jwt  = require('jsonwebtoken');

/* ------------------------------------------------------------------ */
/*  AUTHENTIKASI                                                      */
/* ------------------------------------------------------------------ */

/** Middleware: verify JWT token & attach req.user */
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

/** Middleware: hanya boleh diakses role admin */
exports.isAdmin = (req, res, next) => {
  // authenticate **wajib** dipasang lebih dulu di rantai middleware
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

/* ------------------------------------------------------------------ */
/*  ENDPOINT PROFIL USER                                              */
/* ------------------------------------------------------------------ */

/** GET /api/user */
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT 
         id, email, name, role, username, phone, profile_url, created_at, updated_at
       FROM users 
       WHERE id = ?`,
      [userId]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    // ubah ke URL absolut jika masih relatif
    if (user.profile_url && !user.profile_url.startsWith('http')) {
      user.profile_url = `${req.protocol}://${req.get('host')}${user.profile_url}`;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/user */
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, username, phone } = req.body;

    /* 1) Cek unik username */
    if (username) {
      const [dup] = await pool.query(
        'SELECT id FROM users WHERE username = ? AND id <> ?',
        [username, userId]
      );
      if (dup.length) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    /* 2) Validasi nomor HP (contoh pola Indonesia) */
    if (phone && !/^08\d{8,10}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone format invalid' });
    }

    /* 3) Susun SET clause dinamis */
    const fields = [];
    const params = [];

    if (name)     { fields.push('name = ?');     params.push(name); }
    if (email)    { fields.push('email = ?');    params.push(email); }
    if (username) { fields.push('username = ?'); params.push(username); }
    if (phone)    { fields.push('phone = ?');    params.push(phone); }

    if (req.file && req.file.filename) {
      const profilePath = `/uploads/${req.file.filename}`;
      fields.push('profile_url = ?');
      params.push(profilePath);
    }

    if (!fields.length) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    /* 4) Jalankan UPDATE */
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

    /* 5) Ambil profil terbaru */
    const [rows] = await pool.query(
      `SELECT 
         id, email, name, role, username, phone, profile_url, created_at, updated_at
       FROM users 
       WHERE id = ?`,
      [userId]
    );
    const user = rows[0];
    if (user.profile_url && !user.profile_url.startsWith('http')) {
      user.profile_url = `${req.protocol}://${req.get('host')}${user.profile_url}`;
    }

    res.json(user);

  } catch (err) {
    next(err);
  }
};
