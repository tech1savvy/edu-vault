import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Guards routes that require a logged-in student (or administrator).
 */
const StudentRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      /* ignore */
    }
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default StudentRoute;
