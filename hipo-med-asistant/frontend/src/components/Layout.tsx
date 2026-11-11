import { useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Clock,
  Users,
  Building2,
  LogOut,
  User,
  Database,
  BarChart3,
  ShieldCheck,
  Stethoscope,
  Users2,
  ClipboardList,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import Navbar, { type NavItem } from "./Navbar";
import { accentBgSoft } from "../theme/colors";
import { useAuth, ROLE_HOME } from "../contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const rol = user?.rol?.toLowerCase().trim();

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  const navItems: NavItem[] = [];

  // Helper para verificar si estamos en una ruta específica del prefijo
  const isActive = (path: string) => location.pathname.startsWith(path);

  // ═══════════════════════════════════════════════════════════
  // NAVEGACIÓN PARA ADMINISTRADOR
  // ═══════════════════════════════════════════════════════════
  if (rol === "admin") {
    navItems.push({ 
      label: "Dashboard", 
      icon: <LayoutDashboard size={20} />, 
      onClick: () => navigate("/admin/dashboard"),
      active: isActive("/admin/dashboard")
    });
    navItems.push({
      label: "Usuarios",
      icon: <Users2 size={20} />,
      onClick: () => navigate("/admin/usuarios"),
      active: isActive("/admin/usuarios")
    });
    navItems.push({
      label: "Consultorios",
      icon: <Building2 size={20} />,
      onClick: () => navigate("/admin/consultorios"),
      active: isActive("/admin/consultorios")
    });
    navItems.push({
      label: "Citas",
      icon: <Calendar size={20} />,
      onClick: () => navigate("/cola-espera"),
      active: isActive("/cola-espera")
    });
    navItems.push({
      label: "Estadísticas",
      icon: <BarChart3 size={20} />,
      onClick: () => navigate("/admin/estadisticas"),
      active: isActive("/admin/estadisticas")
    });
    navItems.push({
      label: "Auditoría",
      icon: <ShieldCheck size={20} />,
      onClick: () => navigate("/admin/auditoria"),
      active: isActive("/admin/auditoria")
    });
    navItems.push({
      label: "Respaldos",
      icon: <Database size={20} />,
      onClick: () => navigate("/admin/backups"),
      active: isActive("/admin/backups")
    });
  }

  // ═══════════════════════════════════════════════════════════
  // NAVEGACIÓN PARA RECEPCIONISTA
  // ═══════════════════════════════════════════════════════════
  if (rol === "recepcionista") {
    navItems.push({ 
      label: "Dashboard", 
      icon: <LayoutDashboard size={20} />, 
      onClick: () => navigate("/recepcionista/dashboard"),
      active: isActive("/recepcionista/dashboard")
    });
    navItems.push({ 
      label: "Cola de Espera", 
      icon: <Clock size={20} />, 
      onClick: () => navigate("/recepcionista/cola-espera"),
      active: isActive("/recepcionista/cola-espera")
    });
    navItems.push({
      label: "Sala de Espera",
      icon: <Users size={20} />,
      onClick: () => navigate("/recepcionista/sala-espera"),
      active: isActive("/recepcionista/sala-espera")
    });
  }

  // ═══════════════════════════════════════════════════════════
  // NAVEGACIÓN PARA MÉDICO
  // ═══════════════════════════════════════════════════════════
  if (rol === "medico") {
    navItems.push({ 
      label: "Dashboard", 
      icon: <LayoutDashboard size={20} />, 
      onClick: () => navigate("/medico/dashboard"),
      active: isActive("/medico/dashboard")
    });
    navItems.push({ 
      label: "Mis Citas", 
      icon: <Stethoscope size={20} />, 
      onClick: () => navigate("/medico/mis-citas"),
      active: isActive("/medico/mis-citas")
    });
    navItems.push({ 
      label: "Recepcionistas", 
      icon: <Users2 size={20} />, 
      onClick: () => navigate("/medico/recepcionistas"),
      active: isActive("/medico/recepcionistas")
    });
  }

  // ═══════════════════════════════════════════════════════════
  // NAVEGACIÓN PARA PACIENTE / TUTOR
  // ═══════════════════════════════════════════════════════════
  if (rol === "paciente") {
    navItems.push({ 
      label: "Dashboard", 
      icon: <LayoutDashboard size={20} />, 
      onClick: () => navigate("/paciente/dashboard"),
      active: isActive("/paciente/dashboard")
    });
    navItems.push({ 
      label: "Nueva Cita", 
      icon: <Calendar size={20} />, 
      onClick: () => navigate("/seleccionar-consultorio"),
      active: isActive("/seleccionar-consultorio") || isActive("/agendar")
    });
    navItems.push({
      label: "Sala de Espera",
      icon: <Users size={20} />,
      onClick: () => navigate("/sala-espera"),
      active: isActive("/sala-espera")
    });
  }

  // ═══════════════════════════════════════════════════════════
  // ACCESO COMPARTIDO: SALA DE ESPERA (para todos excepto médico)
  // ═══════════════════════════════════════════════════════════
  if (rol !== "medico" && !navItems.some(n => n.label === "Sala de Espera")) {
    navItems.push({
      label: "Sala de Espera",
      icon: <Users size={20} />,
      onClick: () => navigate("/sala-espera"),
      highlight: true,
      active: isActive("/sala-espera")
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        logo={
          <div onClick={() => navigate(ROLE_HOME[rol as keyof typeof ROLE_HOME] || "/")} className="cursor-pointer flex items-center gap-2">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentBgSoft} text-xl`}>
              👶
            </span>
            <span>Clínica Infantil</span>
          </div>
        }
        items={navItems}
        profile={{
          label: user?.nombre || "Mi Perfil",
          icon: <User size={20} />,
          onClick: () => navigate("/perfil"),
        }}
        logout={{
          label: "Cerrar Sesión",
          icon: <LogOut size={20} />,
          onClick: handleLogout,
        }}
        mobileOpen={menuOpen}
        onMobileToggle={() => setMenuOpen(!menuOpen)}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
