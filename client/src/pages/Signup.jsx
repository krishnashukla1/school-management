import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FormInput from '../components/FormInput';
import { FiUser, FiLock, FiMail } from 'react-icons/fi';

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      await signup(data);
      setError(null);
      navigate('/'); // redirect to dashboard after signup
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

        {error && (
          <div className="text-red-500 text-center py-2 bg-red-50 rounded-md mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiUser />
            </span>
            <FormInput
              register={register}
              name="username"
              label="Username"
              errors={errors}
              className="pl-10"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiMail />
            </span>
            <FormInput
              register={register}
              name="email"
              label="Email"
              type="email"
              errors={errors}
              className="pl-10"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiLock />
            </span>
            <FormInput
              register={register}
              name="password"
              label="Password"
              type="password"
              errors={errors}
              className="pl-10"
            />
          </div>

          {/* Role */}
          <select
            {...register('role', { required: true })}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.role ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="accountant">Accountant</option>
            <option value="student">Student</option>
          </select>
          {errors.role && <span className="text-red-500 text-sm">Role is required</span>}

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:scale-105 transform transition duration-300 shadow-lg"
          >
            Signup
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
