// const feeSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   amount: { type: Number, required: true },
//   installmentNo: { type: Number, required: true },
//   totalInstallments: { type: Number, required: true },
//   paymentDate: { type: Date, default: Date.now },
//   dueDate: { type: Date, required: true },
//   status: { 
//     type: String, 
//     enum: ['pending', 'paid', 'overdue'], 
//     default: 'pending' 
//   },
//   receiptNumber: { type: String, unique: true },
//   paymentMethod: { type: String, default: 'cash' },
//   collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// });


const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  installment: { type: Number, default: 1 },  // Track installment number
  totalDue: { type: Number, required: true },
  paidDate: { type: Date, default: Date.now },
  receiptId: { type: String, unique: true },  // Auto-generated
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fee', feeSchema);