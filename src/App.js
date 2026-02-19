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
import Student from "./Admin/Pages/Student";
import PremiumJob from "./Admin/Pages/Premiumjob";
import PremiumManage from "./Admin/Pages/PremiumManage";
import HrSettings from "./Admin/Pages/HrSettings";
import AdminApplications from "./Admin/Pages/AdminApplications";
 

 
function App() {
 
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
    <RoleRoute allowed={["admin", "student"]}>
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
           <Route
            path="student"
            element={
              <RoleRoute allowed={["admin"]}>
                <Student />
              </RoleRoute>
            }
          />
          <Route
  path="premium"
  element={
    <RoleRoute allowed={["admin", "student"]}>
      <PremiumJob/>
    </RoleRoute>
  }
/>
 <Route
  path="premium-manage"
  element={
    <RoleRoute allowed={["admin"]}>
      <PremiumManage/>
    </RoleRoute>
  }
/>
 <Route
  path="hr-settings"
  element={
    <RoleRoute allowed={["admin"]}>
      <HrSettings/>
    </RoleRoute>
  }
/>
 <Route
  path="applies"
  element={
    <RoleRoute allowed={["admin"]}>
      <AdminApplications/>
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
