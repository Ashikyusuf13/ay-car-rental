import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
    address: { type: String, default: "" },
    buyedCars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'car' }],
}, { minimize: false, timestamps: true });

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;