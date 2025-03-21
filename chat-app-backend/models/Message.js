const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    chatRoom: { type: String, required: true }, // Public or Private Chat Room ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
