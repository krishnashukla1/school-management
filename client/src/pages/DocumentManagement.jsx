
import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { FiDownload, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const DocumentManagement = () => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ type: 'NOC', fileUrl: '', file: null, id: null });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !['admin', 'accountant'].includes(user.role)) {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }
      try {
        const studentRes = await api.get('/students');
        setStudents(studentRes.data);

        if (selectedStudentId) {
          const docRes = await api.get(`/documents/student/${selectedStudentId}`);
          setDocuments(docRes.data);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, selectedStudentId]);

  const handleStudentChange = e => setSelectedStudentId(e.target.value);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedStudentId) return alert('Select a student first');

    const data = new FormData();
    data.append('student', selectedStudentId);
    data.append('type', formData.type);
    if (formData.file) data.append('file', formData.file);
    else data.append('fileUrl', formData.fileUrl);

    try {
      if (formData.id) {
        await api.put(`/documents/${formData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/documents', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Reset form
      setFormData({ type: 'NOC', fileUrl: '', file: null, id: null });

      // Refresh documents
      const docRes = await api.get(`/documents/student/${selectedStudentId}`);
      setDocuments(docRes.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save document');
    }
  };

  const handleEdit = doc => {
    setFormData({ id: doc._id, type: doc.type, fileUrl: doc.fileUrl, file: null });
  };

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete document');
    }
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
        value={selectedStudentId}
        onChange={handleStudentChange}
        className="w-full sm:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
      >
        <option value="">Select a student</option>
        {students.map(s => (
          <option key={s._id} value={s._id}>
            {s.name} ({s.rollNo})
          </option>
        ))}
      </select>

      {/* Add/Edit Form */}
      {selectedStudentId && (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col sm:flex-row gap-2">
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md"
          >
            <option value="NOC">NOC</option>
            <option value="Marksheet">Marksheet</option>
            <option value="Project">Project</option>
            <option value="LessonPlan">LessonPlan</option>
          </select>


          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="px-3 py-2 border rounded-md"
          />
          
          <input
            type="text"
            name="fileUrl"
            placeholder="Or enter file URL"
            value={formData.fileUrl}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md flex-1"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center transition-colors duration-200"
          >
            {formData.id ? 'Update' : 'Add'} <FiPlus className="ml-2" />
          </button>
        </form>
      )}

      {/* Documents Table */}
      <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-blue-600 text-white uppercase text-sm font-medium tracking-wider">
          <tr>
            <th className="p-3 text-left border-b border-blue-400">Type</th>
            <th className="p-3 text-left border-b border-blue-400">File</th>
            <th className="p-3 text-left border-b border-blue-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map(doc => (
              <tr
                key={doc._id}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
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
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500 italic">
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
