const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const projectService = require('../services/projectService');
const fileUploadService = require('../services/fileUploadService');
const { addSignedUrlsToSubmissions } = require('../utils/fileUrlHelper');
const env = require('../utils/env');

const router = express.Router();

// Multer config - using memory storage for Supabase upload
const upload = multer({
  storage: multer.memoryStorage(),
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
    
    // Add signed URLs to submissions
    const submissionsWithUrls = await addSignedUrlsToSubmissions(submissions);
    
    res.json(submissionsWithUrls);
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
      // Upload file to Supabase
      const filePath = await fileUploadService.uploadFile(req.file, 'uploads', 'files');
      
      const submission = await projectService.submitProject({
        userId: req.user.id,
        courseId: req.body.courseId,
        fileUrl: filePath, // Store only the file path, not the full URL
        githubLink: req.body.githubLink,
      });
      
      // Add signed URL to the response
      const submissionWithUrl = await addSignedUrlsToSubmissions(submission);
      
      res.status(201).json({ 
        message: 'Project submitted successfully', 
        submission: submissionWithUrl
      });
  } catch (err) {
    console.error('Error in project submission:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});



// POST /api/project/evaluate
router.post('/evaluate', authenticateToken, authorizeRoles('instructor'), async (req, res) => {
  const { error } = evaluateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const submission = await projectService.evaluateSubmission(req.body);
    
    // Add signed URL to submission
    const submissionWithUrl = await addSignedUrlsToSubmissions(submission);
    
    res.json({ message: 'Evaluation submitted', submission: submissionWithUrl });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// GET /api/project/:courseId
router.get('/:courseId', authenticateToken, authorizeRoles('instructor'), async (req, res) => {
  try {
    const submissions = await projectService.getSubmissionsByCourse(req.params.courseId);
    
    // Add signed URLs to submissions
    const submissionsWithUrls = await addSignedUrlsToSubmissions(submissions);
    
    res.json(submissionsWithUrls);
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
    console.log('Raw submissions:', submissions);
    
    // Add signed URLs to submissions
    const submissionsWithUrls = await addSignedUrlsToSubmissions(submissions);
    console.log('Submissions with URLs:', submissionsWithUrls);
    
    res.json(submissionsWithUrls);
  } catch (err) {
    console.error('Error in evaluation endpoint:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 