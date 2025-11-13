const Message = require("../models/Message");
const { updateConversationLastMessage } = require("./conversationController");

// Create a new message
const createMessage = async (req, res) => {
  const { conversationId, senderId, senderName, senderAvatar, text } = req.body;

  try {
    const message = await Message.create({
      conversationId,
      senderId,
      senderName,
      senderAvatar,
      text,
    });

    // Update conversation last message
    await updateConversationLastMessage(conversationId, message);

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all messages for a conversation
const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update message status (delivered/seen)
const updateMessageStatus = async (req, res) => {
  const { messageId, userId, status } = req.body; // status: "delivered" or "seen"

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (status === "seen" && !message.readBy.includes(userId)) {
      message.readBy.push(userId);
      message.status = "seen";
    } else if (status === "delivered") {
      message.status = "delivered";
    }

    await message.save();
    res.status(200).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createMessage,
  getMessages,
  updateMessageStatus,
};
