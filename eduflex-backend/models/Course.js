const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  professorId: {
    type: String, // or mongoose.Schema.Types.ObjectId if referencing users
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; // ✅ make sure this line exists and ONLY this is exported
