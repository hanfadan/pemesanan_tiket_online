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
 * GET /api/events/upcoming
 * (upcoming = sessions start time in the future)
 */
exports.getUpcomingEvents = async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const query = `
      SELECT e.id, e.name, e.description, e.city, e.venue, e.address,
             es.id AS session_id, es.title, es.start_time, es.end_time
      FROM events e
      JOIN event_sessions es ON es.event_id = e.id
      WHERE es.start_time > ?`;
    const [rows] = await pool.query(query, [now]);
    const eventsMap = new Map();
    rows.forEach(r => {
      if (!eventsMap.has(r.id)) {
        eventsMap.set(r.id, {
          id: r.id,
          name: r.name,
          description: r.description,
          city: r.city,
          venue: r.venue,
          address: r.address,
          sessions: []
        });
      }
      eventsMap.get(r.id).sessions.push({
        id: r.session_id,
        title: r.title,
        startTime: r.start_time,
        endTime: r.end_time
      });
    });
    res.json(Array.from(eventsMap.values()));
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
    const [eRows] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (!eRows.length) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const [sRows] = await pool.query(
      'SELECT id, title, start_time AS startTime, end_time AS endTime FROM event_sessions WHERE event_id = ?',
      [eventId]
    );
    const event = { ...eRows[0], sessions: sRows };
    res.json(event);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/events
 */
exports.createEvent = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { name, description, city, venue, address, sessions } = req.body;
    const [result] = await conn.query(
      `INSERT INTO events (name, description, city, venue, address) VALUES (?, ?, ?, ?, ?)`,
      [name, description, city, venue, address]
    );
    const eventId = result.insertId;
    if (Array.isArray(sessions) && sessions.length) {
      const values = sessions.map(s => [eventId, s.title, s.startTime, s.endTime]);
      await conn.query(
        `INSERT INTO event_sessions (event_id, title, start_time, end_time) VALUES ?`,
        [values]
      );
    }
    await conn.commit();
    res.status(201).json({ id: eventId, name, description, city, venue, address, sessions: sessions || [] });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

/**
 * PUT /api/events/:eventId
 */
exports.updateEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const { name, description, city, venue, address } = req.body;
    const [result] = await pool.query(
      `UPDATE events SET name = ?, description = ?, city = ?, venue = ?, address = ?, updated_at = NOW() WHERE id = ?`,
      [name, description, city, venue, address, eventId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ id: eventId, name, description, city, venue, address });
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
