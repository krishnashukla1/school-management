const Income = require('../models/Income');
const Expense = require('../models/Expense');
const ExcelJS = require('exceljs');
// Add new income
const addIncome = async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json({ message: 'Income added successfully', income });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new expense
const addExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all incomes
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Summary: total income, total expense, balance
const getFinanceSummary = async (req, res) => {
  try {
    const incomes = await Income.find();
    const expenses = await Expense.find();

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Update income
const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findByIdAndUpdate(id, req.body, { new: true });
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json({ message: 'Income updated', income });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete income
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findByIdAndDelete(id);
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json({ message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense updated', expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const downloadFinanceExcel = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ date: -1 });
    const expenses = await Expense.find().sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Finance Report');

    // Headers
    worksheet.columns = [
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Amount (₹)', key: 'amount', width: 15 },
      { header: 'Date', key: 'date', width: 20 }
    ];

    // Income rows
    incomes.forEach(i => {
      worksheet.addRow({
        type: 'Income',
        title: i.title,
        amount: i.amount,
        date: new Date(i.date).toLocaleDateString()
      });
    });

    // Expense rows
    expenses.forEach(e => {
      worksheet.addRow({
        type: 'Expense',
        title: e.title,
        amount: e.amount,
        date: new Date(e.date).toLocaleDateString()
      });
    });

    // Styling header
    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E86C1' } };
    });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="finance_report.xlsx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { addIncome, addExpense, getIncomes, getExpenses, getFinanceSummary ,  updateIncome,
  deleteIncome,
  updateExpense,
  deleteExpense, downloadFinanceExcel};
