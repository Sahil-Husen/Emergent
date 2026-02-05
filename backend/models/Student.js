import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rollNumber: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    default: 1
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  graduationStatus: {
    type: String,
    enum: ['enrolled', 'graduated', 'dropped'],
    default: 'enrolled'
  },
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Student', studentSchema);