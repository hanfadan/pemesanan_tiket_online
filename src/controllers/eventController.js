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
    const { name, eventDate, description, city, venue, address, regularPrice, vipPrice } = req.body;
    const posterUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO events 
         (name, event_date, description, city, venue, address, poster_url, regular_price, vip_price, created_at)
       VALUES (?,      ?,          ?,           ?,    ?,     ?,       ?,          ?,           ?,          NOW())`,
      [name, eventDate, description, city, venue, address, posterUrl, regularPrice, vipPrice]
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
    const { name, eventDate, description, city, venue, address, regularPrice, vipPrice } = req.body;
    const fields = [];
    const params = [];

    // required fields
    fields.push('name = ?', 'event_date = ?', 'description = ?', 'city = ?', 'venue = ?', 'address = ?');
    params.push(name, eventDate, description, city, venue, address);

    // optional poster
    if (req.file) {
      fields.push('poster_url = ?');
      params.push(`/uploads/${req.file.filename}`);
    }

    // always update prices
    fields.push('regular_price = ?', 'vip_price = ?');
    params.push(regularPrice, vipPrice);

    // finalize
    const sql = `
      UPDATE events
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = ?
    `;
    params.push(eventId);

    const [result] = await pool.query(sql, params);
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
