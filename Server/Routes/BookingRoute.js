import express from "express";
import {
  cancelBooking,
  createBooking,
  getUserBookings,
  verifyStripe,
  cancelPayment,
} from "../Controller/BookingController.js";
import userAuth from "../Middleware/userAuth.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", userAuth, createBooking);
bookingRouter.post("/verify", userAuth, verifyStripe);
bookingRouter.post("/cancel-payment", userAuth, cancelPayment);
bookingRouter.get("/my-bookings", userAuth, getUserBookings);
bookingRouter.post("/cancel", userAuth, cancelBooking);

export default bookingRouter;
