import User from "../Model/UserModel.js";
import Car from "../Model/CarModel.js";
import Booking from "../Model/BookingModel.js";

// --- Owner Onboarding ---

// Upgrade an existing user to Owner
export const becomeOwner = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { role: "owner" },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Ideally, you might want to issue a new token with the updated role if role is in token,
    // but here we just store ID in token, so next request will fetch updated user from DB.

    return res.json({ success: true, message: "You are now an Owner!", user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// --- Car Management Controllers ---

import { v2 as cloudinary } from "cloudinary";

export const addCar = async (req, res) => {
  try {
    let cardata = req.body.cardata
      ? typeof req.body.cardata === "string"
        ? JSON.parse(req.body.cardata)
        : req.body.cardata
      : req.body;

    if (!cardata) {
      return res.json({
        success: false,
        message: "Missing Required Car Details",
      });
    }

    // Handle Image Upload
    const imageFile = req.file;
    if (!imageFile) {
      return res.json({ success: false, message: "Car image is required" });
    }

    // Upload to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const image = imageUpload.secure_url;

    const car = new Car({
      ...cardata,
      owner: req.user._id,
      image,
    });

    await car.save();

    return res.json({ success: true, message: "Car added successfully", car });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const userId = req.userId;

    const cars = await Car.find({ owner: userId });

    return res.json({ success: true, cars });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const userId = req.userId;
    const carId = req.body.carId;
    const id = carId || req.params.id;

    const car = await Car.findOneAndDelete({ _id: id, owner: userId });

    if (!car) {
      return res.json({
        success: false,
        message: "Car not found or unauthorized",
      });
    }

    return res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// --- Booking Management ---

export const getOwnerBookings = async (req, res) => {
  try {
    const userId = req.userId;

    // Find bookings where the car belongs to this owner (user)
    const bookings = await Booking.find({ ownerId: userId })
      .populate("carId")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Approve a booking
export const approveBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.json({ success: false, message: "Booking ID is required" });
    }

    const booking = await Booking.findOne({ _id: bookingId, ownerId: userId });

    if (!booking) {
      return res.json({ success: false, message: "Booking not found or unauthorized" });
    }

    if (booking.status !== "Pending") {
      return res.json({ success: false, message: "Only pending bookings can be approved" });
    }

    booking.status = "Confirmed";
    await booking.save();

    // Update car availability
    await Car.findByIdAndUpdate(booking.carId, { isAvailable: false });

    return res.json({ success: true, message: "Booking approved successfully", booking });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reject a booking
export const rejectBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.json({ success: false, message: "Booking ID is required" });
    }

    const booking = await Booking.findOne({ _id: bookingId, ownerId: userId });

    if (!booking) {
      return res.json({ success: false, message: "Booking not found or unauthorized" });
    }

    if (booking.status !== "Pending") {
      return res.json({ success: false, message: "Only pending bookings can be rejected" });
    }

    booking.status = "Cancelled";
    await booking.save();

    return res.json({ success: true, message: "Booking rejected successfully", booking });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Complete a booking
export const completeBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.json({ success: false, message: "Booking ID is required" });
    }

    const booking = await Booking.findOne({ _id: bookingId, ownerId: userId });

    if (!booking) {
      return res.json({ success: false, message: "Booking not found or unauthorized" });
    }

    if (booking.status !== "Confirmed") {
      return res.json({ success: false, message: "Only confirmed bookings can be marked as completed" });
    }

    booking.status = "Completed";
    await booking.save();

    // Make car available again
    await Car.findByIdAndUpdate(booking.carId, { isAvailable: true });

    return res.json({ success: true, message: "Booking marked as completed", booking });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// --- Car Management - Update & Toggle ---

// Update car details
export const updateCar = async (req, res) => {
  try {
    const userId = req.userId;
    const { carId, ...updateData } = req.body;

    if (!carId) {
      return res.json({ success: false, message: "Car ID is required" });
    }

    const car = await Car.findOneAndUpdate(
      { _id: carId, owner: userId },
      updateData,
      { new: true }
    );

    if (!car) {
      return res.json({ success: false, message: "Car not found or unauthorized" });
    }

    return res.json({ success: true, message: "Car updated successfully", car });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Toggle car availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const userId = req.userId;
    const { carId } = req.body;

    if (!carId) {
      return res.json({ success: false, message: "Car ID is required" });
    }

    const car = await Car.findOne({ _id: carId, owner: userId });

    if (!car) {
      return res.json({ success: false, message: "Car not found or unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    return res.json({
      success: true,
      message: `Car is now ${car.isAvailable ? 'available' : 'unavailable'}`,
      car
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get single car details for editing
export const getCarById = async (req, res) => {
  try {
    const userId = req.userId;
    const { carId } = req.params;

    const car = await Car.findOne({ _id: carId, owner: userId });

    if (!car) {
      return res.json({ success: false, message: "Car not found or unauthorized" });
    }

    return res.json({ success: true, car });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getOwnerDashboardData = async (req, res) => {
  try {
    const userId = req.userId;

    const totalCars = await Car.countDocuments({ owner: userId });
    const totalBookings = await Booking.countDocuments({ ownerId: userId });

    const bookings = await Booking.find({
      ownerId: userId,
      paymentStatus: "Paid",
    });
    const totalRevenue = bookings.reduce(
      (acc, curr) => acc + curr.totalPrice,
      0,
    );

    const recentBookings = await Booking.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("carId")
      .populate("userId", "name");

    const pendingBookings = await Booking.countDocuments({
      ownerId: userId,
      status: "Pending",
    });

    const confirmedBookings = await Booking.countDocuments({
      ownerId: userId,
      status: "Confirmed",
    });

    const completedBookings = await Booking.countDocuments({
      ownerId: userId,
      status: "Completed",
    });

    return res.json({
      success: true,
      dashboardData: {
        totalCars,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        recentBookings,
        monthlyRevenue: totalRevenue,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
