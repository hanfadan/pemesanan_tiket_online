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

// Setup Multer storage with original file extension
const storageEvent = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = `poster-${Date.now()}`;
    cb(null, base + ext);
  }
});
const uploadEvent = multer({ storage: storageEvent });

// Public endpoints
router.get('/', getAllEvents);
router.get('/:eventId', getEventById);

// Admin-only endpoints (auth + role)
router.post(
  '/',
  authenticate,
  isAdmin,
  uploadEvent.single('poster'),
  createEvent
);

router.put(
  '/:eventId',
  authenticate,
  isAdmin,
  uploadEvent.single('poster'),
  updateEvent
);

router.delete(
  '/:eventId',
  authenticate,
  isAdmin,
  deleteEvent
);

module.exports = router;
