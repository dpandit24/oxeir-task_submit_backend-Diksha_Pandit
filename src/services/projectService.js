const ProjectSubmission = require('../models/ProjectSubmission');
const Course = require('../models/Course');

async function submitProject({ userId, courseId, fileUrl, githubLink }) {
  const submission = new ProjectSubmission({
    userId,
    courseId,
    fileUrl,
    githubLink,
    status: 'pending',
  });
  await submission.save();
  return submission;
}

async function getSubmissionsByCourse(courseId) {
  return ProjectSubmission.find({ courseId }).populate('userId', 'name email');
}

async function evaluateSubmission({ submissionId, rating, tags, comment }) {
  const submission = await ProjectSubmission.findById(submissionId);
  if (!submission) throw new Error('Submission not found');
  submission.status = 'evaluated';
  submission.feedback = {
    rating,
    tags,
    comment,
    evaluatedAt: new Date(),
  };
  await submission.save();
  return submission;
}

async function getEvaluationsByUser(userId) {
  return ProjectSubmission.find({ userId });
}

// New: Instructor dashboard stats
async function getInstructorDashboardStats() {
  const total = await ProjectSubmission.countDocuments();
  const pending = await ProjectSubmission.countDocuments({ status: 'pending' });
  const evaluated = await ProjectSubmission.countDocuments({ status: 'evaluated' });
  return { total, pending, evaluated };
}

// New: Get submissions with filters and sorting
async function getSubmissions({ courseId, status }) {
  const filter = {};
  if (courseId) filter.courseId = courseId;
  if (status) filter.status = status;
  const submissions = await ProjectSubmission.find(filter)
    .populate('userId', 'name email')
    .populate('courseId', 'name')
    .sort({ submittedAt: -1 });
  return submissions;
}

module.exports = {
  submitProject,
  getSubmissionsByCourse,
  evaluateSubmission,
  getEvaluationsByUser,
  getInstructorDashboardStats,
  getSubmissions,
}; 