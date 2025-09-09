// const express = require('express');
// const { protect } = require('../middleware/authMiddleware');
// const { addIncome, addExpense, getIncomes, getExpenses, getFinanceSummary } = require('../controllers/financeController');

// const router = express.Router();

// router.post('/income', protect, addIncome);
// router.post('/expense', protect, addExpense);
// router.get('/incomes', protect, getIncomes);
// router.get('/expenses', protect, getExpenses);
// router.get('/summary', protect, getFinanceSummary);

// module.exports = router;

//---------------

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  addIncome, getIncomes, updateIncome, deleteIncome,
  addExpense, getExpenses, updateExpense, deleteExpense,
  getFinanceSummary,downloadFinanceExcel
} = require('../controllers/financeController');

const router = express.Router();

// Income routes
router.post('/income', protect, addIncome);
router.get('/incomes', protect, getIncomes);
router.put('/income/:id', protect, updateIncome);
router.delete('/income/:id', protect, deleteIncome);

// Expense routes
router.post('/expense', protect, addExpense);
router.get('/expenses', protect, getExpenses);
router.put('/expense/:id', protect, updateExpense);
router.delete('/expense/:id', protect, deleteExpense);

// Summary
router.get('/summary', protect, getFinanceSummary);

router.get('/download/excel',downloadFinanceExcel)
module.exports = router;
