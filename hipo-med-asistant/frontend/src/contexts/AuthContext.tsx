import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "admin" | "recepcionista" | "medico" | "paciente";

export const USER_ROLES: UserRole[] = ["admin", "recepcionista", "medico", "paciente"];

export interface User {
  id: number;
  nombre: string;
  username: string;
  email: string;
  rol: UserRole;
  creado_en?: string;
  cedula_profesional?: string;
  rfc?: string;
  especialidad?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  recepcionista: "/recepcionista/dashboard",
  medico: "/medico/dashboard",
  paciente: "/paciente/dashboard",
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Normalizar rol al cargar de localStorage
        if (parsed && parsed.rol) {
          parsed.rol = parsed.rol.toLowerCase().trim();
        }
        setUser(parsed);
      } catch {
        localStorage.removeItem("usuario");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    // Normalizar rol a minúsculas y sin espacios
    const normalizedUser = {
      ...userData,
      rol: userData.rol?.toLowerCase().trim() as UserRole
    };
    
    setUser(normalizedUser);
    localStorage.setItem("usuario", JSON.stringify(normalizedUser));
    const homePath = ROLE_HOME[normalizedUser.rol] || "/dashboard";
    navigate(homePath);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
