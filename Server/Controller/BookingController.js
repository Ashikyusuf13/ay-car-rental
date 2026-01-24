import Booking from "../Model/BookingModel.js";
import Car from "../Model/CarModel.js";

// Imports needed for Payment
import Stripe from "stripe";
import Purchase from "../Model/PurchaseModel.js";
import mongoose from "mongoose";
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a new booking
// Create a new booking (Initializes Payment)
export const createBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { carId, startDate, endDate } = req.body;

    if (!userId || !carId || !startDate || !endDate) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Basic validation
    if (start >= end) {
      return res.json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    // Check availability overlap
    const existingBooking = await Booking.findOne({
      carId,
      status: { $in: ["Confirmed", "Pending"] }, // Check pending too if we want to block concurrent attempts, but here we don't have pending bookings in DB yet.
      // Actually, if we don't save pending booking, double booking is possible.
      // To prevent double booking, we usually reserve.
      // But user insists "booking created ONLY if success".
      // We will check Confirmed bookings.
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });

    if (existingBooking) {
      return res.json({
        success: false,
        message: "Car is not available for these dates",
      });
    }

    // Calculate total price
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    // Generate a booking ID to use later
    const potentialBookingId = new mongoose.Types.ObjectId();

    // Create Purchase Record to track this transaction attempt
    const purchase = new Purchase({
      userId,
      carId,
      amount: totalPrice,
      status: "pending",
      bookingId: potentialBookingId,
      startDate,
      endDate,
    });

    await purchase.save();

    // Create Stripe Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${car.brand} ${car.model} Rental`,
              images: [car.image],
              description: `Rental from ${start.toDateString()} to ${end.toDateString()}`,
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        purchaseId: purchase._id.toString(),
        userId,
        carId,
        startDate: startDate,
        endDate: endDate,
        bookingId: potentialBookingId.toString(), // Pass this ID to use when creating booking
        ownerId: car.owner.toString(),
      },
      success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-cancel`,
    });

    return res.json({
      success: true,
      message: "Payment initialized.",
      url: session.url,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify Stripe Payment
export const verifyStripe = async (req, res) => {
  try {
    const { success, orderId } = req.body; // orderId is the Stripe session ID

    if (!orderId) {
      return res.json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Retrieve the Stripe session to get purchaseId from metadata
    const session = await stripeInstance.checkout.sessions.retrieve(orderId);

    if (!session) {
      return res.json({
        success: false,
        message: "Invalid session",
      });
    }

    const purchaseId = session.metadata?.purchaseId;

    if (!purchaseId) {
      return res.json({
        success: false,
        message: "Purchase ID not found in session",
      });
    }

    if (success === "true" || success === true) {
      // Find the purchase record using purchaseId
      const purchase = await Purchase.findById(purchaseId);
      if (!purchase) {
        return res.json({
          success: false,
          message: "Purchase record not found",
        });
      }

      // Create the Booking
      const newBooking = new Booking({
        _id: purchase.bookingId, // Use the ID we reserved
        userId: purchase.userId,
        carId: purchase.carId,
        startDate: purchase.startDate,
        endDate: purchase.endDate,
        totalPrice: purchase.amount,
      });

      // Re-fetch Car to get ownerId
      const car = await Car.findById(purchase.carId);
      if (car) {
        newBooking.ownerId = car.owner;
      } else {
        return res.json({
          success: false,
          message: "Car not found during verification",
        });
      }

      newBooking.paymentStatus = "Paid";
      newBooking.status = "Confirmed";

      await newBooking.save();

      // Update Purchase Status
      purchase.status = "Completed";
      await purchase.save();

      return res.json({ success: true, message: "Booking Confirmed!" });
    } else {
      // Payment Failed
      const purchase = await Purchase.findById(purchaseId);
      if (purchase) {
        purchase.status = "failed";
        await purchase.save();
      }
      return res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const bookings = await Booking.find({ userId })
      .populate("carId")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "Cancelled") {
      return res.json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Optional: Check if cancellation is allowed (e.g., 24h before)

    booking.status = "Cancelled";
    await booking.save();

    return res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Cancel Payment (when user cancels during Stripe checkout)
export const cancelPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Retrieve Stripe session to get purchaseId
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    const purchaseId = session.metadata?.purchaseId;

    if (!purchaseId) {
      return res.json({
        success: false,
        message: "Purchase ID not found",
      });
    }

    // Update Purchase status to cancelled
    const purchase = await Purchase.findByIdAndUpdate(
      purchaseId,
      { status: "cancelled" },
      { new: true },
    );

    if (!purchase) {
      return res.json({
        success: false,
        message: "Purchase record not found",
      });
    }

    return res.json({
      success: true,
      message: "Payment cancelled. You can retry anytime.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
