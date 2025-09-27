const Post = require("../models/postModel");
const Reaction = require("../models/reactionModel");
const Comment = require("../models/commentModel");

/**
 * Get the profile of the currently authenticated user
 * requires JWT token
 * @returns {Object} User info including post, reaction, and comment counts
 */
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const postIds = await Post.find({ user_id: user._id }).distinct("_id");

    const [postCount, reactionCount, commentCount] = await Promise.all([
      Post.countDocuments({ user_id: user._id }),
      Reaction.countDocuments({ post: { $in: postIds } }),
      Comment.countDocuments({ post: { $in: postIds } }),
    ]);

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      profile_picture_url: user.profile_picture_url || null,
      created_at: user.created_at,
      post_count: postCount,
      reaction_count: reactionCount,
      comment_count: commentCount,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile };
