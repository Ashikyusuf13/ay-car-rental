import React, { useContext } from "react";
import { assets, testimonials } from "../assets/assets";
import { AppContext } from "../Context/Appcontext";

const Testimonials = () => {
  const { theme } = useContext(AppContext);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-10 gap-4 dark:bg-black bg-gray-100 rounded-lg px-6 text-center">
      <h2 className="text-3xl font-semibold">What Our Customers Say</h2>
      <p className="max-w-2xl text-gray-700 dark:text-gray-300">
        Discover why discerning travelers choose AY Car Rental for their luxury
        car rentals around the world.
      </p>
      <div
        className={`absolute top-20 left-0 transform translate-y-30/12 ${
          theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
        }`}
      ></div>

      <div
        className={`absolute top-0 right-0 transform translate-y-250/50 ${
          theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
        }`}
      ></div>

      <div className="max-w-sm flex gap-4 justify-center items-center w-full md:flex-row md:max-w-4xl flex-col ">
        {testimonials.map((test, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 dark:text-white p-6  rounded-lg shadow-md flex flex-col  hover:shadow-xl transition duration-300 gap-4 items-start "
          >
            <div className="flex gap-4 items-center justify-center py-2">
              <img src={test.image} alt="" className="w-20 rounded-full" />
              <div>
                <p className="text-xl font-semibold">{test.name}</p>
                <p className="text-sm text-gray-500">{test.location}</p>
              </div>
            </div>

            <div className="flex gap-1">
              {[...Array(test.rating)].map((_, i) => (
                <img key={i} src={assets.star_icon} alt="" />
              ))}
            </div>

            <p className="text-start">{test.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
