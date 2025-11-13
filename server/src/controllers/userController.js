const UserProfile = require("../models/UserProfile");

// Create or update a user profile
const createOrUpdateUserProfile = async (req, res) => {
  const { clerkUserId, displayName, avatarUrl, email } = req.body;

  try {
    let user = await UserProfile.findOne({ clerkUserId });

    if (user) {
      user.displayName = displayName || user.displayName;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      user.email = email || user.email;
      await user.save();
    } else {
      user = await UserProfile.create({ clerkUserId, displayName, avatarUrl, email });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a user profile by Clerk ID
const getUserProfile = async (req, res) => {
  const { clerkUserId } = req.params;

  try {
    const user = await UserProfile.findOne({ clerkUserId });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update last seen timestamp
const updateLastSeen = async (req, res) => {
  const { clerkUserId } = req.params;

  try {
    const user = await UserProfile.findOne({ clerkUserId });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.lastSeenAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Last seen updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrUpdateUserProfile,
  getUserProfile,
  updateLastSeen,
};
