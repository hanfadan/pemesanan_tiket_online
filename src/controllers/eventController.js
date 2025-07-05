// src/controllers/eventController.js
const pool = require('../db');

/**
 * GET /api/events
 */
exports.getAllEvents = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/events/:eventId
 */
exports.getEventById = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/events
 */
exports.createEvent = async (req, res, next) => {
  try {
    const { name, description, city, venue, address } = req.body;
    const posterUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO events (name, description, city, venue, address, poster_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [name, description, city, venue, address, posterUrl]
    );
    const eventId = result.insertId;
    const [[event]] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId]);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/events/:eventId
 */
exports.updateEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const { name, description, city, venue, address } = req.body;
    let posterClause = '';
    const params = [name, description, city, venue, address];
    if (req.file) {
      posterClause = ', poster_url = ?';
      params.push(`/uploads/${req.file.filename}`);
    }
    params.push(eventId);

    const [result] = await pool.query(
      `UPDATE events
       SET name = ?, description = ?, city = ?, venue = ?, address = ?, updated_at = NOW()${posterClause}
       WHERE id = ?`,
      params
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const [[event]] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId]);
    res.json(event);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/events/:eventId
 */
exports.deleteEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [eventId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
