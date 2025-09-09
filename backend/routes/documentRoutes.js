
const express = require('express');
const { body } = require('express-validator');
const { uploadDocument, getStudentDocuments, updateDocument, deleteDocument } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // save files in 'uploads' folder
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

// Add new document (supports file upload or URL)
router.post(
  '/',
  protect,
  authorize('admin', 'accountant'),
  upload.single('file'), // file input from frontend
  [
    body('student').notEmpty().withMessage('Student ID is required'),
    body('type').isIn(['NOC', 'Marksheet', 'Project', 'LessonPlan']).withMessage('Invalid document type')
  ],
  uploadDocument
);

// Get documents for a student
router.get('/student/:id', protect, getStudentDocuments);

// Update a document
router.put('/:id', protect, authorize('admin', 'accountant'), upload.single('file'), updateDocument);

// Delete a document
router.delete('/:id', protect, authorize('admin'), deleteDocument);

module.exports = router;
