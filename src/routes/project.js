const express = require('express');
const multer = require('multer');
const path = require('path');
const Joi = require('joi');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const projectService = require('../services/projectService');
const env = require('../utils/env');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

// Validation schemas
const submitSchema = Joi.object({
  courseId: Joi.string().required(),
  githubLink: Joi.string().uri().optional().allow(''),
});

const evaluateSchema = Joi.object({
  submissionId: Joi.string().required(),
  rating: Joi.number().min(1).max(10).required(),
  tags: Joi.array().items(Joi.string()),
  comment: Joi.string().allow(''),
});

// GET /api/project/dashboard (instructor dashboard stats)
router.get('/dashboard', authenticateToken, authorizeRoles('instructor'), async (req, res) => {
  try {
    const stats = await projectService.getInstructorDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error ' + err.message });
  }
});

// GET /api/project/submissions?courseId=...&status=... (filtered, sorted submissions)
router.get('/submissions', authenticateToken, authorizeRoles('instructor'), async (req, res) => {
  try {
    const { courseId, status } = req.query;
    const submissions = await projectService.getSubmissions({ courseId, status });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/project/submit
router.post('/submit', authenticateToken, authorizeRoles('learner'), upload.single('file'), async (req, res) => {
  const { error } = submitSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  if (!req.file) return res.status(400).json({ message: 'File is required' });
  try {
    const submission = await projectService.submitProject({
      userId: req.user.id,
      courseId: req.body.courseId,
      fileUrl: `/uploads/${req.file.filename}`,
      githubLink: req.body.githubLink,
    });
    res.status(201).json({ message: 'Project submitted', submission });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/project/evaluate
router.post('/evaluate', authenticateToken, authorizeRoles('instructor'), async (req, res) => {
  const { error } = evaluateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const submission = await projectService.evaluateSubmission(req.body);
    res.json({ message: 'Evaluation submitted', submission });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// GET /api/project/:courseId
router.get('/:courseId', authenticateToken, authorizeRoles('instructor'), async (req, res) => {
  try {
    const submissions = await projectService.getSubmissionsByCourse(req.params.courseId);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/project/evaluation/:userId
router.get('/evaluation/:userId', authenticateToken, async (req, res) => {
  if (req.user.role === 'learner' && req.user.id !== req.params.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const submissions = await projectService.getEvaluationsByUser(req.params.userId);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 