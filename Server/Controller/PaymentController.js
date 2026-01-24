import Stripe from "stripe";
import Purchase from "../Model/PurchaseModel.js";
import User from "../Model/UserModel.js";
import Booking from "../Model/BookingModel.js";
import Car from "../Model/CarModel.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { carId, startDate, endDate, bookingId } = req.body;

    // Verify car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    // Calculate total amount (Assuming bookingId already has/we calculate it)
    // Ideally pass bookingId of the pending booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    const amount = booking.totalPrice * 100; // in cents

    // Create Purchase Record
    const purchase = new Purchase({
      userId,
      carId,
      bookingId,
      amount: booking.totalPrice,
      status: "pending",
    });
    await purchase.save();

    // Create Stripe Session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${car.brand} ${car.model} Rental`,
              images: [car.image],
              description: `Rental from ${new Date(startDate).toDateString()} to ${new Date(endDate).toDateString()}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        purchaseId: purchase._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-cancel`,
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Webhook to handle success/failure
export const stripeWebhook = async (request, response) => {
  console.log("Webhook Received"); // Debug Log

  const sig = request.headers["stripe-signature"];
  let event;

  try {
    // Verify Stripe webhook signature
    event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("Webhook Signature Verified", event.type); // Debug Log
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      console.log("Handling checkout.session.completed"); // Debug Log
      const session = event.data.object;

      const {
        purchaseId,
        userId,
        carId,
        startDate,
        endDate,
        bookingId,
        ownerId,
      } = session.metadata;
      console.log("Metadata:", session.metadata); // Debug Log

      const purchase = await Purchase.findById(purchaseId);

      if (purchase) {
        console.log("Found Purchase, updating...");
        purchase.status = "Completed";
        await purchase.save();

        // Create the Booking NOW
        const newBooking = new Booking({
          _id: bookingId,
          userId,
          carId,
          ownerId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice: purchase.amount,
          status: "Confirmed",
          paymentStatus: "Paid",
        });

        await newBooking.save();
        console.log("Booking Created:", newBooking._id);

        // Update User's buyedCars
        const user = await User.findById(userId);
        if (user) {
          user.buyedCars.push(carId);
          await user.save();
        }
      } else {
        console.error("Purchase record not found for ID:", purchaseId);
      }
      break;
    }

    case "payment_intent.succeeded": {
      // Handled by checkout.session.completed
      break;
    }

    case "payment_intent.payment_failed": {
      // Keep existing logic or better yet, handle 'checkout.session.expired'
      // But let's keep payment_intent logic for failure if needed,
      // though accessing metadata via session lookup might fail if we don't have metadata on PI.
      // If we want robust failure handling, we need metadata on PI or use session events.
      // For now, let's focus on fixing success flow.
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      if (sessions.data.length > 0) {
        const { purchaseId } = sessions.data[0].metadata;
        const purchase = await Purchase.findById(purchaseId);
        if (purchase) {
          purchase.status = "failed";
          await purchase.save();
        }
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.json({ received: true });
};

// Manual Payment Verification Endpoint (Workaround for localhost webhook issues)
// Manual verification removed as per request
