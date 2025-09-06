const FormInput = ({ register, name, label, type = 'text', errors }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      {...register(name, { required: true })}
      className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
        errors[name] ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {errors[name] && <span className="text-red-500 text-sm">Required</span>}
  </div>
);

export default FormInput;