import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Heart,
  Smile,
  Clock,
  ArrowRight,
  Star,
  Activity,
  User,
  Stethoscope,
  AlertCircle,
  XCircle,
  History,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import PageCard from "../../components/PageCard";
import { pageBg, textPrimary, textMuted, accentBorder, surfaceLight } from "../../theme/colors";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

interface ProximaCita {
  id: number;
  fecha: string;
  hora: string;
  paciente: string;
  consultorio: string;
  especialidad: string;
  estado: string;
}

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

export default function PacienteDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proximaCita, setProximaCita] = useState<ProximaCita | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal Moderno
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [citaIdToCancel, setCitaIdToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchProximaCita = () => {
    if (user?.email) {
      api.get(`/citas/proxima?email=${user.email}`)
        .then(res => setProximaCita(res.data))
        .catch(err => console.error("Error fetching next appointment:", err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchProximaCita();
    // Polling cada 30 segundos para actualizar el estado de la cita
    const interval = setInterval(fetchProximaCita, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleCancelarCita = (id: number) => {
    setCitaIdToCancel(id);
    setShowConfirmModal(true);
  };

  const confirmCancel = async () => {
    if (!citaIdToCancel) return;
    
    setIsCancelling(true);
    try {
      await api.post(`/citas/${citaIdToCancel}/cancelar`);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      fetchProximaCita();
      
      // Auto cerrar el modal de éxito después de 3 segundos
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (err) {
      console.error("Error al cancelar cita:", err);
      alert("Hubo un error al cancelar la cita.");
    } finally {
      setIsCancelling(false);
      setCitaIdToCancel(null);
    }
  };

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr + 'T12:00:00'); // Evitar problemas de zona horaria
    return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });
  };

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8 md:px-6 md:py-10">
        {/* Header */}
        <section className="mb-8 sm:mb-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight md:text-5xl ${textPrimary} truncate`}>
                <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
                  ¡Hola {user?.nombre.split(' ')[0]}!
                </span>
              </h1>
              <p className={`mt-2 sm:mt-3 text-sm sm:text-lg font-bold ${textMuted} uppercase tracking-widest`}>
                Bienvenido a tu panel de salud familiar ❤️
              </p>
            </div>
            <div className="flex justify-center md:justify-end shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[1.8rem] sm:rounded-[2rem] bg-gradient-to-br from-rose-400 to-amber-400 p-1 shadow-xl shadow-rose-500/20">
                <div className="h-full w-full rounded-[1.6rem] sm:rounded-[1.8rem] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center text-2xl sm:text-3xl">
                  🦁
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resumen de Mis Citas */}
        <section className="mb-12">
          <h2 className={`mb-6 text-xl font-black uppercase tracking-widest ${textPrimary} flex items-center gap-2 justify-center md:justify-start`}>
            <Activity size={24} className="text-rose-400" />
            Mis Próximos Pasos
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className={`${surfaceLight} border-2 border-rose-500/20 rounded-[2.5rem] p-8 shadow-xl hover:border-rose-500/40 transition-all group`}>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-3xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                  <Calendar size={32} />
                </div>
                <span className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
                  Próxima Cita
                </span>
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-8 bg-slate-800 rounded-xl w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded-xl w-1/2"></div>
                </div>
              ) : proximaCita ? (
                <>
                  <h3 className={`text-2xl font-black ${textPrimary} mb-2`}>
                    {formatFecha(proximaCita.fecha)}
                  </h3>
                  <p className={`${textMuted} font-bold mb-6`}>
                    {proximaCita.especialidad} - {proximaCita.consultorio}
                    <br />
                    <span className="text-rose-400/80 text-sm">Hora: {proximaCita.hora}</span>
                  </p>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => navigate("/sala-espera")}
                      className="w-full py-4 bg-rose-500 hover:bg-rose-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
                    >
                      Ver Detalles
                      <ArrowRight size={18} />
                    </button>
                    <button 
                      onClick={() => handleCancelarCita(proximaCita.id)}
                      className="w-full py-4 bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      Cancelar Cita
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className={`text-2xl font-black ${textPrimary} mb-2 flex items-center gap-2`}>
                    <AlertCircle size={24} className="text-amber-400" />
                    Sin Cita
                  </h3>
                  <p className={`${textMuted} font-bold mb-6`}>
                    No tienes citas programadas.
                    <br />
                    ¡Reserva una próximamente!
                  </p>
                  <button 
                    onClick={() => navigate("/seleccionar-consultorio")}
                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
                  >
                    Agendar Ahora
                    <Calendar size={18} />
                  </button>
                </>
              )}
            </div>

            <div className={`${surfaceLight} border-2 border-amber-500/20 rounded-[2.5rem] p-8 shadow-xl hover:border-amber-500/40 transition-all group`}>
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <Clock size={32} />
                </div>
                <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                  En la Clínica
                </span>
              </div>
              <h3 className={`text-2xl font-black ${textPrimary} mb-2`}>Sala de Espera</h3>
              <p className={`${textMuted} font-bold mb-6`}>Mira tu turno en tiempo real</p>
              <button 
                onClick={() => navigate("/sala-espera")}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                Ir a Sala
                <Users size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Acciones Rápidas */}
        <section className="mb-12">
          <h2 className={`mb-6 text-xl font-black uppercase tracking-widest ${textPrimary} flex items-center gap-2 justify-center md:justify-start`}>
            <Star size={24} className="text-amber-400" />
            ¿Qué quieres hacer hoy?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <PageCard
              icon={<Calendar size={44} />}
              title="Agendar Cita"
              subtitle="Reserva tu lugar"
              onClick={() => navigate("/seleccionar-consultorio")}
              accent="rose"
            />
            <PageCard
              icon={<History size={44} />}
              title="Historial"
              subtitle="Tus citas pasadas"
              onClick={() => navigate("/paciente/historial")}
              accent="indigo"
            />
            <PageCard
              icon={<Stethoscope size={44} />}
              title="Mis Médicos"
              subtitle="Ver especialistas"
              onClick={() => navigate("/paciente/mis-medicos")}
              accent="sky"
            />
            <PageCard
              icon={<User size={44} />}
              title="Mi Perfil"
              subtitle="Actualizar datos"
              onClick={() => navigate("/perfil")}
              accent="amber"
            />
          </div>
        </section>

        {/* Mensaje motivacional */}
        <section>
          <div className="bg-gradient-to-r from-indigo-600 to-sky-600 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-20px] left-[-20px] opacity-10">
              <Heart size={120} />
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] opacity-10">
              <Smile size={120} />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
                ¡Recuerda que tu salud es lo más importante!
              </h2>
              <p className="text-sky-100 text-lg font-bold">
                Estamos aquí para cuidarte en cada paso del camino. 😊
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Confirmación Moderno */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-5 rounded-3xl bg-rose-500/10 text-rose-400 ring-4 ring-rose-500/5">
                <AlertTriangle size={48} />
              </div>
              
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
                ¿Cancelar Cita?
              </h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
                Esta acción no se puede deshacer. ¿Estás seguro de que deseas cancelar tu consulta?
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={confirmCancel}
                  disabled={isCancelling}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20 active:scale-95 disabled:opacity-50"
                >
                  {isCancelling ? "Cancelando..." : "SÍ, CANCELAR CITA"}
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setCitaIdToCancel(null);
                  }}
                  disabled={isCancelling}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  MANTENER CITA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito Moderno */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 text-center">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            
            <div className="flex flex-col items-center">
              <div className="mb-6 p-5 rounded-3xl bg-emerald-500/10 text-emerald-400 ring-4 ring-emerald-500/5">
                <CheckCircle size={48} />
              </div>
              
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
                ¡Cita Cancelada!
              </h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
                Tu cita ha sido anulada con éxito. Esperamos verte pronto de nuevo.
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

