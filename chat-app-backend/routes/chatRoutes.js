const express = require("express");
const { sendMessage, getChatRoomMessages, getPrivateMessages } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/room/:chatRoom", protect, getChatRoomMessages);
router.get("/private/:userId", protect, getPrivateMessages);
router.put("/read", protect, markMessagesAsRead);

module.exports = router;
