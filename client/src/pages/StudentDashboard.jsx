import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import FormInput from '../components/FormInput';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ fees: [], documents: [], student: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const studentResponse = await api.get(`/students/user/${user.id}`);
        const student = studentResponse.data;
        let fees = [];
        let documents = [];
        if (student) {
          const feesResponse = await api.get(`/fees/student/${student._id}`);
          const documentsResponse = await api.get(`/documents/student/${student._id}`);
          fees = feesResponse.data || [];
          documents = documentsResponse.data || [];
          reset({
            name: student.name,
            rollNo: student.rollNo,
            course: student.course,
            year: student.year,
          });
        }
        setData({ fees, documents, student });
        setError(null);
      } catch (err) {
        console.error('Fetch data failed:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, reset]);

  const onSubmit = async (formData) => {
    try {
      if (data.student) {
        // Update existing student
        const response = await api.put('/students/self', {
          ...formData,
        });
        setData(prev => ({
          ...prev,
          student: response.data,
        }));
        toast.success('Profile updated successfully!');
      } else {
        // Create new student
        const response = await api.post('/students', {
          ...formData,
          userId: user.id,
        });
        setData(prev => ({
          ...prev,
          student: response.data,
        }));
        toast.success('Profile created successfully!');
      }
      setError(null);
    } catch (err) {
      console.error('Save student failed:', err);
      const message = err.response?.data?.message || 'Failed to save student profile';
      setError(message);
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!data.student) return;
    if (!window.confirm('Are you sure you want to delete your profile?')) return;

    try {
      await api.delete('/students/self');
      setData({ fees: [], documents: [], student: null });
      reset({ name: '', rollNo: '', course: '', year: '' });
      setError(null);
      toast.success('Profile deleted successfully!');
    } catch (err) {
      console.error('Delete student failed:', err);
      const message = err.response?.data?.message || 'Failed to delete student profile';
      setError(message);
      toast.error(message);
    }
  };

  if (loading) return <div className="text-gray-600 text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-primary mb-6">Student Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title={data.student ? 'Edit Profile' : 'Create Profile'}
          content={
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                register={register}
                name="name"
                label="Name"
                errors={errors}
              />
              <FormInput
                register={register}
                name="rollNo"
                label="Roll No"
                errors={errors}
              />
              <FormInput
                register={register}
                name="course"
                label="Course"
                errors={errors}
              />
              <FormInput
                register={register}
                name="year"
                label="Year"
                type="number"
                errors={errors}
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors duration-300"
                >
                  {data.student ? 'Update Profile' : 'Create Profile'}
                </button>
                {data.student && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Delete Profile
                  </button>
                )}
              </div>
            </form>
          }
        />
        <DashboardCard
          title="Fee Status"
          content={
            data.fees.length > 0 ? (
              <ul className="space-y-2">
                {data.fees.map(f => (
                  <li key={f._id} className="text-gray-600">
                    Amount: ${f.amount} (Receipt: {f.receiptId})
                    {f.receiptUrl && (
                      <span>
                        {' '}
                        <a
                          href={f.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-blue-800 font-medium"
                        >
                          Download
                        </a>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No fees recorded</p>
            )
          }
        />
        <DashboardCard
          title="Documents"
          content={
            data.documents.length > 0 ? (
              <ul className="space-y-2">
                {data.documents.map(d => (
                  <li key={d._id} className="text-gray-600">
                    {d.type}:{' '}
                    <a
                      href={d.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-blue-800 font-medium"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No documents uploaded</p>
            )
          }
        />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentDashboard;