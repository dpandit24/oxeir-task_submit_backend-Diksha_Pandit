const mongoose = require('mongoose');
const Schemas = require('../utils/Schemas');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

module.exports = mongoose.model(Schemas.Course, CourseSchema, 'courses'); 