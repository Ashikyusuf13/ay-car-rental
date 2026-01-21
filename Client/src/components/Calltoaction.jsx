import React, { useState } from "react";

const Calltoaction = () => {
  const [email, setEmail] = useState("");

  const handleSubscription = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed with:", email);
      setEmail("");
      alert("Thank you for subscribing!");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="flex dark:bg-black flex-col justify-center items-center md:px-10 px-4 py-10 md:py-16 ">
      <h2 className="text-3xl md:text-4xl font-semibold py-3 text-center">
        Never Miss a Deal!
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-md">
        Subscribe to get the latest offers, new collections, and exclusive
        discounts delivered straight to your inbox.
      </p>

      <form
        onSubmit={handleSubscription}
        className="flex w-full max-w-lg py-10"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="outline-none w-full border border-gray-300 dark:border-gray-600 px-5 py-3 rounded-l-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email address"
          required
        />
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg font-semibold transition-colors duration-200"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Calltoaction;
