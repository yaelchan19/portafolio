import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { horarios, meses } from "./constants";
import FormCard from "../../components/FormCard";
import Splash from "../../components/Splash";
import BackButton from "../../components/BackButton";
import api from "../../services/api";
import { pageBg, textPrimary, textMuted, textOnAccent, accentPrimary, accentBorder, surfaceLight } from "../../theme/colors";

export default function AgendarCita() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { consultorio?: { id: number; nombre: string; especialidad: string; numero?: string; piso?: number } } };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hora, setHora] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [isLoadingHoras, setIsLoadingHoras] = useState(false);
  const [avisoSinHorario, setAvisoSinHorario] = useState(false);
  const [citaConfirmada, setCitaConfirmada] = useState<{ fechaTexto: string; hora: string } | null>(null);
  const [showProcessSplash, setShowProcessSplash] = useState(false);

  useEffect(() => {
    if (!state?.consultorio) {
      navigate("/seleccionar-consultorio");
      return;
    }
    
    // Cargar horas ocupadas cuando cambie la fecha o el consultorio
    const fetchHorasOcupadas = async () => {
      setIsLoadingHoras(true);
      try {
        const fechaISO = selectedDate.toISOString().split('T')[0];
        const res = await api.get(`/citas/ocupadas?fecha=${fechaISO}&consultorio_id=${state.consultorio?.id}`);
        setHorasOcupadas(res.data);
        // Si la hora seleccionada ahora está ocupada, la limpiamos
        if (res.data.includes(hora)) {
          setHora("");
        }
      } catch (err) {
        console.error("Error al obtener horas ocupadas:", err);
      } finally {
        setIsLoadingHoras(false);
      }
    };

    fetchHorasOcupadas();
  }, [selectedDate, state?.consultorio, navigate]);

  const continuarReserva = () => {
    setAvisoSinHorario(false);
    setCitaConfirmada(null);
    if (!hora) {
      setAvisoSinHorario(true);
      return;
    }
    const fechaTexto = `${selectedDate.getDate()} de ${meses[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`;
    setCitaConfirmada({ fechaTexto, hora });
  };

  const irACompletarDatos = () => {
    if (!citaConfirmada) return;
    setShowProcessSplash(true);
  };

  const esHoraPasada = (timeStr: string, date: Date) => {
    const ahora = new Date();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaSeleccionada = new Date(date);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    // Si la fecha es anterior a hoy, todas son pasadas
    if (fechaSeleccionada < hoy) return true;
    // Si la fecha es posterior a hoy, ninguna es pasada
    if (fechaSeleccionada > hoy) return false;

    // Si es hoy, comparamos las horas
    const normalized = timeStr.toLowerCase().replace(/\./g, "").trim(); // "1:30 pm"
    const [timePart, ampm] = normalized.split(" ");
    let [h, m] = timePart.split(":").map(Number);
    
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    
    const slot = new Date();
    slot.setHours(h, m, 0, 0);
    
    return slot < ahora;
  };

  if (showProcessSplash && citaConfirmada) {
    return (
      <Splash
        title="Reserva en proceso"
        subtitle="Fecha y hora registradas."
        message="Redirigiendo a completar datos…"
        durationMs={1200}
        onFinish={() => {
          setShowProcessSplash(false);
          navigate("/confirmar-cita", { 
            state: { 
              ...citaConfirmada, 
              fechaISO: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
              consultorio: state?.consultorio 
            } 
          });
        }}
      />
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-md md:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-3 sm:gap-4">
          <BackButton />
          <div className="flex-1 text-center min-w-0">
            <h1 className={`text-lg sm:text-xl font-bold md:text-2xl ${textPrimary} truncate`}>
              ✨ ¡Reserva tu Visita Divertida! ✨
            </h1>
            <p className={`mt-0.5 text-[10px] sm:text-sm ${textMuted} truncate`}>
              🌟 Elijamos el momento perfecto para tu revisión 🌟
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Consultorio seleccionado */}
          {state?.consultorio && (
            <FormCard title="🏥 Consultorio seleccionado" subtitle={state.consultorio.especialidad}>
              <div className={`rounded-xl border ${accentBorder} ${surfaceLight} p-4`}>
                <p className={`text-sm ${textPrimary}`}>
                  {state.consultorio.nombre}
                </p>
              </div>
            </FormCard>
          )}
          {/* Calendario */}
          <FormCard title="📅 Seleccionar fecha">
            <div className="flex items-center justify-between rounded-xl border border-slate-600/80 bg-slate-800/50 px-3 py-2">
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="rounded-lg px-2 py-1 text-xl font-bold text-slate-300 transition hover:bg-slate-700/60 hover:text-white"
              >
                ‹
              </button>
              <span className={`font-semibold ${textPrimary}`}>
                {meses[month]} de {year}
              </span>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="rounded-lg px-2 py-1 text-xl font-bold text-slate-300 transition hover:bg-slate-700/60 hover:text-white"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
              {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {[...Array(firstDay)].map((_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const dateObj = new Date(year, month, day);
                const active = selectedDate.toDateString() === dateObj.toDateString();
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(dateObj)}
                    className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-md"
                        : `${surfaceLight} ${textPrimary} hover:bg-slate-800/80`
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </FormCard>

          {/* Horarios */}
          <FormCard
            title="🕒 Horarios Disponibles"
            subtitle={`para el ${selectedDate.getDate()} de ${meses[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`}
            footer={
              <button
                type="button"
                onClick={continuarReserva}
                disabled={isLoadingHoras}
                className={`w-full rounded-2xl ${accentPrimary} px-4 py-3 text-sm font-semibold ${textOnAccent} shadow-lg shadow-indigo-900/50 transition hover:brightness-110 disabled:opacity-50`}
              >
                ✓ Continuar con la Reserva
              </button>
            }
          >
            {isLoadingHoras ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {horarios.map((h) => {
                  const ocupada = horasOcupadas.includes(h) || esHoraPasada(h, selectedDate);
                  const active = hora === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={ocupada}
                      onClick={() => setHora(h)}
                      className={`rounded-xl border py-3 text-sm font-medium transition ${
                        ocupada
                          ? "border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed"
                          : active
                            ? `border-indigo-400/50 bg-indigo-500/30 ${textPrimary} ring-2 ring-indigo-400/50`
                            : `${accentBorder} ${surfaceLight} ${textPrimary} hover:bg-slate-800/80`
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        {h}
                        {active && <span className="text-indigo-300">✔</span>}
                        {ocupada && <AlertTriangle size={14} className="text-slate-700" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </FormCard>
        </div>

        {/* Card aviso: falta seleccionar horario */}
        {avisoSinHorario && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl border border-amber-400/40 bg-slate-900/95 p-6 shadow-2xl ${surfaceLight}`}>
              <div className="flex items-center gap-3 text-amber-400">
                <Clock size={32} />
                <h3 className={`text-lg font-semibold ${textPrimary}`}>Selecciona un horario</h3>
              </div>
              <p className={`mt-3 text-sm ${textMuted}`}>
                Elige una hora en el panel «Horarios Disponibles» para continuar con tu reserva.
              </p>
              <button
                type="button"
                onClick={() => setAvisoSinHorario(false)}
                className={`mt-6 w-full rounded-xl ${accentPrimary} px-4 py-3 text-sm font-semibold ${textOnAccent} transition hover:brightness-110`}
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* Card confirmación: cita agendada (fecha y hora) */}
        {citaConfirmada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl border border-emerald-400/40 bg-slate-900/95 p-6 shadow-2xl ${surfaceLight}`}>
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle size={32} />
                <h3 className={`text-lg font-semibold ${textPrimary}`}>¡Fecha y hora confirmadas!</h3>
              </div>
              <div className={`mt-4 space-y-2 rounded-xl border ${accentBorder} bg-slate-800/50 px-4 py-3 text-sm`}>
                <p className={textPrimary}><span className={textMuted}>📅 Fecha:</span> {citaConfirmada.fechaTexto}</p>
                <p className={textPrimary}><span className={textMuted}>🕒 Hora:</span> {citaConfirmada.hora}</p>
              </div>
              <p className={`mt-3 text-sm ${textMuted}`}>
                Ahora completa los datos del paciente y del tutor para finalizar la cita.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCitaConfirmada(null)}
                  className="flex-1 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-700/60"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={irACompletarDatos}
                  className={`flex-1 rounded-xl ${accentPrimary} px-4 py-3 text-sm font-semibold ${textOnAccent} shadow-lg transition hover:brightness-110`}
                >
                  Continuar a completar datos
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
