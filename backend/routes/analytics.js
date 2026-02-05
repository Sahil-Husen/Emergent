import express from 'express';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Admission from '../models/Admission.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import Hostel from '../models/Hostel.js';
import Alumni from '../models/Alumni.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard analytics (admin only)
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const [totalStudents, totalFaculty, totalCourses, pendingAdmissions, totalAlumni] = await Promise.all([
      Student.countDocuments({ graduationStatus: 'enrolled' }),
      Faculty.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Admission.countDocuments({ status: 'pending' }),
      Alumni.countDocuments()
    ]);

    const recentAdmissions = await Admission.find()
      .sort({ applicationDate: -1 })
      .limit(5)
      .select('applicantName program status applicationDate');

    const departmentWiseStudents = await Student.aggregate([
      { $match: { graduationStatus: 'enrolled' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const feeStats = await Fee.aggregate([
      { $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }}
    ]);

    const hostelOccupancy = await Hostel.aggregate([
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    res.json({
      overview: {
        totalStudents,
        totalFaculty,
        totalCourses,
        pendingAdmissions,
        totalAlumni
      },
      recentAdmissions,
      departmentWiseStudents,
      feeStats,
      hostelOccupancy
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;