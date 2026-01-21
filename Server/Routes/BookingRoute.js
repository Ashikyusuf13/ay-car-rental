import express from 'express';
import { cancelBooking, createBooking, getUserBookings, verifyStripe } from '../Controller/BookingController.js';
import userAuth from '../Middleware/userAuth.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', userAuth, createBooking);
bookingRouter.post('/verify', userAuth, verifyStripe);
bookingRouter.get('/my-bookings', userAuth, getUserBookings);
bookingRouter.post('/cancel', userAuth, cancelBooking);

export default bookingRouter;
