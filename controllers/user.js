const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const validate = require("../helpers/validate");
const jwt = require("../helpers/jwt");

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
      user: {
        name: userToSave.name,
        nick: userToSave.nick,
        email: userToSave.email,
        image: userToSave.image,
        created_at: userToSave.created_at,
        _id: userToSave._id,
      },
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

// Implement login with JWT token authentication
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      message: "Missing data to send",
    });
  }

  try {
    // Find in database if the user exist
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).send({
        status: "error",
        message: "User doesn't exist",
      });
    }

    // Check password comparing
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({
        status: "error",
        message: "You have not correctly identified",
      });
    }

    // Return token
    const token = jwt.createToken(user);

    // Return user data
    return res.status(200).send({
      status: "success",
      message: "you have identified yourself correctly",
      user: {
        id: user._id,
        name: user.name,
        nick: user.nick,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add profile function to get user information without showing password or role.
const profile = async (req, res) => {
  // Receive the user id parameter
  const id = req.params.id;

  try {
    // Find in database if the user exist
    const userProfile = await User.findById(id, { password: 0, role: 0, email: 0 });
    if (!userProfile) {
      return res.status(404).send({
        status: "error",
        message: "User doesn't exist or there is an error",
      });
    }

    // Return the result
    return res.status(200).json({
      status: "success",
      user: userProfile,
    });

    //Return follow information
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  test,
  register,
  login,
  profile,
};
