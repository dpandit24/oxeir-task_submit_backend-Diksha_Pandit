const mongoose = require('mongoose');
const Schemas = require('../utils/Schemas');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['learner', 'instructor'], required: true },
});

module.exports = mongoose.model(Schemas.User, UserSchema, 'users'); 