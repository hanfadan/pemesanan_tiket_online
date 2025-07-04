const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/events.json');

let events = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

/**
 * Helper: save ke JSON file
 */
function saveEvents() {
  fs.writeFileSync(dataPath, JSON.stringify(events, null, 2));
}

/**
 * GET /api/events
 */
exports.getAllEvents = (req, res) => {
  res.json(events);
};

/**
 * GET /api/events/upcoming
 * (anggap upcoming = startTime di masa mendatang)
 */
exports.getUpcomingEvents = (req, res) => {
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.sessions[0].startTime) > now);
  res.json(upcoming);
};

/**
 * GET /api/events/:eventId
 */
exports.getEventById = (req, res) => {
  const id = +req.params.eventId;
  const ev = events.find(e => e.id === id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json(ev);
};

/**
 * POST /api/events
 */
exports.createEvent = (req, res) => {
  const { name, description, city, venue, address, sessions } = req.body;
  const newId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;
  const newEvent = { id: newId, name, description, city, venue, address, sessions };
  events.push(newEvent);
  saveEvents();
  res.status(201).json(newEvent);
};

/**
 * PUT /api/events/:eventId
 */
exports.updateEvent = (req, res) => {
  const id = +req.params.eventId;
  const idx = events.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Event not found' });
  const updated = { ...events[idx], ...req.body, id };
  events[idx] = updated;
  saveEvents();
  res.json(updated);
};

/**
 * DELETE /api/events/:eventId
 */
exports.deleteEvent = (req, res) => {
  const id = +req.params.eventId;
  const idx = events.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Event not found' });
  events.splice(idx, 1);
  saveEvents();
  res.status(204).end();
};
