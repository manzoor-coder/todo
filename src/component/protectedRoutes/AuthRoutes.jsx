import React, { useEffect, useState, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Authcontext } from '../../context/Authcontext';

const AuthRoutes = ({ children }) => {
  const { loading, user } = useContext(Authcontext);

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  if (user) {
    return <Navigate to="/todo" />;  // ✅ return is necessary
  }

  return children;
};

export default AuthRoutes;
