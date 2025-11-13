const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ✅ Match function name from userController.js
router.post("/create-or-update", userController.createOrUpdateUserProfile);
router.get("/:clerkUserId", userController.getUserProfile);
router.put("/:clerkUserId/last-seen", userController.updateLastSeen);

module.exports = router;
