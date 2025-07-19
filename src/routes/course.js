const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const courseService = require('../services/courseService');

const router = express.Router();

// GET /api/course - get all courses (for both learners and instructors)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/course/:id - get a single course by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 