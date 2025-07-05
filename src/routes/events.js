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

const path   = require('path');
const multer = require('multer');
// pastikan path ini sesuai project-mu
const upload = multer({
  dest: path.join(__dirname, '../../public/uploads')
});
// Public
router.get('/', getAllEvents);
router.get('/:eventId', getEventById);

// Admin (harus login + role=admin)
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
