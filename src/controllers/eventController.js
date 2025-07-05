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
    const updates = [];
    const params = [];
    const {
      name,
      eventDate,
      description,
      city,
      venue,
      address,
      regularPrice,
      vipPrice
    } = req.body;

    if (name) updates.push('name = ?'), params.push(name);
    if (eventDate) updates.push('event_date = ?'), params.push(eventDate);
    if (description) updates.push('description = ?'), params.push(description);
    if (city) updates.push('city = ?'), params.push(city);
    if (venue) updates.push('venue = ?'), params.push(venue);
    if (address) updates.push('address = ?'), params.push(address);
    if (req.file) updates.push('poster_url = ?'), params.push(`/uploads/${req.file.filename}`);
    if (regularPrice) updates.push('regular_price = ?'), params.push(regularPrice);
    if (vipPrice) updates.push('vip_price = ?'), params.push(vipPrice);

    if (!updates.length) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    updates.push('updated_at = NOW()');
    const sql = `UPDATE events SET ${updates.join(', ')} WHERE id = ?`;
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
