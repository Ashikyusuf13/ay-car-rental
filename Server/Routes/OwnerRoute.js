import express from 'express';
import {
    becomeOwner,
    addCar,
    getOwnerCars,
    deleteCar,
    getOwnerBookings,
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
ownerRouter.post('/delete-car', ownerAuth, deleteCar);

// Booking Routes
ownerRouter.get('/bookings', ownerAuth, getOwnerBookings);

// Dashboard Routes
ownerRouter.get('/dashboard', ownerAuth, getOwnerDashboardData);

export default ownerRouter;
