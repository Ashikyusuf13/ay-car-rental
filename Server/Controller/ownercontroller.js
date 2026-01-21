import User from '../Model/UserModel.js';
import Car from '../Model/CarModel.js';
import Booking from '../Model/BookingModel.js';

// --- Owner Onboarding ---

// Upgrade an existing user to Owner
export const becomeOwner = async (req, res) => {
    try {
        const { userId, phone, address } = req.body;

        if (!phone || !address) {
            return res.json({ success: false, message: 'Phone and Address are required to become an owner' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role: 'owner', phone, address },
            { new: true }
        ).select("-password")

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Ideally, you might want to issue a new token with the updated role if role is in token, 
        // but here we just store ID in token, so next request will fetch updated user from DB.

        return res.json({ success: true, message: "You are now an Owner!", user });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- Car Management Controllers ---

import { v2 as cloudinary } from 'cloudinary';

export const addCar = async (req, res) => {
    try {
        let { cardata } = req.body;

        if (typeof cardata === 'string') {
            cardata = JSON.parse(cardata);
        }

        if (!cardata) {
            return res.json({ success: false, message: 'Missing Required Car Details' });
        }

        // Handle Image Upload
        const imageFile = req.file;
        if (!imageFile) {
            return res.json({ success: false, message: 'Car image is required' });
        }

        // Upload to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        const image = imageUpload.secure_url;

        const car = new Car({
            ...cardata,
            owner: req.user._id,
            image
        });

        await car.save();

        return res.json({ success: true, message: "Car added successfully", car });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getOwnerCars = async (req, res) => {
    try {
        const { userId } = req.body;

        const cars = await Car.find({ owner: userId });

        return res.json({ success: true, cars });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteCar = async (req, res) => {
    try {
        const { userId, carId } = req.body;
        const id = carId || req.params.id;

        const car = await Car.findOneAndDelete({ _id: id, owner: userId });

        if (!car) {
            return res.json({ success: false, message: "Car not found or unauthorized" });
        }

        return res.json({ success: true, message: "Car deleted successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- Booking Management ---

export const getOwnerBookings = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find bookings where the car belongs to this owner (user)
        const bookings = await Booking.find({ ownerId: userId })
            .populate('carId')
            .populate('userId', 'name email phone');

        return res.json({ success: true, bookings });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getOwnerDashboardData = async (req, res) => {
    try {
        const { userId } = req.body;

        const totalCars = await Car.countDocuments({ owner: userId });
        // For totalBookings, we need to query based on ownerId field in Booking (which we added)
        const totalBookings = await Booking.countDocuments({ ownerId: userId });

        // Calculate revenue directly via mongo aggregation or simple loop if scale is small
        const bookings = await Booking.find({ ownerId: userId, paymentStatus: 'Paid' }); // Only paid bookings
        const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);

        return res.json({
            success: true,
            stats: {
                totalCars,
                totalBookings,
                totalRevenue
            }
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
