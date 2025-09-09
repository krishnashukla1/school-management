import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiUsers, FiDollarSign, FiShield } from 'react-icons/fi';
import api from '../services/api';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const Reports = () => {
  const [feeSummary, setFeeSummary] = useState(null);
  const [fraudLogs, setFraudLogs] = useState([]);
  const [batchSummary, setBatchSummary] = useState([]);

  useEffect(() => {
    api.get('/reports/fees').then(res => setFeeSummary(res.data));
    api.get('/reports/fraud-check').then(res => setFraudLogs(res.data));
    api.get('/reports/batches').then(res => setBatchSummary(res.data));
  }, []);


const downloadExcel = async () => {
  try {
    const res = await api.get('/reports/fees', {}); // Use your existing feeSummary API
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Total Collection');

    sheet.columns = [
      { header: 'Total Records', key: 'totalRecords', width: 20 },
      { header: 'Total Collected', key: 'totalCollected', width: 20 },
      { header: 'Pending Due', key: 'totalDue', width: 20 },
    ];

    sheet.addRow({
      totalRecords: res.data.totalRecords,
      totalCollected: res.data.totalCollected,
      totalDue: res.data.totalDue,
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'total_collection.xlsx');
  } catch (err) {
    console.error('Excel download failed:', err);
  }
};

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FiTrendingUp className="text-blue-600" /> Reports & Analytics
      </h2>

      {/* Fee Analytics */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FiDollarSign className="text-green-500" /> Fee Analytics
        </h3>
        {feeSummary && (
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-green-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Fee Records</p>
              <p className="text-xl font-bold">{feeSummary.totalRecords}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Collected</p>
              <p className="text-xl font-bold text-green-600">
                ₹{feeSummary.totalCollected.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg shadow">
              <p className="text-sm text-gray-500">Pending Due</p>
              <p className="text-xl font-bold text-red-600">
                ₹{feeSummary.totalDue.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Batch Summary */}
  <div className="bg-white p-6 rounded-2xl shadow-lg">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
      <FiUsers className="text-indigo-500" /> Batch Summary
    </h3>
    <button
      onClick={downloadExcel}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Download Excel
    </button>
  </div>


        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3 text-left">Batch</th>
                <th className="p-3 text-left">Students</th>
                <th className="p-3 text-left">Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {batchSummary.map(b => (
                <tr key={b._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{b.name}</td>
                  <td className="p-3">{b.studentCount}</td>
                  <td className="p-3 text-green-600 font-semibold">
                    ₹{b.totalCollected.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fraud Logs */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FiShield className="text-red-500" /> Fraud Prevention Audit
        </h3>
        <ul className="space-y-3">
          {fraudLogs.length > 0 ? (
            fraudLogs.map(log => (
              <li key={log._id} className="bg-gray-50 border rounded-md p-3 text-sm text-gray-700 shadow-sm">
                <span className="font-medium text-gray-800">{log.action}</span>:{" "}
                {JSON.stringify(log.details)} <br />
                <span className="text-xs text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 italic">No fraud logs available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Reports;



