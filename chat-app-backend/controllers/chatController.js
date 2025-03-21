const Message = require("../models/Message");

// Send a message (Private or Public)
const sendMessage = async (req, res) => {
  try {
    const { content, chatRoom, receiver } = req.body;

    const messageData = {
      sender: req.user.id,
      content,
    };

    if (receiver) {
      messageData.receiver = receiver; // Private message
    } else if (chatRoom) {
      messageData.chatRoom = chatRoom; // Public message
    } else {
      return res.status(400).json({ message: "Either chatRoom or receiver must be provided" });
    }

    const message = new Message(messageData);
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a public chat room
const getChatRoomMessages = async (req, res) => {
  try {
    const { chatRoom } = req.params;
    const messages = await Message.find({ chatRoom }).populate("sender", "username avatar");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get private messages between two users
const getPrivateMessages = async (req, res) => {
  try {
    const { userId } = req.params; // Chat with this user
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).populate("sender", "username avatar");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getChatRoomMessages, getPrivateMessages };
