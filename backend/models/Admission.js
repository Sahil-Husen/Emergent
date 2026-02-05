import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
  applicantName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  previousEducation: {
    institution: String,
    percentage: Number,
    year: Number
  },
  entranceScore: {
    type: Number,
    required: true
  },
  meritRank: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'enrolled'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: Date,
  remarks: String,
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }
});

export default mongoose.model('Admission', admissionSchema);