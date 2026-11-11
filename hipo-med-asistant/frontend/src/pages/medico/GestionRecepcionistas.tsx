import { useState, useEffect } from "react";
import { Users2, UserPlus, Pencil, Trash2, User, Mail, Phone, Calendar, MapPin, CreditCard, ShieldCheck, Lock } from "lucide-react";
import api from "../../services/api";
import { pageBg, textPrimary, textMuted, accentBorder, surfaceLight } from "../../theme/colors";
import BackButton from "../../components/BackButton";

interface Recepcionista {
  id: number;
  nombre: string;
  username: string;
  email: string;
  telefono?: string;
  fecha_ingreso?: string;
  identificacion_oficial?: string;
  direccion?: string;
  rfc?: string;
  activo: boolean;
}

export default function GestionRecepcionistas() {
  const [recepcionistas, setRecepcionistas] = useState<Recepcionista[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRec, setEditingRec] = useState<Recepcionista | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    email: "",
    password: "",
    telefono: "",
    fecha_ingreso: new Date().toISOString().split('T')[0],
    identificacion_oficial: "",
    direccion: "",
    rfc: ""
  });

  const fetchRecepcionistas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/medico/recepcionistas");
      setRecepcionistas(res.data);
    } catch (err) {
      console.error("Error al obtener recepcionistas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecepcionistas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRec) {
        // En edición, si la contraseña está vacía, no la enviamos
        const dataToSave = { ...formData };
        if (!dataToSave.password) delete (dataToSave as any).password;
        
        await api.put(`/medico/recepcionistas/${editingRec.id}`, dataToSave);
      } else {
        await api.post("/medico/recepcionistas", formData);
      }
      setShowModal(false);
      setEditingRec(null);
      resetForm();
      fetchRecepcionistas();
    } catch (err: any) {
      console.error("Error al guardar recepcionista:", err);
      alert(err.response?.data?.detail || "Error al procesar la solicitud");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      username: "",
      email: "",
      password: "",
      telefono: "",
      fecha_ingreso: new Date().toISOString().split('T')[0],
      identificacion_oficial: "",
      direccion: "",
      rfc: ""
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este recepcionista?")) return;
    try {
      await api.delete(`/medico/recepcionistas/${id}`);
      fetchRecepcionistas();
    } catch (err) {
      console.error("Error al eliminar recepcionista:", err);
    }
  };

  return (
    <div className={`min-h-screen ${pageBg} p-4 sm:p-8`}>
      <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${textPrimary} flex items-center gap-3 uppercase tracking-tighter truncate`}>
              <Users2 className="text-emerald-400 shrink-0" size={28} />
              Gestión de Recepcionistas
            </h1>
            <p className={`${textMuted} text-[10px] sm:text-sm font-bold uppercase tracking-widest mt-1`}>
              Administra el personal de apoyo de tu clínica
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setEditingRec(null);
            resetForm();
            setShowModal(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 sm:py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95"
        >
          <UserPlus size={18} />
          <span>ALTA DE RECEPCIONISTA</span>
        </button>
      </header>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {recepcionistas.length === 0 ? (
            <div className="py-20 text-center rounded-[2rem] sm:rounded-[3rem] border border-dashed border-white/10 bg-white/5 px-6">
              <User className="mx-auto text-slate-700 mb-4 w-10 h-10 sm:w-12 sm:h-12" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs sm:text-sm">No tienes recepcionistas registrados aún</p>
            </div>
          ) : (
            recepcionistas.map((r) => (
              <div key={r.id} className={`p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all group`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform shrink-0`}>
                      <User className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-lg sm:text-xl font-black ${textPrimary} tracking-tight truncate`}>{r.nombre}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 mt-2">
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 font-medium">
                          <Mail className="text-indigo-400/60 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="truncate max-w-[150px] sm:max-w-none">{r.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 font-medium">
                          <ShieldCheck className="text-indigo-400/60 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Usuario:</span> <span className="text-indigo-300 font-bold">{r.username}</span>
                        </div>
                        {r.telefono && (
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 font-medium">
                            <Phone className="text-indigo-400/60 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {r.telefono}
                          </div>
                        )}
                        {r.fecha_ingreso && (
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 font-medium">
                            <Calendar className="text-indigo-400/60 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">Ingreso:</span> {new Date(r.fecha_ingreso).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
                        {r.rfc && (
                          <span className="px-2 sm:px-3 py-1 rounded-lg bg-slate-800 text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                            RFC: {r.rfc}
                          </span>
                        )}
                        {r.identificacion_oficial && (
                          <span className="px-2 sm:px-3 py-1 rounded-lg bg-slate-800 text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                            ID: {r.identificacion_oficial}
                          </span>
                        )}
                        {r.direccion && (
                          <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {r.direccion}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                    <button 
                      onClick={() => {
                        setEditingRec(r);
                        setFormData({
                          nombre: r.nombre,
                          username: r.username,
                          email: r.email,
                          password: "",
                          telefono: r.telefono || "",
                          fecha_ingreso: r.fecha_ingreso || new Date().toISOString().split('T')[0],
                          identificacion_oficial: r.identificacion_oficial || "",
                          direccion: r.direccion || "",
                          rfc: r.rfc || ""
                        });
                        setShowModal(true);
                      }}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition-all text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                      title="Editar"
                    >
                      <Pencil className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      <span className="lg:hidden">Editar</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(r.id)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-all text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      <span className="lg:hidden">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal de Formulario */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl my-auto p-6 sm:p-10 rounded-3xl sm:rounded-[3.5rem] border ${accentBorder} ${surfaceLight} shadow-2xl relative animate-in zoom-in-95 duration-200`}>
            <header className="mb-6 sm:mb-8">
              <h2 className={`text-2xl sm:text-3xl font-black ${textPrimary} uppercase tracking-tighter`}>
                {editingRec ? "Editar Recepcionista" : "Nuevo Recepcionista"}
              </h2>
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                Completa todos los campos requeridos para el acceso al sistema
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
                      placeholder="Ej. Juan Pérez García"
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
                      placeholder="juan@ejemplo.com"
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Usuario del Recepcionista</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="juan.perez"
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                    {editingRec ? "Cambiar Contraseña (Opcional)" : "Contraseña"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required={!editingRec}
                    />
                  </div>
                </div>

                {/* Telefono */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Teléfono de Contacto</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="tel" 
                      value={formData.telefono}
                      onChange={e => setFormData({...formData, telefono: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="5512345678"
                    />
                  </div>
                </div>

                {/* Fecha Ingreso */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Fecha de Ingreso</label>
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

                {/* RFC */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">RFC</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={formData.rfc}
                      onChange={e => setFormData({...formData, rfc: e.target.value.toUpperCase()})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder="RFC123456ABC"
                    />
                  </div>
                </div>

                {/* ID Oficial */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Identificación Oficial</label>
                  <input 
                    type="text" 
                    value={formData.identificacion_oficial}
                    onChange={e => setFormData({...formData, identificacion_oficial: e.target.value})}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="IFE / INE / Pasaporte"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Dirección Completa</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-500" size={18} />
                  <textarea 
                    value={formData.direccion}
                    onChange={e => setFormData({...formData, direccion: e.target.value})}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all min-h-[100px]"
                    placeholder="Calle, número, colonia, CP, ciudad..."
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-2xl border border-white/5 bg-white/5 p-5 text-xs font-black text-slate-400 hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  className="flex-1 rounded-2xl bg-indigo-600 p-5 text-xs font-black text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 transition-all active:scale-95 uppercase tracking-widest"
                >
                  {editingRec ? "GUARDAR CAMBIOS" : "REGISTRAR RECEPCIONISTA"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
