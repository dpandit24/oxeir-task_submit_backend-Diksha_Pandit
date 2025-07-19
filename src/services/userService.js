const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register({ name, email, password, role }) {
  let user = await User.findOne({ email });
  if (user) throw new Error('Email already registered');
  const hashedPassword = await bcrypt.hash(password, 10);
  user = new User({ name, email, password: hashedPassword, role });
  await user.save();
  return user;
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return { token, user };
}

module.exports = { register, login }; 