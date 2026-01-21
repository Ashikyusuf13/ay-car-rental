import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/Appcontext";

const Navbar = () => {
  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/car-list" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, setTheme, search, setSearch } = useContext(AppContext);

  return (
    <div
      className={`${theme === "dark" ? "bg-black " : "bg-gray-100"
        } mx-auto max-w-7xl py-4 mb-10 md:mb-18 flex relative  z-90`}
    >
      <div
        className={`flex fixed items-center justify-between w-full max-sm:px-4 max-sm:py-3 md:px-10 py-2 ${theme === "dark" ? "bg-black " : "bg-gray-100"
          }    backdrop-blur-2xl shadow-2xl  `}
      >
        <img src={assets.logo} alt="" className="dark:invert-100 w-40" />

        {isMenuOpen && (
          <div
            onClick={() => setIsMenuOpen(false)}
            className="bg-black/90 opacity-50 w-screen h-screen fixed top-0 left-0 z-40"
          ></div>
        )}

        <div
          className={`max-sm:fixed max-sm:min-h-screen max-sm:min-w-50 max-sm:left-0 max-sm:top-0 flex flex-col  sm:flex-row sm:items-center sm:justify-between transition-all duration-300 z-50 max-sm:gap-4 sm:gap-8 max-sm:px-4  py-4 max-sm:py-15 
            dark:max-sm:bg-slate-800 max-sm:bg-gray-100
           ${isMenuOpen ? "max-sm:translate-x-0" : "max-sm:-translate-x-full"}`}
        >
          <img
            src={assets.close_icon}
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-6 cursor-pointer  max-sm:block md:hidden"
            alt=""
          />

          {menuLinks.map((link, idx) => (
            <div className="" key={idx}>
              <Link
                onClick={() => setIsMenuOpen(false)}
                key={idx}
                to={link.path}
                className={`font-medium ${theme === "dark"
                    ? "text-gray-200 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                  }`}
              >
                {link.name}
              </Link>
            </div>
          ))}

          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (location.pathname !== "/car-list") {
                  navigate("/car-list");
                }
              }}
              className="w-full max-sm:hidden px-2 py-1 border border-gray-500 rounded-lg focus:outline-none  dark:text-white placeholder:text-gray-500"
              placeholder="Search for car"
            />
          </div>

          <div className="flex gap-4">
            <Link
              to="/car-list"
              onClick={() => setIsMenuOpen(false)}
              className="shadow-lg px-3 py-2 hover:scale-105 duration-200 dark:bg-violet-700 dark:text-white rounded-lg"
            >
              List Cars
            </Link>

            {/* sign up btn */}
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-800 px-3 py-2 rounded-lg text-white"
            >
              Sign up
            </Link>
          </div>
        </div>

        <img
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          src={theme === "dark" ? assets.sun_icon : assets.moon_icon}
          alt="theme_icon"
          className="w-8 md:-ml-30 border dark:border-white border-black  rounded-full p-2 cursor-pointer"
        />

        <div className="sm:hidden" onClick={() => setIsMenuOpen(true)}>
          <img
            src={assets.menu_icon}
            alt="menu"
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
