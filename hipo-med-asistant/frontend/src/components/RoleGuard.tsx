import type { FC } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../contexts/AuthContext";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const RoleGuard: FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRol = user.rol?.toLowerCase().trim();
  const isAllowed = allowedRoles.some(role => role.toLowerCase().trim() === userRol);

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
