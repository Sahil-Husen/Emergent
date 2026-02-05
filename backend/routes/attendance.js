import express from 'express';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get attendance records
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      query.studentId = student._id;
    } else if (req.query.studentId) {
      query.studentId = req.query.studentId;
    }
    
    if (req.query.courseId) {
      query.courseId = req.query.courseId;
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name rollNumber')
      .populate('courseId', 'courseName courseCode')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark attendance (faculty only)
router.post('/mark', protect, authorize('faculty'), async (req, res) => {
  try {
    const { studentId, courseId, date, status, remarks } = req.body;
    const faculty = await Faculty.findOne({ userId: req.user._id });

    const attendance = await Attendance.create({
      studentId,
      courseId,
      date,
      status,
      markedBy: faculty._id,
      remarks
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Attendance already marked for this date' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get attendance statistics
router.get('/stats/:studentId', protect, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId } = req.query;

    const query = { studentId };
    if (courseId) query.courseId = courseId;

    const totalClasses = await Attendance.countDocuments(query);
    const presentClasses = await Attendance.countDocuments({ ...query, status: 'present' });
    const lateClasses = await Attendance.countDocuments({ ...query, status: 'late' });

    const attendancePercentage = totalClasses > 0 
      ? ((presentClasses + lateClasses) / totalClasses * 100).toFixed(2)
      : 0;

    res.json({
      totalClasses,
      presentClasses,
      lateClasses,
      absentClasses: totalClasses - presentClasses - lateClasses,
      attendancePercentage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;