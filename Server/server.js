import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectCloudinary from "./Config/Cloudnary.js"
import connectDB from "./Config/mongodb.js";
import userRouter from "./Routes/UserRouter.js";
import ownerRouter from "./Routes/OwnerRoute.js";
import carRouter from "./Routes/CarRoute.js";
// import paymentRouter from "./Routes/PaymentRoute.js";
import { stripeWebhook } from "./Controller/PaymentController.js";
import bookingRouter from "./Routes/BookingRoute.js";

const app = express();
const port = process.env.PORT || 4000;
await connectDB();
await connectCloudinary()

const allowedOrigins = ['http://localhost:5173'] // CLIENT URL

// Stripe Webhook - Must be before express.json()
app.post("/stripe", express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use('/uploads', express.static('uploads'));

// API Endpoints
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/auth', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/cars', carRouter);
app.use('/api/bookings', bookingRouter);
// app.use('/api/payment', paymentRouter); // Removed


app.listen(port, () => console.log(`Server started on PORT :${port}`));