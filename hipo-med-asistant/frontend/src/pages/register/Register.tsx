import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import { AxiosError } from "axios";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  AtSign,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  BookOpen,
  Building2,
  Stethoscope as DoctorIcon,
} from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import HeroCard from "../../components/HeroCard";
import FormCard from "../../components/FormCard";
import Splash from "../../components/Splash";

interface RegisterProps {
  onBack: () => void;
}

function Register({ onBack }: RegisterProps) {
  const location = useLocation();
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(location.state?.role || "paciente");
  
  // Campos dinámicos
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [cedula, setCedula] = useState("");
  const [universidad, setUniversidad] = useState("");
  const [horario, setHorario] = useState("");
  const [consultorio, setConsultorio] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().split('T')[0]);
  const [rfc, setRfc] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showProcessSplash, setShowProcessSplash] = useState(false);

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const validatePassword = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  const handleRegister = async () => {
    if (!nombre || !username || !email || !password) {
      setMessage("Completa todos los campos");
      setMessageType("error");
      return;
    }
    if (passwordStrength < 50) {
      setMessage("La contraseña es demasiado débil. Usa mayúsculas, números y caracteres especiales.");
      setMessageType("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Ingresa un correo electrónico válido");
      setMessageType("error");
      return;
    }
    setIsLoading(true);
    setMessage("");
    setMessageType("");
    try {
      const payload = {
        nombre,
        username,
        email,
        password,
        rol: role,
        telefono,
        direccion,
        identificacion_oficial: identificacion,
        especialidad,
        cedula_profesional: cedula,
        universidad_egreso: universidad,
        horario_atencion: horario,
        consultorio_pref: consultorio,
        fecha_ingreso: fechaIngreso,
        rfc
      };
      const response = await api.post("/auth/register/", payload);
      setMessage(response.data.message || "¡Cuenta creada! Redirigiendo al inicio de sesión…");
      setMessageType("success");
      setShowProcessSplash(true);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const detail = error.response?.data?.detail;
        setMessage(
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(" ") || "Error al registrar"
              : "Error al registrar. Intenta de nuevo."
        );
      } else {
        setMessage("Error inesperado. Intenta de nuevo.");
      }
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister();
  };

  if (showProcessSplash) {
    return (
      <Splash
        title="¡Cuenta creada!"
        subtitle="Registro completado correctamente."
        message="Redirigiendo al inicio de sesión…"
        durationMs={1800}
        onFinish={() => {
          setShowProcessSplash(false);
          onBack();
        }}
      />
    );
  }

  const strengthColor =
    passwordStrength >= 75 ? "bg-emerald-500" : passwordStrength >= 50 ? "bg-amber-500" : "bg-rose-500";

  const inputBase =
    "w-full rounded-2xl border border-slate-700 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/70";

  return (
    <AuthLayout
      hero={
        <HeroCard
          icon={<UserPlus size={38} />}
          title="Crear cuenta"
          subtitle="Únete al equipo de Clínica Infantil Pro y gestiona citas y expedientes."
          footer={
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <ArrowLeft size={18} />
              Volver al login
            </button>
          }
        >
          <ul className="space-y-2">
            <li>👤 Una cuenta para todo el personal autorizado.</li>
            <li>📧 Usa tu correo institucional para registrarte.</li>
            <li>🔐 Contraseña segura con mayúsculas, números y símbolos.</li>
          </ul>
          <p className="text-xs text-sky-100/80">
            Si ya tienes cuenta, inicia sesión desde la pantalla de login.
          </p>
        </HeroCard>
      }
      form={
        <FormCard
          title="Nueva cuenta"
          subtitle="Completa los datos para acceder al panel clínico."
          footer={
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>👶 Clínica Infantil Pro</span>
              <span>© 2025</span>
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
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <AtSign
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-400"
                size={20}
              />
              <input
                type="text"
                className={inputBase}
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-400"
                size={20}
              />
              <input
                type="email"
                className={inputBase}
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <ShieldCheck
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-400"
                size={20}
              />
              <select
                className={`${inputBase} appearance-none bg-slate-800/50 cursor-not-allowed opacity-80`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={true}
              >
                <option value="paciente">Tutor / Paciente</option>
                <option value="medico">Médico</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Lock size={14} className="text-slate-500" />
              </div>
            </div>

            {/* CAMPOS DINÁMICOS POR ROL */}
            {(role === "paciente" || role === "medico" || role === "recepcionista") && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                <input
                  type="tel"
                  className={inputBase}
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            {(role === "paciente" || role === "recepcionista") && (
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-sky-400" size={20} />
                <textarea
                  className={`${inputBase} min-h-[80px] pt-2`}
                  placeholder="Dirección completa"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            {(role === "paciente" || role === "recepcionista") && (
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                <input
                  type="text"
                  className={inputBase}
                  placeholder="Identificación Oficial (INE/Pasaporte)"
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            {role === "medico" && (
              <>
                <div className="relative">
                  <DoctorIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                  <input
                    type="text"
                    className={inputBase}
                    placeholder="Especialidad"
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                  <input
                    type="text"
                    className={inputBase}
                    placeholder="Cédula Profesional"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                  <input
                    type="text"
                    className={inputBase}
                    placeholder="Universidad de egreso"
                    value={universidad}
                    onChange={(e) => setUniversidad(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                  <input
                    type="text"
                    className={inputBase}
                    placeholder="Horario de atención (Ej. 9:00 - 18:00)"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                  <input
                    type="text"
                    className={inputBase}
                    placeholder="Consultorio (Opcional)"
                    value={consultorio}
                    onChange={(e) => setConsultorio(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {role === "recepcionista" && (
              <>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                  <input
                    type="date"
                    className={inputBase}
                    placeholder="Fecha de ingreso"
                    value={fechaIngreso}
                    onChange={(e) => setFechaIngreso(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                  <input
                    type="text"
                    className={inputBase}
                    placeholder="RFC"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase())}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
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
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-300 hover:bg-slate-800/80 hover:text-slate-50 disabled:opacity-60"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {passwordStrength >= 75
                      ? "Contraseña fuerte"
                      : passwordStrength >= 50
                        ? "Contraseña media"
                        : passwordStrength >= 25
                          ? "Contraseña débil"
                          : "Muy débil — añade mayúsculas, números y símbolos"}
                  </p>
                </div>
              )}
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-sm text-center font-medium ${
                messageType === "success" 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}>
                {message}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-3 text-sm font-semibold text-slate-50 shadow-lg shadow-indigo-900/50 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creando cuenta…
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Crear Cuenta
                </>
              )}
            </button>

            <button
              onClick={onBack}
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-600 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100 shadow-md hover:bg-slate-800/80 transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              <ArrowLeft size={18} />
              Volver al Login
            </button>
          </div>
        </FormCard>
      }
    />
  );
}

export default Register;
