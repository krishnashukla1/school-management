import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { FiDownload } from 'react-icons/fi';

const DocumentManagement = () => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !['admin', 'accountant'].includes(user.role)) {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }

      try {
        const studentResponse = await api.get('/students');
        setStudents(studentResponse.data);
        if (selectedStudentId) {
          const documentResponse = await api.get(`/documents/student/${selectedStudentId}`);
          setDocuments(documentResponse.data);
        } else {
          setDocuments([]);
        }
        setError(null);
      } catch (err) {
        console.error('Fetch data failed:', err);
        setError(err.response?.data?.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, selectedStudentId]);

  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
  };

  if (!user || !['admin', 'accountant'].includes(user.role)) {
    return <div className="text-red-500 text-center py-4">Access denied. Admin or Accountant only.</div>;
  }
  if (loading) return <div className="text-gray-600 text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-primary mb-6">Document Management</h2>
      <select
        onChange={handleStudentChange}
        value={selectedStudentId}
        className="w-full sm:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-6"
      >
        <option value="">Select a student</option>
        {students.map(student => (
          <option key={student._id} value={student._id}>
            {student.name} ({student.rollNo})
          </option>
        ))}
      </select>
      <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">File</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map(doc => (
              <tr key={doc._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="p-3">{doc.type}</td>
                <td className="p-3">


                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition-colors duration-300"
                  >
                    <FiDownload className="mr-2" /> Download
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="p-3 text-center text-gray-500 italic">
                No documents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentManagement;