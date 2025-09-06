// const express = require('express');
// const { body } = require('express-validator');
// const { depositFee, getStudentFees, getBatchFees, getReceipt, updateFee, getFeeReports,downloadReceipt } = require('../controllers/feeController');
// const { protect, authorize } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/deposit', protect, authorize('accountant'), [
//   body('studentId').notEmpty(),
//   body('amount').isNumeric(),
//   body('totalDue').isNumeric()
// ], depositFee);

// router.get('/student/:id', protect, getStudentFees);
// router.get('/batch/:batchId', protect, authorize('admin', 'accountant'), getBatchFees);
// router.get('/receipt/:id', protect, getReceipt);
// router.put('/:id', protect, authorize('admin'), updateFee);  // Admin only for updates
// router.get('/reports', protect, authorize('admin', 'accountant'), getFeeReports);
// router.get('/download/:id', protect, authorize('admin', 'accountant'), downloadReceipt);

// module.exports = router;


//-=----

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
// router.get('/download/:id', protect, authorize('admin', 'accountant'), downloadReceipt);
router.get('/download/:id', authorize('admin', 'accountant'), downloadReceipt);


module.exports = router;