import express from 'express';
import Result from '../models/Result.js';
import Exam from '../models/Exam.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get results
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      query.studentId = student._id;
    } else if (req.query.studentId) {
      query.studentId = req.query.studentId;
    }

    const results = await Result.find(query)
      .populate('studentId', 'name rollNumber')
      .populate({
        path: 'examId',
        populate: { path: 'courseId', select: 'courseName courseCode' }
      })
      .sort({ publishedDate: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student results
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId })
      .populate({
        path: 'examId',
        populate: { path: 'courseId', select: 'courseName courseCode credits' }
      })
      .sort({ publishedDate: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enter result (faculty only)
router.post('/', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const { studentId, examId, marksObtained, remarks } = req.body;
    
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Calculate grade
    const percentage = (marksObtained / exam.totalMarks) * 100;
    let grade;
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 40) grade = 'D';
    else grade = 'F';

    const faculty = await Faculty.findOne({ userId: req.user._id });
    const result = await Result.create({
      studentId,
      examId,
      marksObtained,
      grade,
      remarks,
      enteredBy: faculty?._id || req.user._id
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Result already exists for this exam' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update result
router.put('/:id', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;