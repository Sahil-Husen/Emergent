import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Student from '../models/Student.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get enrollments
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      query.studentId = student._id;
    } else if (req.query.studentId) {
      query.studentId = req.query.studentId;
    }

    const enrollments = await Enrollment.find(query)
      .populate('studentId', 'name rollNumber')
      .populate('courseId', 'courseName courseCode credits');
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in course
router.post('/', protect, async (req, res) => {
  try {
    const { courseId, semester, academicYear } = req.body;
    
    let studentId;
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      studentId = student._id;
    } else {
      studentId = req.body.studentId;
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId,
      courseId,
      semester
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Check course capacity
    const course = await Course.findById(courseId);
    const enrollmentCount = await Enrollment.countDocuments({ courseId, status: 'active' });
    
    if (enrollmentCount >= course.maxStudents) {
      return res.status(400).json({ error: 'Course is full' });
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      semester,
      academicYear
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete enrollment
router.delete('/:id', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status: 'dropped' },
      { new: true }
    );
    
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    
    res.json({ message: 'Course dropped successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;