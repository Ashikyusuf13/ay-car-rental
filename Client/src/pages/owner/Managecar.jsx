import React, { useState } from "react";
import { dummyCarData } from "../../assets/assets";

const Managecar = () => {
  const [cars, setCars] = useState(dummyCarData);

  const handleEdit = (id) => {
    console.log("Edit car:", id);
    // Navigate to an edit page or open a modal
  };

  const handleDelete = (id) => {
    setCars(cars.filter((car) => car._id !== id));
    console.log("Delete car:", id);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Fleet Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-md w-full md:w-auto">
          + Add New Car
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-750 text-left border-b border-gray-100 dark:border-gray-700">
                <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Vehicle</th>
                <th className="py-5 px-6 font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Specs</th>
                <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Year</th>
                <th className="py-5 px-6 font-semibold text-right text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Rate/Day</th>
                <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Status</th>
                <th className="py-5 px-6 font-semibold text-center text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {cars.map((car) => (
                <tr
                  key={car._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center group">
                      <div className="relative overflow-hidden rounded-xl w-16 h-12 mr-4 shadow-sm">
                        <img
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          src={car.image}
                          alt="car"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">{car.brand} {car.model}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{car._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <div className="text-gray-600 dark:text-gray-300">
                      <span className="block">{car.transmission}</span>
                      <span className="text-xs text-gray-400">{car.fuel_type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-300 font-medium">
                    {car.year}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-gray-800 dark:text-white">
                    ₹{car.pricePerDay.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${car.isAvaliable
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${car.isAvaliable ? "bg-green-500" : "bg-red-500"}`}></span>
                      {car.isAvaliable ? "Available" : "Booked"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleEdit(car._id)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /> </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Managecar;
