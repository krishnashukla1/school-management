
const { validationResult } = require('express-validator');
const Document = require('../models/Document');
const Log = require('../models/TransactionLog');


const uploadDocument = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let fileUrl = req.body.fileUrl || null;
    if (req.file) {
      // If user uploaded a file, create URL to access it
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (!fileUrl) return res.status(400).json({ message: 'File URL or upload is required' });

    const document = new Document({
      student: req.body.student,
      type: req.body.type,
      fileUrl
    });

    await document.save();
    await new Log({ action: 'document_upload', user: req.user._id, details: { docId: document._id } }).save();

    res.status(201).json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload document' });
  }
};


// Get all documents of a student
const getStudentDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ student: req.params.id });
    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
};


// Similar for updateDocument
const updateDocument = async (req, res) => {
  try {
    let fileUrl = req.body.fileUrl || null;
    if (req.file) {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updateData = { type: req.body.type };
    if (fileUrl) updateData.fileUrl = fileUrl;

    const document = await Document.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    await new Log({ action: 'document_update', user: req.user._id, details: { docId: document._id } }).save();
    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update document' });
  }
};

// Delete a document
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    await new Log({ action: 'document_delete', user: req.user._id, details: { docId: req.params.id } }).save();
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete document' });
  }
};

module.exports = { uploadDocument, getStudentDocuments, updateDocument, deleteDocument };
