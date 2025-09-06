// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import DashboardCard from '../components/DashboardCard';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({ students: 0, batches: 0, fees: 0 });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const students = (await api.get('/students')).data.length;
//         const batches = (await api.get('/batches')).data.length;
//         const fees = (await api.get('/fees/reports')).data.reduce((sum, f) => sum + (f.amount || 0), 0);
//         setStats({ students, batches, fees });
//       } catch (err) {
//         console.error('Fetch stats failed:', err);
//         setError('Failed to load dashboard data');
//       }
//     };
//     fetchStats();
//   }, []);

//   if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       <DashboardCard title="Total Students" content={<p className="text-2xl font-bold text-primary">{stats.students}</p>} />
//       <DashboardCard title="Total Batches" content={<p className="text-2xl font-bold text-primary">{stats.batches}</p>} />
//       <DashboardCard title="Total Fees Collected" content={<p className="text-2xl font-bold text-primary">${stats.fees}</p>} />
//     </div>
//   );
// };

// export default AdminDashboard;

//--------------------------------------------------


// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import DashboardCard from '../components/DashboardCard';
// import { FaUserGraduate, FaChalkboardTeacher, FaMoneyBillWave } from 'react-icons/fa';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({ students: 0, batches: 0, fees: 0 });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const students = (await api.get('/students')).data.length;
//         const batches = (await api.get('/batches')).data.length;
//         const fees = (await api.get('/fees/reports')).data.reduce((sum, f) => sum + (f.amount || 0), 0);
//         setStats({ students, batches, fees });
//       } catch (err) {
//         console.error('Fetch stats failed:', err);
//         setError('Failed to load dashboard data');
//       }
//     };
//     fetchStats();
//   }, []);

//   if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//       <DashboardCard
//         title="Total Students"
//         content={stats.students}
//         icon={<FaUserGraduate />}
//       />
//       <DashboardCard
//         title="Total Batches"
//         content={stats.batches}
//         icon={<FaChalkboardTeacher />}
//       />
//       <DashboardCard
//         title="Total Fees Collected"
//         content={`$${stats.fees}`}
//         icon={<FaMoneyBillWave />}
//       />
//     </div>
//   );
// };

// export default AdminDashboard;

//--------------------------


// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import DashboardCard from '../components/DashboardCard';
// import { FaUserGraduate, FaChalkboardTeacher, FaMoneyBillWave } from 'react-icons/fa';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({ students: 0, batches: 0, fees: 0 });
//   const [recentFees, setRecentFees] = useState([]); // store recent fee details
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const students = (await api.get('/students')).data.length;
//         const batches = (await api.get('/batches')).data.length;

//         const feeReports = (await api.get('/fees/reports')).data;
//         const fees = feeReports.reduce((sum, f) => sum + (f.amount || 0), 0);

//         // Show only latest 5 payments
//         setRecentFees(feeReports.slice(-5).reverse());  
//         setStats({ students, batches, fees });
//       } catch (err) {
//         console.error('Fetch stats failed:', err);
//         setError('Failed to load dashboard data');
//       }
//     };
//     fetchStats();
//   }, []);

//   if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-10">
//       {/* Top Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         <DashboardCard
//           title="Total Students"
//           content={stats.students}
//           icon={<FaUserGraduate />}
//         />
//         <DashboardCard
//           title="Total Batches"
//           content={stats.batches}
//           icon={<FaChalkboardTeacher />}
//         />
//         <DashboardCard
//           title="Total Fees Collected"
//           content={`$${stats.fees}`}
//           icon={<FaMoneyBillWave />}
//         />
//       </div>

//       {/* Recent Fees Section */}
//       <div className="bg-white shadow-md rounded-xl p-6">
//         <h2 className="text-lg font-semibold mb-4">Recent Fee Submissions</h2>
//         {recentFees.length > 0 ? (
//           // <table className="w-full border-collapse border border-gray-200">
//           //   <thead className="bg-gray-100">
//           //     <tr>
//           //       <th className="border p-2 text-left">Student Name</th>
//           //       <th className="border p-2 text-left">Amount</th>
//           //       <th className="border p-2 text-left">Date</th>
//           //     </tr>
//           //   </thead>
//           //   <tbody>
//           //     {recentFees.map((f, i) => (
//           //       <tr key={i} className="hover:bg-gray-50">
//           //         <td className="border p-2">{f.studentName}</td>
//           //         <td className="border p-2">${f.amount}</td>
//           //         <td className="border p-2">{new Date(f.date).toLocaleDateString()}</td>
//           //       </tr>
//           //     ))}
//           //   </tbody>
//           // </table>


//           <table className="w-full bg-white rounded-lg shadow-md mt-6">
//   <thead className="bg-primary text-white">
//     <tr>
//       <th className="p-3 text-left">Student Name</th>
//       <th className="p-3 text-left">Amount</th>
//       <th className="p-3 text-left">Date</th>
//     </tr>
//   </thead>
//   <tbody>
//     {recentFees.map(f => (
//       <tr key={f._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
//         <td className="p-3">{f.student?.name || "Unknown"}</td>
//         <td className="p-3">₹{f.amount}</td>
//         <td className="p-3">{new Date(f.paidDate).toLocaleDateString()}</td>
//       </tr>
//     ))}
//   </tbody>
// </table>

//         ) : (
//           <p className="text-gray-500">No fee records found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

//-----------------

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
      setRecentFees(feesData.slice(-5).reverse()); // last 5 payments
    } catch (err) {
      console.error('Fetch stats failed:', err);
      setError('Failed to load dashboard data');
    }
  };

  // Fetch with date range filter
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

  // ✅ Secure PDF download
  const downloadReceipt = async (receiptId) => {
    try {
      const token = localStorage.getItem('token'); // JWT
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <DashboardCard title="Total Students" content={stats.students} icon={<FaUserGraduate />} />
        <DashboardCard title="Total Batches" content={stats.batches} icon={<FaChalkboardTeacher />} />
        <DashboardCard
          title="Total Fees Collected"
          content={`₹${stats.fees}`}
          icon={<FaMoneyBillWave />}
        />
      </div>

      {/* Date Range Filter */}
      {/* Uncomment if needed */}
      {/* <div className="flex items-center gap-4 mb-6">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={fetchReportsByDate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Filter
        </button>
      </div> */}

      {/* Recent Fee Submissions */}
      <h3 className="text-xl font-semibold mb-4">Recent Fee Submissions</h3>
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
            <tr
              key={f._id}
              className="border-b hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="p-3">{f.student?.name || 'Unknown'}</td>
              <td className="p-3">₹{f.amount}</td>
              <td className="p-3">{f.installment || 'N/A'}</td>
              <td className="p-3">₹{Math.max(f.totalDue - f.amount, 0)}</td>
              <td className="p-3">
                {f.paidDate ? new Date(f.paidDate).toLocaleDateString() : 'N/A'}
              </td>
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
