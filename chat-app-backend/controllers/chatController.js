const Message = require("../models/Message");

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { content, chatRoom } = req.body;

    const message = new Message({
      sender: req.user.id,
      content,
      chatRoom,
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat messages
const getMessages = async (req, res) => {
  try {
    const { chatRoom } = req.params;

    const messages = await Message.find({ chatRoom }).populate("sender", "username avatar");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages };
