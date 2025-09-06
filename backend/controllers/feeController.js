// const { validationResult } = require('express-validator');
// const Fee = require('../models/Fee');
// const Student = require('../models/Student');
// const Log = require('../models/TransactionLog');
// const path = require('path');
// const fs = require('fs');
// const generateReceipt = require('../utils/receiptGenerator');

// const depositFee = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   const { studentId, amount, totalDue } = req.body;
//   const student = await Student.findById(studentId);
//   if (!student) return res.status(404).json({ message: 'Student not found' });

//   const fee = new Fee({ student: studentId, amount, totalDue });
//   await fee.save();

//   generateReceipt({ student, amount, paidDate: fee.paidDate }, async (receiptId, filePath) => {
//     fee.receiptId = receiptId;
//     await fee.save();
//     await new Log({ action: 'fee_deposit', user: req.user._id, details: { feeId: fee._id, amount } }).save();
//     res.json({ fee, receiptUrl: filePath });  // In production, upload to S3 and return URL
//   });
// };

// const getStudentFees = async (req, res) => {
//   const fees = await Fee.find({ student: req.params.id });
//   res.json(fees);
// };

// const getBatchFees = async (req, res) => {
//   const students = await Student.find({ batches: req.params.batchId });
//   const studentIds = students.map(s => s._id);
//   const fees = await Fee.find({ student: { $in: studentIds } });
//   res.json(fees);
// };

// const getReceipt = async (req, res) => {
//   const fee = await Fee.findById(req.params.id);
//   if (!fee) return res.status(404).json({ message: 'Fee not found' });
//   res.json({ receiptId: fee.receiptId });  // In prod, send PDF file
// };

// const updateFee = async (req, res) => {
//   const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   if (!fee) return res.status(404).json({ message: 'Fee not found' });
//   await new Log({ action: 'fee_update', user: req.user._id, details: { feeId: fee._id } }).save();
//   res.json(fee);
// };

// const getFeeReports = async (req, res) => {
//   const { startDate, endDate } = req.query;
//   const filter = {};
//   if (startDate) filter.paidDate = { $gte: new Date(startDate) };
//   if (endDate) filter.paidDate = { ...filter.paidDate, $lte: new Date(endDate) };
//   const fees = await Fee.find(filter);
//   res.json(fees);
// };


// const downloadReceipt = async (req, res) => {
//   const { id } = req.params; // receiptId (e.g., REC-123456.pdf)
//   const filePath = path.join(__dirname, '..', 'receipts', `${id}.pdf`);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ message: 'Receipt not found' });
//   }

//   res.download(filePath, `${id}.pdf`, (err) => {
//     if (err) {
//       console.error('Error downloading file:', err);
//       res.status(500).json({ message: 'Error downloading receipt' });
//     }
//   });
// };



// module.exports = { depositFee, getStudentFees, getBatchFees, getReceipt, updateFee, getFeeReports,downloadReceipt };


//==============


// const { validationResult } = require('express-validator');
// const Fee = require('../models/Fee');
// const Student = require('../models/Student');
// const Log = require('../models/TransactionLog');
// const path = require('path');
// const fs = require('fs');
// const generateReceipt = require('../utils/receiptGenerator');

// const depositFee = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   const { studentId, amount, totalDue, installment } = req.body;
//   const student = await Student.findById(studentId);
//   if (!student) return res.status(404).json({ message: 'Student not found' });

//   const fee = new Fee({ student: studentId, amount, totalDue, installment });
//   await fee.save();

//   generateReceipt({ student, amount, paidDate: fee.paidDate }, async (receiptId, filePath) => {
//     fee.receiptId = receiptId;
//     await fee.save();
//     await new Log({ action: 'fee_deposit', user: req.user._id, details: { feeId: fee._id, amount } }).save();
//     res.json({ fee, receiptUrl: `/receipts/${receiptId}.pdf` });
//   });
// };

// const getAllFees = async (req, res) => {
//   try {
//     const fees = await Fee.find().populate('student', 'name rollNo');
//     res.json(fees);
//   } catch (err) {
//     console.error('Get all fees failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getStudentFees = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: 'Invalid student ID' });
//     }
//     const fees = await Fee.find({ student: id }).populate('student', 'name rollNo');
//     res.json(fees);
//   } catch (err) {
//     console.error('Get student fees failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getBatchFees = async (req, res) => {
//   try {
//     const students = await Student.find({ batches: req.params.batchId });
//     const studentIds = students.map(s => s._id);
//     const fees = await Fee.find({ student: { $in: studentIds } }).populate('student', 'name rollNo');
//     res.json(fees);
//   } catch (err) {
//     console.error('Get batch fees failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// // ✅ Correct: find by receiptId (string), not _id (ObjectId)
// const getReceipt = async (req, res) => {
//   try {
//     const { id } = req.params; // this will be "REC-1757180974144"

//     const fee = await Fee.findOne({ receiptId: id }).populate('student');
//     if (!fee) {
//       return res.status(404).json({ message: 'Receipt not found' });
//     }

//     // If you store PDFs on disk:
//     const filePath = `./receipts/${id}.pdf`;
//     res.download(filePath);

//     // Or if you generate PDF dynamically:
//     // generateReceipt(fee, res);
//   } catch (err) {
//     console.error("Get receipt failed:", err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// const updateFee = async (req, res) => {
//   try {
//     const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!fee) return res.status(404).json({ message: 'Fee not found' });
//     await new Log({ action: 'fee_update', user: req.user._id, details: { feeId: fee._id } }).save();
//     res.json(fee);
//   } catch (err) {
//     console.error('Update fee failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getFeeReports = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const filter = {};
//     if (startDate) filter.paidDate = { $gte: new Date(startDate) };
//     if (endDate) filter.paidDate = { ...filter.paidDate, $lte: new Date(endDate) };
//     const fees = await Fee.find(filter).populate('student', 'name rollNo');
//     res.json(fees);
//   } catch (err) {
//     console.error('Get fee reports failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const downloadReceipt = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const filePath = path.join(__dirname, '..', 'receipts', `${id}.pdf`);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: 'Receipt not found' });
//     }

//     res.download(filePath, `${id}.pdf`, (err) => {
//       if (err) {
//         console.error('Error downloading file:', err);
//         res.status(500).json({ message: 'Error downloading receipt' });
//       }
//     });
//   } catch (err) {
//     console.error('Download receipt failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   depositFee,
//   getAllFees,
//   getStudentFees,
//   getBatchFees,
//   getReceipt,
//   updateFee,
//   getFeeReports,
//   downloadReceipt,
// };

//----------------------


// const { validationResult } = require('express-validator');
// const Fee = require('../models/Fee');
// const Student = require('../models/Student');
// const Log = require('../models/TransactionLog');
// const path = require('path');
// const fs = require('fs');
// const generateReceipt = require('../utils/receiptGenerator'); // helper for saving receipts
// const PDFDocument = require('pdfkit');

// /**
//  * Deposit Fee + Save Receipt on Disk
//  */
// const depositFee = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   const { studentId, amount, totalDue, installment } = req.body;
//   const student = await Student.findById(studentId);
//   if (!student) return res.status(404).json({ message: 'Student not found' });

//   const fee = new Fee({ student: studentId, amount, totalDue, installment });
//   await fee.save();

//   // Generate & Save Receipt PDF
//   generateReceipt({ student, amount, paidDate: fee.paidDate }, async (receiptId, filePath) => {
//     fee.receiptId = receiptId;
//     await fee.save();
//     await new Log({
//       action: 'fee_deposit',
//       user: req.user?._id,
//       details: { feeId: fee._id, amount },
//     }).save();

//     res.json({ fee, receiptUrl: `/api/fees/receipt/${receiptId}` });
//   });
// };

// const downloadReceipt = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const fee = await Fee.findOne({ receiptId: id }).populate('student');
//     if (!fee) return res.status(404).json({ message: 'Receipt not found' });

//     // Generate PDF dynamically and force download
//     const doc = new PDFDocument({ size: 'A4', margin: 50 });

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${id}.pdf"`);

//     doc.pipe(res);

//     doc.fontSize(20).text('Fee Receipt', { align: 'center' });
//     doc.moveDown(2);

//     doc.fontSize(12).text(`Receipt ID: ${fee.receiptId}`);
//     doc.text(`Student Name: ${fee.student?.name}`);
//     doc.text(`Roll Number: ${fee.student?.rollNo || 'N/A'}`);
//     doc.text(`Amount Paid: ₹${fee.amount}`);
//     doc.text(`Installment: ${fee.installment || 'N/A'}`);
//     doc.text(`Remaining Due: ₹${fee.totalDue - fee.amount}`);
//     doc.text(`Paid Date: ${fee.paidDate.toDateString()}`);

//     doc.end();
//   } catch (err) {
//     console.error('Download receipt failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// /**
//  * Get All Fees
//  */
// const getAllFees = async (req, res) => {
//   try {
//     const fees = await Fee.find().populate('student', 'name rollNo');
//     res.json(fees);
//   } catch (err) {
//     console.error('Get all fees failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// /**
//  * Get Fees for a Student
//  */
// const getStudentFees = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: 'Invalid student ID' });
//     }
//     const fees = await Fee.find({ student: id }).populate('student', 'name rollNo');
//     res.json(fees);
//   } catch (err) {
//     console.error('Get student fees failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// /**
//  * Get Fees for a Batch
//  */
// const getBatchFees = async (req, res) => {
//   try {
//     const students = await Student.find({ batches: req.params.batchId });
//     const studentIds = students.map((s) => s._id);
//     const fees = await Fee.find({ student: { $in: studentIds } }).populate('student', 'name rollNo');
//     res.json(fees);
//   } catch (err) {
//     console.error('Get batch fees failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// /**
//  * Serve Receipt (Option 1: From Disk, Option 2: Generate On Demand)
//  */
// const getReceipt = async (req, res) => {
//   try {
//     const { id } = req.params; // e.g. REC-1757180974144
//     const fee = await Fee.findOne({ receiptId: id }).populate('student');
//     if (!fee) return res.status(404).json({ message: 'Receipt not found' });

//     // --- Option 1: Serve from Disk (if pre-saved) ---
//     const filePath = path.join(__dirname, '..', 'receipts', `${id}.pdf`);
//     if (fs.existsSync(filePath)) {
//       return res.download(filePath);
//     }

//     // --- Option 2: Generate Dynamically ---
//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `inline; filename=${id}.pdf`);
//     doc.pipe(res);

//     doc.fontSize(18).text('Fee Receipt', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Receipt ID: ${fee.receiptId}`);
//     doc.text(`Student Name: ${fee.student?.name}`);
//     doc.text(`Amount Paid: ₹${fee.amount}`);
//     doc.text(`Installment: ${fee.installment}`);
//     doc.text(`Remaining Due: ₹${fee.totalDue - fee.amount}`);
//     doc.text(`Paid Date: ${fee.paidDate.toDateString()}`);
//     doc.end();
//   } catch (err) {
//     console.error('Get receipt failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// /**
//  * Update Fee
//  */
// const updateFee = async (req, res) => {
//   try {
//     const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!fee) return res.status(404).json({ message: 'Fee not found' });

//     await new Log({
//       action: 'fee_update',
//       user: req.user?._id,
//       details: { feeId: fee._id },
//     }).save();

//     res.json(fee);
//   } catch (err) {
//     console.error('Update fee failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// /**
//  * Fee Reports (by Date Range)
//  */
// const getFeeReports = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const filter = {};
//     if (startDate) filter.paidDate = { $gte: new Date(startDate) };
//     if (endDate) filter.paidDate = { ...filter.paidDate, $lte: new Date(endDate) };

//     const fees = await Fee.find(filter).populate('student', 'name rollNo');
//     res.json(fees);
//   } catch (err) {
//     console.error('Get fee reports failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   depositFee,
//   getAllFees,
//   getStudentFees,
//   getBatchFees,
//   getReceipt,
//   updateFee,
//   getFeeReports,
//   downloadReceipt
// };

//-------------------------------

const { validationResult } = require('express-validator');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const Log = require('../models/TransactionLog');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const generateReceipt = require('../utils/receiptGenerator'); // helper to save PDF on disk

/**
 * Deposit Fee + Save Receipt on Disk
 */
const depositFee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { studentId, amount, totalDue, installment } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const fee = new Fee({ student: studentId, amount, totalDue, installment });
    await fee.save();

    // Generate & Save Receipt PDF
    generateReceipt({ student, amount, paidDate: fee.paidDate }, async (receiptId, filePath) => {
      fee.receiptId = receiptId;
      await fee.save();

      await new Log({
        action: 'fee_deposit',
        user: req.user?._id,
        details: { feeId: fee._id, amount },
      }).save();

      res.json({ fee, receiptUrl: `/api/fees/receipt/${receiptId}` });
    });
  } catch (err) {
    console.error('Deposit fee failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Inline view of receipt (opens in browser)
 */
const getReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findOne({ receiptId: id }).populate('student');
    if (!fee) return res.status(404).json({ message: 'Receipt not found' });

    // Serve from disk if exists
    const filePath = path.join(__dirname, '..', 'receipts', `${id}.pdf`);
    if (fs.existsSync(filePath)) return res.sendFile(filePath);

    // Generate dynamically if not saved
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${id}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).text('Fee Receipt', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12).text(`Receipt ID: ${fee.receiptId}`);
    doc.text(`Student Name: ${fee.student?.name}`);
    doc.text(`Roll Number: ${fee.student?.rollNo || 'N/A'}`);
    doc.text(`Amount Paid: ₹${fee.amount}`);
    doc.text(`Installment: ${fee.installment || 'N/A'}`);
    doc.text(`Remaining Due: ₹${fee.totalDue - fee.amount}`);
    doc.text(`Paid Date: ${fee.paidDate.toDateString()}`);

    doc.end();
  } catch (err) {
    console.error('Get receipt failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Download receipt as PDF
 */
const downloadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findOne({ receiptId: id }).populate('student');
    if (!fee) return res.status(404).json({ message: 'Receipt not found' });

    // Serve from disk if exists
    const filePath = path.join(__dirname, '..', 'receipts', `${id}.pdf`);
    if (fs.existsSync(filePath)) return res.download(filePath);

    // Generate dynamically if not saved
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${id}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).text('Fee Receipt', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12).text(`Receipt ID: ${fee.receiptId}`);
    doc.text(`Student Name: ${fee.student?.name}`);
    doc.text(`Roll Number: ${fee.student?.rollNo || 'N/A'}`);
    doc.text(`Amount Paid: ₹${fee.amount}`);
    doc.text(`Installment: ${fee.installment || 'N/A'}`);
    doc.text(`Remaining Due: ₹${fee.totalDue - fee.amount}`);
    doc.text(`Paid Date: ${fee.paidDate.toDateString()}`);

    doc.end();
  } catch (err) {
    console.error('Download receipt failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get All Fees
 */
const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student', 'name rollNo');
    res.json(fees);
  } catch (err) {
    console.error('Get all fees failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get Fees for a Student
 */
const getStudentFees = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Invalid student ID' });
    const fees = await Fee.find({ student: id }).populate('student', 'name rollNo');
    res.json(fees);
  } catch (err) {
    console.error('Get student fees failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get Fees for a Batch
 */
const getBatchFees = async (req, res) => {
  try {
    const students = await Student.find({ batches: req.params.batchId });
    const studentIds = students.map((s) => s._id);
    const fees = await Fee.find({ student: { $in: studentIds } }).populate('student', 'name rollNo');
    res.json(fees);
  } catch (err) {
    console.error('Get batch fees failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update Fee
 */
const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fee) return res.status(404).json({ message: 'Fee not found' });

    await new Log({
      action: 'fee_update',
      user: req.user?._id,
      details: { feeId: fee._id },
    }).save();

    res.json(fee);
  } catch (err) {
    console.error('Update fee failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Fee Reports (by Date Range)
 */
const getFeeReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate) filter.paidDate = { $gte: new Date(startDate) };
    if (endDate) filter.paidDate = { ...filter.paidDate, $lte: new Date(endDate) };

    const fees = await Fee.find(filter).populate('student', 'name rollNo');
    res.json(fees);
  } catch (err) {
    console.error('Get fee reports failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  depositFee,
  getAllFees,
  getStudentFees,
  getBatchFees,
  getReceipt,
  downloadReceipt,
  updateFee,
  getFeeReports,
};
