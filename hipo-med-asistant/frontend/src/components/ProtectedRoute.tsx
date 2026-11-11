import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const userStr = localStorage.getItem("usuario");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    // Redirigir al login si no hay usuario autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Redirigir al dashboard si el rol no tiene permiso
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
