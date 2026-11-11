import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Clock,
  Users,
  Calendar,
  UserPlus,
  Activity,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  LayoutDashboard
} from "lucide-react";
import PageCard from "../../components/PageCard";
import { pageBg, textPrimary, textMuted, accentBorder, surfaceLight } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";

export default function RecepcionistaDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    en_espera: 0,
    citas_hoy: 0,
    pendientes_pago: 0,
    nuevos_registros: 0
  });
  const [ultimaAccion, setUltimaAccion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, accionRes] = await Promise.all([
        api.get("/cola/stats"),
        api.get("/cola/ultima-accion")
      ]);
      setStats(statsRes.data);
      setUltimaAccion(accionRes.data);
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Polling cada 15 segundos para actualización en tiempo real
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Justo ahora";
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        {/* Header */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-black tracking-tight md:text-4xl ${textPrimary} uppercase`}>
                Panel de <span className="text-emerald-400">Recepción</span>
              </h1>
              <p className={`mt-2 text-lg font-medium ${textMuted}`}>
                ¡Hola {user?.nombre.split(' ')[0]}! El flujo de hoy está en tus manos. ✨
              </p>
            </div>
            <div className={`rounded-2xl border ${accentBorder} bg-emerald-500/10 px-6 py-3 flex items-center gap-3`}>
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-sm font-bold uppercase tracking-wider ${textPrimary}`}>Centro de Control Activo</span>
            </div>
          </div>
        </section>

        {/* Estadísticas de Flujo */}
        <section className="mb-12">
          <h2 className={`mb-6 text-xl font-black uppercase tracking-widest ${textPrimary} flex items-center gap-2`}>
            <Activity size={24} className="text-emerald-400" />
            Flujo de Pacientes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className={`${surfaceLight} border ${accentBorder} rounded-3xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Clock size={24} />
                </div>
                <span className="text-2xl font-black text-emerald-400">
                  {loading ? "..." : stats.en_espera}
                </span>
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest ${textMuted}`}>En Espera</p>
            </div>
            
            <div className={`${surfaceLight} border ${accentBorder} rounded-3xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400">
                  <Calendar size={24} />
                </div>
                <span className="text-2xl font-black text-sky-400">
                  {loading ? "..." : stats.citas_hoy}
                </span>
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest ${textMuted}`}>Citas de Hoy</p>
            </div>

            <div className={`${surfaceLight} border ${accentBorder} rounded-3xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                  <AlertCircle size={24} />
                </div>
                <span className="text-2xl font-black text-amber-400">
                  {loading ? "..." : stats.pendientes_pago}
                </span>
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest ${textMuted}`}>Pendientes de Pago</p>
            </div>

            <div className={`${surfaceLight} border ${accentBorder} rounded-3xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
                  <UserPlus size={24} />
                </div>
                <span className="text-2xl font-black text-rose-400">
                  {loading ? "..." : stats.nuevos_registros}
                </span>
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest ${textMuted}`}>Nuevos Registros</p>
            </div>
          </div>
        </section>

        {/* Acciones Rápidas */}
        <section className="mb-12">
          <h2 className={`mb-6 text-xl font-black uppercase tracking-widest ${textPrimary} flex items-center gap-2`}>
            <LayoutDashboard size={24} className="text-emerald-400" />
            Gestión Rápida
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PageCard
              icon={<Clock size={44} />}
              title="Cola de Espera"
              subtitle="Gestionar turnos"
              onClick={() => navigate("/recepcionista/cola-espera")}
              accent="emerald"
            />
            <PageCard
              icon={<Users size={44} />}
              title="Sala de Espera"
              subtitle="Estado de consultorios"
              onClick={() => navigate("/recepcionista/sala-espera")}
              accent="rose"
            />
          </div>
        </section>

        {/* Última Cita Registrada */}
        <section>
          <div className={`${surfaceLight} border ${accentBorder} rounded-[2rem] p-8 shadow-xl overflow-hidden relative`}>
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ClipboardList size={160} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                  Última Acción
                </span>
                {ultimaAccion && (
                  <span className="text-xs font-bold text-slate-500">{formatTimeAgo(ultimaAccion.fecha_creacion)}</span>
                )}
              </div>
              
              {loading ? (
                <div className="animate-pulse flex gap-6">
                  <div className="h-20 w-20 bg-slate-800 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-slate-800 rounded w-1/4" />
                    <div className="h-4 bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
              ) : ultimaAccion ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-1 shadow-lg shadow-emerald-500/20">
                      <div className="h-full w-full rounded-[0.9rem] bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-white text-3xl font-black">
                        {ultimaAccion.iniciales}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-black ${textPrimary} tracking-tight uppercase`}>{ultimaAccion.paciente}</h3>
                      <p className={`${textMuted} font-bold text-sm uppercase tracking-wide`}>{ultimaAccion.accion}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate("/recepcionista/cola-espera")}
                    className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
                  >
                    Ver Cola de Espera
                    <ArrowRight size={20} />
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className={`${textMuted} font-bold italic`}>No se han registrado citas recientemente. ✨</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
