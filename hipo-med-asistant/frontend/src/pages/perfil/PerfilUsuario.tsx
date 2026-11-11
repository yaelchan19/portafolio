import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Key,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCircle2,
  Calendar,
  Stethoscope,
  Baby,
  Activity,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";
import { useAuth, type UserRole } from "../../contexts/AuthContext";
import api from "../../services/api";
import BackButton from "../../components/BackButton";
import { 
  pageBg, 
  surfaceLight, 
  textPrimary, 
  textMuted, 
  accentBorder, 
  accentBgSoft 
} from "../../theme/colors";

function StatCard({ label, value, icon, color }: { label: string, value: any, icon: any, color: string }) {
  const colors: Record<string, string> = {
    sky: "from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/20",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
    rose: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20",
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/20",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-3xl p-5 flex flex-col gap-3 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-xl bg-slate-950/50">
          {icon}
        </div>
        <span className="text-2xl font-black tracking-tighter">{value ?? 0}</span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</span>
    </div>
  );
}

export default function PerfilUsuario() {
  const { user, logout, login } = useAuth();
  
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [rol, setRol] = useState<UserRole>((user?.rol as UserRole) || "paciente");
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [message, setMessage] = useState({ text: "", type: "" as "success" | "error" | "" });
  const [isSaving, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Cargar estadísticas según el rol
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        let endpoint = "";
        if (user.rol === "medico") endpoint = "/medico/stats";
        else if (user.rol === "recepcionista") endpoint = "/cola/stats";
        
        if (endpoint) {
          const res = await api.get(endpoint);
          setStats(res.data);
        }
      } catch (err) {
        console.error("Error fetching profile stats:", err);
      }
    };
    fetchStats();
  }, [user]);

  // Sincronizar con el usuario del contexto si cambia
  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setEmail(user.email);
      setRol(user.rol as UserRole);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (!user?.email) throw new Error("Sesión no válida");

      const response = await api.put(`/auth/update-profile/${user.email}`, { 
        nombre, 
        email, 
        rol: user.rol === 'admin' ? rol : user.rol // Solo admin cambia roles
      });

      login(response.data.user); // Actualiza contexto y localStorage
      setMessage({ text: "¡Perfil actualizado con éxito!", type: "success" });
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Error al actualizar el perfil. Intenta de nuevo.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden", type: "error" });
      return;
    }
    
    setIsLoading(true);
    try {
      if (!user?.email) throw new Error("Sesión no válida");

      await api.put(`/auth/update-password/${user.email}`, { 
        current_password: oldPassword, 
        new_password: newPassword 
      });

      setMessage({ text: "Contraseña cambiada exitosamente", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Error al cambiar la contraseña";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = () => {
    if (!user?.rol) return <UserCircle2 className="text-slate-400" size={48} />;
    
    switch (user.rol) {
      case "admin": return <Shield className="text-indigo-400" size={48} />;
      case "medico": return <Stethoscope className="text-sky-400" size={48} />;
      case "recepcionista": return <Calendar className="text-emerald-400" size={48} />;
      case "paciente": return <Baby className="text-rose-400" size={48} />;
      default: return <UserCircle2 className="text-slate-400" size={48} />;
    }
  };

  const infoItems = [
    { 
      label: "Nombre Completo", 
      icon: <User size={18} />, 
      value: nombre, 
      setter: (val: string) => setNombre(val),
      type: "text"
    },
    { 
      label: "Correo Electrónico", 
      icon: <Mail size={18} />, 
      value: email, 
      setter: (val: string) => setEmail(val),
      type: "email"
    },
    { 
      label: "Rol del Sistema", 
      icon: <Shield size={18} />, 
      value: rol, 
      setter: (val: string) => setRol(val as UserRole),
      type: "select",
      options: ["admin", "recepcionista", "medico", "paciente"],
      disabled: user?.rol !== "admin" // Solo admin cambia roles
    },
  ];

  return (
    <div className={`min-h-screen ${pageBg} p-4 sm:p-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <BackButton />
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${textMuted}`}>Mi Perfil de Usuario</span>
        </div>
        {/* Header Perfil */}
        <div className={`${surfaceLight} border ${accentBorder} rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-8 opacity-5 hidden sm:block">
            {getRoleIcon()}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
            <div className={`h-24 w-24 sm:h-32 sm:w-32 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-sky-500 p-1 shadow-2xl shadow-indigo-500/20`}>
              <div className="h-full w-full rounded-[1.8rem] sm:rounded-[2.3rem] bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl font-black text-white">
                {user?.nombre?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className={`text-2xl sm:text-4xl font-black ${textPrimary} uppercase tracking-tighter mb-2 sm:mb-3 truncate max-w-[300px] sm:max-w-none`}>
                {user?.nombre}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
                <span className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] sm:text-sm font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 shadow-lg shadow-indigo-500/5`}>
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {user?.rol === 'medico' ? 'Médico' : 
                   user?.rol === 'recepcionista' ? 'Recepción' : 
                   user?.rol === 'admin' ? 'Administrador' : 'Paciente'}
                  {user?.rol === 'medico' && user?.cedula_profesional && (
                    <span className="ml-1 opacity-60 font-medium">#{user.cedula_profesional}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 flex items-center gap-3 p-4 rounded-2xl border ${
            message.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold uppercase tracking-wide">{message.text}</p>
          </div>
        )}

        {/* Resumen de Actividad por Rol */}
        {stats && (user?.rol === 'medico' || user?.rol === 'recepcionista') && (
          <div className="mb-8">
            <h2 className={`text-lg sm:text-xl font-black ${textPrimary} uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-3`}>
              <TrendingUp className="text-sky-400" size={20} />
              Resumen de Actividad
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {user.rol === 'medico' && (
                <>
                  <StatCard label="Citas Hoy" value={stats.citas_programadas} icon={<Calendar size={18} />} color="sky" />
                  <StatCard label="Atendidos" value={stats.atendidos} icon={<CheckCircle2 size={18} />} color="emerald" />
                  <StatCard label="Pendientes" value={stats.pendientes} icon={<Clock size={18} />} color="amber" />
                  <StatCard label="Urgencias" value={stats.urgencias} icon={<AlertCircle size={18} />} color="rose" />
                </>
              )}
              {user.rol === 'recepcionista' && (
                <>
                  <StatCard label="En Espera" value={stats.en_espera} icon={<Users size={18} />} color="indigo" />
                  <StatCard label="Citas Hoy" value={stats.citas_hoy} icon={<Calendar size={18} />} color="sky" />
                  <StatCard label="Nuevos" value={stats.nuevos_registros} icon={<UserCircle2 size={18} />} color="emerald" />
                  <StatCard label="Pagos" value={stats.pendientes_pago} icon={<Activity size={18} />} color="rose" />
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información General */}
          <div className={`${surfaceLight} border ${accentBorder} rounded-[2rem] p-8 shadow-lg`}>
            <h2 className={`text-xl font-black ${textPrimary} uppercase tracking-widest mb-8 flex items-center gap-3`}>
              <UserCircle2 className="text-indigo-400" />
              Datos Generales
            </h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {infoItems.map((item, idx) => (
                <div key={idx}>
                  <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ${textMuted} mb-2 ml-1`}>
                    {item.label}
                  </label>
                  <div className="relative group">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted} group-focus-within:text-indigo-400 transition-colors`}>
                      {item.icon}
                    </div>
                    {item.type === "select" ? (
                      <select
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        disabled={item.disabled}
                        className={`w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold ${textPrimary} focus:border-indigo-500 outline-none transition-all disabled:opacity-50 appearance-none`}
                      >
                        {item.options?.map(opt => (
                          <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={item.type}
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className={`w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold ${textPrimary} focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700`}
                        placeholder={`Ingresa tu ${item.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <Save size={20} />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>

          {/* Seguridad / Contraseña */}
          <div className="space-y-8">
            <div className={`${surfaceLight} border ${accentBorder} rounded-[2rem] p-8 shadow-lg`}>
              <h2 className={`text-xl font-black ${textPrimary} uppercase tracking-widest mb-8 flex items-center gap-3`}>
                <Key className="text-amber-400" />
                Seguridad
              </h2>
              
              <form onSubmit={handleChangePassword} className="space-y-6">
                {[
                  { label: "Contraseña Actual", val: oldPassword, set: setOldPassword, show: showOldPass, setShow: setShowOldPass },
                  { label: "Nueva Contraseña", val: newPassword, set: setNewPassword, show: showNewPass, setShow: setShowNewPass },
                  { label: "Confirmar Nueva", val: confirmPassword, set: setConfirmPassword, show: showConfirmPass, setShow: setShowConfirmPass }
                ].map((pass, idx) => (
                  <div key={idx}>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ${textMuted} mb-2 ml-1`}>
                      {pass.label}
                    </label>
                    <div className="relative">
                      <input
                        type={pass.show ? "text" : "password"}
                        value={pass.val}
                        onChange={(e) => pass.set(e.target.value)}
                        className={`w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold ${textPrimary} focus:border-amber-500 outline-none transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => pass.setShow(!pass.show)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${textMuted} hover:text-amber-400 transition-colors`}
                      >
                        {pass.show ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="submit"
                  className="w-full py-4 bg-amber-600/10 border border-amber-600/20 hover:bg-amber-600 text-amber-500 hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Cambiar Contraseña
                </button>
              </form>
            </div>

            {/* Cerrar Sesión */}
            <div className={`${surfaceLight} border border-rose-500/20 rounded-[2rem] p-8 shadow-lg`}>
              <h3 className={`text-lg font-black ${textPrimary} uppercase mb-4`}>¿Deseas salir?</h3>
              <p className={`${textMuted} text-sm font-bold mb-6`}>Tu sesión se cerrará de forma segura en este dispositivo.</p>
              <button
                onClick={logout}
                className="w-full py-4 bg-rose-500 hover:bg-rose-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

