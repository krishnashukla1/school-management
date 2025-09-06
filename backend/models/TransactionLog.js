const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },  // e.g., 'fee_deposit', 'document_upload'
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);