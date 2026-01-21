import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    image: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    seating_capacity: { type: Number, required: true },
    fuel_type: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
    transmission: { type: String, required: true, enum: ['Automatic', 'Manual', 'Semi-Automatic'] },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    mileage: { type: String, required: true },
    features: [{ type: String }],
    registerNumber: { type: String, required: true, unique: true },
}, { timestamps: true });

const carModel = mongoose.models.car || mongoose.model('car', carSchema);

export default carModel;
