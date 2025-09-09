
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const StudentManagement = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, data);
        setMessage({ type: "success", text: "Student updated successfully!" });
        setEditingStudent(null);
      } else {
        await api.post('/students', data);
        setMessage({ type: "success", text: "Student added successfully!" });
      }
      reset();
      fetchStudents();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setMessage({ type: "error", text: err.response.data.message || "Duplicate student data!" });
      } else {
        setMessage({ type: "error", text: "Something went wrong!" });
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter(s => s._id !== id));
      setMessage({ type: "success", text: "Student deleted successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Error deleting student!" });
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    reset(student);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-primary mb-6">Student Management</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            placeholder="Enter student name"
            className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
        </div>

        {/* Roll No */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Roll No</label>
          <input
            {...register("rollNo", { required: "Roll No is required" })}
            type="text"
            placeholder="Please enter unique Roll No."
            className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.rollNo ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.rollNo && <span className="text-red-500 text-sm mt-1">{errors.rollNo.message}</span>}
        </div>

        {/* Course */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Course</label>
          <input
            {...register("course", { required: "Course is required" })}
            type="text"
            placeholder="Enter course name"
            className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.course ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.course && <span className="text-red-500 text-sm mt-1">{errors.course.message}</span>}
        </div>

        {/* Year */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Year</label>
          <input
            {...register("year", { required: "Year is required" })}
            type="number"
            placeholder="Enter year"
            className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.year ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.year && <span className="text-red-500 text-sm mt-1">{errors.year.message}</span>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          {editingStudent ? "Update Student" : "Add Student"}
        </button>
      </form>

      <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-blue-600 text-white uppercase text-sm font-medium tracking-wider">
          <tr>
            <th className="p-3 text-left border-b border-blue-400">Name</th>
            <th className="p-3 text-left border-b border-blue-400">Roll No</th>
            <th className="p-3 text-left border-b border-blue-400">Course</th>
            <th className="p-3 text-left border-b border-blue-400">Year</th>
            <th className="p-3 text-left border-b border-blue-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr
              key={s._id}
              className="border-b hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            >
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.rollNo}</td>
              <td className="p-3">{s.course}</td>
              <td className="p-3">{s.year}</td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagement;



