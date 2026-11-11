import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Stethoscope,
  Users,
  Calendar,
  ClipboardList,
  Activity,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import PageCard from "../../components/PageCard";
import { pageBg, textPrimary, textMuted, accentBorder, surfaceLight } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";

export default function MedicoDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    citas_programadas: 0,
    atendidos: 0,
    pendientes: 0,
    urgencias: 0,
    siguiente_paciente: null as {
      nombre: string;
      iniciales: string;
      motivo: string;
      hora: string;
    } | null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/medico/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error al obtener estadísticas del médico:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        {/* Header */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-black tracking-tight md:text-4xl ${textPrimary} uppercase`}>
                Panel del <span className="text-sky-400">Médico</span>
              </h1>
              <p className={`mt-2 text-lg font-medium ${textMuted}`}>
                ¡Hola Dr. {user?.nombre.split(' ')[0]}! Prepárate para salvar el día. 🩺
              </p>
            </div>
            <div className={`rounded-2xl border ${accentBorder} bg-sky-500/10 px-6 py-3 flex items-center gap-3`}>
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-sm font-bold uppercase tracking-wider ${textPrimary}`}>En línea y listo</span>
            </div>
          </div>
        </section>

        {/* Resumen de hoy */}
        <section className="mb-12">
          <h2 className={`mb-6 text-xl font-black uppercase tracking-widest ${textPrimary} flex items-center gap-2`}>
            <Activity size={24} className="text-sky-400" />
            Estado de hoy
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className={`${surfaceLight} border ${accentBorder} rounded-3xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400">
                  <Calendar size={24} />
                </div>
                <span className="text-2xl font-black text-sky-400">
                  {loading ? "..." : stats.citas_programadas}
                </span>
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest ${textMuted}`}>Citas Programadas</p>
            </div>
            
            <div className={`${surfaceLight} border ${accentBorder} rounded-3xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-2xl font-black text-emerald-400">
                  {loading ? "..." : stats.atendidos}
                </span>
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest ${textMuted}`}>En Consulta</p>
            </div>

            <div className={`${surfaceLight} border ${accentBorder} rounded-3xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                  <Clock size={24} />
                </div>
                <span className="text-2xl font-black text-amber-400">
                  {loading ? "..." : stats.pendientes}
                </span>
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest ${textMuted}`}>Pendientes</p>
            </div>

            <div className={`${surfaceLight} border ${accentBorder} rounded-3xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
                  <Bell size={24} />
                </div>
                <span className="text-2xl font-black text-rose-400">
                  {loading ? "..." : stats.urgencias}
                </span>
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest ${textMuted}`}>Urgencias</p>
            </div>
          </div>
        </section>

        {/* Acciones Rápidas */}
        <section className="mb-12">
          <h2 className={`mb-6 text-xl font-black uppercase tracking-widest ${textPrimary} flex items-center gap-2`}>
            <Stethoscope size={24} className="text-sky-400" />
            Acciones rápidas
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PageCard
              icon={<Calendar size={44} />}
              title="Mi Agenda"
              subtitle="Ver citas del día"
              onClick={() => navigate("/medico/mis-citas")}
              accent="sky"
            />
            <PageCard
              icon={<Users size={44} />}
              title="Pacientes"
              subtitle="Expedientes clínicos"
              onClick={() => navigate("/medico/pacientes-atendidos")}
              accent="indigo"
            />
          
          </div>
        </section>

        {/* Próximo Paciente (Preview) */}
        <section>
          <div className={`${surfaceLight} border ${accentBorder} rounded-[2rem] p-8 shadow-xl overflow-hidden relative`}>
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Stethoscope size={160} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-black uppercase tracking-widest border border-sky-500/20">
                  Siguiente Paciente
                </span>
                {stats.siguiente_paciente && (
                  <span className="text-xs font-bold text-slate-500">Programado: {stats.siguiente_paciente.hora}</span>
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
              ) : stats.siguiente_paciente ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 p-1 shadow-lg shadow-sky-500/20">
                      <div className="h-full w-full rounded-[0.9rem] bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-white text-3xl font-black">
                        {stats.siguiente_paciente.iniciales}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-black ${textPrimary} tracking-tight uppercase`}>{stats.siguiente_paciente.nombre}</h3>
                      <p className={`${textMuted} font-bold text-sm uppercase tracking-wide`}>Motivo: {stats.siguiente_paciente.motivo}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate("/medico/mis-citas")}
                    className="flex items-center gap-3 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-sky-500/25 active:scale-95"
                  >
                    Iniciar Consulta
                    <ArrowRight size={20} />
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className={`${textMuted} font-bold italic`}>No hay más pacientes programados para hoy. ✨</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
