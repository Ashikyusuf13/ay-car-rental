import express from 'express';
import {
    becomeOwner,
    addCar,
    getOwnerCars,
    deleteCar,
    updateCar,
    toggleCarAvailability,
    getCarById,
    getOwnerBookings,
    approveBooking,
    rejectBooking,
    completeBooking,
    getOwnerDashboardData
} from '../Controller/ownercontroller.js';
import ownerAuth from '../Middleware/ownerAuth.js';
import userAuth from '../Middleware/userAuth.js';
import upload from '../Config/multer.js';

const ownerRouter = express.Router();

// Owner Onboarding
// User must be logged in (userAuth) to become an owner.
ownerRouter.post('/become-owner', userAuth, becomeOwner);

// Car Routes (Protected by ownerAuth)
ownerRouter.post('/add-car', ownerAuth, upload.single('image'), addCar);
ownerRouter.get('/my-cars', ownerAuth, getOwnerCars);
ownerRouter.get('/car/:carId', ownerAuth, getCarById);
ownerRouter.post('/update-car', ownerAuth, updateCar);
ownerRouter.post('/delete-car', ownerAuth, deleteCar);
ownerRouter.post('/toggle-availability', ownerAuth, toggleCarAvailability);

// Booking Routes
ownerRouter.get('/bookings', ownerAuth, getOwnerBookings);
ownerRouter.post('/approve-booking', ownerAuth, approveBooking);
ownerRouter.post('/reject-booking', ownerAuth, rejectBooking);
ownerRouter.post('/complete-booking', ownerAuth, completeBooking);

// Dashboard Routes
ownerRouter.get('/dashboard', ownerAuth, getOwnerDashboardData);

export default ownerRouter;

