import React from "react";
import { dummyDashboardData } from "../../assets/assets";

const Dashboard = () => {
  const {
    totalCars,
    totalBookings,
    pendingBookings,
    completedBookings,
    recentBookings,
    monthlyRevenue,
  } = dummyDashboardData;

  const stats = [
    { title: "Total Cars", value: totalCars, color: "from-blue-500 to-blue-600", icon: "🚗" },
    { title: "Total Bookings", value: totalBookings, color: "from-purple-500 to-purple-600", icon: "📅" },
    { title: "Pending Bookings", value: pendingBookings, color: "from-orange-500 to-orange-600", icon: "⏳" },
    { title: "Completed Bookings", value: completedBookings, color: "from-green-500 to-green-600", icon: "✅" },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 dark:text-white tracking-tight">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500`}></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-lg shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 md:p-8 rounded-2xl shadow-lg mb-10 md:mb-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>
        <h2 className="text-base md:text-lg font-semibold opacity-90 mb-2 relative z-10">Total Monthly Revenue</h2>
        <p className="text-3xl md:text-5xl font-bold relative z-10">₹{monthlyRevenue.toLocaleString()}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Recent Bookings</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-750 text-left">
                  <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercasetracking-wider">Car Details</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Dates</th>
                  <th className="py-4 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 font-semibold text-right text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img
                          className="w-12 h-12 rounded-xl object-cover shadow-sm mr-4"
                          src={booking.car.image}
                          alt="car"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{booking.car.brand} {booking.car.model}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {booking._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-medium">Pickup: {new Date(booking.pickupDate).toLocaleDateString()}</span>
                        <span className="text-xs text-cool-gray-400">Return: {new Date(booking.returnDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === "confirmed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${booking.status === "confirmed" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gray-800 dark:text-white">
                      ₹{booking.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
