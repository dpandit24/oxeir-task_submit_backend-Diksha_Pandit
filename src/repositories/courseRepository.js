const Course = require('../models/Course');

async function findAll() {
  return Course.find();
}

async function findById(courseId) {
  return Course.findById(courseId);
}

module.exports = {
  findAll,
  findById,
}; 