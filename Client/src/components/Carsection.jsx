import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/Appcontext";

const Carsection = () => {
  const navigate = useNavigate();
  const { cars, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center py-20 gap-8">
        <h2 className="text-3xl md:text-4xl font-semibold">Featured Vehicles</h2>
        <div className="flex justify-center items-center py-10">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-10 gap-8">
      <h2 className="text-3xl md:text-4xl font-semibold">Featured Vehicles</h2>

      {cars.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No cars available at the moment.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center md:px-10 px-4 w-full gap-6">
          {cars.slice(0, 3).map((car, idx) => (
            <div
              onClick={() => {
                navigate(`/car-details/${car._id}`);
                scrollTo(0, 0);
              }}
              key={car._id || idx}
              className="max-w-sm w-full dark:bg-gray-800 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              {/* Image Container with Badge and Price */}
              <div className="w-full h-48 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${car.isAvailable
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    }`}>
                    {car.isAvailable ? "Available" : "Booked"}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    ₹{car.pricePerDay?.toLocaleString()}/day
                  </span>
                </div>
              </div>

              {/* Car Details */}
              <div className="py-5 px-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {car.category} • {car.year}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">👥</span>
                    <span className="dark:text-gray-300 text-gray-700">
                      {car.seating_capacity} Seats
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⛽</span>
                    <span className="dark:text-gray-300 text-gray-700">
                      {car.fuel_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⚙️</span>
                    <span className="dark:text-gray-300 text-gray-700">
                      {car.transmission}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📍</span>
                    <span className="dark:text-gray-300 text-gray-700 truncate">
                      {car.location || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/car-list"
        className="rounded-lg transition-all duration-300 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 hover:scale-105"
      >
        Explore All Cars <img src={assets.arrow_icon} alt="" className="w-4 invert" />
      </Link>
    </div>
  );
};

export default Carsection;
