const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateReceipt = (feeData, callback) => {
  const doc = new PDFDocument();
  const receiptId = `REC-${Date.now()}`;
  const filePath = `./receipts/${receiptId}.pdf`;  // Save to a folder (create 'receipts' dir)

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Fee Receipt', { align: 'center' });
  doc.text(`Receipt ID: ${receiptId}`);
  doc.text(`Student: ${feeData.student.name}`);
  doc.text(`Amount: $${feeData.amount}`);
  doc.text(`Paid On: ${feeData.paidDate.toDateString()}`);
  doc.text('Thank you for your payment!');

  doc.end();

  callback(receiptId, filePath);
};

module.exports = generateReceipt;