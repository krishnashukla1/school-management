// import { createContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import api from '../services/api';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         console.log('Decoded token:', decoded);
//         if (decoded.id && decoded.role) {
//           setUser({ id: decoded.id, role: decoded.role });
//         } else {
//           console.error('Invalid token payload:', decoded);
//           localStorage.removeItem('token');
//         }
//       } catch (err) {
//         console.error('Token decoding failed:', err);
//         localStorage.removeItem('token');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const { data } = await api.post('/auth/login', credentials);
//       console.log('Login response:', data);
//       localStorage.setItem('token', data.token);
//       const decoded = jwtDecode(data.token);
//       console.log('Decoded JWT:', decoded);
//       if (!decoded.id || !decoded.role) {
//         throw new Error('Invalid JWT payload: missing id or role');
//       }
//       setUser({ id: decoded.id, role: decoded.role });
//       return data;
//     } catch (err) {
//       console.error('Login failed:', err);
//       throw err;
//     }
//   };

//   const signup = async (credentials) => {
//     try {
//       const { data } = await api.post('/auth/register', credentials);
//       console.log('Signup response:', data);
//       localStorage.setItem('token', data.token);
//       const decoded = jwtDecode(data.token);
//       console.log('Decoded JWT:', decoded);
//       if (!decoded.id || !decoded.role) {
//         throw new Error('Invalid JWT payload: missing id or role');
//       }
//       setUser({ id: decoded.id, role: decoded.role });
//       return data;
//     } catch (err) {
//       console.error('Signup failed:', err);
//       throw err;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     api.post('/auth/logout').catch(err => console.error('Logout failed:', err));
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;




import { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.id && decoded.role) {
          setUser({ id: decoded.id, role: decoded.role });
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    const decoded = jwtDecode(data.token);
    setUser({ id: decoded.id, role: decoded.role });
    return data;
  };

  const signup = async (credentials) => {
    const { data } = await api.post('/auth/register', credentials);
    localStorage.setItem('token', data.token);
    const decoded = jwtDecode(data.token);
    setUser({ id: decoded.id, role: decoded.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
