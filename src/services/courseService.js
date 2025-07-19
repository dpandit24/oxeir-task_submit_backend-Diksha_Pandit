const courseRepository = require('../repositories/courseRepository');

async function getAllCourses() {
  return courseRepository.findAll();
}

async function getCourseById(courseId) {
  return courseRepository.findById(courseId);
}

module.exports = {
  getAllCourses,
  getCourseById,
}; 