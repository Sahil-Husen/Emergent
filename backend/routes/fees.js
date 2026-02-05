import express from 'express';
import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get fees
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      query.studentId = student._id;
    } else if (req.query.studentId) {
      query.studentId = req.query.studentId;
    }

    const fees = await Fee.find(query)
      .populate('studentId', 'name rollNumber')
      .sort({ dueDate: -1 });
    
    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student fees
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.params.studentId })
      .sort({ dueDate: -1 });
    
    const totalPending = await Fee.aggregate([
      { $match: { studentId: req.params.studentId, status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      fees,
      totalPending: totalPending[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create fee (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pay fee (mock payment)
router.post('/pay', protect, async (req, res) => {
  try {
    const { feeId, paymentMethod } = req.body;
    
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    if (fee.status === 'paid') {
      return res.status(400).json({ error: 'Fee already paid' });
    }

    // Mock payment processing
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    fee.status = 'paid';
    fee.paymentDate = new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;
    await fee.save();

    res.json({ 
      message: 'Payment successful',
      transactionId,
      fee 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update fee status
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }
    res.json(fee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;