const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  course: { type: String, required: true },  // e.g., 'BA', 'BEd'
  year: { type: Number, required: true },  // 1, 2, 3
  batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Link to User for login
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);