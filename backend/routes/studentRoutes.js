
const express = require('express');
const { body } = require('express-validator');
const {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentBatches,
  updateStudentSelf,
  deleteStudentSelf,
  getStudentByUserId
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// ➕ Add new student (admin/accountant only)
router.post(
  '/',
  protect,
  authorize('admin', 'accountant'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('rollNo').notEmpty().withMessage('Roll No is required'),
    body('course').notEmpty().withMessage('Course is required'),
    body('year').isNumeric().withMessage('Year must be a number')
  ],
  addStudent
);

// 📌 All students (admin/accountant only)
router.get('/', protect, authorize('admin', 'accountant'), getStudents);

// 📌 Single student (any authenticated user, but student can only see own)
router.get('/:id', protect, getStudent);

// ✏️ Update student (admin/accountant)
router.put('/:id', protect, authorize('admin', 'accountant'), updateStudent);

// ❌ Delete student (admin only)
router.delete('/:id', protect, authorize('admin'), deleteStudent);

// 📌 Get batches for a student
router.get('/:id/batches', protect, getStudentBatches);

// 📌 Student self routes
router.put('/self', protect, updateStudentSelf);
router.delete('/self', protect, deleteStudentSelf);

// 📌 Get student by user ID (for dashboard/profile)
router.get('/user/:userId', protect, getStudentByUserId);

module.exports = router;
