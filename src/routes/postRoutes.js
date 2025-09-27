const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPost,
  editPost,
  getMyPosts,
  addComment,
  toggleReaction,
  getComments,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management endpoints
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts (Newsfeed)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       image:
 *                         type: string
 *                         format: uri
 *                         nullable: true
 *                       video:
 *                         type: string
 *                         format: uri
 *                         nullable: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       commentCount:
 *                         type: integer
 *                       reactionCount:
 *                         type: integer
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           profile_picture_url:
 *                             type: string
 *                             format: uri
 *                             nullable: true
 */
router.get("/posts", getPosts);

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64f8c3a2e7c0b1a2f0b56789
 *         user_id:
 *           type: string
 *           example: 64f8c0b8c1d2a2f3b4567890
 *         title:
 *           type: string
 *           example: "My first post"
 *         content:
 *           type: string
 *           example: "Hello world!"
 *         image:
 *           type: string
 *           nullable: true
 *           example: "image123.jpg"
 *         video:
 *           type: string
 *           nullable: true
 *           example: "video123.mp4"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-26T12:34:56.789Z"
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please provide both title and content"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.post(
  "/posts",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Edit a post (owner only)
 *     description: Update the title, content, and/or media of an existing post. Only the owner of the post can edit it.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to edit
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the post
 *               content:
 *                 type: string
 *                 description: Updated content of the post
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New image file (optional)
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: New video file (optional)
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post updated successfully
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f8e23fa1b2c34567890abc
 *                     user_id:
 *                       type: string
 *                       example: 64f8e23fa1b2c34567890def
 *                     title:
 *                       type: string
 *                       example: Updated Post Title
 *                     content:
 *                       type: string
 *                       example: Updated post content
 *                     image:
 *                       type: string
 *                       nullable: true
 *                       example: uploaded_image.jpg
 *                     video:
 *                       type: string
 *                       nullable: true
 *                       example: uploaded_video.mp4
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date when the post was originally created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date when the post was last updated
 *       401:
 *         description: Not authorized to edit this post
 *       404:
 *         description: Post not found
 */
router.put(
  "/posts/:postId",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  editPost
);

/**
 * @swagger
 * /my-posts:
 *   get:
 *     summary: Get posts created by the logged-in user
 *     description: Returns a list of posts created by the currently authenticated user.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get("/my-posts", protect, getMyPosts);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Hello, I miss you"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the comment
 *                 post:
 *                   type: string
 *                   description: ID of the post
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     profile_picture_url:
 *                       type: string
 *                       description: User profile picture URL
 *                 content:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                 __v:
 *                   type: integer
 *       400:
 *         description: Comment content is required
 *       404:
 *         description: Post not found
 */
router.post("/posts/:postId/comments", protect, addComment);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                   user_id:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       avatar:
 *                         type: string
 *       404:
 *         description: Post not found or no comments found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items: {}
 */
router.get("/posts/:postId/comments", protect, getComments);

/**
 * @swagger
 * /api/posts/{postId}/reaction:
 *   post:
 *     summary: Toggle like/unlike for a post
 *     description: >
 *       Adds a reaction to a post if the user hasn't reacted with the given type yet.
 *       Removes the reaction if the user already reacted with that type.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the post to react to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Reaction type, e.g., "like"
 *                 example: like
 *     responses:
 *       200:
 *         description: Reaction toggled with updated count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reaction liked
 *                 status:
 *                   type: string
 *                   description: Current reaction status after toggling.
 *                   enum: [liked, unliked]
 *                   example: liked
 *                 reactionCount:
 *                   type: integer
 *                   description: Total number of reactions of this type for the post.
 *                   example: 5
 *       400:
 *         description: Invalid post ID (not a valid ObjectId)
 *       401:
 *         description: Unauthorized – Missing or invalid Bearer token
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.post("/posts/:postId/reaction", protect, toggleReaction);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post (owner only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post deleted successfully"
 *       401:
 *         description: Not authorized to delete this post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete("/posts/:postId", protect, deletePost);

module.exports = router;
