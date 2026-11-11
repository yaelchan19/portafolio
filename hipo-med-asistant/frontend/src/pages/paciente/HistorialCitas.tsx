import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  History,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { pageBg, textPrimary, textMuted, surfaceLight, accentBorder } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

interface HistorialCita {
  id: number;
  fecha: string;
  hora: string;
  dia: string;
  paciente: string;
  tutor: string;
  motivo: string;
  medico: string;
  estado: string;
  expediente: Array<{
    tipo: string;
    descripcion: string;
    procedimientos: string;
  }>;
}

export default function HistorialCitas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [historialCitas, setHistorialCitas] = useState<HistorialCita[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCita, setExpandedCita] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  // Estados para el Modal Moderno
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistorial = () => {
    if (user?.email) {
      api.get(`/citas/historial?email=${user.email}`)
        .then(res => setHistorialCitas(res.data))
        .catch(err => console.error("Error fetching history:", err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, [user]);

  const handleDeleteHistorial = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/citas/historial?email=${user?.email}`);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      fetchHistorial();
      
      // Auto cerrar modal de éxito
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (err) {
      console.error("Error al eliminar historial:", err);
      alert("Hubo un error al intentar eliminar el historial.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr + 'T12:00:00');
    return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const filteredCitas = historialCitas.filter(cita => {
    const matchesSearch = 
      cita.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || cita.fecha === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className={`min-h-screen ${pageBg} p-4 md:p-8`}>
      <main className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className={`text-3xl md:text-4xl font-black ${textPrimary} flex items-center gap-3 uppercase tracking-tighter`}>
                <History className="text-indigo-400" size={36} />
                Mi Historial Médico
              </h1>
              <p className={`${textMuted} text-sm font-bold uppercase tracking-widest mt-2`}>
                Consulta el registro detallado de todas tus visitas anteriores
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex flex-col items-end px-4 border-r border-white/10 hidden md:flex">
                <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-1 flex items-center gap-1`}>
                  <Calendar size={12} /> Filtrar por Fecha
                </label>
                <input
                  type="date"
                  className="bg-transparent border-none text-sm font-bold text-white outline-none cursor-pointer [color-scheme:dark]"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setShowConfirmModal(true)}
                disabled={loading || historialCitas.length === 0}
                className="flex items-center gap-2 px-6 py-4 bg-rose-600/10 border border-rose-500/20 text-rose-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                Borrar Historial
              </button>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar por paciente, médico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Filtro Móvil */}
        <div className="md:hidden mb-6 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
          <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-2 block`}>
            Seleccionar Fecha
          </label>
          <input
            type="date"
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none [color-scheme:dark]"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Listado */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredCitas.length === 0 ? (
            <div className={`${surfaceLight} p-20 rounded-[3rem] text-center border-2 border-dashed border-white/5`}>
              <ClipboardList size={64} className="mx-auto text-slate-700 mb-6" />
              <p className={`${textMuted} font-black uppercase tracking-[0.2em] text-sm`}>
                {searchTerm ? "No se encontraron citas con ese criterio" : "Aún no tienes un historial de citas registrado"}
              </p>
            </div>
          ) : (
            filteredCitas.map((cita) => (
              <div key={cita.id} className={`${surfaceLight} rounded-[2.5rem] border border-white/5 overflow-hidden transition-all hover:border-indigo-500/30 group`}>
                <div className="p-8 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      cita.estado === 'Completada' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      cita.estado === 'Cancelada' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                      'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      <Calendar size={32} />
                    </div>
                    <div>
                      <h4 className={`font-black ${textPrimary} text-xl tracking-tight`}>{formatFecha(cita.fecha)}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{cita.dia} · {cita.hora}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-700 hidden md:block" />
                        <span className="text-xs text-indigo-400 font-black uppercase tracking-widest">{cita.paciente}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${
                      cita.estado === 'Completada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      cita.estado === 'Cancelada' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {cita.estado}
                    </span>
                    <button 
                      onClick={() => setExpandedCita(expandedCita === cita.id ? null : cita.id)}
                      className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                      {expandedCita === cita.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>
                </div>
                
                {expandedCita === cita.id && (
                  <div className="px-8 pb-8 pt-2 border-t border-white/5 bg-white/[0.02] animate-in slide-in-from-top-2 duration-300">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Motivo de la Cita</p>
                          <p className={`${textPrimary} text-base font-medium bg-white/5 p-4 rounded-2xl border border-white/5`}>{cita.motivo}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Médico que Atendió</p>
                            <p className={`${textPrimary} text-sm font-bold`}>{cita.medico}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Responsable / Tutor</p>
                            <p className={`${textPrimary} text-sm font-bold`}>{cita.tutor}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                          <ClipboardList size={14} />
                          Detalle del Expediente Médico
                        </p>
                        {cita.expediente.length > 0 ? (
                          <div className="space-y-3">
                            {cita.expediente.map((e, idx) => (
                              <div key={idx} className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">{e.tipo}</p>
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">{e.procedimientos}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 rounded-[2rem] bg-white/5 border border-dashed border-white/10 text-center">
                            <p className="text-xs text-slate-500 italic font-medium">No se registraron notas adicionales en esta consulta.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal de Confirmación de Borrado */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-5 rounded-3xl bg-rose-500/10 text-rose-400 ring-4 ring-rose-500/5">
                <AlertTriangle size={48} />
              </div>
              
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
                ¿Borrar Historial?
              </h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
                Estás a punto de eliminar permanentemente todo tu historial de citas. Esta acción no se puede deshacer.
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={handleDeleteHistorial}
                  disabled={isDeleting}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20 active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? "Borrando..." : "SÍ, ELIMINAR TODO"}
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isDeleting}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito al Borrar */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 text-center">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            
            <div className="flex flex-col items-center">
              <div className="mb-6 p-5 rounded-3xl bg-emerald-500/10 text-emerald-400 ring-4 ring-emerald-500/5">
                <CheckCircle size={48} />
              </div>
              
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
                ¡Historial Borrado!
              </h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
                Todo tu historial de citas ha sido eliminado correctamente del sistema.
              </p>
              
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
