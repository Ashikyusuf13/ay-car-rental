import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-6 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <div className="mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} AY Car Rental. All rights reserved.
        </div>
        <div className="flex gap-6 justify-center md:justify-end">
          <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </a>
          <a href="/course-list" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Cars
          </a>
          <a href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            About
          </a>
          <a href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
