import { type ReactNode } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import MedicoDashboard from "../pages/dashboard/MedicoDashboard";
import RecepcionistaDashboard from "../pages/dashboard/RecepcionistaDashboard";
import PacienteDashboard from "../pages/dashboard/PacienteDashboard";
import MisMedicos from "../pages/paciente/MisMedicos";
import HistorialCitas from "../pages/paciente/HistorialCitas";
import AgendarCita from "../pages/agenda/AgendarCita";
import SeleccionarConsultorio from "../pages/agenda/SeleccionarConsultorio";
import ConfirmarCita from "../pages/confirmar/ConfirmarCita";
import ColaEspera from "../pages/cola/ColaEspera";
import SalaEspera from "../pages/sala/SalaEspera";
import ExpedientePaciente from "../pages/expediente/ExpedientePaciente";
import SeleccionConsultorio from "../pages/consultorio/SeleccionConsultorio";
import PerfilUsuario from "../pages/perfil/PerfilUsuario";
import GestionBackups from "../pages/backups/GestionBackups";
import MisCitas from "../pages/medico/MisCitas";
import PacientesAtendidos from "../pages/medico/PacientesAtendidos";
import GestionRecepcionistas from "../pages/medico/GestionRecepcionistas";
import Analytics from "../pages/analytics/Analytics";
import Auditoria from "../pages/auditoria/Auditoria";
import GestionUsuarios from "../pages/usuarios/GestionUsuarios";
import Layout from "../components/Layout";
import RoleGuard from "../components/RoleGuard";
import { useAuth, ROLE_HOME, type UserRole } from "../contexts/AuthContext";

export default function AppRoutes() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const withLayout = (element: ReactNode, allowedRoles?: UserRole[]) => {
    const content = (
      <Layout onLogout={logout}>{element}</Layout>
    );
    
    if (allowedRoles) {
      return (
        <RoleGuard allowedRoles={allowedRoles}>
          {content}
        </RoleGuard>
      );
    }
    
    return content;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Login
              onLogin={() => {}}
              onRegister={(role) => navigate("/register", { state: { role } })}
            />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Register onBack={() => navigate("/login")} />
        }
      />

      {/* Ruta raíz - redirige según rol */}
      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            <Navigate to={ROLE_HOME[user.rol] || "/dashboard"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DASHBOARDS POR ROL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route
        path="/admin/dashboard"
        element={withLayout(<Dashboard onLogout={logout} />, ["admin"])}
      />
      <Route
        path="/medico/dashboard"
        element={withLayout(<MedicoDashboard />, ["medico"])}
      />
      <Route
        path="/recepcionista/dashboard"
        element={withLayout(<RecepcionistaDashboard />, ["recepcionista"])}
      />
      <Route
        path="/paciente/dashboard"
        element={withLayout(<PacienteDashboard />, ["paciente"])}
      />
      <Route
        path="/paciente/mis-medicos"
        element={withLayout(<MisMedicos />, ["paciente"])}
      />
      <Route
        path="/paciente/historial"
        element={withLayout(<HistorialCitas />, ["paciente"])}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RUTAS DE ADMINISTRADOR */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route
        path="/admin/usuarios"
        element={withLayout(<GestionUsuarios />, ["admin"])}
      />
      <Route
        path="/admin/consultorios"
        element={withLayout(<SeleccionConsultorio />, ["admin"])}
      />
      <Route
        path="/admin/estadisticas"
        element={withLayout(<Analytics />, ["admin"])}
      />
      <Route
        path="/admin/auditoria"
        element={withLayout(<Auditoria />, ["admin"])}
      />
      <Route
        path="/admin/backups"
        element={withLayout(<GestionBackups />, ["admin"])}
      />
      <Route
        path="/admin/perfil"
        element={withLayout(<PerfilUsuario />, ["admin"])}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RUTA DE PERFIL (ACCESIBLE PARA TODOS) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route
        path="/perfil"
        element={withLayout(<PerfilUsuario />, ["admin", "medico", "recepcionista", "paciente"])}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RUTAS DE RECEPCIONISTA */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route
        path="/recepcionista/cola-espera"
        element={withLayout(<ColaEspera />, ["recepcionista"])}
      />
      <Route
        path="/recepcionista/sala-espera"
        element={withLayout(<SalaEspera />, ["recepcionista"])}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RUTAS DE MÉDICO */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route
        path="/medico/mis-citas"
        element={withLayout(<MisCitas />, ["medico"])}
      />
      <Route
        path="/medico/pacientes-atendidos"
        element={withLayout(<PacientesAtendidos />, ["medico"])}
      />
      <Route
        path="/medico/recepcionistas"
        element={withLayout(<GestionRecepcionistas />, ["medico"])}
      />
      <Route
        path="/medico/expediente/:id"
        element={withLayout(<ExpedientePaciente />, ["medico"])}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RUTAS DE PACIENTE / TUTOR */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route
        path="/seleccionar-consultorio"
        element={withLayout(<SeleccionarConsultorio />, ["paciente"])}
      />
      <Route
        path="/agendar-cita"
        element={withLayout(<AgendarCita />, ["paciente"])}
      />
      <Route
        path="/confirmar-cita"
        element={withLayout(<ConfirmarCita />, ["paciente"])}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RUTAS COMPARTIDAS (MÚLTIPLES ROLES) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route
        path="/expediente/:id"
        element={withLayout(<ExpedientePaciente />, ["admin", "medico", "recepcionista"])}
      />
      <Route
        path="/sala-espera"
        element={withLayout(<SalaEspera />, ["admin", "recepcionista", "paciente"])}
      />
      <Route
        path="/cola-espera"
        element={withLayout(<ColaEspera />, ["admin", "recepcionista"])}
      />
      <Route
        path="/mis-citas"
        element={withLayout(<MisCitas />, ["admin", "medico"])}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RUTA DE ACCESO NO AUTORIZADO */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
            <div className="text-center">
              <h1 className="text-4xl font-black mb-4">403</h1>
              <p className="text-xl mb-6">No tienes permisos para acceder a esta página.</p>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition"
              >
                Volver al Login
              </button>
            </div>
          </div>
        }
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RUTA DEFAULT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
