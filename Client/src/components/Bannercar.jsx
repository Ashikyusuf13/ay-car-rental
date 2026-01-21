import React from "react";
import { assets } from "../assets/assets";

const Bannercar = () => {
  return (
    <div className="flex items-center justify-center gap-25 flex-col md:flex-row mx-5 my-10 px-5 md:mx-20 rounded-lg py-10 mb-5 bg-linear-to-r from-blue-600 dark:from-slate-900 dark:to-blue-950 to-blue-400">
      <div className="max-w-md gap-4 ">
        <h2 className="text-3xl text-white font-semibold py-5">
          Do You Own a Luxury Car?
        </h2>
        <p className="text-white text-md mb-4">
          Monetize your vehicle effortlessly by listing it on CarRental.We take
          care of insurance, driver verification, and secure payments — so you
          can earn passive income, stress-free.
        </p>
        <button className="bg-white font-semibold dark:text-black px-8 py-4 hover:scale-105 transition duration-300 cursor-pointer rounded-lg">
          List Your Car
        </button>
      </div>

      <div>
        <img
          src={assets.banner_car_image}
          alt=""
          className="w-sm md:max-w-md"
        />
      </div>
    </div>
  );
};

export default Bannercar;
