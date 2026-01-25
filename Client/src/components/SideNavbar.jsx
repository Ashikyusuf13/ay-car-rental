import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/Appcontext";
import toast from "react-hot-toast";

const SideNavbar = () => {
  const { userData, logout, theme, setTheme } = useContext(AppContext);
  const navigate = useNavigate();
  const menuitems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: assets.dashboardIcon,
      coloredIcon: assets.dashboardIconColored,
    },
    {
      name: "Add car",
      path: "/dashboard/Add-car",
      icon: assets.addIcon,
      coloredIcon: assets.addIconColored,
    },
    {
      name: "Manage Cars",
      path: "/dashboard/Manage-cars",
      icon: assets.car_icon,
      coloredIcon: assets.calendar_icon_colored,
    },
    {
      name: "Manage Bookings",
      path: "/dashboard/Manage-bookings",
      icon: assets.listIcon,
      coloredIcon: assets.listIconColored,
    },
  ];
  // Responsive: show/hide sidebar on mobile
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <>
      {/* Mobile hamburger button */}
      {!open && (
        <button
          className={`md:hidden fixed top-3 left-3 z-50 bg-gray-900 text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-90`}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-gray-900 dark:bg-black border-r border-gray-800  shadow-2xl z-40 transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 flex flex-col w-72`}
      >
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-wider"><span className="text-blue-500">AY</span> Rental</h2>
          {/* Close button for mobile */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuitems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={item.icon} className={`w-5 h-5 transition-all ${item.isActive ? "brightness-200" : "brightness-100 opacity-70 group-hover:opacity-100"}`} style={{ filter: "brightness(0) invert(1)" }} alt="" />
              <span className="text-sm tracking-wide">{item.name}</span>
            </NavLink>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-800 my-4"></div>

          {/* Back to Home */}
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1 w-full text-left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm tracking-wide">Back to Home</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 hover:translate-x-1 w-full text-left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm tracking-wide">Logout</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {userData ? userData.name?.charAt(0).toUpperCase() : 'O'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userData ? userData.name : 'Owner Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{userData ? userData.email : 'admin@ayrental.com'}</p>
            </div>
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">Owner</span>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideNavbar;
