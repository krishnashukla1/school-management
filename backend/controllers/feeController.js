
// controllers/feesController.js
const { validationResult } = require('express-validator');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const Log = require('../models/TransactionLog');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const generateReceipt = require('../utils/receiptGenerator'); // optional helper
const { PDFLibDocument, rgb, degrees, StandardFonts } = require('pdf-lib'); // Renamed to avoid conflict with PDFKit's PDFDocument

// ✅ Define addWatermark BEFORE using it
async function addWatermark(inputPath, outputPath, watermarkText = 'My School - Original') {
  try {
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFLibDocument.load(existingPdfBytes); // Use pdf-lib's PDFDocument
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Await the embed

    const pages = pdfDoc.getPages();
    pages.forEach(page => {
      const { width, height } = page.getSize();
      // Simulate light gray with low opacity using rgb (0.85 is ~85% transparent gray)
      page.drawText(watermarkText, {
        x: width / 4,
        y: height / 2,
        size: 50,
        font,
        color: rgb(0.85, 0.85, 0.85), // Light gray for watermark effect
        rotate: degrees(-45),
      });
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    console.log('Watermark added:', outputPath);
  } catch (err) {
    console.error('Watermark addition failed:', err);
    // Optionally, copy the original file as fallback
    fs.copyFileSync(inputPath, outputPath);
  }
}

// const depositFee = async (req, res) => {
//   try {
//     const { studentId, amount, totalDue, installment } = req.body;
//     const student = await Student.findById(studentId);
//     if (!student) return res.status(404).json({ message: 'Student not found' });

//     // Generate receiptId
//     const receiptId = `REC-${Date.now()}`;

//     // Save Fee (paidDate will be now if not specified)
//     const fee = new Fee({ student: studentId, amount, totalDue, installment, receiptId });
//     await fee.save();

//     // Generate PDF safely
//     const receiptsDir = path.join(__dirname, '..', 'receipts');
//     if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });

//     const filePath = path.join(receiptsDir, `${receiptId}.pdf`);

//     try {
//       const doc = new PDFDocument({ size: 'A4', margin: 50 });
//       doc.pipe(fs.createWriteStream(filePath));

//       // Header
//       doc.fontSize(20).text('My School - Fee Receipt', { align: 'center' }).moveDown(1);
//       doc.fontSize(12).text(`Receipt ID: ${receiptId}`, { align: 'right' });
//       doc.text(`Date: ${new Date(fee.createdAt).toLocaleDateString()}`, { align: 'right' }).moveDown(1); // Use createdAt

//       // Student Info
//       doc.fontSize(14).text(`Student Name: ${student.name}`);
//       doc.text(`Roll No: ${student.rollNo}`);
//       doc.text(`Course: ${student.course}`).moveDown(1);

//       // Fee Details
//       doc.fontSize(13).fillColor('#1d4ed8').text('Fee Details', { underline: true }).moveDown(0.5);
//       doc.fontSize(12).fillColor('#111827');
//       doc.text(`Amount Paid (Rs.): ${amount}`);
//       doc.text(`Installment: ${installment || 'N/A'}`);
//       doc.text(`Remaining Due (Rs.): ${Math.max(totalDue - amount, 0)}`).moveDown(2);

//       // Footer
//       doc.fontSize(10).fillColor('#6b7280');
//       doc.text('This is a system-generated receipt.', { align: 'center' });
//       doc.text('Thank you for your payment!', { align: 'center' });

//       doc.end();
//     } catch (pdfErr) {
//       console.error('PDF generation failed:', pdfErr);
//       return res.status(500).json({ message: 'PDF generation failed' });
//     }

//     // ✅ Add watermark after PDF creation (now defined above)
//     const watermarkedPath = path.join(receiptsDir, `WM-${receiptId}.pdf`);
//     await addWatermark(filePath, watermarkedPath);
//     fs.renameSync(watermarkedPath, filePath);

//     // Log the transaction
//     await new Log({
//       action: 'fee_deposit',
//       user: req.user?._id,
//       details: { feeId: fee._id, amount },
//     }).save();

//     res.status(200).json({ success: true, fee, receiptId });
//   } catch (err) {
//     console.error('Deposit fee failed:', err);
//     res.status(500).json({ message: 'Server error while depositing fee' });
//   }
// };

// Get Receipt Inline

const depositFee = async (req, res) => {
  try {
    const { studentId, amount, totalDue, installment } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const receiptId = `REC-${Date.now()}`;
    const fee = new Fee({
      student: studentId,
      amount: parseFloat(amount),
      totalDue: parseFloat(totalDue),
      installment: parseInt(installment),
      receiptId,
    });
    await fee.save();

    const receiptsDir = path.join(__dirname, '..', 'receipts');
    if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });
    const filePath = path.join(receiptsDir, `${receiptId}.pdf`);
    const watermarkedPath = path.join(receiptsDir, `WM-${receiptId}.pdf`);

    // Generate PDF and wait for finish
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      doc.fontSize(20).text('My School - Fee Receipt', { align: 'center' }).moveDown(1);
      doc.fontSize(12).text(`Receipt ID: ${receiptId}`, { align: 'right' });
      doc.text(`Date: ${new Date(fee.createdAt).toLocaleDateString()}`, { align: 'right' }).moveDown(1);

      doc.fontSize(14).text(`Student Name: ${student.name}`);
      doc.text(`Roll No: ${student.rollNo}`);
      doc.text(`Course: ${student.course}`).moveDown(1);

      doc.fontSize(13).fillColor('#1d4ed8').text('Fee Details', { underline: true }).moveDown(0.5);
      doc.fontSize(12).fillColor('#111827');
      doc.text(`Amount Paid (Rs.): ${fee.amount}`);
      doc.text(`Installment: ${fee.installment || 'N/A'}`);
      doc.text(`Remaining Due (Rs.): ${Math.max(fee.totalDue - fee.amount, 0)}`).moveDown(2);

      doc.fontSize(10).fillColor('#6b7280');
      doc.text('This is a system-generated receipt.', { align: 'center' });
      doc.text('Thank you for your payment!', { align: 'center' });

      doc.end();

      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Add watermark safely
    try {
      await addWatermark(filePath, watermarkedPath);
      fs.renameSync(watermarkedPath, filePath);
    } catch (wmErr) {
      console.error('Watermark failed:', wmErr);
    }

    // Log transaction
    await new Log({
      action: 'fee_deposit',
      user: req.user?._id,
      details: { feeId: fee._id, amount: fee.amount },
    }).save();

    res.status(200).json({ success: true, fee, receiptId });
  } catch (err) {
    console.error('Deposit fee failed:', err);
    res.status(500).json({ message: 'Server error while depositing fee' });
  }
};

const getReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findOne({ receiptId: id }).populate('student');
    if (!fee) return res.status(404).json({ message: 'Receipt not found' });

    const filePath = path.join(__dirname, '..', 'receipts', `${id}.pdf`);
    if (fs.existsSync(filePath)) return res.sendFile(filePath);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${id}.pdf"`);
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('My School - Fee Receipt', { align: 'center' }).moveDown(1);
    doc.fontSize(12).text(`Receipt ID: ${fee.receiptId}`, { align: 'right' });
    doc.text(`Date: ${new Date(fee.createdAt).toLocaleDateString()}`, { align: 'right' }).moveDown(1);

    // Student Info
    doc.fontSize(14).text(`Student Name: ${fee.student?.name || 'Unknown'}`);
    doc.text(`Roll No: ${fee.student?.rollNo || 'N/A'}`);
    doc.text(`Course: ${fee.student?.course || 'N/A'}`).moveDown(1);

    // Fee Details
    doc.fontSize(13).fillColor('#1d4ed8').text('Fee Details', { underline: true }).moveDown(0.5);
    doc.fontSize(12).fillColor('#111827');
    doc.text(`Amount Paid (Rs.): ${fee.amount}`);
    doc.text(`Installment: ${fee.installment || 'N/A'}`);
    doc.text(`Remaining Due (Rs.): ${Math.max(fee.totalDue - fee.amount, 0)}`).moveDown(2);

    // Footer
    doc.fontSize(10).fillColor('#6b7280');
    doc.text('This is a system-generated receipt.', { align: 'center' });
    doc.text('Thank you for your payment!', { align: 'center' });

    doc.end();
  } catch (err) {
    console.error('Get receipt failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download Receipt
const downloadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findOne({ receiptId: id }).populate('student');
    if (!fee) return res.status(404).json({ message: 'Receipt not found' });

    const filePath = path.join(__dirname, '..', 'receipts', `${id}.pdf`);
    if (fs.existsSync(filePath)) return res.download(filePath);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${id}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).text('My School - Fee Receipt', { align: 'center' }).moveDown(1);
    doc.fontSize(12).text(`Receipt ID: ${fee.receiptId}`, { align: 'right' });
    doc.text(`Date: ${new Date(fee.createdAt).toLocaleDateString()}`, { align: 'right' }).moveDown(1);

    doc.fontSize(14).text(`Student Name: ${fee.student?.name || 'Unknown'}`);
    doc.text(`Roll No: ${fee.student?.rollNo || 'N/A'}`);
    doc.text(`Course: ${fee.student?.course || 'N/A'}`).moveDown(1);

    doc.fontSize(13).fillColor('#1d4ed8').text('Fee Details', { underline: true }).moveDown(0.5);
    doc.fontSize(12).fillColor('#111827');
    doc.text(`Amount Paid (Rs.): ${fee.amount}`);
    doc.text(`Installment: ${fee.installment || 'N/A'}`);
    doc.text(`Remaining Due (Rs.): ${Math.max(fee.totalDue - fee.amount, 0)}`).moveDown(2);

    doc.fontSize(10).fillColor('#6b7280');
    doc.text('This is a system-generated receipt.', { align: 'center' });
    doc.text('Thank you for your payment!', { align: 'center' });

    doc.end();

    // ✅ If regenerating, add watermark to a temp file and stream it (but since we're streaming directly, watermark on-the-fly is complex; fallback to file if needed)
    // For simplicity, if file exists (with watermark), we already download it above. If regenerating, you could save to temp, watermark, then download/stream.
  } catch (err) {
    console.error('Download receipt failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const exportFeesExcel = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Fee Reports');

    // ✅ Headers as per your screenshot
    sheet.addRow([
      'Student Name',
      'Roll No',
      'Course',
      'Amount Paid',
      'Total Due',
      'Remaining Due',
      'Installment',
      'Paid Date',
      'Receipt ID'
    ]);

    // ✅ Data rows
    fees.forEach(f => {
      sheet.addRow([
        f.student?.name || 'Unknown',
        f.student?.rollNo || 'N/A',
        f.student?.course || 'N/A',
        f.amount,
        f.totalDue,
        Math.max(f.totalDue - f.amount, 0), // Remaining Due
        f.installment || 1,
        f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A',
        f.receiptId || 'N/A'
      ]);
    });

    // Optional: style header row
    sheet.getRow(1).font = { bold: true };
    sheet.columns.forEach(col => {
      col.width = 18; // uniform column width
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=fees_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export failed:', err);
    res.status(500).json({ message: 'Error exporting Excel' });
  }
};



// CRUD & Report Methods
const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student', 'name rollNo');
    res.json(fees);
  } catch (err) {
    console.error('Get all fees failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

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

const getBatchFees = async (req, res) => {
  try {
    const students = await Student.find({ batches: req.params.batchId });
    const studentIds = students.map(s => s._id);
    const fees = await Fee.find({ student: { $in: studentIds } }).populate('student', 'name rollNo');
    res.json(fees);
  } catch (err) {
    console.error('Get batch fees failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

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

const getFeeReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate) filter.createdAt = { $gte: new Date(startDate) }; // Use createdAt
    if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
    const fees = await Fee.find(filter).populate('student', 'name rollNo');
    res.json(fees);
  } catch (err) {
    console.error('Get fee reports failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



const getAllFeesForExcel = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Total Collection');

    sheet.columns = [
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Amount Paid', key: 'amount', width: 15 },
      { header: 'Total Due', key: 'totalDue', width: 15 },
      { header: 'Paid Date', key: 'paidDate', width: 20 },
      { header: 'Batch', key: 'batch', width: 20 }
    ];

    fees.forEach(fee => {
      sheet.addRow({
        studentName: fee.student?.name || 'N/A',
        amount: fee.amount,
        totalDue: fee.totalDue,
        paidDate: fee.paidDate.toLocaleDateString(),
        batch: fee.batchName || 'N/A'
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=total_collection.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  depositFee,
  getReceipt,
  downloadReceipt,
  exportFeesExcel, getAllFeesForExcel,
  getAllFees,
  getStudentFees,
  getBatchFees,
  updateFee,
  getFeeReports,
};
