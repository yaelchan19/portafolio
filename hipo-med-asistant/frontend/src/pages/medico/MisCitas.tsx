import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  ChevronRight, 
  Search,
  Stethoscope,
  LayoutDashboard,
  Bell,
  Activity, 
  CheckCircle2, 
  CheckCircle,
  Users2, 
  ArrowRight, 
  X,
  Building2
} from "lucide-react";
import api from "../../services/api";
import BackButton from "../../components/BackButton";
import {
  pageBg,
  textPrimary,
  textMuted,
  accentBorder,
  surfaceLight,
  accentBg,
  textOnAccent,
  accentBgSoft,
} from "../../theme/colors";

interface CitaMedico {
  id: number;
  paciente_id: number;
  hora: string;
  paciente: string;
  motivo: string;
  estado: string;
  genero: string;
  edad: number;
  consultorio?: string;
}
export default function MisCitas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<CitaMedico[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState<string>(new Date().toISOString().split("T")[0]);
  
  // Estados para Notificaciones
  const [lastInProgresoIds, setLastInProgresoIds] = useState<number[]>([]);
  const [notificacion, setNotificacion] = useState<{ paciente: string; id: number } | null>(null);
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchCitas = async () => {
    try {
      const res = await api.get("/medico/mis-citas", { params: { fecha: fechaFiltro } });
      const nuevasCitas: CitaMedico[] = res.data;
      
      // Detectar nuevos ingresos a consulta
      const actualInProgreso = nuevasCitas
        .filter(c => c.estado === "En Progreso")
        .map(c => c.id);
      
      const nuevos = nuevasCitas.filter(c => 
        c.estado === "En Progreso" && !lastInProgresoIds.includes(c.id)
      );

      if (nuevos.length > 0) {
        const masReciente = nuevos[nuevos.length - 1];
        setNotificacion({ paciente: masReciente.paciente, id: masReciente.id });
        setHasNewActivity(true);
        
        // Reproducir un sonido sutil si es posible (opcional)
        // try { new Audio('/notification.mp3').play(); } catch(e) {}
        
        // Auto-cerrar notificación después de 8 segundos
        setTimeout(() => setNotificacion(null), 8000);
      }

      setLastInProgresoIds(actualInProgreso);
      setCitas(nuevasCitas);
    } catch (err) {
      console.error("Error al obtener citas del médico:", err);
    } finally {
      setLoading(false);
    }
  };

  const finalizarCita = async (citaId: number) => {
    if (loadingId) return;
    setLoadingId(citaId);
    try {
      await api.patch(`/citas/${citaId}/status/`, { estado: "Completada" });
      fetchCitas();
    } catch (err) {
      console.error("Error al finalizar cita:", err);
      alert("No se pudo finalizar la atención");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchCitas();
    const interval = setInterval(fetchCitas, 30000);
    return () => clearInterval(interval);
  }, [fechaFiltro]);

  const citasFiltradas = citas.filter(c => 
    c.paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.motivo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getEstadoStyles = (estado: string) => {
    switch (estado) {
      case "En Progreso": 
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          text: "text-amber-400",
          icon: <Activity className="animate-pulse" size={14} />
        };
      case "Registrada": 
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          text: "text-emerald-400",
          icon: <CheckCircle2 size={14} />
        };
      case "Completada": 
        return {
          bg: "bg-indigo-500/10",
          border: "border-indigo-500/20",
          text: "text-indigo-400",
          icon: <CheckCircle2 size={14} />
        };
      default: 
        return {
          bg: "bg-slate-500/10",
          border: "border-slate-500/20",
          text: "text-slate-400",
          icon: <Clock size={14} />
        };
    }
  };

  return (
    <div className={`min-h-screen ${pageBg} pb-20 overflow-x-hidden`}>
      {/* Elementos Decorativos de Fondo */}
      <div className="fixed -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      {/* Header Moderno con Glassmorphism */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/40 px-4 sm:px-6 py-4 sm:py-6 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-5">
            <BackButton />
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-indigo-500/20 rounded-lg sm:rounded-xl shrink-0">
                  <Stethoscope className="text-indigo-400" size={20} />
                </div>
                <span className="truncate">Mis Citas</span>
              </h1>
              <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] ${textMuted} mt-0.5 sm:mt-1 flex items-center gap-2`}>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="truncate">{new Date().toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex flex-col items-end px-4 border-r border-white/10">
              <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-1 flex items-center gap-1`}>
                <Calendar size={12} /> Fecha de Agenda
              </label>
              <input
                type="date"
                className="bg-transparent border-none text-sm font-bold text-white outline-none cursor-pointer [color-scheme:dark]"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
              />
            </div>
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-40 lg:w-72 rounded-2xl border border-white/10 bg-slate-900/50 py-3 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600 uppercase tracking-widest"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button 
              onClick={() => {
                fetchCitas();
                setHasNewActivity(false);
              }}
              className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all active:scale-95 relative ${
                hasNewActivity 
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400 animate-bounce" 
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Bell size={18} className={hasNewActivity ? "animate-pulse" : ""} />
              {hasNewActivity && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950 animate-ping"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 relative">
        {/* Filtro de Fecha Móvil */}
        <div className="md:hidden mb-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
          <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${textMuted} mb-3 block flex items-center gap-2`}>
            <Calendar size={14} className="text-indigo-400" /> Seleccionar Fecha
          </label>
          <input
            type="date"
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-indigo-500/50 [color-scheme:dark]"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>

        {/* KPI Cards con Diseño Elevado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Hoy", value: citas.length, icon: <Users2 size={24} />, color: "text-white", border: "border-white/10", bg: "bg-white/5" },
            { label: "En Consulta", value: citas.filter(c => c.estado === 'En Progreso').length, icon: <Activity size={24} />, color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
            { label: "Por Atender", value: citas.filter(c => c.estado === 'Registrada').length, icon: <CheckCircle2 size={24} />, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" }
          ].map((kpi, idx) => (
            <div 
              key={idx}
              className={`relative overflow-hidden rounded-[32px] border ${kpi.border} ${kpi.bg} p-8 backdrop-blur-md group hover:scale-[1.02] transition-all duration-500`}
            >
              <div className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-700">
                {kpi.icon}
              </div>
              <div className={`mb-4 inline-flex p-3 rounded-2xl ${kpi.bg} ${kpi.color} border border-white/5`}>
                {kpi.icon}
              </div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textMuted} mb-1`}>{kpi.label}</p>
              <p className={`text-5xl font-black ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
              <Stethoscope className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={32} />
            </div>
            <p className={`text-xs font-black uppercase tracking-[0.3em] ${textMuted} animate-pulse`}>Sincronizando Expedientes...</p>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[48px] border border-dashed border-white/10 bg-white/5 py-32 text-center backdrop-blur-sm">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar size={48} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Agenda despejada</h3>
            <p className={`${textMuted} mt-3 max-w-xs text-sm font-bold`}>
              No hay pacientes registrados en este momento. La lista se actualizará automáticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] ${textMuted} ml-2 mb-4 flex items-center gap-3`}>
              <div className="h-px w-8 bg-indigo-500/30"></div>
              Lista de Atención Activa
            </h2>
            
            <div className="grid gap-4 sm:gap-6">
              {citasFiltradas.map((cita, idx) => {
                const styles = getEstadoStyles(cita.estado);
                return (
                  <div 
                    key={cita.id}
                    className="group relative rounded-[2rem] sm:rounded-[40px] border border-white/5 bg-slate-900/30 p-1 sm:p-2 transition-all duration-500 hover:border-indigo-500/30 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-indigo-500/10"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-8 p-5 sm:p-8">
                      <div className="flex items-center gap-4 sm:gap-8 flex-1">
                        {/* Hora Badge Moderno */}
                        <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-[32px] bg-indigo-500/10 border border-indigo-500/20 p-3 sm:p-6 min-w-[80px] sm:min-w-[120px] shadow-inner shrink-0">
                          <Clock size={16} className="text-indigo-400 mb-1 sm:mb-2" />
                          <span className="text-sm sm:text-xl font-black text-white tabular-nums tracking-tighter">{cita.hora}</span>
                        </div>

                        {/* Info Paciente con Jerarquía */}
                        <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight truncate">
                              {cita.paciente}
                            </h3>
                            <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border text-[8px] sm:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 ${styles.bg} ${styles.border} ${styles.text}`}>
                              {styles.icon}
                              {cita.estado}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/5">
                              <User size={12} className="text-slate-500" />
                              <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider">
                                {cita.genero} · {cita.edad} años
                              </span>
                            </div>

                            {cita.consultorio && (
                              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                <Building2 size={12} className="text-indigo-400" />
                                <span className="text-[10px] sm:text-xs font-bold text-indigo-300 uppercase tracking-wider">
                                  {cita.consultorio}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-indigo-500/40 shrink-0"></div>
                              <p className="text-xs sm:text-sm font-bold text-indigo-400/90 italic tracking-wide truncate">
                                "{cita.motivo}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botones de Acción Premium */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <button
                          onClick={() => navigate(`/expediente/${cita.paciente_id}`)}
                          className="relative group/btn inline-flex items-center justify-center gap-3 sm:gap-4 rounded-xl sm:rounded-[28px] bg-white/5 border border-white/10 px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-white transition-all hover:bg-indigo-600 hover:border-indigo-500 hover:scale-105 active:scale-95 shadow-lg overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                          <FileText size={16} className="relative z-10 text-indigo-400 group-hover/btn:text-white transition-colors" />
                          <span className="relative z-10 uppercase tracking-[0.2em]">Ver Expediente</span>
                          <ArrowRight size={14} className="hidden sm:block relative z-10 text-slate-500 group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-1" />
                        </button>

                        {cita.estado === "En Progreso" && (
                          <button
                            onClick={() => finalizarCita(cita.id)}
                            disabled={loadingId === cita.id}
                            className="relative group/btn inline-flex items-center justify-center gap-3 sm:gap-4 rounded-xl sm:rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-emerald-400 transition-all hover:bg-emerald-600 hover:border-emerald-500 hover:scale-105 active:scale-95 shadow-lg overflow-hidden disabled:opacity-50"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                            <CheckCircle size={16} className="relative z-10 text-emerald-400 group-hover/btn:text-white transition-colors" />
                            <span className="relative z-10 uppercase tracking-[0.2em]">
                              {loadingId === cita.id ? "..." : "Finalizar"}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button Estilizado */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
        {/* Notificación Toast Premium */}
        {notificacion && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-500 mb-4">
            <div className="flex items-center gap-4 rounded-[28px] border border-indigo-500/30 bg-slate-900/90 p-2 pr-6 backdrop-blur-xl shadow-2xl shadow-indigo-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/40">
                <User size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Nuevo Ingreso</p>
                <p className="text-sm font-bold text-white">{notificacion.paciente}</p>
              </div>
              <button 
                onClick={() => setNotificacion(null)}
                className="ml-4 p-1 text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="group relative flex h-20 w-20 items-center justify-center rounded-[32px] bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 transition-all hover:bg-indigo-500 hover:-translate-y-2 active:scale-95"
        >
          <div className="absolute -inset-2 bg-indigo-500 rounded-[40px] blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <LayoutDashboard size={32} className="group-hover:rotate-12 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
}
