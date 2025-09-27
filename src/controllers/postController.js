const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Reaction = require("../models/reactionModel");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

/**
 * Get all posts with pagination, reaction count, comment count, and author info
 */
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const total = await Post.countDocuments();

    const posts = await Post.find({})
      .populate("user_id", "name email profile_picture_url")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [commentCount, reactionCount] = await Promise.all([
          Comment.countDocuments({ post: post._id }),
          Reaction.countDocuments({ post: post._id }),
        ]);

        return {
          _id: post._id,
          title: post.title,
          content: post.content,
          image: post.image ? `${baseUrl}/uploads/${post.image}` : null,
          video: post.video ? `${baseUrl}/uploads/${post.video}` : null,
          created_at: post.createdAt,
          updated_at: post.updatedAt,
          commentCount,
          reactionCount,
          user: {
            _id: post.user_id._id,
            name: post.user_id.name,
            email: post.user_id.email,
            profile_picture_url: post.user_id.profile_picture_url,
          },
        };
      })
    );

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      posts: postsWithCounts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new post
 * @returns {Object} Created post object
 */
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    let image, video;

    if (req.files) {
      if (req.files.image) image = req.files.image[0].filename;
      if (req.files.video) video = req.files.video[0].filename;
    }

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Please provide both title and content" });
    }

    const newPost = await Post.create({
      user_id: req.user._id,
      title,
      content,
      image,
      video,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Edit a post (owner only)
 */
const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id.toString() !== userId) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this post" });
    }

    if (title && title !== post.title) {
      post.title = title;
    }

    if (content && content !== post.content) {
      post.content = content;
    }

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        post.image = req.files.image[0].filename;
      }
      if (req.files.video && req.files.video[0]) {
        post.video = req.files.video[0].filename;
      }
    }

    const updatedPost = await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error editing post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * Delete a post (owner only)
 */
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id.toString() !== userId) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this post" });
    }

    if (post.image) {
      const imagePath = path.join(__dirname, "../uploads", post.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image file:", err);
      });
    }

    if (post.video) {
      const videoPath = path.join(__dirname, "../uploads", post.video);
      fs.unlink(videoPath, (err) => {
        if (err) console.error("Failed to delete video file:", err);
      });
    }

    await Promise.all([
      Comment.deleteMany({ post: postId }),
      Reaction.deleteMany({ post: postId }),
      post.deleteOne(),
    ]);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get posts of the authenticated user with pagination
 */
const getMyPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const total = await Post.countDocuments({ user_id: req.user.id });

    const posts = await Post.find({ user_id: req.user.id })
      .populate("user_id", "name email profile_picture_url")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [commentCount, reactionCount] = await Promise.all([
          Comment.countDocuments({ post: post._id }),
          Reaction.countDocuments({ post: post._id }),
        ]);

        return {
          _id: post._id,
          title: post.title,
          content: post.content,
          image: post.image ? `${baseUrl}/uploads/${post.image}` : null,
          video: post.video ? `${baseUrl}/uploads/${post.video}` : null,
          created_at: post.createdAt,
          updated_at: post.updatedAt,
          commentCount,
          reactionCount,
          user: {
            _id: post.user_id._id,
            name: post.user_id.name,
            email: post.user_id.email,
            profile_picture_url: post.user_id.profile_picture_url,
          },
        };
      })
    );

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      posts: postsWithCounts,
    });
  } catch (error) {
    console.error("Error fetching my posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Add a comment to a post
 */
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Comment content is required" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = await Comment.create({
      post: postId,
      user_id: req.user.id,
      content,
    });

    await newComment.populate("user_id", "name profile_picture_url");

    res.status(201).json({
      _id: newComment._id,
      post: newComment.post,
      user: {
        _id: newComment.user_id._id,
        name: newComment.user_id.name,
        profile_picture_url: newComment.user_id.profile_picture_url,
      },
      content: newComment.content,
      created_at: newComment.created_at,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get comments for a post
 */
const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: postId })
      .populate("user_id", "name profile_picture_url")
      .sort({ created_at: 1 })
      .lean();

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "No comments found", data: [] });
    }

    const transformedComments = comments.map((c) => ({
      _id: c._id,
      content: c.content,
      created_at: c.created_at,
      user: {
        _id: c.user_id._id,
        name: c.user_id.name,
        profile_picture_url: c.user_id.profile_picture_url,
      },
    }));

    res.json(transformedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Toggle reaction (like/unlike) on a post
 */
const toggleReaction = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(400).json({ message: "Invalid post ID" });

  try {
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) return res.status(404).json({ message: "Post not found" });

    const existingReaction = await Reaction.findOne({
      post: postId,
      user: userId,
    });

    let status;
    if (existingReaction) {
      await existingReaction.deleteOne();
      status = "unliked";
    } else {
      await Reaction.create({ post: postId, user: userId });
      status = "liked";
    }

    const reactionCount = await Reaction.countDocuments({ post: postId });

    res.json({
      message: `Reaction ${status}`,
      status,
      reactionCount,
    });
  } catch (error) {
    console.error("toggleReaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPosts,
  createPost,
  editPost,
  getMyPosts,
  addComment,
  getComments,
  toggleReaction,
  deletePost,
};
