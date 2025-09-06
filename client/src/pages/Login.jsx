import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FormInput from '../components/FormInput';
import { FiUser, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);


  
  const onSubmit = async (data) => {
    try {
      await login(data);
      setError(null);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

        {error && (
          <div className="text-red-500 text-center mb-4 font-medium">
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:scale-105 transform transition duration-300 shadow-lg"
          >
            Login
          </button>
        </form>

        {/* <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <span className="text-indigo-600 font-medium hover:underline cursor-pointer">
            Sign up
          </span>
        </p> */}




        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
