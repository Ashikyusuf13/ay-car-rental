import React, { useContext, useEffect, useState } from "react";
import { assets, dummyCarData } from "../../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { AppContext } from "../../Context/Appcontext";

const Cardetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cardata, setCarData] = useState(null);

  useEffect(() => {
    setCarData(dummyCarData.find((car) => car._id === id));
  }, [id]);

  const { theme } = useContext(AppContext);

  return cardata ? (
    <div className="md:px-10 px-4 py-6 dark:bg-black dark:text-white bg-gray-100">
      <div
        className={`absolute top-20 left-0 transform translate-y-9/6 ${
          theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
        }`}
      ></div>

      <div
        className={`absolute top-0 right-0 transform translate-y-1/6 ${
          theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
        }`}
      ></div>

      <button
        onClick={() => navigate(-1)}
        className="bg-blue-700 hover:bg-blue-800 px-5 py-2 text-white rounded-lg cursor-pointer flex items-center gap-2"
      >
        <img src={assets.arrow_icon} alt="" className="w-4 rotate-180 invert" />
        Back to all cars
      </button>
      <div className="flex flex-col md:flex-row px-5 md:px-10 py-5 justify-between gap-10">
        {/* oneside with details */}
        <div className="flex flex-col gap-5 flex-1">
          {/* image for cars */}
          <div className="w-full md:w-[500px] h-[300px] rounded-lg overflow-hidden shadow-lg">
            <img
              src={cardata?.image}
              alt={`${cardata?.brand} ${cardata?.model}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* name and brand */}
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl md:text-4xl font-semibold">
              {cardata?.brand} {cardata?.model}
            </h2>
            <p className="text-sm text-gray-500">
              {cardata?.year}.{cardata?.category}
            </p>
          </div>
          <hr className="text-gray-500" />

          {/* grid seciton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-gray-400 dark:text-black border border-blue-200 rounded-lg flex justify-center items-center gap-2 flex-col py-4 px-3">
              <img
                src={assets.users_icon}
                alt="seating"
                className="w-10 rounded-lg"
              />
              <p className="text-sm font-semibold">
                {cardata?.seating_capacity} Seats
              </p>
            </div>

            <div className="bg-green-50 dark:bg-gray-400  dark:text-black border border-green-200 rounded-lg flex justify-center items-center gap-2 flex-col py-4 px-3">
              <img
                src={assets.car_icon}
                alt="transmission"
                className="w-8"
              />
              <p className="text-sm font-semibold">{cardata?.transmission}</p>
            </div>

            <div className="bg-yellow-50 dark:bg-gray-400  dark:text-black border border-yellow-200 rounded-lg flex justify-center items-center gap-2 flex-col py-4 px-3">
              <img src={assets.fuel_icon} alt="fuel" className="w-8" />
              <p className="text-sm font-semibold">{cardata?.fuel_type}</p>
            </div>

            <div className="bg-red-50 dark:bg-gray-400 dark:text-black border border-red-200 rounded-lg flex justify-center items-center gap-2 flex-col py-4 px-3">
              <img src={assets.dashboardIcon} alt="mileage" className="w-8" />
              <p className="text-sm font-semibold">{cardata?.mileage}</p>
            </div>
          </div>

          {/* desc sec */}
          <div className="max-w-md py-8">
            <h2 className="text-2xl font-bold mb-3">Description</h2>
            <p className=" text-balance text-sm text-gray-400">
              {cardata?.description}
            </p>
          </div>

          {/* features */}
          <div className="grid grid-cols-2 gap-3 text-gray-500 ">
            {cardata?.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <img src={assets.check_icon} alt="" className="w-5" />
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* another side with dates */}
        <form className="w-full md:w-[380px] border-2 border-gray-200 rounded-lg px-6 py-6 flex flex-col gap-5 shadow-md h-fit ">
          <h3 className="text-xl font-bold">Book This Car</h3>
          <div className="flex items-center justify-between gap-4 px-4 bg-blue-700 rounded-lg w-full py-4 text-white">
            <p className="text-3xl font-bold">₹{cardata?.pricePerDay}</p>
            <p className="text-sm">per day</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label className="font-semibold text-gray-700">Pickup Date</label>
            <input
              required
              min={new Date().toISOString().split("T")[0]}
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <label className="font-semibold text-gray-700">Return Date</label>
            <input
              required
              min={new Date().toISOString().split("T")[0]}
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer text-white rounded-lg font-semibold transition duration-200 transform hover:scale-105">
            Book Now
          </button>

          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            <p>Free cancellation until 24 hours before pickup</p>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Cardetails;
