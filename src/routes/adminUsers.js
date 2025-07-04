const router = require('express').Router();
const { authenticate, isAdmin } = require('../controllers/userController');
const {
  getUsers,
  createUser,
  updateUserRole
} = require('../controllers/adminUserController');

router.use(authenticate, isAdmin);

// GET /api/admin/users
router.get('/', getUsers);

// POST /api/admin/users
router.post('/', createUser);

// PATCH /api/admin/users/:userId/role
router.patch('/:userId/role', updateUserRole);

module.exports = router;
