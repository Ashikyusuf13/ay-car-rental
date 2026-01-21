import React, { useEffect, useState } from "react";
import { assets, dummyCarData } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const Carsection = () => {
  const navigate = useNavigate();

  const [cardata, setCardata] = useState([]);

  useEffect(() => {
    setCardata(dummyCarData);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-10 gap-8">
      <h2 className="text-3xl md:text-4xl font-semibold">Featured Vehicles</h2>

      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center md:px-10 px-4 w-full gap-6">
        {cardata.slice(0, 3).map((car, idx) => (
          <div
            onClick={() => navigate(`/car-details/${car._id}`)}
            key={idx}
            className="max-w-sm w-full dark:bg-gray-500 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image Container with Badge and Price */}
            <div className=" w-full h-48 overflow-hidden ">
              <img
                className="w-full h-full object-cover"
                src={car.image}
                alt={`${car.brand} ${car.model}`}
              />
            </div>

            {/* Car Details */}
            <div className="py-5 px-2">
              <div className="flex items-center justify-between ">
                <div>
                  <h3 className="text-lg font-semibold  text-gray-800">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {car.category} {car.year}
                  </p>
                </div>

                <div className="flex gap-2 -mt-10 items-center">
                  <div className=" bg-blue-500 text-white px-2 py-1 rounded-full text-sm  ">
                    Available Now
                  </div>
                  <div className=" bg-black/70 bg-opacity-40 text-white px-2 py-1 rounded text-sm  ">
                    ₹{car.pricePerDay}/day
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">👥</span>
                  <span className="dark:text-gray-900 text-gray-700">
                    {car.seating_capacity} Seats
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">⛽</span>
                  <span className="dark:text-gray-900 text-gray-700">
                    {car.fuel_type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">⚙️</span>
                  <span className="dark:text-gray-900 text-gray-700">
                    {car.transmission}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📍</span>
                  <span className="dark:text-gray-900 text-gray-700">
                    {car.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button>
        <Link
          to="/car-list"
          className="rounded-lg transition-all duration-300  px-8 py-2 border hover:scale-105 cursor-pointer flex items-center gap-2 "
        >
          Explore All <img src={assets.arrow_icon} alt="" className="w-4" />
        </Link>
      </button>
    </div>
  );
};

export default Carsection;
