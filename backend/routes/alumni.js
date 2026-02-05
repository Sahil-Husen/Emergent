import express from 'express';
import Alumni from '../models/Alumni.js';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all alumni
router.get('/', protect, async (req, res) => {
  try {
    const alumni = await Alumni.find()
      .populate('studentId', 'name rollNumber department program')
      .sort({ graduationYear: -1 });
    
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single alumni
router.get('/:id', protect, async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id)
      .populate('studentId', 'name rollNumber department program');
    
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create alumni record (admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    // Update student graduation status
    await Student.findByIdAndUpdate(req.body.studentId, {
      graduationStatus: 'graduated'
    });

    const alumni = await Alumni.create(req.body);
    res.status(201).json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update alumni profile
router.put('/:id', protect, async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;