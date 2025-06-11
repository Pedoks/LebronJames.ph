import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedTypes = [] }) => {
  const token = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user type is allowed (if specific types are required)
  if (allowedTypes.length > 0 && !allowedTypes.includes(userType)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;