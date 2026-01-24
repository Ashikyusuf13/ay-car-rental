import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Managebookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState("all");

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/owner/bookings");
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message || "Failed to load bookings");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleApprove = async (id) => {
        try {
            setActionLoading(id);
            const { data } = await axios.post("/api/owner/approve-booking", { bookingId: id });
            if (data.success) {
                toast.success("Booking approved successfully!");
                fetchBookings();
            } else {
                toast.error(data.message || "Failed to approve booking");
            }
        } catch (error) {
            toast.error("Failed to approve booking");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject this booking?")) return;

        try {
            setActionLoading(id);
            const { data } = await axios.post("/api/owner/reject-booking", { bookingId: id });
            if (data.success) {
                toast.success("Booking rejected!");
                fetchBookings();
            } else {
                toast.error(data.message || "Failed to reject booking");
            }
        } catch (error) {
            toast.error("Failed to reject booking");
        } finally {
            setActionLoading(null);
        }
    };

    const handleComplete = async (id) => {
        try {
            setActionLoading(id);
            const { data } = await axios.post("/api/owner/complete-booking", { bookingId: id });
            if (data.success) {
                toast.success("Booking marked as completed!");
                fetchBookings();
            } else {
                toast.error(data.message || "Failed to complete booking");
            }
        } catch (error) {
            toast.error("Failed to complete booking");
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "cancelled":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "completed":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
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

    const filteredBookings = bookings.filter(booking => {
        if (filter === "all") return true;
        return booking.status?.toLowerCase() === filter;
    });

    const filterOptions = [
        { value: "all", label: "All Bookings", count: bookings.length },
        { value: "pending", label: "Pending", count: bookings.filter(b => b.status === "Pending").length },
        { value: "confirmed", label: "Confirmed", count: bookings.filter(b => b.status === "Confirmed").length },
        { value: "completed", label: "Completed", count: bookings.filter(b => b.status === "Completed").length },
        { value: "cancelled", label: "Cancelled", count: bookings.filter(b => b.status === "Cancelled").length },
    ];

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Manage Bookings</h1>
                <button
                    onClick={fetchBookings}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                {filterOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === option.value
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                    >
                        {option.label}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === option.value
                                ? "bg-white/20"
                                : "bg-gray-200 dark:bg-gray-600"
                            }`}>
                            {option.count}
                        </span>
                    </button>
                ))}
            </div>

            {filteredBookings.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12 text-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl md:text-4xl">📋</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                        {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                        {filter === "all"
                            ? "When customers book your cars, they will appear here."
                            : `You don't have any ${filter} bookings at the moment.`
                        }
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="block lg:hidden space-y-4">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 overflow-hidden"
                            >
                                {/* Car Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative overflow-hidden rounded-xl w-16 h-12 shadow-sm flex-shrink-0">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={booking.carId?.image}
                                            alt="car"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 dark:text-white truncate">
                                            {booking.carId?.brand} {booking.carId?.model}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            ID: {booking._id.slice(-6).toUpperCase()}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(booking.status)}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(booking.status)}`}></span>
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Customer & Dates */}
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div>
                                        <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">Customer</p>
                                        <p className="font-medium text-gray-700 dark:text-gray-200 truncate">
                                            {booking.userId?.name || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {booking.userId?.email || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">Trip Dates</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Price & Payment */}
                                <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${booking.paymentStatus === 'Paid'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}
                                        >
                                            {booking.paymentStatus}
                                        </span>
                                    </div>
                                    <p className="font-bold text-lg text-gray-800 dark:text-white">
                                        ₹{booking.totalPrice?.toLocaleString()}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    {booking.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(booking._id)}
                                                disabled={actionLoading === booking._id}
                                                className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {actionLoading === booking._id ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Approve
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleReject(booking._id)}
                                                disabled={actionLoading === booking._id}
                                                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {booking.status === "Confirmed" && (
                                        <button
                                            onClick={() => handleComplete(booking._id)}
                                            disabled={actionLoading === booking._id}
                                            className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {actionLoading === booking._id ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Mark Complete
                                                </>
                                            )}
                                        </button>
                                    )}
                                    {(booking.status === "Completed" || booking.status === "Cancelled") && (
                                        <div className="flex-1 py-2.5 text-center text-gray-400 dark:text-gray-500 text-sm italic">
                                            {booking.status === 'Completed' ? '✓ Trip Completed' : '✗ Cancelled'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-750 text-left border-b border-gray-100 dark:border-gray-700">
                                        <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Vehicle Details</th>
                                        <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Customer</th>
                                        <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Trip Dates</th>
                                        <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Status</th>
                                        <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Payment</th>
                                        <th className="py-5 px-6 font-semibold text-right text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Total</th>
                                        <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredBookings.map((booking) => (
                                        <tr
                                            key={booking._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center group">
                                                    <div className="relative overflow-hidden rounded-xl w-16 h-12 mr-4 shadow-sm">
                                                        <img
                                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                                            src={booking.carId?.image}
                                                            alt="car"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 dark:text-white">{booking.carId?.brand} {booking.carId?.model}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {booking._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                        {booking.userId?.name || 'Unknown User'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {booking.userId?.email || ''}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="flex flex-col space-y-1">
                                                    <span className="flex items-center text-xs">
                                                        <span className="w-16 text-gray-400">Pickup:</span>
                                                        <span className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</span>
                                                    </span>
                                                    <span className="flex items-center text-xs">
                                                        <span className="w-16 text-gray-400">Return:</span>
                                                        <span className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(booking.status)}`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${getStatusDot(booking.status)}`}></span>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${booking.paymentStatus === 'Paid'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}
                                                >
                                                    {booking.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold text-gray-800 dark:text-white">
                                                ₹{booking.totalPrice?.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex item-center justify-center space-x-2">
                                                    {booking.status === "Pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(booking._id)}
                                                                disabled={actionLoading === booking._id}
                                                                className="w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors dark:bg-green-900/20 dark:hover:bg-green-900/40 disabled:opacity-50"
                                                                title="Approve"
                                                            >
                                                                {actionLoading === booking._id ? (
                                                                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> </svg>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(booking._id)}
                                                                disabled={actionLoading === booking._id}
                                                                className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/40 disabled:opacity-50"
                                                                title="Reject"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                    {booking.status === "Confirmed" && (
                                                        <button
                                                            onClick={() => handleComplete(booking._id)}
                                                            disabled={actionLoading === booking._id}
                                                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium transition-colors dark:bg-blue-900/20 dark:hover:bg-blue-900/40 disabled:opacity-50"
                                                            title="Mark as Complete"
                                                        >
                                                            {actionLoading === booking._id ? (
                                                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                "Complete"
                                                            )}
                                                        </button>
                                                    )}
                                                    {(booking.status === "Completed" || booking.status === "Cancelled") && (
                                                        <span className="text-gray-300 dark:text-gray-600 text-sm italic">
                                                            {booking.status === 'Completed' ? '✓ Done' : '✗ Cancelled'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Managebookings;
