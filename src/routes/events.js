// src/routes/events.js
const router = require('express').Router();
const { authenticate, isAdmin } = require('../controllers/userController');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

// Public endpoints
// GET /api/events         → list all events
router.get('/', getAllEvents);

// GET /api/events/:eventId → detail event
router.get('/:eventId', getEventById);

// Admin-only endpoints (authentication + authorization)
// POST /api/events        → create event (with poster upload)
router.post('/', authenticate, isAdmin, upload.single('poster'), createEvent);

// PUT /api/events/:eventId → update event (with poster upload)
router.put('/:eventId', authenticate, isAdmin, upload.single('poster'), updateEvent);

// DELETE /api/events/:eventId → delete event
router.delete('/:eventId', authenticate, isAdmin, deleteEvent);

module.exports = router;
