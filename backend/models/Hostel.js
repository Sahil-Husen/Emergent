import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },
  hostelName: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple'],
    required: true
  },
  allocationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['allocated', 'pending', 'vacated'],
    default: 'allocated'
  },
  vacationDate: Date,
  remarks: String
});

export default mongoose.model('Hostel', hostelSchema);