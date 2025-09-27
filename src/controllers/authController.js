const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Register a new user
 * @param {Object} req request object containing user registration data
 * @param {Object} res response object to send JSON response
 * @returns {Object} JSON response with created user info and token, or error message
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profile_picture_url } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profile_picture_url: profile_picture_url || null,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profile_picture_url: newUser.profile_picture_url,
        created_at: newUser.created_at,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Login a user
 * @param   {Object} req.body - Request body containing email and password
 * @returns {Object} 200 - Returns user info and JWT token
 * @returns {Object} 400 - Invalid credentials
 * @returns {Object} 500 - Server error
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Logout the currently logged-in user
 * requires valid JWT token
 * @returns {Object} 200 - Success message
 *
 * JWT is stateless, logout only requires the client
 * to delete the token. No server-side token deletion is performed.
 */
const logoutUser = (req, res) => {
  res.status(200).json({
    message: "Successfully logged out",
  });
};

module.exports = { registerUser, loginUser, logoutUser };
