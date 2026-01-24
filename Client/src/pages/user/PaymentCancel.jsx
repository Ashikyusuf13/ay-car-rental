import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../Context/Appcontext";
import toast from "react-hot-toast";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { theme } = useContext(AppContext);
  const [cancelling, setCancelling] = useState(!!sessionId);

  useEffect(() => {
    const handlePaymentCancel = async () => {
      if (!sessionId) {
        setCancelling(false);
        return;
      }

      try {
        // Notify backend that payment was cancelled
        await axios.post("/api/bookings/cancel-payment", {
          sessionId: sessionId,
        });
        toast.info("Payment cancelled. You can try again later.");
      } catch (error) {
        console.log(error);
        // Don't show error toast since user already cancelled
      } finally {
        setCancelling(false);
      }
    };

    if (sessionId) {
      handlePaymentCancel();
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dark:bg-black bg-gray-50">
      <div
        className={`absolute top-20 left-0 transform translate-y-0/6 ${
          theme === "dark"
            ? "w-96 h-96 bg-linear-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20"
            : ""
        }`}
      ></div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative z-10">
        {cancelling ? (
          <div>
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Processing Cancellation...
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we process your cancellation.
            </p>
          </div>
        ) : (
          <div>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Payment Cancelled
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Your payment was cancelled. No charges were made to your account.
              Your booking has been saved as pending and you can retry the
              payment anytime.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/my-bookings")}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate("/car-list")}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Browse More Cars
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

export default PaymentCancel;
