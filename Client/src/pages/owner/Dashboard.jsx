import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalCars: 0,
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        recentBookings: [],
        monthlyRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get("/api/owner/dashboard");
                if (data.success) {
                    setDashboardData(data.dashboardData);
                } else {
                    toast.error(data.message || "Failed to load dashboard data");
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const {
        totalCars,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        recentBookings,
        monthlyRevenue,
    } = dashboardData;

    const stats = [
        { title: "Total Cars", value: totalCars, color: "from-blue-500 to-blue-600", icon: "🚗" },
        { title: "Total Bookings", value: totalBookings, color: "from-purple-500 to-purple-600", icon: "📅" },
        { title: "Pending", value: pendingBookings, color: "from-orange-500 to-orange-600", icon: "⏳" },
        { title: "Active", value: confirmedBookings || 0, color: "from-green-500 to-green-600", icon: "✓" },
        { title: "Completed", value: completedBookings, color: "from-indigo-500 to-indigo-600", icon: "✅" },
    ];

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            case "completed":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    const getStatusDot = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-green-500";
            case "pending":
                return "bg-yellow-500";
            case "cancelled":
                return "bg-red-500";
            case "completed":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Dashboard Overview</h1>
                <Link
                    to="/dashboard/Manage-bookings"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                >
                    View All Bookings →
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8 md:mb-10">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110 duration-500`}></div>
                        <div className="flex flex-col">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-sm md:text-lg shadow-md mb-2`}>
                                {stat.icon}
                            </div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{stat.title}</p>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 md:p-8 rounded-xl md:rounded-2xl shadow-lg mb-8 md:mb-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 md:w-64 h-40 md:h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 md:w-40 h-32 md:h-40 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                    <h2 className="text-sm md:text-lg font-semibold opacity-90 mb-1 md:mb-2">Total Revenue</h2>
                    <p className="text-2xl md:text-5xl font-bold">₹{monthlyRevenue?.toLocaleString() || 0}</p>
                    <p className="text-xs md:text-sm opacity-75 mt-1 md:mt-2">From paid bookings</p>
                </div>
            </div>

            {/* Recent Bookings */}
            <div>
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Recent Bookings</h2>
                    <Link
                        to="/dashboard/Manage-bookings"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        See All
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {recentBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="text-4xl">📋</span>
                            <p className="text-gray-500 dark:text-gray-400 mt-4">No bookings yet</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add cars to start receiving bookings</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                                {recentBookings.map((booking) => (
                                    <div key={booking._id} className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <img
                                                className="w-14 h-10 rounded-lg object-cover shadow-sm"
                                                src={booking.carId?.image}
                                                alt="car"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                                                    {booking.carId?.brand} {booking.carId?.model}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {booking.userId?.name || 'Unknown'}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}
                                            >
                                                <span className={`w-1.5 h-1.5 mr-1 rounded-full ${getStatusDot(booking.status)}`}></span>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="text-gray-500 dark:text-gray-400">
                                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                            </div>
                                            <div className="font-bold text-gray-800 dark:text-white">
                                                ₹{booking.totalPrice?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-750 text-left">
                                            <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Car Details</th>
                                            <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Customer</th>
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
                                                            src={booking.carId?.image}
                                                            alt="car"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800 dark:text-white">{booking.carId?.brand} {booking.carId?.model}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {booking._id.slice(-6).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {booking.userId?.name || 'Unknown'}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</span>
                                                        <span className="text-xs text-gray-400">to {new Date(booking.endDate).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${getStatusDot(booking.status)}`}></span>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right font-bold text-gray-800 dark:text-white">
                                                    ₹{booking.totalPrice?.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                    to="/dashboard/Add-car"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow group"
                >
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        ➕
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-white">Add New Car</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">List a new vehicle</p>
                    </div>
                </Link>
                <Link
                    to="/dashboard/Manage-cars"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow group"
                >
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        🚗
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-white">Manage Fleet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Edit your vehicles</p>
                    </div>
                </Link>
                <Link
                    to="/dashboard/Manage-bookings"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow group"
                >
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        📋
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-white">Manage Bookings</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Handle requests</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
