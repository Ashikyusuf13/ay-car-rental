import React, { useState, useContext } from "react";
import { assets, cityList } from "../assets/assets";
import { AppContext } from "../Context/Appcontext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Searchbydate = () => {
  const { theme } = useContext(AppContext);
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!location) {
      toast.error("Please select a location");
      return;
    }

    if (!pickupDate) {
      toast.error("Please select a pickup date");
      return;
    }

    if (!returnDate) {
      toast.error("Please select a return date");
      return;
    }

    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);

    if (returnD <= pickup) {
      toast.error("Return date must be after pickup date");
      return;
    }

    toast.success(`Searching cars in ${location}`);
    navigate(
      `/car-list?location=${encodeURIComponent(location)}&pickup=${pickupDate}&return=${returnDate}`,
    );
  };

  return (
    <div
      className={`h-full px-4 md:px-10 flex flex-col justify-center items-center py-7 gap-8 dark:text-white rounded-lg relative overflow-hidden`}
    >
      <div
        className={`absolute top-5 left-3 transform translate-x-5/2 -translate-y-1/2 pointer-events-none ${theme === "dark"
          ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
          : ""
          }`}
      ></div>

      <div
        className={`absolute top-10  left-0 pointer-events-none ${theme === "dark"
          ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
          : ""
          }`}
      ></div>

      <div className="text-center relative z-10">
        <p className="text-3xl font-semibold md:text-5xl mb-2">
          Luxury Cars on Rent
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Find and book your perfect ride
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex max-sm:flex-col flex-row items-start justify-between md:items-center gap-4 py-4 px-8 dark:bg-gray-800 bg-white w-full max-w-50 md:max-w-4xl rounded-xl md:rounded-full shadow-xl border border-gray-100 dark:border-gray-700 relative z-10"
      >
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-8">
          <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              📍 Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full min-w-[150px] bg-white dark:bg-gray-700 font-medium text-gray-800 dark:text-white cursor-pointer px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
            >
              <option value="" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white">Select City</option>
              {cityList.map((city) => (
                <option key={city} value={city} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 hidden md:block"></div>

          <div className="flex flex-col items-start gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              📅 Pickup Date
            </label>
            <input
              type="date"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="bg-transparent font-medium text-gray-800 dark:text-white cursor-pointer"
            />
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 hidden md:block"></div>

          <div className="flex flex-col items-start gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              📅 Return Date
            </label>
            <input
              type="date"
              required
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split("T")[0]}
              className="bg-transparent font-medium text-gray-800 dark:text-white cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
        >
          🔍 Search
        </button>
      </form>

      <img src={assets.main_car} alt="" className="max-h-80 drop-shadow-2xl" />
    </div>
  );
};

export default Searchbydate;
