import { useContext, useState } from "react";
import { AppContext } from "../Context/Appcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login"); // login or register
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { theme, getUserData, backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (state === "login") {
        // Login - requires email and password
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        if (data.success) {
          toast.success("Logged in successfully!");
          await getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        // Register - requires name, email and password
        if (!formData.name) {
          toast.error("Please enter your name");
          setLoading(false);
          return;
        }
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        if (data.success) {
          toast.success("Account created successfully!");
          await getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 md:px-10 bg-gradient-to-b from-black to-slate-900">
      {/* Background Effects */}
      <div
        className={`absolute top-20 left-0 transform translate-y-0/6 w-96 h-96 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20`}
      ></div>

      <div
        className={`absolute top-0 right-0 transform translate-y-2/6 w-96 h-96 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-900 rounded-full blur-3xl opacity-20`}
      ></div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md text-center bg-slate-900 border border-gray-700 my-5 rounded-2xl px-8 py-8 relative z-10"
      >
        <h1 className="text-white text-3xl font-medium">
          {state === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="text-white/50 text-sm mt-2">
          {state === "login"
            ? "Enter your credentials to access your account"
            : "Sign up to get started with AY Rental"}
        </p>

        {/* Name Field - Only for Registration */}
        {state === "register" && (
          <div className="flex items-center mt-6 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-white/60"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Email Field */}
        <div
          className={`flex items-center w-full ${state === "register" ? "mt-4" : "mt-6"} bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-white/75"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
          </svg>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-white/75"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        {/* Forgot Password - Only for Login */}
        {state === "login" && (
          <div className="mt-4 text-left">
            <button
              type="button"
              className="text-sm text-indigo-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-12 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : state === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>

        {/* Toggle Login/Register */}
        <p className="text-gray-400 text-sm mt-6 cursor-pointer">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span
            onClick={() =>
              setState((prev) => (prev === "login" ? "register" : "login"))
            }
            className="text-indigo-400 hover:underline ml-1 font-medium"
          >
            {state === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>

        {/* Back to Home */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
