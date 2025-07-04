const router = require('express').Router();
const {
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// GET /api/events           → daftar semua event
router.get('/', getAllEvents);

// GET /api/events/upcoming  → daftar upcoming events
router.get('/upcoming', getUpcomingEvents);

// GET /api/events/:eventId  → detail event
router.get('/:eventId', getEventById);

// POST /api/events          → buat event baru (admin)
router.post('/', createEvent);

// PUT /api/events/:eventId  → update event (admin)
router.put('/:eventId', updateEvent);

// DELETE /api/events/:eventId → hapus event (admin)
router.delete('/:eventId', deleteEvent);

module.exports = router;
