const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// Send a message
router.post("/", messageController.sendMessage);

// Get all messages for a conversation
router.get("/:conversationId", messageController.getMessagesByConversation);

module.exports = router;
