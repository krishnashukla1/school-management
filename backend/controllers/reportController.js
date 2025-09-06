// const Fee = require('../models/Fee');
// const Batch = require('../models/Batch');
// const Log = require('../models/TransactionLog');


// const getFeeAnalytics = async (req, res) => {
//   const fees = await Fee.aggregate([
//     { $group: { _id: { $month: '$paidDate' }, total: { $sum: '$amount' } } }
//   ]);
//   res.json(fees);
// };

// const getFraudCheck = async (req, res) => {
//   const logs = await Log.find({ action: { $regex: 'fee' } }).sort({ createdAt: -1 });
//   res.json(logs);
// };

// const getBatchSummary = async (req, res) => {
//   const batches = await Batch.find().populate('students');
//   const summary = batches.map(batch => ({
//     name: batch.name,
//     studentCount: batch.students.length,
//     totalFees: 0  // Add aggregation for fees later
//   }));
//   res.json(summary);
// };


// module.exports = { getFeeAnalytics, getFraudCheck, getBatchSummary };







const Fee = require('../models/Fee');
const Batch = require('../models/Batch');
const Log = require('../models/TransactionLog');

// Monthly grouped fee analytics (for charts)
const getFeeAnalytics = async (req, res) => {
  try {
    const fees = await Fee.aggregate([
      {
        $group: {
          _id: { $month: '$paidDate' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Overall fee report summary
const getFeeReport = async (req, res) => {
  try {
    const fees = await Fee.find();

    const totalRecords = fees.length;
    const totalCollected = fees.reduce((sum, f) => sum + f.amount, 0);
    const totalDue = fees.reduce((sum, f) => sum + (f.totalDue - f.amount), 0);

    res.json({
      totalRecords,
      totalCollected,
      totalDue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fraud-related logs
const getFraudCheck = async (req, res) => {
  try {
    const logs = await Log.find({ action: { $regex: 'fee' } })
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Batch-wise summary with collected fees
const getBatchSummary = async (req, res) => {
  try {
    const batches = await Batch.aggregate([
      {
        $lookup: {
          from: "fees",
          localField: "students",
          foreignField: "student",
          as: "fees"
        }
      },
      {
        $project: {
          name: 1,
          studentCount: { $size: "$students" },
          totalCollected: { $sum: "$fees.amount" },
          totalDue: { $sum: "$fees.totalDue" }
        }
      }
    ]);

    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
  getFeeAnalytics, 
  getFeeReport, 
  getFraudCheck, 
  getBatchSummary 
};
