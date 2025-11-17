import React from 'react';
import { Navigate } from 'react-router-dom';
// Removed import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const storedUser = localStorage.getItem('user');
  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage in AdminRoute", error);
    }
  }

  const isAdmin = user && user.role === 'administrator';

  if (!user || !isAdmin) {
    // Redirect to login page if not authenticated or not an admin
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
