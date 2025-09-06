const express = require('express');
const { body } = require('express-validator');
const { uploadDocument, getStudentDocuments, updateDocument, deleteDocument } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin', 'accountant'), [
  body('student').notEmpty(),
  body('type').isIn(['NOC', 'Marksheet', 'Project', 'LessonPlan']),
  body('fileUrl').notEmpty()
], uploadDocument);

router.get('/student/:id', protect, getStudentDocuments);
router.put('/:id', protect, authorize('admin', 'accountant'), updateDocument);
router.delete('/:id', protect, authorize('admin'), deleteDocument);

module.exports = router;