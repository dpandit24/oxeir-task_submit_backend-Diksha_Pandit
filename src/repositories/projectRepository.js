const ProjectSubmission = require('../models/ProjectSubmission');

async function create(submissionData) {
  const submission = new ProjectSubmission(submissionData);
  return submission.save();
}

async function findByCourseId(courseId) {
  return ProjectSubmission.find({ courseId }).populate('userId', 'name email');
}

async function findById(submissionId) {
  return ProjectSubmission.findById(submissionId);
}

async function findByUserId(userId) {
  return ProjectSubmission.find({ userId });
}

module.exports = {
  create,
  findByCourseId,
  findById,
  findByUserId,
}; 