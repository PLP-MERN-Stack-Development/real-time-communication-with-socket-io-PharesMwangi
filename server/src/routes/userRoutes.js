const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create or update user profile
router.post("/create-or-update", userController.createOrUpdateUser);

// Get user by Clerk user ID
router.get("/:clerkUserId", userController.getUserProfile);

module.exports = router;
