import express from 'express';
import Admission from '../models/Admission.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all admissions (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ applicationDate: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit admission application
router.post('/', async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    
    // Auto-calculate merit rank based on entrance score
    const higherScores = await Admission.countDocuments({
      program: admission.program,
      entranceScore: { $gt: admission.entranceScore }
    });
    admission.meritRank = higherScores + 1;
    await admission.save();

    res.status(201).json(admission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single admission
router.get('/:id', protect, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/Reject admission
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const admission = await Admission.findById(req.params.id);
    
    if (!admission) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    admission.status = status;
    admission.remarks = remarks;
    admission.reviewedBy = req.user._id;
    admission.reviewDate = new Date();

    // If approved, create student account
    if (status === 'approved') {
      const rollNumber = `AMU${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      
      const user = await User.create({
        email: admission.email,
        password: 'AMU@' + rollNumber,
        role: 'student'
      });

      const student = await Student.create({
        userId: user._id,
        rollNumber,
        name: admission.applicantName,
        dateOfBirth: admission.dateOfBirth,
        phone: admission.phone,
        address: admission.address,
        department: admission.program.split(' ')[0],
        program: admission.program
      });

      admission.studentId = student._id;
      admission.status = 'enrolled';
    }

    await admission.save();
    res.json(admission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;