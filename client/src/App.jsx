import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AccountantDashboard from './pages/AccountantDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentManagement from './pages/StudentManagement';
import BatchManagement from './pages/BatchManagement';
import FeeManagement from './pages/FeeManagement';
import DocumentManagement from './pages/DocumentManagement';
import Reports from './pages/Reports';
import './App.css';

function App() {
  const { user, loading } = useContext(AuthContext);
  console.log('App render, user:', user); // Debug

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
          <Route path="/" element={user ? <DashboardRouter user={user} /> : <Navigate to="/login" replace />} />
          <Route
            path="/students"
            element={user && (user.role === 'admin' || user.role === 'accountant') ? <StudentManagement /> : <Navigate to="/" replace />}
          />
          <Route
            path="/batches"
            element={user && user.role === 'admin' ? <BatchManagement /> : <Navigate to="/" replace />}
          />
          <Route
            path="/fees"
            element={user && (user.role === 'admin' || user.role === 'accountant') ? <FeeManagement /> : <Navigate to="/" replace />}
          />
          <Route
            path="/documents"
            element={user && (user.role === 'admin' || user.role === 'accountant') ? <DocumentManagement /> : <Navigate to="/" replace />}
          />
          <Route
            path="/reports"
            element={user && (user.role === 'admin' || user.role === 'accountant') ? <Reports /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

const DashboardRouter = ({ user }) => {
  console.log('DashboardRouter user:', user); // Debug
  if (!user) return <Navigate to="/login" replace />;
  if (!user.role) {
    return <div style={{ color: 'red' }}>Error: User role not set. Please log out and log in again.</div>;
  }
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'accountant') return <AccountantDashboard />;
  if (user.role === 'student') return <StudentDashboard />;
  return <Navigate to="/login" replace />;
};

export default App;