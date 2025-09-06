// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import api from '../services/api';
// import FormInput from '../components/FormInput';

// const StudentManagement = () => {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     api.get('/students').then(res => setStudents(res.data));
//   }, []);

//   const onSubmit = async (data) => {
//     await api.post('/students', data);
//     reset();
//     const res = await api.get('/students');
//     setStudents(res.data);
//   };

//   const handleDelete = async (id) => {
//     await api.delete(`/students/${id}`);
//     setStudents(students.filter(s => s._id !== id));
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h2 className="text-2xl font-semibold text-primary mb-6">Student Management</h2>
//       <form className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
//         <FormInput register={register} name="name" label="Name" errors={errors} />
//         <FormInput register={register} name="rollNo" label="Roll No" errors={errors} />
//         <FormInput register={register} name="course" label="Course" errors={errors} />
//         <FormInput register={register} name="year" label="Year" type="number" errors={errors} />
//         <button
//           type="submit"
//           className="bg-primary text-white px-4 py-2  bg-blue-600 rounded-md hover:bg-green-600 transition-colors duration-300"
//         >
//           Add Student
//         </button>
//       </form>
//       <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
//         <thead className="bg-primary text-white">
//           <tr>
//             <th className="p-3 text-left">Name</th>
//             <th className="p-3 text-left">Roll No</th>
//             <th className="p-3 text-left">Course</th>
//             <th className="p-3 text-left">Year</th>
//             <th className="p-3 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map(s => (
//             <tr key={s._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
//               <td className="p-3">{s.name}</td>
//               <td className="p-3">{s.rollNo}</td>
//               <td className="p-3">{s.course}</td>
//               <td className="p-3">{s.year}</td>
//               <td className="p-3">
//                 <button
//                   onClick={() => handleDelete(s._id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-300"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StudentManagement;




import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import FormInput from '../components/FormInput';

const StudentManagement = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    api.get('/students').then(res => setStudents(res.data));
  }, []);

  const onSubmit = async (data) => {
    if (editingStudent) {
      await api.put(`/students/${editingStudent._id}`, data);
      setEditingStudent(null);
    } else {
      await api.post('/students', data);
    }
    reset();
    const res = await api.get('/students');
    setStudents(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/students/${id}`);
    setStudents(students.filter(s => s._id !== id));
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    reset(student); // Pre-fill form
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-primary mb-6">Student Management</h2>
      
      <form className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput register={register} name="name" label="Name" errors={errors} />
        <FormInput register={register} name="rollNo" label="Roll No" errors={errors} />
        <FormInput register={register} name="course" label="Course" errors={errors} />
        <FormInput register={register} name="year" label="Year" type="number" errors={errors} />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 bg-blue-600 rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          {editingStudent ? "Update Student" : "Add Student"}
        </button>
      </form>

      <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Roll No</th>
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-left">Year</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
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
