import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  currentPosition: String,
  currentCompany: String,
  location: String,
  linkedinProfile: String,
  email: String,
  phone: String,
  achievements: [String],
  willingToMentor: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Alumni', alumniSchema);