const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

// ✅ Match function names
router.post("/", conversationController.createConversation);
router.get("/user/:userId", conversationController.getConversations);
router.get("/:conversationId", conversationController.getConversationById);

module.exports = router;
