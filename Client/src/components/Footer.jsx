import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="w-full h-full md:px-10 px-4 S py-5 gap-8 dark:bg-black bg-gray-100 dark:text-white">
      <div className="w-full h-full md:px-10 px-4 md:py-10 py-5 flex flex-col md:flex-row justify-center items-center gap-8 border-b-2 border-gray-600">
        <div className="flex flex-col gap-4 items-start">
          <img src={assets.logo} alt="" className="w-44 dark:invert" />

          <p className="text-sm max-w-sm">
            Premium car rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </p>

          <div className="flex gap-3">
            <img src={assets.gmail_logo} alt="" className="w-6" />
            <img src={assets.instagram_logo} alt="" className="w-6" />
            <img src={assets.facebook_logo} alt="" className="w-6" />
            <img src={assets.gmail_logo} alt="" className="w-6" />
          </div>
        </div>

        {/* another side  */}
        <div className="w-full flex flex-wrap md:flex-row gap-10 md:gap-27 md:justify-end items-start md:items-center">
          {/*  1st line */}
          <div>
            <h2 className="py-2 font-semibold">Quick links</h2>
            <p>Home</p>
            <p>Browse cars</p>
            <p>List your car</p>
            <p>Contact us</p>
          </div>

          {/*  2nd line */}
          <div>
            <h2 className="py-2 font-semibold">Resourse</h2>
            <p>Home</p>
            <p>Browse cars</p>
            <p>List your car</p>
            <p>Contact us</p>
          </div>

          {/*  3rd line */}
          <div>
            <h2 className="py-2 font-semibold">Contact</h2>
            <p>Home</p>
            <p>Browse cars</p>
            <p>List your car</p>
            <p>Contact us</p>
          </div>
        </div>
      </div>

      <p className="py-4 text-gray-500">
        © 2025 CarRental. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
