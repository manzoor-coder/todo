import React from "react";
import { Routes, Route } from 'react-router-dom';
import Todo from "./Todo";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import ProtectedRoutes from "./component/protectedRoutes/ProtectedRoutes";
import AuthRoutes from "./component/protectedRoutes/AuthRoutes";
import { AuthcontextProvider } from "./context/Authcontext";

function App() {
  return (
   <AuthcontextProvider>
     <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<AuthRoutes><Login /></AuthRoutes>} />

      {/* Protected Routes */}
      <Route
        path="/todo"
        element={
          <ProtectedRoutes>
            <Todo />
          </ProtectedRoutes>
        }
      />
    </Routes>
   </AuthcontextProvider>
  );
}

export default App;
