// services/userService.js
const User = require('../models/User');

// Get all users
const getAllUsers = async () => {
  return await User.find({});
};

// Get user by ID
const getUserById = async (id) => {
  return await User.findById(id);
};

// Find user by email
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Create user
const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

// Update user
const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

// Delete user
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
