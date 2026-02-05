import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  grade: String,
  remarks: String,
  publishedDate: {
    type: Date,
    default: Date.now
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }
});

resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });

export default mongoose.model('Result', resultSchema);