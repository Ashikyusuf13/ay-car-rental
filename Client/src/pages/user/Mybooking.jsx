import React from "react";
import { assets } from "../../assets/assets";

const Mybooking = () => {
  const bookings = [
    {
      id: 1,
      image: assets.car_image1,
      name: "BMW M4 COMPETITION",
      year: 2022,
      type: "SUV",
      city: "Los Angeles",
      rentalPeriod: "4/10/2025 - 4/15/2025",
      pickup: "Airport Terminal 1",
      return: "Downtown Office",
      price: 75,
      status: "Confirmed",
      bookedOn: "4/1/2025",
    },
    {
      id: 2,
      image: assets.car_image2,
      name: "BMW M4 COMPETITION",
      year: 2022,
      type: "SUV",
      city: "Los Angeles",
      rentalPeriod: "4/10/2025 - 4/15/2025",
      pickup: "Airport Terminal 1",
      return: "Downtown Office",
      price: 45,
      status: "Confirmed",
      bookedOn: "4/1/2025",
    },
  ];

  return (
    <div className="dark:bg-black dark:text-white px-10 py-10 space-y-6">
      <h1 className="font-bold text-2xl">My Booking</h1>
      <p className="text-gray-500">View and manage your car bookings here.</p>

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex flex-col md:flex-row justify-between items-center bg-gray-100 dark:bg-gray-900 rounded-xl p-5 shadow-lg"
        >
          {/* LEFT SECTION */}

          <div className="flex flex-col md:flex-row gap-5 w-full">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <img
                  src={booking.image}
                  alt={booking.name}
                  className="w-full sm:w-48 rounded-lg object-cover"
                />

                <div className="space-y-2 mt-2">
                  <h2 className="font-semibold text-lg">{booking.name}</h2>
                  <p className="text-gray-500">
                    {booking.year} • {booking.type} • {booking.city}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex gap-3 mt-2 flex-wrap">
                  <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">
                    Booking #{booking.id}
                  </span>
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                    {booking.status}
                  </span>
                </div>

                <div className="text-sm space-y-3 mt-3">
                  <p>
                    <span className="font-medium">Rental Period:</span>
                    <br />
                    {booking.rentalPeriod}
                  </p>
                  <p>
                    <span className="font-medium">Pick-up:</span>
                    <br />
                    {booking.pickup}
                  </p>
                  <p>
                    <span className="font-medium">Return:</span>
                    <br />
                    {booking.return}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="text-left md:text-right space-y-2 mt-4 md:mt-0 -ml-24 md:-ml-2">
            <p className="text-gray-500 text-sm">Total Price</p>
            <p className="text-blue-600 font-bold text-xl">₹{booking.price}</p>
            <p className="text-gray-500 text-sm">
              Booked on {booking.bookedOn}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Mybooking;
