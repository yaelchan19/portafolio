import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  FileText, 
  UserCheck, 
  X, 
  Stethoscope, 
  CheckCircle,
  Search,
  Calendar,
  Filter,
  Users,
  Clock,
  LayoutDashboard,
  ShieldCheck,
  AlertCircle,
  Bell,
  BellRing,
  Check,
  Info,
  Plus,
  AlertTriangle
} from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import BackButton from "../../components/BackButton";
import {
  pageBg,
  textPrimary,
  textMuted,
  textOnAccent,
  accentBorder,
  surfaceLight,
  accentFocus,
  accentBg,
  danger,
  accentBgSoft,
} from "../../theme/colors";

interface Cita {
  id: number;
  paciente_id: number;
  hora: string;
  paciente: string;
  genero: "Masculino" | "Femenino" | "Otro";
  edad: number;
  motivo: string;
  estado: "Programada" | "Registrada" | "En Progreso" | "Completada" | "Cancelada";
  tutor: string;
  email: string;
  telefono: string;
  created_at: string;
  consultorio?: string;
}

const ESTADOS: Cita["estado"][] = ["Programada", "Registrada", "En Progreso", "Completada", "Cancelada"];

const badgeClass: Record<Cita["estado"], string> = {
  Programada: "bg-sky-500/10 border-sky-400/30 text-sky-400",
  Registrada: "bg-emerald-500/10 border-emerald-400/30 text-emerald-400",
  "En Progreso": "bg-amber-500/10 border-amber-400/30 text-amber-400",
  Completada: "bg-indigo-500/10 border-indigo-400/30 text-indigo-400",
  Cancelada: "bg-slate-500/10 border-slate-400/30 text-slate-400",
};

const inputClass = `w-full rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all ${accentFocus} focus:bg-slate-900/60`;

export default function ColaEspera() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("Todos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [fechaFiltro, setFechaFiltro] = useState<string>(new Date().toISOString().split("T")[0]);
  const [expandida, setExpandida] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Estados para Modal de Confirmación Moderno
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [citaToCancel, setCitaToCancel] = useState<number | null>(null);

  const userStr = localStorage.getItem("usuario");
  const user = userStr ? JSON.parse(userStr) : null;
  const canManage = user?.rol === "admin" || user?.rol === "recepcionista";

  const fetchCitas = () => {
    api
      .get("/cola/", { params: { fecha: fechaFiltro } })
      .then((res) => setCitas(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  };

  const fetchPendientes = () => {
    api
      .get("/citas/pendientes/")
      .then((res) => setPendientes(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCitas();
    fetchPendientes();
    const interval = setInterval(fetchPendientes, 30000); // Polling cada 30s
    return () => clearInterval(interval);
  }, [fechaFiltro]);

  const aceptarCita = async (id: number) => {
    setLoadingId(id);
    try {
      await api.post(`/citas/${id}/aceptar/`);
      fetchCitas();
      fetchPendientes();
    } catch (err) {
      console.error(err);
      alert("Error al aceptar la cita");
    } finally {
      setLoadingId(null);
    }
  };

  const actualizarEstado = async (citaId: number, nuevoEstado: string) => {
    if (loadingId) return;
    
    if (nuevoEstado === "Cancelada") {
      setCitaToCancel(citaId);
      setShowConfirmCancel(true);
      return;
    }

    ejecutarActualizacionEstado(citaId, nuevoEstado);
  };

  const ejecutarActualizacionEstado = async (citaId: number, nuevoEstado: string) => {
    // Regla de negocio: Solo un paciente en consulta a la vez
    if (nuevoEstado === "En Progreso") {
      const alguienEnConsulta = citas.find(c => c.estado === "En Progreso");
      if (alguienEnConsulta) {
        alert(`AVISO: Ya hay un paciente en consulta (${alguienEnConsulta.paciente}). Debe finalizar la atención actual antes de iniciar una nueva.`);
        return;
      }
    }

    setLoadingId(citaId);
    try {
      await api.patch(`/citas/${citaId}/status/`, { estado: nuevoEstado });
      fetchCitas();
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("No se pudo actualizar el estado de la cita");
    } finally {
      setLoadingId(null);
    }
  };

  const citasFiltradas = citas.filter((c) => {
    const cumpleEstado = estadoFiltro === "Todos" || c.estado === estadoFiltro;
    const searchLower = busqueda.toLowerCase().trim();
    const cumpleBusqueda =
      searchLower === "" ||
      c.paciente.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.motivo.toLowerCase().includes(searchLower) ||
      c.tutor.toLowerCase().includes(searchLower);

    return cumpleEstado && cumpleBusqueda;
  });

  const stats = [
    { label: "TOTAL", count: citas.length, value: "Todos", color: "indigo" },
    { label: "PROGRAMADAS", count: citas.filter(c => c.estado === "Programada").length, value: "Programada", color: "sky" },
    { label: "REGISTRADAS", count: citas.filter(c => c.estado === "Registrada").length, value: "Registrada", color: "emerald" },
    { label: "EN PROGRESO", count: citas.filter(c => c.estado === "En Progreso").length, value: "En Progreso", color: "amber" },
  ];

  const pacienteEnConsulta = citas.find(c => c.estado === "En Progreso");

  return (
    <div className={`min-h-screen ${pageBg} selection:bg-indigo-500/30`}>
      {/* Header Estilo Centro de Mando */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 px-4 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <div className="flex flex-col">
              <h1 className={`text-xl font-black tracking-tighter md:text-2xl ${textPrimary} flex items-center gap-2 uppercase`}>
                <LayoutDashboard className="text-indigo-400" size={24} />
                Gestión de Citas
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className={`text-[10px] font-bold tracking-widest uppercase ${textMuted}`}>
                  Centro de Control Virtual
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Sistema de Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${
                  pendientes.length > 0 
                    ? "border-amber-500/50 bg-amber-500/10 text-amber-400" 
                    : "border-white/5 bg-slate-900/40 text-slate-500"
                }`}
              >
                {pendientes.length > 0 ? <BellRing className="animate-pulse" size={18} /> : <Bell size={18} />}
                {pendientes.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-rose-500 text-white text-[9px] sm:text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg">
                    {pendientes.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 md:w-96 rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-100 flex items-center gap-2">
                      <Plus className="text-sky-400" size={16} /> Solicitudes
                    </h4>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {pendientes.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-3 border border-white/5">
                          <Check className="text-slate-700" size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sin solicitudes pendientes</p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        {pendientes.map((p) => (
                          <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-black text-white truncate pr-2">{p.paciente}</p>
                              <span className="text-[10px] font-black text-sky-400 uppercase bg-sky-500/10 px-2 py-0.5 rounded-md">Nueva</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase mb-4">
                              <span className="flex items-center gap-1"><Calendar size={10} /> {p.fecha}</span>
                              <span className="flex items-center gap-1"><Clock size={10} /> {p.hora}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => aceptarCita(p.id)}
                                disabled={loadingId === p.id}
                                className="flex-1 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
                              >
                                {loadingId === p.id ? "..." : "Aceptar"}
                              </button>
                              <button
                                onClick={() => setShowNotifications(false)}
                                className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                              >
                                Ver
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {pendientes.length > 0 && (
                    <div className="p-4 bg-white/5 border-t border-white/5">
                      <p className="text-[9px] text-center font-bold text-slate-500 uppercase tracking-tight">
                        Al aceptar, se enviará un correo de confirmación al tutor
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden md:flex flex-col items-end px-4 border-r border-white/10">
              <p className={`text-xs font-black uppercase tracking-widest ${textMuted}`}>Estado del Sistema</p>
              <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> Operativo
              </p>
            </div>
            <button
              onClick={() => setEstadoFiltro("Cancelada")}
              className={`group relative overflow-hidden rounded-2xl border transition-all hover:scale-105 active:scale-95 ${estadoFiltro === "Cancelada" ? "border-rose-500/50 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.2)]" : "border-white/5 bg-slate-900/40"} px-4 py-2.5`}
            >
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-lg font-black leading-none ${estadoFiltro === "Cancelada" ? "text-rose-400" : textPrimary}`}>
                    {citas.filter((c) => c.estado === "Cancelada").length}
                  </p>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${textMuted}`}>Canceladas</p>
                </div>
                <X size={18} className={estadoFiltro === "Cancelada" ? "text-rose-400" : "text-slate-500"} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <ConfirmModal
          isOpen={showConfirmCancel}
          onClose={() => {
            setShowConfirmCancel(false);
            setCitaToCancel(null);
          }}
          onConfirm={() => {
            if (citaToCancel) {
              ejecutarActualizacionEstado(citaToCancel, "Cancelada");
            }
          }}
          title="¿Cancelar Cita?"
          message="Esta acción no se puede deshacer. El paciente perderá su turno en la cola de espera y se le notificará por correo electrónico."
          confirmText="Sí, Cancelar"
          cancelText="No, Mantener"
          type="danger"
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PANEL IZQUIERDO: ESTADÍSTICAS Y FILTROS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <button
                  key={stat.label}
                  onClick={() => setEstadoFiltro(stat.value)}
                  className={`group relative flex flex-col items-center justify-center rounded-[2rem] border p-6 transition-all hover:scale-105 active:scale-95 ${
                    estadoFiltro === stat.value 
                      ? `border-${stat.color}-500/50 bg-${stat.color}-500/10 shadow-lg shadow-${stat.color}-500/10` 
                      : "border-white/5 bg-slate-900/40"
                  }`}
                >
                  <p className={`text-3xl font-black mb-1 ${
                    estadoFiltro === stat.value ? `text-${stat.color}-400` : textPrimary
                  }`}>
                    {stat.count}
                  </p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textMuted} text-center`}>
                    {stat.label}
                  </p>
                  {estadoFiltro === stat.value && (
                    <div className={`absolute bottom-2 h-1 w-8 rounded-full bg-${stat.color}-500`} />
                  )}
                </button>
              ))}
            </div>

            {/* Filtros Card */}
            <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/20 p-8 backdrop-blur-sm">
              <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 ${textPrimary}`}>
                <Filter size={18} className="text-indigo-400" />
                Filtros de Búsqueda
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted} flex items-center gap-2`}>
                    <Calendar size={12} /> Fecha de Atención
                  </label>
                  <input
                    type="date"
                    className={inputClass}
                    value={fechaFiltro}
                    onChange={(e) => setFechaFiltro(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted} flex items-center gap-2`}>
                    <Clock size={12} /> Filtrar por Estado
                  </label>
                  <div className="relative">
                    <select
                      value={estadoFiltro}
                      onChange={(e) => setEstadoFiltro(e.target.value)}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="Todos">Todos los Estados</option>
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted} flex items-center gap-2`}>
                    <Search size={12} /> Búsqueda Rápida
                  </label>
                  <div className="relative">
                    <input
                      type="search"
                      className={`${inputClass} pl-11`}
                      placeholder="Nombre, correo..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600/20 to-sky-600/20 border border-white/5 p-6 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-indigo-500/20 p-3">
                  <AlertCircle className="text-indigo-400" size={24} />
                </div>
                <div>
                  <h4 className={`text-sm font-black uppercase tracking-tight mb-1 ${textPrimary}`}>Monitorización Activa</h4>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>
                    Los estados se sincronizan en tiempo real con la sala de espera virtual.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: LISTADO DE CITAS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className={`text-xl font-black tracking-tight ${textPrimary} uppercase`}>
                Listado de Turnos
                <span className="ml-3 text-xs font-bold text-indigo-400 lowercase tracking-normal bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  {citasFiltradas.length} resultados
                </span>
              </h2>
            </div>

            <div className="space-y-4 custom-scrollbar max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
              {citasFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-[3rem] border border-dashed border-white/10 bg-slate-900/10">
                  <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-white/5">
                    <Users className="text-slate-700" size={40} />
                  </div>
                  <p className={`text-lg font-medium ${textMuted}`}>No se encontraron registros</p>
                  <p className="text-xs text-slate-600 uppercase tracking-widest mt-1">Ajuste los filtros para ver más resultados</p>
                </div>
              ) : (
                citasFiltradas.map((c) => {
                  const abierta = expandida === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`group relative rounded-[2.5rem] border transition-all duration-300 ${
                        abierta 
                          ? "border-indigo-500/30 bg-slate-900/60 shadow-2xl shadow-indigo-500/5" 
                          : "border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-white/10"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandida(abierta ? null : c.id)}
                        className="flex w-full items-center gap-4 p-5 sm:p-6 text-left transition sm:gap-8"
                      >
                        <div className={`flex flex-col items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl border transition-colors shrink-0 ${
                          abierta ? "bg-indigo-500 border-indigo-400 text-white" : "bg-slate-900 border-white/5 text-slate-400 group-hover:border-white/20"
                        }`}>
                          <p className="text-sm sm:text-lg font-black leading-none">{c.hora.split(" ")[0]}</p>
                          <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-80">{c.hora.split(" ")[1]}</p>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 sm:gap-3 mb-1">
                            <span className="text-xl sm:text-2xl transition-transform group-hover:scale-110 duration-300">
                              {c.genero === "Masculino" ? "👦" : c.genero === "Femenino" ? "👧" : "👶"}
                            </span>
                            <p className={`text-base sm:text-lg font-black tracking-tight truncate ${textPrimary}`}>
                              {c.paciente}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-tight ${textMuted}`}>
                              {c.motivo}
                            </p>
                            <span className="hidden sm:block h-1 w-1 rounded-full bg-slate-700" />
                            <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-tight ${textMuted}`}>
                              {c.edad} años
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 sm:gap-2 shrink-0">
                          <span className={`rounded-full border px-2 sm:px-4 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${badgeClass[c.estado]}`}>
                            {c.estado}
                          </span>
                          <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all ${
                            abierta ? "bg-indigo-500/20 text-indigo-400 rotate-180" : "bg-slate-800 text-slate-500"
                          }`}>
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </button>

                      {abierta && (
                        <div className="px-4 sm:px-6 pb-5 sm:pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-slate-950/50 p-4 sm:p-6 border border-white/5 space-y-4 sm:space-y-6">
                            <div className="grid gap-4 sm:gap-6 text-sm grid-cols-2 md:grid-cols-4">
                              <div className="space-y-1">
                                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Tutor</p>
                                <p className={`text-xs sm:text-sm font-bold ${textPrimary} truncate`}>{c.tutor}</p>
                              </div>
                              <div className="space-y-1">
                                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Email</p>
                                <p className={`text-xs sm:text-sm font-bold ${textPrimary} truncate`}>{c.email}</p>
                              </div>
                              <div className="space-y-1">
                                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Teléfono</p>
                                <p className={`text-xs sm:text-sm font-bold ${textPrimary}`}>{c.telefono}</p>
                              </div>
                              <div className="space-y-1">
                                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Registro</p>
                                <p className={`text-xs sm:text-sm font-bold ${textPrimary}`}>{new Date(c.created_at).toLocaleDateString()}</p>
                              </div>
                              {c.consultorio && (
                                <div className="space-y-1">
                                  <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Consultorio</p>
                                  <p className={`text-xs sm:text-sm font-bold text-sky-400 truncate`}>{c.consultorio}</p>
                                </div>
                              )}
                            </div>

                            <div className="h-px bg-white/5 w-full" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-3">
                              <button
                                type="button"
                                onClick={() => navigate(`/expediente/${c.paciente_id}`, { state: c })}
                                className={`flex-1 min-w-0 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-sm font-black text-indigo-400 transition hover:bg-indigo-500 hover:text-white uppercase tracking-widest active:scale-95`}
                              >
                                <FileText size={16} />
                                <span className="truncate">Expediente</span>
                              </button>
                              
                              {canManage && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => actualizarEstado(c.id, "Registrada")}
                                    disabled={loadingId === c.id || c.estado !== "Programada"}
                                    className={`flex-1 min-w-0 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-sm font-black text-emerald-400 transition hover:bg-emerald-500 hover:text-white uppercase tracking-widest active:scale-95 disabled:opacity-30 disabled:grayscale`}
                                  >
                                    <UserCheck size={16} />
                                    <span className="truncate">{loadingId === c.id ? "..." : "Llegada"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => actualizarEstado(c.id, "En Progreso")}
                                    disabled={loadingId === c.id || c.estado !== "Registrada" || (!!pacienteEnConsulta && pacienteEnConsulta.id !== c.id)}
                                    title={!!pacienteEnConsulta && pacienteEnConsulta.id !== c.id ? `Ya hay un paciente en consulta: ${pacienteEnConsulta.paciente}` : ""}
                                    className={`flex-1 min-w-0 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-sm font-black text-amber-400 transition hover:bg-amber-500 hover:text-white uppercase tracking-widest active:scale-95 disabled:opacity-30 disabled:grayscale`}
                                  >
                                    <Stethoscope size={16} />
                                    <span className="truncate">{loadingId === c.id ? "..." : "Atender"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => actualizarEstado(c.id, "Completada")}
                                    disabled={loadingId === c.id || c.estado !== "En Progreso"}
                                    className={`flex-1 min-w-0 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-sky-500/10 border border-sky-500/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-sm font-black text-sky-400 transition hover:bg-sky-500 hover:text-white uppercase tracking-widest active:scale-95 disabled:opacity-30 disabled:grayscale`}
                                  >
                                    <CheckCircle size={16} />
                                    <span className="truncate">Finalizar</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => actualizarEstado(c.id, "Cancelada")}
                                    disabled={loadingId === c.id || c.estado === "Completada" || c.estado === "Cancelada"}
                                    className={`flex-1 min-w-0 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-sm font-black text-rose-400 transition hover:bg-rose-500 hover:text-white uppercase tracking-widest active:scale-95 disabled:opacity-30 disabled:grayscale`}
                                  >
                                    <X size={16} />
                                    <span className="truncate">Cancelar</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
