import { useState, useEffect } from "react";
import { 
  Users2, UserPlus, Pencil, Trash2, Shield, User, Mail, 
  CheckCircle2, XCircle, Phone, MapPin, CreditCard, 
  Stethoscope, Calendar, BookOpen, Building2, AtSign, 
  Lock, ChevronDown 
} from "lucide-react";
import api from "../../services/api";
import { pageBg, textPrimary, textMuted, accentBorder, surfaceLight } from "../../theme/colors";
import BackButton from "../../components/BackButton";

interface Usuario {
  id: number;
  nombre: string;
  username: string;
  email: string;
  rol: string;
  activo: boolean;
  telefono?: string;
  direccion?: string;
  identificacion_oficial?: string;
  especialidad?: string;
  cedula_profesional?: string;
  universidad_egreso?: string;
  horario_atencion?: string;
  consultorio_pref?: string;
  fecha_ingreso?: string;
  rfc?: string;
}

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    email: "",
    password: "",
    rol: "recepcionista",
    activo: true,
    telefono: "",
    direccion: "",
    identificacion_oficial: "",
    especialidad: "",
    cedula_profesional: "",
    universidad_egreso: "",
    horario_atencion: "",
    consultorio_pref: "",
    fecha_ingreso: new Date().toISOString().split('T')[0],
    rfc: ""
  });

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/usuarios/");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const resetForm = () => {
    setFormData({
      nombre: "",
      username: "",
      email: "",
      password: "",
      rol: "recepcionista",
      activo: true,
      telefono: "",
      direccion: "",
      identificacion_oficial: "",
      especialidad: "",
      cedula_profesional: "",
      universidad_egreso: "",
      horario_atencion: "",
      consultorio_pref: "",
      fecha_ingreso: new Date().toISOString().split('T')[0],
      rfc: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = { ...formData };
      if (editingUser && !dataToSave.password) delete (dataToSave as any).password;

      if (editingUser) {
        await api.put(`/usuarios/${editingUser.id}`, dataToSave);
      } else {
        await api.post("/usuarios/", dataToSave);
      }
      setShowModal(false);
      setEditingUser(null);
      resetForm();
      fetchUsuarios();
    } catch (err: any) {
      console.error("Error al guardar usuario:", err);
      alert(err.response?.data?.detail || "Error al procesar la solicitud");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const getRolBadge = (rol: string) => {
    const roles: any = {
      admin: { label: "Administrador", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
      medico: { label: "Médico", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
      recepcionista: { label: "Recepcionista", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
      paciente: { label: "Tutor / Paciente", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
    };
    const r = roles[rol] || { label: rol, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
    return (
      <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${r.color}`}>
        {r.label}
      </span>
    );
  };

  return (
    <div className={`min-h-screen ${pageBg} p-4 sm:p-8`}>
      <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${textPrimary} flex items-center gap-3 uppercase tracking-tighter truncate`}>
              <Users2 className="text-indigo-400 shrink-0" size={28} />
              Gestión de Usuarios
            </h1>
            <p className={`${textMuted} text-[10px] sm:text-sm font-bold uppercase tracking-widest mt-1`}>
              Control centralizado de cuentas y permisos
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setEditingUser(null);
            resetForm();
            setShowModal(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 sm:py-3 text-xs sm:text-sm font-black text-white shadow-lg hover:bg-indigo-500 transition-all active:scale-95"
        >
          <UserPlus size={18} />
          <span>NUEVO USUARIO</span>
        </button>
      </header>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4">
          {usuarios.map((u) => (
            <div key={u.id} className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${u.activo ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'bg-slate-800 border border-slate-700 text-slate-500'}`}>
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-base sm:text-lg font-black ${textPrimary} tracking-tight truncate`}>{u.nombre}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 truncate max-w-[150px] sm:max-w-none">
                        <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {u.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500">
                        <AtSign className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {u.username}
                      </div>
                      <div className="shrink-0 scale-90 sm:scale-100 origin-left">
                        {getRolBadge(u.rol)}
                      </div>
                      {u.activo ? (
                        <span className="flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                          <CheckCircle2 size={10} /> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                          <XCircle size={10} /> Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                  <button 
                    onClick={() => {
                      setEditingUser(u);
                      setFormData({ 
                        ...u, 
                        password: "",
                        telefono: u.telefono || "",
                        direccion: u.direccion || "",
                        identificacion_oficial: u.identificacion_oficial || "",
                        especialidad: u.especialidad || "",
                        cedula_profesional: u.cedula_profesional || "",
                        universidad_egreso: u.universidad_egreso || "",
                        horario_atencion: u.horario_atencion || "",
                        consultorio_pref: u.consultorio_pref || "",
                        fecha_ingreso: u.fecha_ingreso || new Date().toISOString().split('T')[0],
                        rfc: u.rfc || ""
                      } as any);
                      setShowModal(true);
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-all text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                  >
                    <Pencil size={16} />
                    <span className="sm:hidden">Editar</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(u.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-all text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                  >
                    <Trash2 size={16} />
                    <span className="sm:hidden">Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Formulario */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl my-auto p-6 sm:p-10 rounded-3xl sm:rounded-[3.5rem] border ${accentBorder} ${surfaceLight} shadow-2xl relative animate-in zoom-in-95 duration-200`}>
            <header className="mb-6 sm:mb-8">
              <h2 className={`text-2xl sm:text-3xl font-black ${textPrimary} uppercase tracking-tighter`}>
                {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
              </h2>
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                Completa los datos según el rol asignado
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={formData.nombre}
                      onChange={e => setFormData({...formData, nombre: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Usuario</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, "_")})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Contraseña {editingUser && "(dejar vacío para mantener)"}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                      required={!editingUser}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Rol Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Rol Asignado</label>
                  <div className="relative group">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <select 
                      value={formData.rol}
                      onChange={e => setFormData({...formData, rol: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/50 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800/80"
                    >
                      <option value="paciente" className="bg-slate-900 text-white py-2">Tutor / Paciente</option>
                      <option value="medico" className="bg-slate-900 text-white py-2">Médico Especialista</option>
                      <option value="recepcionista" className="bg-slate-900 text-white py-2">Recepcionista / Admin Local</option>
                      <option value="admin" className="bg-slate-900 text-white py-2">Administrador del Sistema</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-white transition-colors" size={18} />
                  </div>
                </div>

                {/* Estado Toggle */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Estado de Cuenta</label>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, activo: !formData.activo})}
                    className={`w-full h-[54px] rounded-2xl border p-2 text-[10px] font-black uppercase tracking-widest transition-all ${formData.activo ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/20 bg-rose-500/10 text-rose-400'}`}
                  >
                    {formData.activo ? "CUENTA ACTIVA" : "CUENTA INACTIVA"}
                  </button>
                </div>

                {/* CAMPOS DINÁMICOS POR ROL */}
                {(formData.rol === "paciente" || formData.rol === "medico" || formData.rol === "recepcionista") && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="tel" 
                        value={formData.telefono}
                        onChange={e => setFormData({...formData, telefono: e.target.value})}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {(formData.rol === "paciente" || formData.rol === "recepcionista") && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Identificación Oficial</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          value={formData.identificacion_oficial}
                          onChange={e => setFormData({...formData, identificacion_oficial: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.rol === "medico" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Especialidad</label>
                      <div className="relative">
                        <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          value={formData.especialidad}
                          onChange={e => setFormData({...formData, especialidad: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Cédula Profesional</label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          value={formData.cedula_profesional}
                          onChange={e => setFormData({...formData, cedula_profesional: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Universidad</label>
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          value={formData.universidad_egreso}
                          onChange={e => setFormData({...formData, universidad_egreso: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Horario</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          value={formData.horario_atencion}
                          onChange={e => setFormData({...formData, horario_atencion: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Consultorio (Pref)</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          value={formData.consultorio_pref}
                          onChange={e => setFormData({...formData, consultorio_pref: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.rol === "recepcionista" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Fecha Ingreso</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="date" 
                          value={formData.fecha_ingreso}
                          onChange={e => setFormData({...formData, fecha_ingreso: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">RFC</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                          type="text" 
                          value={formData.rfc}
                          onChange={e => setFormData({...formData, rfc: e.target.value.toUpperCase()})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {(formData.rol === "paciente" || formData.rol === "recepcionista") && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Dirección Completa</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-500" size={18} />
                    <textarea 
                      value={formData.direccion}
                      onChange={e => setFormData({...formData, direccion: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all min-h-[80px]"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs font-black text-slate-400 hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  className="flex-1 rounded-2xl bg-indigo-600 p-4 text-xs font-black text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 uppercase tracking-widest"
                >
                  {editingUser ? "GUARDAR CAMBIOS" : "CREAR USUARIO"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
