// src/routes/user.js
const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const { authenticate } = require("../controllers/userController");
const { getProfile, updateProfile } = require("../controllers/userController");

// Setup Multer storage with original file extension for profile pictures
const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = `profile-${Date.now()}`;
    cb(null, base + ext);
  },
});
const uploadUser = multer({ storage: storageUser });

// All routes here require authentication
router.use(authenticate);

// GET /api/user → get user profile
router.get("/", getProfile);

// PUT /api/user → update profile (name, email, username, phone, profile picture)
// expects multipart/form-data with field 'profile' for image
router.put("/", uploadUser.single("profile_url"), updateProfile);

module.exports = router;
