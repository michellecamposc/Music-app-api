const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const validate = require("../helpers/validate");

// Import models
const User = require("../models/user");

// Just for testing
const test = (req, res) => {
  return res.status(200).send({
    status: "success",
    message: "Sent message from: controllers/user.js",
  });
};

// User registration
const register = async (req, res) => {
  const { name, email, password, nick } = req.body;

  // Check and validate data
  if (!name || !email || !password || !nick) {
    return res.status(400).json({
      status: "error",
      message: "Missing data to send",
    });
  }

  // Data validation
  const errors = validate(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: errors,
    });
  }

  try {
    // Duplicate user control
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { nick: nick.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "The user already exists",
      });
    }

    // Create user object
    const userToSave = new User({ name, email, password, nick });

    // Encrypt password
    const hash = await bcrypt.hash(userToSave.password, 10);
    userToSave.password = hash;

    // Save the user in Database
    await userToSave.save();

    // Response with success message and user object
    return res.status(200).json({
      status: "success",
      message: "User successfully registered",
      user: userToSave,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error registering user",
      error: error.message,
    });
  }
};

module.exports = {
  test,
  register,
};
