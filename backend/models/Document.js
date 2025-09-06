const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type: { type: String, enum: ['NOC', 'Marksheet', 'Project', 'LessonPlan'], required: true },
  fileUrl: { type: String, required: true },  // URL to stored file (e.g., S3 or local)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);