import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  LogIn,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  UserPlus,
  ShieldCheck,
  User,
  Users,
  ClipboardList,
  X,
} from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import HeroCard from "../../components/HeroCard";
import FormCard from "../../components/FormCard";
import Splash from "../../components/Splash";
import { useAuth } from "../../contexts/AuthContext";

interface LoginProps {
  onLogin: () => void;
  onRegister: (role: string) => void;
}

function Login({ onLogin, onRegister }: LoginProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProcessSplash, setShowProcessSplash] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const roles = [
    { id: "paciente", label: "Tutor / Paciente", icon: <Users size={24} />, description: "Agenda citas para tus hijos" },
    { id: "medico", label: "Médico", icon: <Stethoscope size={24} />, description: "Gestiona tu consulta y pacientes" },
    { id: "recepcionista", label: "Recepcionista", icon: <ClipboardList size={24} />, description: "Controla la sala de espera" },
    { id: "admin", label: "Administrador", icon: <ShieldCheck size={24} />, description: "Gestión total del sistema" },
  ];

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Por favor, completa todos los campos");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await api.post("/auth/login/", { username, password });

      if (response.data.access_token && response.data.user) {
        sessionStorage.setItem("token", response.data.access_token);
        
        setMessage("🎉 ¡Login exitoso!");
        setShowProcessSplash(true);

        setTimeout(() => {
          setShowProcessSplash(false);
          login(response.data.user);
          onLogin();
        }, 1500);
      } else {
        setMessage("❌ Error al obtener información del usuario");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "❌ Credenciales incorrectas. Intenta de nuevo.";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (showProcessSplash) {
    return (
      <Splash
        title="Iniciando sesión"
        subtitle="Procesando credenciales…"
        message="Redirigiendo al panel…"
        durationMs={1500}
        onFinish={() => {}}
      />
    );
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  const inputBase =
    "w-full rounded-2xl border border-slate-700 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/70";
  const btnPrimary =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-3 text-sm font-semibold text-slate-50 shadow-lg shadow-indigo-900/50 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70";
  const btnSecondary =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100 shadow-md hover:bg-slate-800/80 transition disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <>
      <AuthLayout
        hero={
          <HeroCard
            icon={<Stethoscope size={38} />}
            title="Clínica Infantil Pro"
            subtitle="Panel clínico para hospitales pediátricos y salas de espera infantiles."
          >
            <ul className="space-y-2">
              <li>🩺 Agenda y seguimiento de citas pediátricas.</li>
              <li>📂 Expedientes clínicos organizados por paciente.</li>
              <li>🔒 Acceso seguro para personal autorizado.</li>
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Hospital pediátrico", "Sala de espera amigable", "Historias clínicas digitales"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
            <div className="flex flex-col gap-1 text-xs text-sky-100/90">
              <span>👶 Diseñado para entornos infantiles</span>
              <span>❤️ Cuidado cálido con soporte tecnológico</span>
            </div>
          </HeroCard>
        }
        form={
          <FormCard
            title="Acceso al panel clínico"
            subtitle="Inicia sesión para gestionar citas, sala de espera y expedientes de pacientes pediátricos."
            footer={
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>👶 Clínica Infantil Pro</span>
                <span>© 2025 · Acceso seguro</span>
                <span>🔒</span>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-400"
                  size={20}
                />
                <input
                  type="text"
                  className={inputBase}
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inputBase} pr-10`}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {message && (
                <div className={`p-3 rounded-xl text-sm text-center font-medium ${
                  message.includes("incorrectas") || message.includes("❌")
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {message}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className={btnPrimary}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verificando…
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Iniciar Sesión
                  </>
                )}
              </button>

              <button
                onClick={() => setShowRoleModal(true)}
                disabled={isLoading}
                className={btnSecondary}
              >
                <UserPlus size={18} />
                Crear Cuenta Nueva
              </button>
            </div>
          </FormCard>
        }
      />

      {/* Modal de Selección de Rol */}
      {showRoleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl" />

            <button 
              onClick={() => setShowRoleModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={24} />
            </button>

            <header className="text-center mb-10">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Selecciona tu Rol</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">¿Cómo deseas utilizar el sistema?</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setShowRoleModal(false);
                    onRegister(r.id);
                  }}
                  className="group flex items-start gap-4 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all text-left active:scale-95"
                >
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    {r.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tight mb-1">{r.label}</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{r.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
              Al registrarte, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
