import React, { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../../Context/Appcontext";

const CarList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get("location");

  const { theme, search, setSearch, cars, loading } = useContext(AppContext);

  const filteredCars = cars.filter(
    (car) => {
      const matchesSearch = car.brand?.toLowerCase().includes(search.toLowerCase()) ||
        car.model?.toLowerCase().includes(search.toLowerCase()) ||
        (car.location || "").toLowerCase().includes(search.toLowerCase());

      const matchesLocation = locationParam ? (car.location || "").toLowerCase().includes(locationParam.toLowerCase()) : true;

      return matchesSearch && matchesLocation;
    }
  );

  return (
    <div className="flex flex-col md:px-10 px-4 py-10 items-center min-h-screen dark:bg-black dark:text-white bg-gray-50">
      <div
        className={`absolute top-20 left-0 transform translate-y-0/6 pointer-events-none ${theme === "dark"
          ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
          : ""
          }`}
      ></div>

      <div
        className={`absolute top-0 right-0 transform translate-y-16/6 pointer-events-none ${theme === "dark"
          ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
          : ""
          }`}
      ></div>

      <h1 className="text-4xl md:text-5xl font-semibold py-9">Available Cars</h1>

      {/* Search */}
      <div className="w-full max-w-6xl mb-8">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by brand, model, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          Showing {filteredCars.length} of {cars.length} cars
          {locationParam && <span> in <strong>{locationParam}</strong></span>}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚗</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">No cars found</h2>
          <p className="text-gray-500 mb-4">Try adjusting your search</p>
          <button
            onClick={() => setSearch("")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
          {filteredCars.map((car) => (
            <div
              key={car._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              {/* Image Container with Badge and Price */}
              <div className="h-48 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${car.isAvailable
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                    }`}>
                    {car.isAvailable ? "Available" : "Booked"}
                  </span>
                </div>
              </div>

              {/* Car Details */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {car.category} • {car.year}
                    </p>
                  </div>
                  <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    ₹{car.pricePerDay?.toLocaleString()}<span className="text-xs font-normal">/day</span>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm my-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">👥</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {car.seating_capacity} Seats
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⛽</span>
                    <span className="text-gray-600 dark:text-gray-300">{car.fuel_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⚙️</span>
                    <span className="text-gray-600 dark:text-gray-300">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📍</span>
                    <span className="text-gray-600 dark:text-gray-300 truncate">
                      {car.location || "Unknown"}
                    </span>
                  </div>
                </div>

                <button
                  className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-200"
                  onClick={() => {
                    navigate(`/car-details/${car._id}`);
                    scrollTo(0, 0);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;
