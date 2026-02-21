import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginicon from "../Assets/logo.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../Api/adminApi";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await adminLogin({ username: email, password });
      if (res.success) {
        toast.success("Login Successful");
        localStorage.setItem("token", res.token);
        navigate("/dash");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.message || "Login Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glows — same as rest of app */}
      <div className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-400/5 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 w-full max-w-4xl">

        {/* Card */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

          {/* ── LEFT — branding ── */}
          <div className="hidden lg:flex flex-col items-center justify-center p-12 relative border-r border-[#1e1e2e]">
            {/* Top shimmer line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            {/* Logo */}
            <div className="w-28 h-28 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-8 shadow-lg shadow-blue-600/10">
              <img src={loginicon} alt="logo" className="w-16 h-16 object-contain" />
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">
              Crewminds <span className="text-blue-400">Portal</span>
              </h1>
              <p className="text-sm text-slate-500">Admin & Student Management</p>
            </div>

            {/* Feature list */}
            <div className="w-full space-y-3">
              {[
                { icon: "★", label: "Premium Job Listings" },
                { icon: "◈", label: "Student Applications" },
                { icon: "⊹", label: "HR Dashboard" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3 bg-[#0f0f18] border border-[#1e1e2e] rounded-xl px-4 py-3">
                  <span className="text-blue-400 text-sm">{f.icon}</span>
                  <span className="text-xs text-slate-500">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Bottom pulse dot */}
            <div className="flex items-center gap-2 mt-10">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-slate-600">System Online</span>
            </div>
          </div>

          {/* ── RIGHT — form ── */}
          <div className="p-8 md:p-12 flex flex-col justify-center relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-4 h-px bg-blue-500" />
                <span className="text-xs font-medium tracking-[3px] uppercase text-blue-500">Admin Panel</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
                Welcome <span className="text-blue-400">Back</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>
                <label className="block text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-500 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-semibold tracking-[1.5px] uppercase text-slate-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 pr-11 text-sm text-slate-200 placeholder-slate-700 outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition text-sm"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200 mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            <p className="text-center text-[11px] text-slate-700 mt-8 tracking-wide">
              © 2026 DB Skills Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;