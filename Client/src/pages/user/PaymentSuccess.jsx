import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../Context/Appcontext";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const { theme } = useContext(AppContext);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                toast.error("Invalid session");
                navigate("/");
                return;
            }

            try {
                // Verify payment with backend
                const { data } = await axios.post("/api/bookings/verify", {
                    success: true,
                    orderId: sessionId,
                });

                if (data.success) {
                    setVerified(true);
                    toast.success("Booking confirmed!");
                } else {
                    toast.error(data.message || "Payment verification failed");
                }
            } catch (error) {
                console.log(error);
                toast.error("Payment verification failed");
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [sessionId, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 dark:bg-black bg-gray-50">
            <div
                className={`absolute top-20 left-0 transform translate-y-0/6 ${theme === "dark"
                    ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
                    : ""
                    }`}
            ></div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative z-10">
                {verifying ? (
                    <div>
                        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                            Verifying Payment...
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Please wait while we confirm your booking.
                        </p>
                    </div>
                ) : verified ? (
                    <div>
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Payment Successful!
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Your car has been booked successfully. You will receive a confirmation email shortly.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/my-bookings")}
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                View My Bookings
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Verification Issue
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            There was an issue verifying your payment. Please check your bookings or contact support.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/my-bookings")}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                Check Bookings
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
