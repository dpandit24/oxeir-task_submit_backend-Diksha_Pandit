const mongoose = require('mongoose');
const Schemas = require('../utils/Schemas');

const FeedbackSchema = new mongoose.Schema({
  rating: { type: Number },
  tags: [String],
  comment: String,
  evaluatedAt: Date,
}, { _id: false });

const ProjectSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: Schemas.User },
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: Schemas.Course },
  fileUrl: { type: String, required: true },
  githubLink: { type: String },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'evaluated'], default: 'pending' },
  feedback: FeedbackSchema,
});

module.exports = mongoose.model(Schemas.ProjectSubmission, ProjectSubmissionSchema, 'project_submissions'); 