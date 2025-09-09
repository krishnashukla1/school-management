import { useEffect, useState } from 'react';
import api from '../services/api';
import axios from 'axios';
import DashboardCard from '../components/DashboardCard';
import { FaUserGraduate, FaChalkboardTeacher, FaMoneyBillWave, FaDownload } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, batches: 0, fees: 0 });
  const [recentFees, setRecentFees] = useState([]);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // Fetch stats and recent fees
  const fetchStats = async () => {
    try {
      const students = (await api.get('/students')).data.length;
      const batches = (await api.get('/batches')).data.length;
      const feesData = (await api.get('/fees/reports')).data;

      const fees = feesData.reduce((sum, f) => sum + (f.amount || 0), 0);

      setStats({ students, batches, fees });
      setRecentFees(feesData.slice(-10).reverse()); // last 10 payments
    } catch (err) {
      console.error('Fetch stats failed:', err);
      setError('Failed to load dashboard data');
    }
  };

  // Fetch fees with optional date filter
  const fetchReportsByDate = async () => {
    try {
      const { startDate, endDate } = dateRange;
      let query = '/fees/reports';
      if (startDate || endDate) {
        query += `?${startDate ? `startDate=${startDate}` : ''}${
          startDate && endDate ? '&' : ''
        }${endDate ? `endDate=${endDate}` : ''}`;
      }
      const feesData = (await api.get(query)).data;
      setRecentFees(feesData);
    } catch (err) {
      console.error('Fetch reports failed:', err);
      setError('Failed to load fee reports');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  // Download PDF receipt securely
  const downloadReceipt = async (receiptId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/fees/receipt/${receiptId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${receiptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Not authorized or error downloading receipt.');
    }
  };

  // Download all fees as Excel
const downloadExcel = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/fees/export-excel`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // important for Excel
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fees_report.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error('Excel download failed:', err);
    alert('Error downloading Excel file.');
  }
};


  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <DashboardCard title="Total Students" content={stats.students} icon={<FaUserGraduate />} />
        <DashboardCard title="Total Batches" content={stats.batches} icon={<FaChalkboardTeacher />} />
        <DashboardCard title="Total Fees Collected" content={`₹${stats.fees}`} icon={<FaMoneyBillWave />} />
      </div>

      {/* Date Filter + Excel Export */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Recent Fee Submissions</h3>
        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 flex items-center"
        >
          <FaDownload className="mr-2" /> Export Excel
        </button>
      </div>

      {/* Recent Fees Table */}
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <tr>
            <th className="p-3 text-left uppercase font-semibold tracking-wide">Student Name</th>
            <th className="p-3 text-left uppercase font-semibold tracking-wide">Amount</th>
            <th className="p-3 text-left uppercase font-semibold tracking-wide">Installment</th>
            <th className="p-3 text-left uppercase font-semibold tracking-wide">Remaining Due</th>
            <th className="p-3 text-left uppercase font-semibold tracking-wide">Date</th>
            <th className="p-3 text-left uppercase font-semibold tracking-wide">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {recentFees.map((f) => (
            <tr key={f._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
              <td className="p-3">{f.student?.name || 'Unknown'}</td>
              <td className="p-3">₹{f.amount}</td>
              <td className="p-3">{f.installment || 'N/A'}</td>
              <td className="p-3">₹{Math.max(f.totalDue - f.amount, 0)}</td>
              <td className="p-3">{f.paidDate ? new Date(f.paidDate).toLocaleDateString() : 'N/A'}</td>
              <td className="p-3">
                {f.receiptId ? (
                  <button
                    onClick={() => downloadReceipt(f.receiptId)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FaDownload className="mr-1" /> Download
                  </button>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
