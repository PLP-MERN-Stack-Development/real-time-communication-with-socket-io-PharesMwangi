const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

// Create new conversation
router.post("/", conversationController.createConversation);

// Get all conversations for a user
router.get("/user/:userId", conversationController.getUserConversations);

// Add member to conversation
router.put("/:conversationId/add-member", conversationController.addMember);

module.exports = router;
