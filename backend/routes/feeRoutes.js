
const express = require('express');
const { body } = require('express-validator');
const {
  depositFee,
  getAllFees,
  getStudentFees,
  getBatchFees,
  getReceipt,
  updateFee,
  getFeeReports,
  downloadReceipt,
  exportFeesExcel
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin', 'accountant'), getAllFees);
router.post(
  '/deposit',
  protect,
  authorize('admin', 'accountant'),
  [
    body('studentId').notEmpty(),
    body('amount').isNumeric(),
    body('totalDue').isNumeric(),
    body('installment').isNumeric().optional(),
  ],
  depositFee
);
router.get('/student/:id', protect, getStudentFees);
router.get('/batch/:batchId', protect, authorize('admin', 'accountant'), getBatchFees);
router.get('/receipt/:id', protect, getReceipt);
router.put('/:id', protect, authorize('admin'), updateFee);
router.get('/reports', protect, authorize('admin', 'accountant'), getFeeReports);
router.get('/download/:id', protect, authorize('admin', 'accountant'), downloadReceipt);

// ✅ Corrected Excel export route
router.get('/export-excel', protect, authorize('admin', 'accountant'), exportFeesExcel);

module.exports = router;
