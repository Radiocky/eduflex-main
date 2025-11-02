const User = require('../models/User');

// @desc    Admin creates a new user (student, professor, or another admin)
// @route   POST /api/admin/create-user
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // --- Validate input ---
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const validRoles = ['admin', 'professor', 'student'];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid role. Must be admin, professor, or student' });
    }

    // --- Check if user already exists ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    // --- Create new user ---
    const newUser = new User({
      name,
      email,
      password, // will be auto-hashed in User model
      role: role.toLowerCase(),
    });

    await newUser.save();

    // --- Respond with success (excluding password) ---
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Server error creating user', error: error.message });
  }
};

// @desc    Admin retrieves all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUserList = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json(users);
  } catch (error) {
    console.error('Get User List Error:', error);
    res.status(500).json({ message: 'Server error fetching users', error: error.message });
  }
};

module.exports = { createUser, getUserList };
