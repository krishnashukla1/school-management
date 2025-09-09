// import { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   console.log('Navbar user:', user);

//   return (
//     <nav className="bg-secondary p-4 shadow-sm">
//       <ul className="flex items-center space-x-6">
//         {user ? (
//           <>
//             <li>
//               <Link to="/" className="text-primary hover:text-blue-800 font-medium">
//                 Dashboard
//               </Link>
//             </li>
//             {user.role === 'admin' || user.role === 'accountant' ? (
//               <>
//                 <li>
//                   <Link to="/students" className="text-primary hover:text-blue-800 font-medium">
//                     Students
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/fees" className="text-primary hover:text-blue-800 font-medium">
//                     Fees
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/documents" className="text-primary hover:text-blue-800 font-medium">
//                     Documents
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/reports" className="text-primary hover:text-blue-800 font-medium">
//                     Reports
//                   </Link>
//                 </li>
//               </>
//             ) : null}
//             {user.role === 'admin' ? (
//               <li>
//                 <Link to="/batches" className="text-primary hover:text-blue-800 font-medium">
//                   Batches
//                 </Link>
//               </li>
//             ) : null}
//             <li>
//               <button
//                 onClick={logout}
//                 className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300"
//               >
//                 Logout
//               </button>
//             </li>
//           </>
//         ) : (
//           <>
//             <li>
//               <Link to="/login" className="text-primary hover:text-blue-800 font-medium">
//                 Login
//               </Link>
//             </li>
//             <li>
//               <Link to="/signup" className="text-primary hover:text-blue-800 font-medium">
//                 Signup
//               </Link>
//             </li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };







import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from "react-hot-toast"; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Students', path: '/students', roles: ['admin', 'accountant'] },
    { name: 'Fees', path: '/fees', roles: ['admin', 'accountant'] },
    { name: 'Documents', path: '/documents', roles: ['admin', 'accountant'] },
    { name: 'Reports', path: '/reports', roles: ['admin', 'accountant'] },
    { name: 'Batches', path: '/batches', roles: ['admin'] },
    { name: 'Finances', path: '/finance', roles: ['admin'] },

  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-2xl hover:text-yellow-300 transition-colors duration-300">
          SchoolMS
        </Link>

        <ul className="hidden md:flex items-center space-x-6">
          {user
            ? navLinks.map((link) => {
                if (!link.roles || link.roles.includes(user.role)) {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`font-medium text-white hover:text-yellow-300 transition-colors duration-300 ${
                          isActive ? 'underline underline-offset-4' : ''
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                }
                return null;
              })
            : null}
        </ul>

        <div className="flex items-center space-x-4">
          {user ? (
       

            <button
    onClick={() => {
      const result = logout();
      toast.success(result.message); // ✅ show success message
    }}
    className="bg-yellow-400 text-indigo-800 px-4 py-2 rounded-md hover:bg-yellow-500 font-semibold transition-all duration-300 shadow-md"
  >
    Logout
  </button>

          ) : (
            <>
              <Link
                to="/login"
                className="text-white font-medium px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-yellow-400 text-indigo-800 px-4 py-2 rounded-md hover:bg-yellow-500 font-semibold transition-all duration-300 shadow-md"
              >
                Signup
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaChevronDown className={`transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-indigo-600 px-6 py-4 space-y-2">
          {user
            ? navLinks.map((link) => {
                if (!link.roles || link.roles.includes(user.role)) {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`block text-white font-medium py-2 px-3 rounded hover:bg-indigo-700 transition-colors duration-300 ${
                          isActive ? 'underline underline-offset-4' : ''
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                }
                return null;
              })
            : null}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
