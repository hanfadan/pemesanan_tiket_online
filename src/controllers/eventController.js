// src/controllers/userController.js
const pool = require("../db");

/**
 * GET /api/events
 */
exports.getAllEvents = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events");
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
    const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [
      eventId,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: "Event not found" });
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
    console.log("CONTENT-TYPE →", req.headers["content-type"]);
    console.log("BODY        →", req.body);
    console.log("FILE        →", req.file);

    // Destructure sesuai snake_case
    const {
      name,
      event_date,
      description,
      city,
      venue,
      address,
      regular_price,
      vip_price,
    } = req.body;

    // poster_url diambil dari req.file (field 'poster')
    const poster_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Pastikan semua field wajib ada (bisa tambah validasi jika mau)
    if (!name || !event_date || !regular_price || !vip_price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Karena kolom event_date itu DATE, kita ambil YYYY-MM-DD saja
    const dateOnly = event_date.split("T")[0];

    const [result] = await pool.query(
      `INSERT INTO events
         (name, event_date, description, city, venue, address, poster_url, regular_price, vip_price)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        name,
        dateOnly,
        description || null,
        city || null,
        venue || null,
        address || null,
        poster_url,
        regular_price,
        vip_price,
      ]
    );

    const eventId = result.insertId;
    const [[event]] = await pool.query(
      `SELECT *
       FROM events
       WHERE id = ?`,
      [eventId]
    );

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/events/:eventId
 */
// src/controllers/eventController.js
exports.updateEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);

    // Destructure sesuai snake_case
    const {
      name,
      event_date, // e.g. "2025-07-17T02:47"
      description,
      city,
      venue,
      address,
      regular_price,
      vip_price,
    } = req.body;

    const updates = [];
    const params = [];

    if (name) {
      updates.push("name = ?");
      params.push(name);
    }
    if (event_date) {
      // MySQL DATE hanya terima "YYYY-MM-DD"
      const dateOnly = event_date.split("T")[0];
      updates.push("event_date = ?");
      params.push(dateOnly);
    }
    if (description) {
      updates.push("description = ?");
      params.push(description);
    }
    if (city) {
      updates.push("city = ?");
      params.push(city);
    }
    if (venue) {
      updates.push("venue = ?");
      params.push(venue);
    }
    if (address) {
      updates.push("address = ?");
      params.push(address);
    }
    if (typeof regular_price !== "undefined") {
      updates.push("regular_price = ?");
      params.push(regular_price);
    }
    if (typeof vip_price !== "undefined") {
      updates.push("vip_price = ?");
      params.push(vip_price);
    }
    // file upload dengan field "poster"
    if (req.file) {
      updates.push("poster_url = ?");
      params.push(`/uploads/${req.file.filename}`);
    }

    if (!updates.length) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // tambahkan updated_at
    updates.push("updated_at = NOW()");
    const sql = `UPDATE events SET ${updates.join(", ")} WHERE id = ?`;
    params.push(eventId);

    const [result] = await pool.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [[event]] = await pool.query("SELECT * FROM events WHERE id = ?", [
      eventId,
    ]);
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
    const [result] = await pool.query("DELETE FROM events WHERE id = ?", [
      eventId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};
