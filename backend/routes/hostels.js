import express from 'express';
import Hostel from '../models/Hostel.js';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get hostels
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      query.studentId = student._id;
    } else if (req.query.studentId) {
      query.studentId = req.query.studentId;
    }

    const hostels = await Hostel.find(query)
      .populate('studentId', 'name rollNumber department');
    
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for hostel
router.post('/apply', protect, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    
    // Check if already allocated
    const existing = await Hostel.findOne({ 
      studentId: student._id,
      status: { $in: ['allocated', 'pending'] }
    });

    if (existing) {
      return res.status(400).json({ error: 'Hostel already allocated or application pending' });
    }

    const { hostelName, roomType } = req.body;
    
    const hostel = await Hostel.create({
      studentId: student._id,
      hostelName,
      roomType,
      roomNumber: 'TBA',
      status: 'pending'
    });

    res.status(201).json(hostel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Allocate hostel (admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json(hostel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update hostel allocation
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hostel) {
      return res.status(404).json({ error: 'Hostel record not found' });
    }
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;