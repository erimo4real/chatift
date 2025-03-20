const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Upload profile picture
router.post("/profile", protect, upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  res.json({ avatar: `/uploads/${req.file.filename}` });
});

module.exports = router;
