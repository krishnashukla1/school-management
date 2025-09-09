// components/DashboardCard.jsx
const DashboardCard = ({ title, content, icon }) => (
  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl rounded-2xl p-6 hover:scale-105 transform transition duration-300 ease-in-out text-white flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      {icon && <div className="text-3xl">{icon}</div>}
    </div>
    <div className="mt-4 text-3xl font-bold">{content}</div>
  </div>
);

export default DashboardCard;
