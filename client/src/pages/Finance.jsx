
import { useEffect, useState } from 'react';
import api from '../services/api';
import { FiTrendingUp, FiDollarSign, FiTrash2, FiEdit2, FiCheck, FiX,FiDownload } from 'react-icons/fi';

const Finance = () => {
  const [summary, setSummary] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newIncome, setNewIncome] = useState({ title: '', amount: '' });
  const [newExpense, setNewExpense] = useState({ title: '', amount: '' });
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchData = async () => {
    const summaryRes = await api.get('/finance/summary');
    setSummary(summaryRes.data);
    const incomesRes = await api.get('/finance/incomes');
    setIncomes(incomesRes.data);
    const expensesRes = await api.get('/finance/expenses');
    setExpenses(expensesRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add
  const handleAddIncome = async () => {
    if (!newIncome.title || !newIncome.amount) return;
    await api.post('/finance/income', { ...newIncome, amount: Number(newIncome.amount) });
    setNewIncome({ title: '', amount: '' });
    fetchData();
  };

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) return;
    await api.post('/finance/expense', { ...newExpense, amount: Number(newExpense.amount) });
    setNewExpense({ title: '', amount: '' });
    fetchData();
  };

  // Delete
  const handleDeleteIncome = async (id) => {
    await api.delete(`/finance/income/${id}`);
    fetchData();
  };
  const handleDeleteExpense = async (id) => {
    await api.delete(`/finance/expense/${id}`);
    fetchData();
  };

  // Start Edit
  const startEditIncome = (income) => setEditingIncome({ ...income });
  const startEditExpense = (expense) => setEditingExpense({ ...expense });

  // Cancel Edit
  const cancelEditIncome = () => setEditingIncome(null);
  const cancelEditExpense = () => setEditingExpense(null);

  // Save Edit
  const saveEditIncome = async () => {
    await api.put(`/finance/income/${editingIncome._id}`, { title: editingIncome.title, amount: Number(editingIncome.amount) });
    setEditingIncome(null);
    fetchData();
  };
  const saveEditExpense = async () => {
    await api.put(`/finance/expense/${editingExpense._id}`, { title: editingExpense.title, amount: Number(editingExpense.amount) });
    setEditingExpense(null);
    fetchData();
  };


const handleDownloadExcel = async () => {
  const res = await api.get('/finance/download/excel', {
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'finance_report.xlsx');
  document.body.appendChild(link);
  link.click();
};


  return (
 <div className="max-w-7xl mx-auto p-6 space-y-8">
  {/* Title + Button in one row */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
      <FiTrendingUp className="text-blue-600" /> Finance Dashboard
    </h2>
    <button
      onClick={handleDownloadExcel}
      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
    >
      <FiDownload /> Download Excel
    </button>
  </div>
  
      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-green-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-xl font-bold text-green-600">₹{summary.totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-xl font-bold text-red-600">₹{summary.totalExpense.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-xl font-bold text-blue-600">₹{summary.balance.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Add Income */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiDollarSign className="text-green-500" /> Income
        </h3>
        <div className="flex gap-3 mb-4">
          <input type="text" placeholder="Title" value={newIncome.title} onChange={e => setNewIncome({ ...newIncome, title: e.target.value })} className="border p-2 rounded w-1/2" />
          <input type="number" placeholder="Amount" value={newIncome.amount} onChange={e => setNewIncome({ ...newIncome, amount: e.target.value })} className="border p-2 rounded w-1/4" />
          <button onClick={handleAddIncome} className="bg-green-600 text-white px-4 rounded">Add</button>
        </div>

        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map(i => (
              <tr key={i._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">
                  {editingIncome?._id === i._id ? (
                    <input className="border p-1 rounded w-full" value={editingIncome.title} onChange={e => setEditingIncome({ ...editingIncome, title: e.target.value })} />
                  ) : i.title}
                </td>
                <td className="p-3 text-green-600 font-semibold">
                  {editingIncome?._id === i._id ? (
                    <input type="number" className="border p-1 rounded w-full" value={editingIncome.amount} onChange={e => setEditingIncome({ ...editingIncome, amount: e.target.value })} />
                  ) : `₹${i.amount}`}
                </td>
                <td className="p-3">{new Date(i.date).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2">
                  {editingIncome?._id === i._id ? (
                    <>
                      <button onClick={saveEditIncome} className="text-green-600"><FiCheck /></button>
                      <button onClick={cancelEditIncome} className="text-red-600"><FiX /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditIncome(i)} className="text-blue-600"><FiEdit2 /></button>
                      <button onClick={() => handleDeleteIncome(i._id)} className="text-red-600"><FiTrash2 /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiDollarSign className="text-red-500" /> Expense
        </h3>
        <div className="flex gap-3 mb-4">
          <input type="text" placeholder="Title" value={newExpense.title} onChange={e => setNewExpense({ ...newExpense, title: e.target.value })} className="border p-2 rounded w-1/2" />
          <input type="number" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} className="border p-2 rounded w-1/4" />
          <button onClick={handleAddExpense} className="bg-red-600 text-white px-4 rounded">Add</button>
        </div>

        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">
                  {editingExpense?._id === e._id ? (
                    <input className="border p-1 rounded w-full" value={editingExpense.title} onChange={evt => setEditingExpense({ ...editingExpense, title: evt.target.value })} />
                  ) : e.title}
                </td>
                <td className="p-3 text-red-600 font-semibold">
                  {editingExpense?._id === e._id ? (
                    <input type="number" className="border p-1 rounded w-full" value={editingExpense.amount} onChange={evt => setEditingExpense({ ...editingExpense, amount: evt.target.value })} />
                  ) : `₹${e.amount}`}
                </td>
                <td className="p-3">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2">
                  {editingExpense?._id === e._id ? (
                    <>
                      <button onClick={saveEditExpense} className="text-green-600"><FiCheck /></button>
                      <button onClick={cancelEditExpense} className="text-red-600"><FiX /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditExpense(e)} className="text-blue-600"><FiEdit2 /></button>
                      <button onClick={() => handleDeleteExpense(e._id)} className="text-red-600"><FiTrash2 /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;
