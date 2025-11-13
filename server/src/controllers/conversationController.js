const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Create a new conversation
const createConversation = async (req, res) => {
  const { name, isGroup, adminId, members } = req.body;

  try {
    // For 1-on-1 chats, check if conversation already exists
    if (!isGroup && members.length === 2) {
      const existing = await Conversation.findOne({ members: { $all: members, $size: 2 } });
      if (existing) return res.status(200).json(existing);
    }

    const conversation = await Conversation.create({ name, isGroup, adminId, members });
    res.status(201).json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all conversations for a user
const getConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({ members: userId }).sort({ lastMessageAt: -1 });
    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a conversation by ID
const getConversationById = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    // Optionally, include last 50 messages
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).limit(50);

    res.status(200).json({ conversation, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update last message for a conversation
const updateConversationLastMessage = async (conversationId, message) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return null;

    conversation.lastMessage = {
      text: message.text,
      senderId: message.senderId,
      senderName: message.senderName,
      senderAvatar: message.senderAvatar,
      createdAt: message.createdAt,
    };

    conversation.lastMessageAt = message.createdAt;

    // Update unread counts
    conversation.members.forEach((memberId) => {
      if (memberId !== message.senderId) {
        const current = conversation.unreadCounts.get(memberId) || 0;
        conversation.unreadCounts.set(memberId, current + 1);
      }
    });

    await conversation.save();
    return conversation;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  updateConversationLastMessage,
};
