// src/routes/events.js
const router = require('express').Router();
const path   = require('path');
const multer = require('multer');
const { authenticate, isAdmin } = require('../controllers/userController');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Setup Multer to write into project-root/public/uploads
const upload = multer({ dest: path.join(__dirname, '../../public/uploads') });

// Public endpoints
router.get('/', getAllEvents);
router.get('/:eventId', getEventById);

// Admin-only endpoints (auth + role)
router.post(
  '/',
  authenticate,
  isAdmin,
  upload.single('poster'),
  createEvent
);
router.put(
  '/:eventId',
  authenticate,
  isAdmin,
  upload.single('poster'),
  updateEvent
);
router.delete(
  '/:eventId',
  authenticate,
  isAdmin,
  deleteEvent
);

module.exports = router;
