import React from "react";
// import plug from "../src/Assets/disconnecting-plug.png"
const ServerDown = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full text-center">
        {/* Broken Server Image */}
        {/* <img
          src= {plug}
          alt="Server Down"
          className="w-96 mx-auto mb-6 opacity-90"
        /> */}

        <h1 className="text-3xl font-bold text-white mb-2">
          Server Temporarily Down
        </h1>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Oops! Our servers are currently unavailable.
          <br />
          We’re working hard to fix this. Please try again in a few moments.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
          >
            🔄 Retry
          </button>

         
        </div>

        <p className="text-xs text-slate-500 mt-8">
          Error Code: <span className="text-slate-400">SERVER_UNAVAILABLE</span>
        </p>
      </div>
    </div>
  );
};

export default ServerDown;
