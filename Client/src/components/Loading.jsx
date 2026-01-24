import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-black bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
