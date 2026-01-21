import React, { useState, useContext } from "react";
import { assets, cityList } from "../assets/assets";
import { AppContext } from "../Context/Appcontext";
import { useNavigate } from "react-router-dom";

const Searchbydate = () => {
  const { theme } = useContext(AppContext);
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (location && pickupDate && returnDate) {
      navigate(
        `/car-list?location=${location}&pickup=${pickupDate}&return=${returnDate}`
      );
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div
      className={`h-full px-4 md:px-10 flex flex-col justify-center items-center py-7 gap-8 dark:text-white rounded-lg relative overflow-hidden`}
    >
      <div
        className={`absolute top-5 left-3 transform translate-x-5/2 -translate-y-1/2 ${
          theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
        }`}
      ></div>

      <div
        className={`absolute top-10  left-0 ${
          theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
        }`}
      ></div>
      <p className="text-3xl font-semibold md:text-5xl">Luxury Cars on Rent</p>

      <form
        onSubmit={handleSearch}
        className="flex max-sm:flex-col flex-row items-start justify-between md:items-center gap-4 py-4 px-8 dark:bg-gray-800 bg-gray-100 w-full max-w-50 md:max-w-200 rounded-lg md:rounded-full shadow-lg"
      >
        <div className=" flex flex-col gap-10 md:flex-row md:items-center">
          <div className="flex flex-col items-start gap-2">
            <select
              value={location}
              required
              onChange={(e) => setLocation(e.target.value)}
              className="outline-none bg-transparent"
            >
              <option value="" disabled>
                Pickup Location
              </option>
              {cityList.map((city) => (
                <option
                  className="dark:bg-black"
                  key={city}
                  value={city}
                >
                  {city}
                </option>
              ))}
            </select>
            <p className="text-sm dark:text-gray-400 text-gray-600 mt-1">
              {location ? location : "select location"}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <p>Pick Up Date</p>
            <input
              type="date"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="bg-transparent"
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <p>Return Date</p>
            <input
              type="date"
              required
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split("T")[0]}
              className="bg-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-700 hover:bg-blue-800 cursor-pointer text-white rounded-full"
        >
          Search Car
        </button>
      </form>

      <img src={assets.main_car} alt="" className="max-h-80" />
    </div>
  );
};

export default Searchbydate;
