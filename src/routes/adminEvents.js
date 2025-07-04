const router = require('express').Router();
const { authenticate, isAdmin } = require('../controllers/userController');
const {
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

router.use(authenticate, isAdmin);

// POST /api/admin/events
router.post('/', createEvent);

// PUT /api/admin/events/:eventId
router.put('/:eventId', updateEvent);

// DELETE /api/admin/events/:eventId
router.delete('/:eventId', deleteEvent);

module.exports = router;
