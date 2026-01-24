import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/Appcontext";
import axios from "axios";
import toast from "react-hot-toast";

const BecomeOwner = () => {
    const navigate = useNavigate();
    const { userData, getUserData, isLoggedin, theme } = useContext(AppContext);

    const [step, setStep] = useState(1); // 1: Enter details, 2: Verify OTP, 3: Success
    const [formData, setFormData] = useState({
        phone: "",
        address: "",
    });
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if not logged in
    if (!isLoggedin) {
        navigate("/login");
        return null;
    }

    // Redirect if already an owner
    if (userData?.role === "owner") {
        navigate("/dashboard");
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const generateOtp = () => {
        // Generate a 6-digit OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        // In a real app, this would be sent via SMS/Email
        toast.success(`Your OTP is: ${newOtp} (Demo mode)`);
        return newOtp;
    };

    const handleSendOtp = (e) => {
        e.preventDefault();

        if (!formData.phone || formData.phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }

        if (!formData.address || formData.address.length < 5) {
            toast.error("Please enter a valid address");
            return;
        }

        generateOtp();
        setStep(2);
        toast.success("OTP sent to your phone number");
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (otp !== generatedOtp) {
            toast.error("Invalid OTP. Please try again.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post("/api/owner/become-owner", {
                phone: formData.phone,
                address: formData.address,
            });

            if (data.success) {
                toast.success("Congratulations! You are now an owner!");
                await getUserData(); // Refresh user data
                setStep(3);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            } else {
                toast.error(data.message || "Failed to become owner");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        generateOtp();
        toast.success("New OTP sent!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 dark:bg-black bg-gray-50">
            <div
                className={`absolute top-20 left-0 transform translate-y-0/6 ${theme === "dark"
                    ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
                    : ""
                    }`}
            ></div>

            <div
                className={`absolute top-0 right-0 transform translate-y-2/6 ${theme === "dark"
                    ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
                    : ""
                    }`}
            ></div>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🚗</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Become a Car Owner</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {step === 1 && "Enter your details to start listing cars"}
                        {step === 2 && "Verify your phone number"}
                        {step === 3 && "You're all set!"}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                {step > s ? "✓" : s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`w-12 h-1 ${step > s ? "bg-green-500" : "bg-gray-200 dark:bg-gray-600"
                                        }`}
                                ></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step 1: Enter Details */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your full address"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Send OTP
                        </button>
                    </form>
                )}

                {/* Step 2: Verify OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest"
                                required
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                                OTP sent to {formData.phone}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <div className="flex justify-between text-sm">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                ← Back
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="text-green-600 hover:text-green-700"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-4xl">🎉</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                Welcome, Owner!
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                You can now list your cars and start earning.
                            </p>
                        </div>
                        <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BecomeOwner;
