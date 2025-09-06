const express = require('express');
const { body } = require('express-validator');
const { createBatch, getBatches, getBatch, updateBatch, deleteBatch } = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin'), [
  body('name').notEmpty(),
  body('course').notEmpty(),
  body('year').isNumeric()
], createBatch);

router.get('/', protect, getBatches);
router.get('/:id', protect, getBatch);
router.put('/:id', protect, authorize('admin'), updateBatch);
router.delete('/:id', protect, authorize('admin'), deleteBatch);

module.exports = router;