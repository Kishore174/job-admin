import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginicon from "../Assets/logo.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { loginUser } from "../Api/authApi";  // your login API
import { adminLogin } from "../Api/adminApi";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await adminLogin({
      username: email,
      password: password,
    });

  if (res.success) {
  toast.success("Login Successful");

  localStorage.setItem("token", res.token);

  navigate("/dash");
    } else {
      toast.error(res.message || "Login failed");
    }

  } catch (err) {
    toast.error(err.message || "Login Error");
  }
};

return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2BB5CE] to-[#6ee4f8] p-4">
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">        
         <div className="hidden md:flex justify-center items-center bg-white p-10 w-1/2">
          <img
            src={loginicon}
            className="w-80 h-80 object-contain"
            alt="logo"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-[#2BB5CE]">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-6">
            Login to access your dashboard
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div>
              <label className="text-gray-700 font-medium">Username</label>
              <input
                type="text"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2BB5CE] focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Password</label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2BB5CE] focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span
                  className="absolute right-4 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                > 
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2BB5CE] hover:bg-[#229fb5] text-white font-semibold py-3 rounded-xl transition-all shadow-md"
            >
              Login
            </button>
            

            <p className="text-center text-gray-500 text-sm mt-2">
              © DB Skills Portal
            </p>
            
          </form>
          
        </div>

      </div>
      
    </div>
);
  
};
export default LoginPage;
