const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Only for private messages
    chatRoom: { type: String }, // For public chat rooms
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false }, // Track if message is read
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
