const User = require('../models/User');

async function findByEmail(email) {
  return User.findOne({ email });
}

async function create(userData) {
  const user = new User(userData);
  return user.save();
}

module.exports = { findByEmail, create }; 