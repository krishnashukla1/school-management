import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const FeeManagement = () => {
  const { user } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ studentId: '', amount: '', totalDue: '', installment: '1' });

  // ✅ Download receipt from backend
  const downloadReceipt = async (receiptId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/fees/receipt/${receiptId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob', // important
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
      toast.error('Error downloading receipt.');
    }
  };
const downloadExcel = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/fees/export-excel`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob', // important for binary data
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fees_report.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error('Excel download failed:', err);
    toast.error('Failed to download Excel.');
  }
};

  // Fetch fees and students
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !['admin', 'accountant'].includes(user.role)) {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }

      try {
        const feeResponse = await api.get('/fees');
        setFees(feeResponse.data);

        const studentResponse = await api.get('/students');
        setStudents(studentResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Fetch data failed:', err);
        setError(err.response?.data?.message || 'Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Deposit Fee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/fees/deposit', {
        ...formData,
        installment: parseInt(formData.installment),
      });

      const newFee = {
        ...response.data.fee || response.data,
        student: students.find(s => s._id === formData.studentId) || null,
      };

      setFees(prev => [...prev, newFee]);
      setFormData({ studentId: '', amount: '', totalDue: '', installment: '1' });
      setError(null);

      toast.success('Fee deposited successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add fee');
      toast.error(err.response?.data?.message || 'Failed to add fee');
    }
  };

  if (!user || !['admin', 'accountant'].includes(user.role)) {
    return <div className="text-red-500 text-center py-4">Access denied. Admin or Accountant only.</div>;
  }
  if (loading) return <div className="text-gray-600 text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-primary mb-6">Fee Management</h2>

      {/* Fee Deposit Form */}
      <form className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
        <select
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          required
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.rollNo})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="number"
          placeholder="Total Due"
          value={formData.totalDue}
          onChange={(e) => setFormData({ ...formData, totalDue: e.target.value })}
          required
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="number"
          placeholder="Installment Number"
          value={formData.installment}
          onChange={(e) => setFormData({ ...formData, installment: e.target.value })}
          required
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          Deposit Fee
        </button>
      </form>


 <div className="mb-4">
    <button
      onClick={downloadExcel}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
    >
      Download Excel
    </button>
  </div>
      {/* Fees Table */}
      <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">


        <thead className="bg-blue-600 text-white uppercase text-sm font-medium tracking-wider">
          <tr>
            <th className="p-3 text-left border-b border-blue-400">Student</th>
            <th className="p-3 text-left border-b border-blue-400">Amount</th>
            <th className="p-3 text-left border-b border-blue-400">Total Due</th>
            <th className="p-3 text-left border-b border-blue-400">Installment</th>
            <th className="p-3 text-left border-b border-blue-400">Paid Date</th>
            <th className="p-3 text-left border-b border-blue-400">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {fees.length > 0 ? (
            fees.map(f => (
              <tr key={f._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="p-3">{f.student?.name || 'Unknown'}</td>
                <td className="p-3">₹{f.amount}</td>
                <td className="p-3">₹{f.totalDue}</td>
                <td className="p-3">{f.installment}</td>
                <td className="p-3">{new Date(f.paidDate).toLocaleDateString()}</td>
                <td className="p-3">
                  {f.receiptId ? (
                    <button
                      onClick={() => downloadReceipt(f.receiptId)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FiDownload className="mr-1" /> Download
                    </button>
                  ) : (
                    'No receipt'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-3 text-center text-gray-500 italic">
                No fees recorded
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>



  );
};

export default FeeManagement;




