import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import api from "../../services/api";
import FormCard from "../../components/FormCard";
import Splash from "../../components/Splash";
import BackButton from "../../components/BackButton";
import { useAuth } from "../../contexts/AuthContext";
import {
  pageBg,
  textPrimary,
  textMuted,
  textOnAccent,
  accentPrimary,
  accentBorder,
  surfaceLight,
  accentFocus,
} from "../../theme/colors";

const MOTIVOS = [
  "🩺 Chequeo Anual",
  "💉 Vacunación",
  "🤒 No me siento bien",
  "🔁 Visita de Seguimiento",
  "🏃 Examen Físico Deportivo",
  "👂 Problemas de Oído",
  "🤧 Alergias",
  "💬 Algo más",
];

const inputClass = `w-full rounded-2xl border border-slate-700 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none ${accentFocus}`;
const selectClass = `${inputClass} appearance-none cursor-pointer pr-10`;
const inputIconClass = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 text-lg";
const selectArrowClass = "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400";

export default function ConfirmarCita() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useLocation() as {
    state?: { 
      fechaTexto?: string; 
      hora?: string; 
      fechaISO?: string;
      consultorio?: { id: number; nombre?: string; especialidad?: string; numero?: string; piso?: number } 
    };
  };
  
  const [showProcessSplash, setShowProcessSplash] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Estado del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [genero, setGenero] = useState("");
  const [tutorNombre, setTutorNombre] = useState(user?.nombre || "");
  const [tutorEmail, setTutorEmail] = useState(user?.email || "");
  const [tutorTelefono, setTutorTelefono] = useState("");
  const [motivo, setMotivo] = useState("");

  // Sincronizar con el usuario si carga después
  useEffect(() => {
    if (user) {
      setTutorNombre(user.nombre);
      setTutorEmail(user.email);
    }
  }, [user]);

  const validarEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleConfirm = async () => {
    if (!nombre || !apellido || !fechaNac || !genero || !tutorNombre || !tutorEmail || !state?.consultorio?.id) {
      setMessage("Por favor completa todos los campos obligatorios (*)");
      return;
    }

    if (!validarEmail(tutorEmail)) {
      setMessage("Por favor ingresa un correo electrónico válido");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const payload = {
        fecha_programada: state.fechaISO,
        hora_programada: state.hora,
        consultorio_id: state.consultorio.id,
        paciente: {
          nombre,
          apellido,
          fecha_nac: fechaNac,
          genero
        },
        tutor: {
          nombre: tutorNombre,
          email: tutorEmail,
          telefono: tutorTelefono,
          motivo
        }
      };

      await api.post("/citas/", payload);
      setShowProcessSplash(true);
    } catch (err: any) {
      // Manejo de error más robusto para evitar crashes
      let errorMsg = "Error al agendar la cita. Intenta de nuevo.";
      
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          // Si es un error de validación de Pydantic (422), extraemos los mensajes
          errorMsg = err.response.data.detail
            .map((d: any) => `${d.loc[d.loc.length - 1]}: ${d.msg}`)
            .join(", ");
        } else if (typeof err.response.data.detail === "string") {
          errorMsg = err.response.data.detail;
        } else if (typeof err.response.data.detail === "object") {
          errorMsg = JSON.stringify(err.response.data.detail);
        }
      }
      
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (showProcessSplash) {
    return (
      <Splash
        title="¡Solicitud Enviada!"
        subtitle="Tu cita está pendiente de aprobación."
        message="Te notificaremos por correo una vez aceptada. Redirigiendo…"
        durationMs={2000}
        onFinish={() => {
          setShowProcessSplash(false);
          navigate("/dashboard");
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-md md:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <BackButton />
          <div className="flex-1 text-center">
            <h1 className={`text-xl font-bold md:text-2xl ${textPrimary}`}>
              ✨ ¡Reserva tu Visita Divertida! ✨
            </h1>
            <p className={`mt-0.5 text-sm ${textMuted}`}>
              🌟 Elijamos el momento perfecto para tu revisión 🌟
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <div className="space-y-8">
          {/* Resumen */}
          <FormCard
            title="¡Reservemos tu visita!"
            subtitle="¡Estamos ansiosos por verte! ✨"
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-xs text-slate-500">Fecha</p>
                  <p className={`font-semibold ${textPrimary}`}>{state?.fechaTexto ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-xs text-slate-500">Hora</p>
                  <p className={`font-semibold ${textPrimary}`}>{state?.hora ?? "—"}</p>
                </div>
              </div>
              <span className="text-2xl">📄</span>
            </div>
          </FormCard>

          {state?.consultorio && (
            <FormCard title="🏥 Consultorio">
              <div className={`flex flex-wrap items-center gap-3 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3`}>
                <span className="text-2xl">🏥</span>
                <div className="min-w-[120px]">
                  <p className="text-xs text-slate-500">Nombre</p>
                  <p className={`font-semibold ${textPrimary}`}>{state.consultorio.nombre}</p>
                </div>
                <div className="min-w-[120px]">
                  <p className="text-xs text-slate-500">Especialidad</p>
                  <p className={`font-semibold ${textPrimary}`}>{state.consultorio.especialidad}</p>
                </div>
                <div className="min-w-[80px]">
                  <p className="text-xs text-slate-500">Número</p>
                  <p className={`font-semibold ${textPrimary}`}>{state.consultorio.numero ?? "—"}</p>
                </div>
                <div className="min-w-[60px]">
                  <p className="text-xs text-slate-500">Piso</p>
                  <p className={`font-semibold ${textPrimary}`}>{typeof state.consultorio.piso === "number" ? state.consultorio.piso : "—"}</p>
                </div>
              </div>
            </FormCard>
          )}

          {/* Paciente */}
          <FormCard title="👶 Acerca de nuestro pequeño paciente">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <span className={inputIconClass}>👤</span>
                <input 
                  className={inputClass} 
                  placeholder="Nombre *" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <span className={inputIconClass}>⭐</span>
                <input 
                  className={inputClass} 
                  placeholder="Apellido *" 
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="relative sm:col-span-2">
                <span className={inputIconClass}>🎂</span>
                <input 
                  type="date" 
                  className={inputClass} 
                  placeholder="Fecha de nacimiento *" 
                  value={fechaNac}
                  onChange={(e) => setFechaNac(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="relative sm:col-span-2">
                <span className={inputIconClass}>⚧</span>
                <select 
                  className={selectClass} 
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  disabled={isLoading}
                >
                  <option className="bg-slate-900" value="">Seleccionar género *</option>
                  <option className="bg-slate-900" value="Masculino">Masculino</option>
                  <option className="bg-slate-900" value="Femenino">Femenino</option>
                  <option className="bg-slate-900" value="Otro">Otro</option>
                </select>
                <ChevronDown className={selectArrowClass} size={18} />
              </div>
            </div>
          </FormCard>

          {/* Tutor */}
          <FormCard title="👤 Información para el tutor">
            <div className="space-y-4">
              <div className="relative">
                <span className={inputIconClass}>🧑</span>
                <input 
                  className={inputClass} 
                  placeholder="Nombre del tutor *" 
                  value={tutorNombre}
                  onChange={(e) => setTutorNombre(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <span className={inputIconClass}>📧</span>
                <input 
                  type="email" 
                  className={inputClass} 
                  placeholder="Correo electrónico *" 
                  value={tutorEmail}
                  onChange={(e) => setTutorEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <span className={inputIconClass}>📞</span>
                <input 
                  className={inputClass} 
                  placeholder="Número de teléfono" 
                  value={tutorTelefono}
                  onChange={(e) => setTutorTelefono(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <span className={inputIconClass}>📝</span>
                <select 
                  className={selectClass} 
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  disabled={isLoading}
                >
                  <option className="bg-slate-900" value="">Motivo de la visita</option>
                  {MOTIVOS.map((m) => (
                    <option className="bg-slate-900" key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className={selectArrowClass} size={18} />
              </div>
            </div>
          </FormCard>

          {/* Tips */}
          <div className={`rounded-2xl border ${accentBorder} ${surfaceLight} p-4 space-y-2`}>
            <p className={`text-sm ${textPrimary}`}>🎁 ¡Tenemos pegatinas para niños valientes!</p>
            <p className={`text-sm ${textPrimary}`}>💛 ¡Trae tu juguete favorito para mayor comodidad!</p>
          </div>

          {message && (
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${message.includes("Error") ? "border-rose-500/60 bg-rose-900/40 text-rose-100" : "border-amber-500/60 bg-amber-900/40 text-amber-100"}`}>
              {message.includes("Error") ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              {message}
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className={`order-2 sm:order-1 rounded-2xl border border-slate-600 ${surfaceLight} px-6 py-3 text-sm font-semibold ${textPrimary} transition hover:bg-slate-800/80 disabled:opacity-50`}
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={`order-1 sm:order-2 rounded-2xl ${accentPrimary} px-6 py-3 text-sm font-semibold ${textOnAccent} shadow-lg shadow-indigo-900/50 transition hover:brightness-110 disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-100/40 border-t-slate-50 mr-2" />
                  Confirmando...
                </>
              ) : (
                <>✔ Confirmar mi Cita</>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
