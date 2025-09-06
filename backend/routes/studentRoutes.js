const express = require('express');
const { body } = require('express-validator');
const { addStudent, getStudents, getStudent, updateStudent, deleteStudent, getStudentBatches, 
  updateStudentSelf,deleteStudentSelf
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin', 'accountant'), [
  body('name').notEmpty(),
  body('rollNo').notEmpty(),
  body('course').notEmpty(),
  body('year').isNumeric()
], addStudent);

router.get('/', protect, authorize('admin', 'accountant'), getStudents);
router.get('/:id', protect, getStudent);  // Students can view own
router.put('/:id', protect, authorize('admin', 'accountant'), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);
router.get('/:id/batches', protect, getStudentBatches);


module.exports = router;