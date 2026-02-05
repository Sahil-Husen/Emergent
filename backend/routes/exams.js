import express from 'express';
import Exam from '../models/Exam.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all exams
router.get('/', protect, async (req, res) => {
  try {
    const { courseId } = req.query;
    const query = courseId ? { courseId } : {};
    
    const exams = await Exam.find(query)
      .populate('courseId', 'courseName courseCode department')
      .populate('createdBy', 'name')
      .sort({ examDate: 1 });
    
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create exam (faculty/admin)
router.post('/', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.user._id });
    const exam = await Exam.create({
      ...req.body,
      createdBy: faculty?._id || req.user._id
    });
    
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single exam
router.get('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('courseId', 'courseName courseCode')
      .populate('createdBy', 'name');
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exam
router.put('/:id', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete exam
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

import Faculty from '../models/Faculty.js';
export default router;