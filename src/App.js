import "./App.css";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

import Loader from "./Admin/Loader";
import Mainfol from "./Admin/Mainfol";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import LoginPage from "./Admin/LoginPage";
import Dashboard from "./Admin/Dashboard";
 
import Unauthorized from "./Unauthorized";
 
import ServerDown from "./ServerDown";
import Globaljob from "./Admin/Pages/Globaljob";
 

const HEALTH_URL =
  "https://astrometric-kris-additionally.ngrok-free.dev/api/health";

function App() {
  const [checking, setChecking] = useState(true);
  const [serverDown, setServerDown] = useState(false);

  // ✅ REAL SERVER CHECK (runs on refresh)
  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(HEALTH_URL, { timeout: 5000 });
        setServerDown(false);
      } catch (error) {
        setServerDown(true);
      } finally {
        setChecking(false);
      }
    };

    checkServer();
  }, []);

  // ⏳ While checking server
  if (checking) {
    return <Loader />;
  }

   if (serverDown) {
    return <ServerDown />;
  }

   return (
    <BrowserRouter>
      <Loader />

      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Mainfol />
            </ProtectedRoute>
          }
        >
          <Route
            path="dash"
            element={
              <RoleRoute allowed={["admin"]}>
                <Dashboard />
              </RoleRoute>
            }
          />
    <Route
            path="global"
            element={
              <RoleRoute allowed={["admin"]}>
                <Globaljob />
              </RoleRoute>
            }
          />
        </Route>

        {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
