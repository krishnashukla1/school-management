const { validationResult } = require('express-validator');
const Document = require('../models/Document');
const Log = require('../models/TransactionLog');


const uploadDocument = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const document = new Document(req.body);  // Assume fileUrl is from file upload (add multer for files later)
  await document.save();
  await new Log({ action: 'document_upload', user: req.user._id, details: { docId: document._id } }).save();
  res.json(document);
};

const getStudentDocuments = async (req, res) => {
  const documents = await Document.find({ student: req.params.id });
  res.json(documents);
};

const updateDocument = async (req, res) => {
  const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!document) return res.status(404).json({ message: 'Document not found' });
  await new Log({ action: 'document_update', user: req.user._id, details: { docId: document._id } }).save();
  res.json(document);
};

const deleteDocument = async (req, res) => {
  const document = await Document.findByIdAndDelete(req.params.id);
  if (!document) return res.status(404).json({ message: 'Document not found' });
  await new Log({ action: 'document_delete', user: req.user._id, details: { docId: req.params.id } }).save();
  res.json({ message: 'Document deleted' });
};

module.exports = { uploadDocument, getStudentDocuments, updateDocument, deleteDocument };