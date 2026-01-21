import React, { useState } from "react";
import { dummyMyBookingsData } from "../../assets/assets";

const Managebookings = () => {
  const [bookings, setBookings] = useState(dummyMyBookingsData);

  const handleApprove = (id) => {
    setBookings(
      bookings.map((booking) =>
        booking._id === id ? { ...booking, status: "confirmed" } : booking
      )
    );
    console.log("Approved booking:", id);
  };

  const handleReject = (id) => {
    setBookings(
      bookings.map((booking) =>
        booking._id === id ? { ...booking, status: "rejected" } : booking
      )
    );
    console.log("Rejected booking:", id);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 dark:text-white">Booking Requests</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-750 text-left border-b border-gray-100 dark:border-gray-700">
                <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Vehicle Details</th>
                <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Customer</th>
                <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Trip Dates</th>
                <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Status</th>
                <th className="py-5 px-6 font-semibold text-right text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Total</th>
                <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center group">
                      <div className="relative overflow-hidden rounded-xl w-16 h-12 mr-4 shadow-sm">
                        <img
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          src={booking.car.image}
                          alt="car"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">{booking.car.brand} {booking.car.model}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {booking._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {booking.user}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex flex-col space-y-1">
                      <span className="flex items-center text-xs">
                        <span className="w-16 text-gray-400">Pickup:</span>
                        <span className="font-medium">{new Date(booking.pickupDate).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center text-xs">
                        <span className="w-16 text-gray-400">Return:</span>
                        <span className="font-medium">{new Date(booking.returnDate).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "confirmed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${booking.status === "confirmed" ? "bg-green-500" :
                        booking.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                        }`}></span>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-gray-800 dark:text-white">
                    ₹{booking.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      {booking.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(booking._id)}
                            className="w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors dark:bg-green-900/20 dark:hover:bg-green-900/40"
                            title="Approve"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> </svg>
                          </button>
                          <button
                            onClick={() => handleReject(booking._id)}
                            className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/40"
                            title="Reject"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> </svg>
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 text-sm italic">Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Managebookings;
