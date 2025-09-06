// const express = require('express');
// const { getFeeAnalytics, getFraudCheck, getBatchSummary } = require('../controllers/reportController');
// const { protect, authorize } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.get('/fees', protect, authorize('admin', 'accountant'), getFeeAnalytics);
// router.get('/fraud-check', protect, authorize('admin'), getFraudCheck);
// router.get('/batches', protect, authorize('admin', 'accountant'), getBatchSummary);

// module.exports = router;



const express = require('express');
const { 
  getFeeAnalytics, 
  getFeeReport, 
  getFraudCheck, 
  getBatchSummary 
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Overall summary
router.get('/fees', protect, authorize('admin', 'accountant'), getFeeReport);

// Monthly analytics (for chart)
router.get('/fees/analytics', protect, authorize('admin', 'accountant'), getFeeAnalytics);

// Fraud audit
router.get('/fraud-check', protect, authorize('admin'), getFraudCheck);

// Batch summary
router.get('/batches', protect, authorize('admin', 'accountant'), getBatchSummary);

module.exports = router;
