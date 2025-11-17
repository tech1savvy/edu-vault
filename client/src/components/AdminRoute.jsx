import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="text-center mt-8">Loading authentication...</div>;
  }

  if (!user || !isAdmin) {
    // Redirect to login page if not authenticated or not an admin
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
