import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import { AppContext } from "../../Context/Appcontext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Mybooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedin, theme } = useContext(AppContext);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/bookings/my-bookings");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const { data } = await axios.post("/api/bookings/cancel", { bookingId });
      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel booking");
    }
  };

  useEffect(() => {
    if (isLoggedin) {
      fetchBookings();
    }
  }, [isLoggedin]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-600";
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
      <div className="min-h-screen flex items-center justify-center dark:bg-black bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-black dark:text-white min-h-screen px-4 md:px-10 py-10">
      <div
        className={`absolute top-20 left-0 transform translate-y-0/6 ${
          theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
        }`}
      ></div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-bold text-2xl md:text-3xl">My Bookings</h1>
          <p className="text-gray-500 mt-2">
            View and manage your car bookings here.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚗</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
            <p className="text-gray-500 mb-6">
              Start exploring cars and make your first booking!
            </p>
            <button
              onClick={() => navigate("/car-list")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-100 dark:border-gray-800"
              >
                {/* LEFT SECTION */}
                <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden">
                      <img
                        src={booking.carId?.image}
                        alt={booking.carId?.model}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <h2 className="font-semibold text-lg">
                        {booking.carId?.brand} {booking.carId?.model}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {booking.carId?.year} • {booking.carId?.category} •{" "}
                        {booking.carId?.location}
                      </p>

                      <div className="flex gap-3 flex-wrap">
                        <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-xs">
                          Booking #{booking._id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${booking.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>

                      <div className="text-sm space-y-1 pt-2">
                        <p>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            Rental Period:
                          </span>{" "}
                          <span className="font-semibold">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium text-gray-600 dark:text-gray-400">
                            Pick-up Location:
                          </span>{" "}
                          <span>{booking.carId?.location}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex flex-col items-start lg:items-end gap-3 mt-4 lg:mt-0 w-full lg:w-auto">
                  <div className="text-left lg:text-right">
                    <p className="text-gray-500 text-sm">Total Price</p>
                    <p className="text-blue-600 font-bold text-2xl">
                      ₹{booking.totalPrice?.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Booked on{" "}
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {booking.status === "Confirmed" && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {booking.status === "Pending" &&
                    booking.paymentStatus !== "Paid" && (
                      <button
                        onClick={() =>
                          navigate(`/car-details/${booking.carId?._id}`)
                        }
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg text-sm font-medium transition-colors"
                      >
                        Complete Payment
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mybooking;
