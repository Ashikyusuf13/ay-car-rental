import React, { useContext, useEffect, useState } from "react";
import { dummyCarData } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/Appcontext";
const CarList = () => {
  const [cardata, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, search, setSearch } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => {
      setCarData(dummyCarData);
      setLoading(false);
    }, 500); // Simulate loading
  }, []);

  const filteredCars = cardata.filter(
    (car) =>
      car.brand.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase()) ||
      (car.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:px-10 px-4 py-10 items-center min-h-screen dark:bg-black dark:text-white bg-gray-50">
      <div
        className={`absolute top-20 left-0 transform translate-y-0/6 ${theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
          }`}
      ></div>

      <div
        className={`absolute top-0 right-0 transform translate-y-16/6 ${theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
          }`}
      ></div>
      <h1 className="text-4xl md:text-5xl font-semibold py-9">Car list</h1>

      {/* Search Bar */}
      <div className="w-full max-w-xl mb-8">
        <input
          type="text"
          placeholder="Search by brand, model, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500"
        />
      </div>

      {loading ? (
        <div className="text-lg text-gray-500 py-20">Loading cars...</div>
      ) : filteredCars.length === 0 ? (
        <div className="text-lg text-gray-500 py-20">No cars found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
          {filteredCars.map((car) => (
            <div
              key={car._id}
              className="bg-white dark:bg-gray-500 rounded-lg shadow-md overflow-hidden flex flex-col  hover:shadow-xl transition-shadow duration-200"
            >
              {/* Image Container with Badge and Price */}
              <div className="h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                />
              </div>

              {/* Car Details */}
              <div className="p-4 flex flex-col flex-1 ">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-gray-900 text-sm mb-3">
                      {car.category} {car.year}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className=" bg-blue-500 text-white px-2 py-1 rounded-full text-sm ">
                      Available Now
                    </div>
                    <div className=" bg-black/70 bg-opacity-40 text-white px-2 py-1 rounded text-sm  ">
                      ₹{car.pricePerDay}/day
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">👥</span>
                    <span className="text-gray-800">
                      {car.seating_capacity} Seats
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">⛽</span>
                    <span className="text-gray-800">{car.fuel_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">⚙️</span>
                    <span className="text-gray-800">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📍</span>
                    <span className="text-gray-800">
                      {car.location || "Unknown"}
                    </span>
                  </div>
                </div>
                <button
                  className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
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
