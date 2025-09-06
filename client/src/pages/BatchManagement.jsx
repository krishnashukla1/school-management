// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import api from '../services/api';
// import FormInput from '../components/FormInput';

// const BatchManagement = () => {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();
//   const [batches, setBatches] = useState([]);

//   useEffect(() => {
//     api.get('/batches').then(res => setBatches(res.data));
//   }, []);

//   const onSubmit = async (data) => {
//     await api.post('/batches', data);
//     reset();
//     const res = await api.get('/batches');
//     setBatches(res.data);
//   };

//   const handleDelete = async (id) => {
//     await api.delete(`/batches/${id}`);
//     setBatches(batches.filter(b => b._id !== id));
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h2 className="text-2xl font-semibold text-primary mb-6">Batch Management</h2>
//       <form className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
//         <FormInput register={register} name="name" label="Name" errors={errors} />
//         <FormInput register={register} name="course" label="Course" errors={errors} />
//         <FormInput register={register} name="year" label="Year" type="number" errors={errors} />
//         <button
//           type="submit"
//           className="bg-primary text-white px-4 py-2 bg-blue-600 rounded-md hover:bg-green-600 transition-colors duration-300"
//         >
//           Create Batch
//         </button>
//       </form>
//       <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
//         <thead className="bg-primary text-white">
//           <tr>
//             <th className="p-3 text-left">Name</th>
//             <th className="p-3 text-left">Course</th>
//             <th className="p-3 text-left">Year</th>
//             <th className="p-3 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {batches.map(b => (
//             <tr key={b._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
//               <td className="p-3">{b.name}</td>
//               <td className="p-3">{b.course}</td>
//               <td className="p-3">{b.year}</td>
//               <td className="p-3">
//                 <button
//                   onClick={() => handleDelete(b._id)}
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

// export default BatchManagement;

//-------------


import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import FormInput from '../components/FormInput';

const BatchManagement = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [batches, setBatches] = useState([]);
  const [editingBatch, setEditingBatch] = useState(null);

  useEffect(() => {
    api.get('/batches').then(res => setBatches(res.data));
  }, []);

  const onSubmit = async (data) => {
    if (editingBatch) {
      // Update batch
      await api.put(`/batches/${editingBatch._id}`, data);
      setEditingBatch(null);
    } else {
      // Create new batch
      await api.post('/batches', data);
    }
    reset();
    const res = await api.get('/batches');
    setBatches(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/batches/${id}`);
    setBatches(batches.filter(b => b._id !== id));
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    reset(batch); // Pre-fill form with batch details
  };

  const handleCancelEdit = () => {
    setEditingBatch(null);
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-primary mb-6">Batch Management</h2>

      <form className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput register={register} name="name" label="Name" errors={errors} />
        <FormInput register={register} name="course" label="Course" errors={errors} />
        <FormInput register={register} name="year" label="Year" type="number" errors={errors} />
        
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 bg-blue-600 rounded-md hover:bg-green-600 transition-colors duration-300"
          >
            {editingBatch ? "Update Batch" : "Create Batch"}
          </button>
          {editingBatch && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-left">Year</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map(b => (
            <tr key={b._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
              <td className="p-3">{b.name}</td>
              <td className="p-3">{b.course}</td>
              <td className="p-3">{b.year}</td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => handleEdit(b)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
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

export default BatchManagement;
