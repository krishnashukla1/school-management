// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// const generateReceipt = (feeData, callback) => {
//   const doc = new PDFDocument();
//   const receiptId = `REC-${Date.now()}`;
//   const filePath = `./receipts/${receiptId}.pdf`;  // Save to a folder (create 'receipts' dir)

//   doc.pipe(fs.createWriteStream(filePath));

//   doc.fontSize(20).text('Fee Receipt', { align: 'center' });
//   doc.text(`Receipt ID: ${receiptId}`);
//   doc.text(`Student: ${feeData.student.name}`);
//   doc.text(`Amount: $${feeData.amount}`);
//   doc.text(`Paid On: ${feeData.paidDate.toDateString()}`);
//   doc.text('Thank you for your payment!');

//   doc.end();

//   callback(receiptId, filePath);
// };

// module.exports = generateReceipt;



//---------------

// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');

// const generateReceipt = (feeData, callback) => {
//   const { student, amount, paidDate } = feeData;
//   const receiptId = `REC-${Date.now()}`;
//   const filePath = path.join(__dirname, '..', 'receipts', `${receiptId}.pdf`);

//   // Ensure receipts folder exists
//   if (!fs.existsSync(path.join(__dirname, '..', 'receipts'))) {
//     fs.mkdirSync(path.join(__dirname, '..', 'receipts'));
//   }

//   const doc = new PDFDocument({ size: 'A4', margin: 50 });
//   doc.pipe(fs.createWriteStream(filePath));

//   // --- HEADER ---
//   doc
//     .fillColor('#1d4ed8')
//     .fontSize(26)
//     .text('🏫 My School', { align: 'center' })
//     .moveDown(0.3);

//   doc
//     .fontSize(18)
//     .fillColor('#111827')
//     .text('Fee Payment Receipt', { align: 'center' })
//     .moveDown(0.8);

//   doc
//     .strokeColor('#1d4ed8')
//     .lineWidth(1)
//     .moveTo(50, doc.y)
//     .lineTo(550, doc.y)
//     .stroke()
//     .moveDown(1);

//   // --- RECEIPT INFO ---
//   doc
//     .fontSize(12)
//     .fillColor('#374151')
//     .text(`Receipt ID: ${receiptId}`)
//     .text(`Paid Date: ${new Date(paidDate).toLocaleDateString()}`)
//     .moveDown(1);

//   // --- STUDENT INFO ---
//   doc
//     .fontSize(14)
//     .fillColor('#111827')
//     .text(`Student Name: ${student.name}`, { continued: true })
//     .text(`  |  Roll No: ${student.rollNo || 'N/A'}`)
//     .moveDown(0.5);

//   doc.text(`Course: ${student.course || 'N/A'}`).moveDown(1);

//   // --- FEE DETAILS ---
//   doc
//     .fontSize(13)
//     .fillColor('#1d4ed8')
//     .text('Payment Details', { underline: true })
//     .moveDown(0.5);

//   doc
//     .fontSize(12)
//     .fillColor('#111827')
//     .text(`Amount Paid: ₹${amount}`)
//     .text(`Remaining Due: ₹${Math.max(student.totalDue - amount, 0)}`)
//     .moveDown(1);

//   // --- FOOTER ---
//   doc
//     .fillColor('#6b7280')
//     .fontSize(10)
//     .text('This is a system-generated receipt.', { align: 'center' })
//     .text('Thank you for your payment!', { align: 'center' })
//     .moveDown(1);

//   // Optional: Dashed line for style
//   doc
//     .dash(5, { space: 5 })
//     .moveTo(50, doc.y)
//     .lineTo(550, doc.y)
//     .stroke()
//     .undash();

//   doc.end();

//   callback(receiptId, filePath);
// };

// module.exports = generateReceipt;

//------------------


// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// const generateReceipt = (feeData, callback) => {
//   const { student, amount, paidDate, receiptId, installment, totalDue } = feeData;
//   const doc = new PDFDocument({ size: 'A4', margin: 50 });

//   const filePath = `./receipts/${receiptId}.pdf`;
//   doc.pipe(fs.createWriteStream(filePath));

//   // --- HEADER ---
//   doc
//     .fillColor('#1d4ed8')
//     .fontSize(28)
//     .text('🏫 My School', { align: 'center' })
//     .moveDown(0.2);

//   doc
//     .fontSize(18)
//     .fillColor('#111827')
//     .text('Fee Payment Receipt', { align: 'center' })
//     .moveDown(1);

//   doc
//     .strokeColor('#1d4ed8')
//     .lineWidth(1)
//     .moveTo(50, doc.y)
//     .lineTo(550, doc.y)
//     .stroke()
//     .moveDown(1);

//   // --- RECEIPT INFO ---
//   doc
//     .fontSize(12)
//     .fillColor('#374151')
//     .text(`Receipt ID: ${receiptId}`, { continued: true })
//     .text(`   Paid On: ${new Date(paidDate).toDateString()}`, { align: 'right' })
//     .moveDown(1);

//   // --- STUDENT INFO ---
//   doc
//     .fontSize(14)
//     .fillColor('#111827')
//     .text(`Student Name: ${student.name}`, { continued: true })
//     .text(`  |  Roll No: ${student.rollNo || 'N/A'}`)
//     .moveDown(0.5);

//   doc.text(`Course: ${student.course || 'N/A'}`).moveDown(1);

//   // --- FEE DETAILS ---
//   doc
//     .fontSize(13)
//     .fillColor('#1d4ed8')
//     .text('Payment Details', { underline: true })
//     .moveDown(0.5);

//   doc
//     .fontSize(12)
//     .fillColor('#111827')
//     .text(`Amount Paid: ₹${amount}`)
//     .text(`Installment: ${installment || 'N/A'}`)
//     .text(`Remaining Due: ₹${Math.max(totalDue - amount, 0) || 0}`)
//     .moveDown(1);

//   // --- FOOTER ---
//   doc
//     .fillColor('#6b7280')
//     .fontSize(10)
//     .text('This is a system-generated receipt.', { align: 'center' })
//     .text('Thank you for your payment!', { align: 'center' })
//     .moveDown(2);

//   // Optional: Add dashed line for aesthetics
//   doc
//     .dash(5, { space: 5 })
//     .moveTo(50, doc.y)
//     .lineTo(550, doc.y)
//     .stroke()
//     .undash();

//   doc.end();
//   callback(receiptId, filePath);
// };

// module.exports = generateReceipt;

//----------------

const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateReceipt = (feeData, callback) => {
  const { student, amount, paidDate, receiptId, installment, totalDue } = feeData;
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const filePath = `./receipts/${receiptId}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  // Set fonts (assuming standard PDFKit fonts; custom fonts can be registered if available)
  doc.registerFont('Bold', 'Helvetica-Bold');
  doc.registerFont('Regular', 'Helvetica');
  doc.registerFont('Italic', 'Helvetica-Oblique');

  // --- HEADER ---
  doc
    .fillColor('#1e40af')
    .font('Bold')
    .fontSize(30)
    .text('My School', { align: 'center' })
    .moveDown(0.3);
  doc
    .font('Regular')
    .fontSize(16)
    .fillColor('#374151')
    .text('Fee Payment Receipt', { align: 'center' })
    .moveDown(0.5);

  // Logo placeholder (can replace with actual image if available)
  doc
    .fillColor('#e5e7eb')
    .rect(40, 40, 50, 50)
    .fill()
    .fillColor('#1e40af')
    .fontSize(10)
    .text('Logo', 50, 60, { align: 'left' });

  // Header line
  doc
    .strokeColor('#1e40af')
    .lineWidth(2)
    .moveTo(40, doc.y)
    .lineTo(555, doc.y)
    .stroke()
    .moveDown(1);

  // --- RECEIPT INFO ---
  doc
    .font('Regular')
    .fontSize(12)
    .fillColor('#374151')
    .text(`Receipt ID: ${receiptId}`, 40, doc.y)
    .text(`Date: ${new Date(paidDate).toLocaleDateString('en-GB', { 
      day: '2-digit', month: 'long', year: 'numeric' })}`, 350, doc.y, { align: 'right' })
    .moveDown(1);

  // --- STUDENT INFO ---
  doc
    .font('Bold')
    .fontSize(14)
    .fillColor('#111827')
    .text('Student Information', { underline: true })
    .moveDown(0.5);
  doc
    .font('Regular')
    .fontSize(12)
    .text(`Name: ${student.name}`)
    .text(`Roll No: ${student.rollNo || 'N/A'}`)
    .text(`Course: ${student.course || 'N/A'}`)
    .moveDown(1);

  // --- FEE DETAILS TABLE ---
  doc
    .font('Bold')
    .fontSize(14)
    .fillColor('#111827')
    .text('Payment Details', { underline: true })
    .moveDown(0.5);

  // Table header
  const tableTop = doc.y;
  const tableLeft = 40;
  const col1 = tableLeft;
  const col2 = tableLeft + 300;
  doc
    .font('Bold')
    .fontSize(12)
    .fillColor('#ffffff')
    .rect(tableLeft, tableTop, 515, 20)
    .fill('#1e40af')
    .text('Description', col1 + 10, tableTop + 5)
    .text('Amount', col2 + 10, tableTop + 5);

  // Table rows
  const rowHeight = 20;
  const rows = [
    { desc: `Amount Paid (${installment || 'N/A'})`, amount: `₹${amount.toFixed(2)}` },
    { desc: 'Remaining Due', amount: `₹${Math.max(totalDue - amount, 0).toFixed(2)}` },
    { desc: 'Total Due', amount: `₹${totalDue.toFixed(2)}` },
  ];

  rows.forEach((row, index) => {
    const y = tableTop + (index + 1) * rowHeight;
    doc
      .fillColor(index % 2 === 0 ? '#f3f4f6' : '#ffffff')
      .rect(tableLeft, y, 515, rowHeight)
      .fill()
      .fillColor('#111827')
      .font('Regular')
      .fontSize(11)
      .text(row.desc, col1 + 10, y + 5)
      .text(row.amount, col2 + 10, y + 5);
  });

  // Table border
  doc
    .strokeColor('#d1d5db')
    .lineWidth(1)
    .rect(tableLeft, tableTop, 515, rowHeight * (rows.length + 1))
    .stroke();

  // --- FOOTER ---
  doc.moveDown(2);
  doc
    .font('Italic')
    .fontSize(10)
    .fillColor('#6b7280')
    .text('This is a system-generated receipt. No signature required.', { align: 'center' })
    .moveDown(0.3)
    .text('Thank you for your payment!', { align: 'center' });

  // Footer decorative line
  doc
    .strokeColor('#1e40af')
    .lineWidth(1)
    .dash(5, { space: 5 })
    .moveTo(40, doc.y + 20)
    .lineTo(555, doc.y + 20)
    .stroke()
    .undash();

  // Finalize PDF
  doc.end();
  callback(receiptId, filePath);
};

module.exports = generateReceipt;