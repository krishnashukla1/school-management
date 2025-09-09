const { validationResult } = require('express-validator');
const Batch = require('../models/Batch');
const Log = require('../models/TransactionLog');

const createBatch = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const batch = new Batch(req.body);
  await batch.save();
  await new Log({ action: 'batch_create', user: req.user._id, details: { batchId: batch._id } }).save();
  res.json(batch);
};

const getBatches = async (req, res) => {
  const batches = await Batch.find().populate('students');
  res.json(batches);
};

const getBatch = async (req, res) => {
  const batch = await Batch.findById(req.params.id).populate('students');
  if (!batch) return res.status(404).json({ message: 'Batch not found' });
  res.json(batch);
};

const updateBatch = async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!batch) return res.status(404).json({ message: 'Batch not found' });
  await new Log({ action: 'batch_update', user: req.user._id, details: { batchId: batch._id } }).save();
  res.json(batch);
};

const deleteBatch = async (req, res) => {
  const batch = await Batch.findByIdAndDelete(req.params.id);
  if (!batch) return res.status(404).json({ message: 'Batch not found' });
  await new Log({ action: 'batch_delete', user: req.user._id, details: { batchId: req.params.id } }).save();
  res.json({ message: 'Batch deleted' });
};

module.exports = { createBatch, getBatches, getBatch, updateBatch, deleteBatch };