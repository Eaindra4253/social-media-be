const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and profile
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Returns the profile information of the authenticated user, including post count, reaction count, and comment count.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 64f8c2d1e7c0b1a2f0b12345
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *                 profile_picture_url:
 *                   type: string
 *                   nullable: true
 *                   example: "https://example.com/avatar.jpg"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-24T12:34:56.789Z"
 *                 post_count:
 *                   type: integer
 *                   example: 12
 *                 reaction_count:
 *                   type: integer
 *                   example: 34
 *                 comment_count:
 *                   type: integer
 *                   example: 56
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
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
router.get("/profile", protect, getProfile);
module.exports = router;
