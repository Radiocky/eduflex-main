// utils/generateToken.js
const jwt = require('jsonwebtoken');

exports.generateToken = (id, role) => {
  const payload = { id, role };
  const secret = process.env.JWT_SECRET || 'dev_secret';
  // Token expires in 7 days by default
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};
