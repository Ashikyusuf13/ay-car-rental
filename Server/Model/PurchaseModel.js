import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        carId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "car",
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "booking",
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "Completed", "failed"],
            default: "pending",
        },
        startDate: {
            type: Date,
            required: true // Added to persist booking details
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    { timestamps: true },
)

const Purchase = mongoose.models.purchase || mongoose.model("purchase", purchaseSchema)
export default Purchase;
