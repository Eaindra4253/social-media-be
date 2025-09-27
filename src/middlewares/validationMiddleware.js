/**
 * Middleware to validate registration request fields
 */
const validateRegistration = (req, res, next) => {
  let { name, email, password, password_confirmation } = req.body;

  name = name?.trim();
  email = email?.trim();

  const errors = [];

  if (!name) errors.push("Name is required");
  else if (name.length > 255) errors.push("Name cannot exceed 255 characters");

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  if (!email) errors.push("Email is required");
  else if (!emailRegex.test(email)) errors.push("Please enter a valid email");

  if (!password) errors.push("Password is required");
  else if (password.length < 8)
    errors.push("Password must be at least 8 characters");

  if (!password_confirmation) errors.push("Password confirmation is required");
  else if (password !== password_confirmation)
    errors.push("Passwords do not match");

  if (errors.length > 0)
    return res.status(400).json({ message: errors.join(", ") });

  req.body.name = name;
  req.body.email = email;

  next();
};

module.exports = { validateRegistration };
