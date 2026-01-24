import React, { useState } from "react";
import { assets, cityList } from "../../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Addcars = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [carDetails, setCarDetails] = useState({
    brand: "",
    model: "",
    year: "",
    category: "",
    seating_capacity: "",
    fuel_type: "",
    transmission: "",
    pricePerDay: "",
    location: "",
    description: "",
    mileage: "",
    registerNumber: "",
    features: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setCarDetails({ ...carDetails, image: files[0] });
    } else {
      setCarDetails({ ...carDetails, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // Append all form fields
    formData.append("brand", carDetails.brand);
    formData.append("model", carDetails.model);
    formData.append("year", carDetails.year);
    formData.append("category", carDetails.category);
    formData.append("seating_capacity", carDetails.seating_capacity);
    formData.append("fuel_type", carDetails.fuel_type);
    formData.append("transmission", carDetails.transmission);
    formData.append("pricePerDay", carDetails.pricePerDay);
    formData.append("location", carDetails.location);
    formData.append("description", carDetails.description);
    formData.append("mileage", carDetails.mileage);
    formData.append("registerNumber", carDetails.registerNumber);

    // Handle features as comma-separated string to array
    if (carDetails.features) {
      const featuresArray = carDetails.features.split(",").map(f => f.trim());
      featuresArray.forEach(feature => {
        formData.append("features", feature);
      });
    }

    // Append image
    if (carDetails.image) {
      formData.append("image", carDetails.image);
    }

    try {
      const { data } = await axios.post("/api/owner/add-car", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Car added successfully!");
        setCarDetails({
          brand: "",
          model: "",
          year: "",
          category: "",
          seating_capacity: "",
          fuel_type: "",
          transmission: "",
          pricePerDay: "",
          location: "",
          description: "",
          mileage: "",
          registerNumber: "",
          features: "",
          image: null,
        });
        navigate("/dashboard/Manage-cars");
      } else {
        toast.error(data.message || "Failed to add car");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error adding car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 dark:text-white">Add New Vehicle</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 md:p-8 lg:p-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Brand & Model */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Vehicle Identity</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Brand *</label>
              <input
                type="text"
                name="brand"
                value={carDetails.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="e.g. Toyota"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Model *</label>
              <input
                type="text"
                name="model"
                value={carDetails.model}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="e.g. Camry"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Year *</label>
              <input
                type="number"
                name="year"
                value={carDetails.year}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="e.g. 2024"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Registration Number *</label>
              <input
                type="text"
                name="registerNumber"
                value={carDetails.registerNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="e.g. MH01AB1234"
                required
              />
            </div>
          </div>

          {/* Specs */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Category *</label>
                <select
                  name="category"
                  value={carDetails.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                  required
                >
                  <option value="" disabled>Select</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Fuel Type *</label>
                <select
                  name="fuel_type"
                  value={carDetails.fuel_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                  required
                >
                  <option value="" disabled>Select</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Capacity *</label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={carDetails.seating_capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                  placeholder="e.g. 5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Transmission *</label>
                <select
                  name="transmission"
                  value={carDetails.transmission}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                  required
                >
                  <option value="" disabled>Select</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Mileage *</label>
              <input
                type="text"
                name="mileage"
                value={carDetails.mileage}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="e.g. 15 km/l"
                required
              />
            </div>
          </div>

          {/* Pricing & Location - Full Width */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Rental Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Price Per Day (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={carDetails.pricePerDay}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="e.g. 5000"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Location *</label>
                <select
                  name="location"
                  value={carDetails.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                  required
                >
                  <option value="" disabled>Select Location</option>
                  {cityList.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Features (comma-separated)</label>
            <input
              type="text"
              name="features"
              value={carDetails.features}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
              placeholder="e.g. AC, Bluetooth, GPS, Sunroof"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description *</label>
            <textarea
              name="description"
              value={carDetails.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 resize-none dark:text-white"
              placeholder="Tell us more about the car..."
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Car Image *</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {carDetails.image ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">✓</span>
                      </div>
                      <p className="text-sm text-green-500 font-semibold">{carDetails.image.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WEBP (MAX. 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  required={!carDetails.image}
                />
              </label>
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Adding Vehicle..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addcars;
