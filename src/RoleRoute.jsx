import React from "react";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, allowed }) => {
  const role = localStorage.getItem("role");

  if (!allowed.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
