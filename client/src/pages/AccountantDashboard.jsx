import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';

const AccountantDashboard = () => {
  const [stats, setStats] = useState({ fees: 0, pending: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const feesData = await api.get('/fees/reports');
        const fees = feesData.data.reduce((sum, f) => sum + f.amount, 0);
        const pending = feesData.data.reduce((sum, f) => sum + (f.totalDue - f.amount), 0);
        setStats({ fees, pending });
      } catch (err) {
        console.error('Fetch stats failed:', err);
        setError('Failed to load dashboard data');
      }
    };
    fetchStats();
  }, []);

  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <DashboardCard title="Fees Collected" content={<p className="text-2xl font-bold text-primary">${stats.fees}</p>} />
      <DashboardCard title="Pending Fees" content={<p className="text-2xl font-bold text-primary">${stats.pending}</p>} />
    </div>
  );
};

export default AccountantDashboard;