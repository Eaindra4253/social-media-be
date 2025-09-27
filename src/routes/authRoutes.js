const express = require("express");
const router = express.Router();
const {
  loginUser,
  logoutUser,
  registerUser,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { validateRegistration } = require("../middlewares/validationMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User management and authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64f8c0b8c1d2a2f3b4567890
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         profile_picture_url:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://example.com/avatar.jpg"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-09-26T00:00:00.000Z"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email
 *           example: john@example.com
 *         password:
 *           type: string
 *           description: User's password
 *           example: securePass123
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *           example: 64f8c0b8c1d2a2f3b4567890
 *         name:
 *           type: string
 *           description: Full name
 *           example: John Doe
 *         email:
 *           type: string
 *           description: User email
 *           example: john@example.com
 *         token:
 *           type: string
 *           description: JWT token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Successfully logged out
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - password_confirmation
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: securePass123
 *               password_confirmation:
 *                 type: string
 *                 minLength: 8
 *                 example: securePass123
 *               profile_picture_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name is required, Password must be at least 8 characters"
 *       409:
 *         description: Conflict – user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists"
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
router.post("/register", validateRegistration, registerUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout the currently logged-in user
 *     description: |
 *       Requires a valid JWT token.
 *       Include it in the `Authorization` header as **Bearer {token}**.
 *       The server simply returns a success message.
 *       The client must delete or invalidate the token locally.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       401:
 *         description: Unauthorized – user not logged in or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized
 */
router.post("/logout", protect, logoutUser);

module.exports = router;
