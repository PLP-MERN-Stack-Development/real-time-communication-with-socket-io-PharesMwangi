const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// ✅ Match function names
router.post("/", messageController.createMessage);
router.get("/:conversationId", messageController.getMessages);
router.put("/status", messageController.updateMessageStatus);

module.exports = router;
