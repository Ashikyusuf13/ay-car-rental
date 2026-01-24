import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { AppContext } from "../../Context/Appcontext";
import toast from "react-hot-toast";
import axios from "axios";

const Cardetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cardata, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { theme, userData, isLoggedin } = useContext(AppContext);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !cardata) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * cardata.pricePerDay : 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isLoggedin) {
      toast.error("Please login to book a car");
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select pickup and return dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      toast.error("Return date must be after pickup date");
      return;
    }

    setBookingLoading(true);
    try {
      const { data } = await axios.post("/api/bookings/create", {
        carId: id,
        startDate,
        endDate,
      });

      if (data.success) {
        toast.success("Redirecting to payment...");
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const fetchCarData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/cars/${id}`);
      if (data.success) {
        setCarData(data.car);
      } else {
        toast.error("Car not found");
        navigate("/car-list");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load car details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!cardata) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-black bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car not found</h2>
          <button
            onClick={() => navigate("/car-list")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Browse Cars
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-10 px-4 py-6 dark:bg-black dark:text-white bg-gray-100 min-h-screen">
      <div
        className={`absolute top-20 left-0 transform translate-y-9/6 ${theme === "dark"
          ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
          : ""
          }`}
      ></div>

      <div
        className={`absolute top-0 right-0 transform translate-y-1/6 ${theme === "dark"
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
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-4xl font-semibold">
                {cardata?.brand} {cardata?.model}
              </h2>
              {cardata?.isAvailable ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Available
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  Not Available
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {cardata?.year} • {cardata?.category} • {cardata?.location}
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
          {cardata?.features && cardata.features.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Features</h2>
              <div className="grid grid-cols-2 gap-3 text-gray-500 ">
                {cardata.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img src={assets.check_icon} alt="" className="w-5" />
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* another side with dates */}
        <form onSubmit={handleBooking} className="w-full md:w-[380px] border-2 border-gray-200 dark:border-gray-700 rounded-lg px-6 py-6 flex flex-col gap-5 shadow-md h-fit bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold">Book This Car</h3>
          <div className="flex items-center justify-between gap-4 px-4 bg-blue-700 rounded-lg w-full py-4 text-white">
            <p className="text-3xl font-bold">₹{cardata?.pricePerDay?.toLocaleString()}</p>
            <p className="text-sm">per day</p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label className="font-semibold text-gray-700 dark:text-gray-300">Pickup Date</label>
            <input
              required
              min={new Date().toISOString().split("T")[0]}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <label className="font-semibold text-gray-700 dark:text-gray-300">Return Date</label>
            <input
              required
              min={startDate || new Date().toISOString().split("T")[0]}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Total Price Preview */}
          {startDate && endDate && calculateTotalPrice() > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  ₹{cardata?.pricePerDay?.toLocaleString()} × {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-600">₹{calculateTotalPrice().toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={bookingLoading || !cardata?.isAvailable}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer text-white rounded-lg font-semibold transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {bookingLoading ? "Processing..." : cardata?.isAvailable ? "Book Now" : "Not Available"}
          </button>

          <div className="text-xs text-gray-500 text-center pt-2 border-t dark:border-gray-700">
            <p>Free cancellation until 24 hours before pickup</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cardetails;
