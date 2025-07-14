import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Authcontext } from '../../context/Authcontext';

const ProtectedRoutes = ({ children }) => {
  const { loading, user } = useContext(Authcontext);

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (user) {
    return children; 
  }

  return <Navigate to="/login" />; 
};

export default ProtectedRoutes;
