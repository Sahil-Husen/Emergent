import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  examType: {
    type: String,
    enum: ['midterm', 'final', 'quiz', 'assignment'],
    required: true
  },
  examName: {
    type: String,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  venue: String,
  instructions: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Exam', examSchema);