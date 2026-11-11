import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, Users, Clock, ArrowRight, Sparkles, Stethoscope, Bell, Volume2, Calendar } from "lucide-react";
import api from "../../services/api";
import {
  pageBg,
  textPrimary,
  textMuted,
  accentBorder,
  surfaceLight,
  accentPrimary,
  textOnAccent,
  accentBgSoft,
} from "../../theme/colors";

interface SalaData {
  actual: { nombre: string; estado: string };
  siguiente: { nombre: string; hora: string; tiempo: string };
  restantes: { nombre: string; hora: string; tiempo: string }[];
  estadisticas: { promedio: string; esperando: number };
}

export default function SalaEspera() {
  const navigate = useNavigate();
  const [data, setData] = useState<SalaData | null>(null);
  const [hora, setHora] = useState<string>("");
  const [fechaFiltro, setFechaFiltro] = useState<string>(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchData = () => {
      api
        .get("/sala-espera/", { params: { fecha: fechaFiltro } })
        .then((res) => setData(res.data))
        .catch((err) => console.error(err));
    };

    fetchData();
    const dataInterval = setInterval(fetchData, 10000); // Actualizar cada 10 segundos

    const clockInterval = setInterval(() => {
      setHora(
        new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, [fechaFiltro]);

  const fechaTexto = new Date(fechaFiltro + "T12:00:00").toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const fecha = fechaTexto; // Alias para evitar errores de referencia antiguos

  return (
    <div className={`min-h-screen ${pageBg} overflow-x-hidden`}>
      {/* Header Estilo Pantalla de Información */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className={`text-xl font-black tracking-tighter md:text-3xl ${textPrimary} flex items-center gap-2 uppercase`}>
                <Monitor className="text-sky-400" size={28} />
                Sistema de Turnos
              </h1>
              <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${textMuted}`}>
                Clínica Infantil Pro · Sala de Espera Virtual
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex flex-col items-end border-r border-white/10 pr-3 md:pr-6">
              <div className="flex items-center gap-2 mb-0.5">
                <Calendar className="text-sky-400" size={16} />
                <input
                  type="date"
                  value={fechaFiltro}
                  onChange={(e) => setFechaFiltro(e.target.value)}
                  className="bg-transparent border-none text-[10px] md:text-sm font-bold text-slate-100 outline-none cursor-pointer hover:text-sky-400 transition-colors [color-scheme:dark]"
                />
              </div>
              <p className={`hidden sm:flex text-[9px] md:text-[10px] font-bold tracking-tight ${textMuted} uppercase items-center gap-1`}>
                {fechaTexto}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-xl md:rounded-2xl px-3 md:px-6 py-1.5 md:py-2 border border-white/5 shadow-inner">
              <p className="text-sm md:text-2xl font-black tabular-nums text-sky-400 tracking-tight drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                {hora || "--:--:--"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {!data ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-400/20 border-t-sky-400" />
            <p className={`text-lg font-medium animate-pulse ${textMuted}`}>Sincronizando con el servidor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* PANEL IZQUIERDO: ACTUAL Y SIGUIENTE */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* TARJETA PACIENTE ACTUAL - EL MÁS LLAMATIVO */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-sky-400/30 bg-slate-900/40 p-1 shadow-2xl shadow-sky-500/10">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Stethoscope size={200} />
                </div>
                
                <div className="relative rounded-[2.3rem] bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/30 p-8 md:p-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-400/20 px-4 py-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">En Consulta Ahora</span>
                      </div>
                      
                      <h2 className={`text-4xl md:text-6xl font-black tracking-tight ${textPrimary}`}>
                        {data.actual.nombre === "Nadie en consulta" ? (
                          <span className="opacity-40 italic">Esperando Paciente...</span>
                        ) : (
                          data.actual.nombre
                        )}
                      </h2>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Bell size={20} className="animate-bounce" />
                          <span className="text-xl font-bold uppercase tracking-tight">Pasar al Consultorio</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-2">
                       <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-sky-500/10 border-4 border-sky-400/20 flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(56,189,248,0.15)]">
                          {data.actual.nombre === "Nadie en consulta" ? "😴" : "🩺"}
                       </div>
                       <div className="mt-4 text-center md:text-right">
                          <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Estado Actual</p>
                          <p className="text-xl font-black text-sky-400 uppercase">{data.actual.estado}</p>
                       </div>
                    </div>
                  </div>
                </div>
                
                {/* Ticker inferior decorativo */}
                <div className="bg-sky-500/10 border-t border-sky-400/20 px-8 py-3 flex items-center gap-3">
                  <Volume2 size={16} className="text-sky-400" />
                  <div className="overflow-hidden whitespace-nowrap">
                    <p className="inline-block animate-[scroll_20s_linear_infinite] text-xs font-bold text-sky-300/80 uppercase tracking-widest">
                       Favor de estar atentos a la pantalla • Mantenga su turno a la mano • Los tiempos son estimados • Clínica Infantil Pro agradece su preferencia • 
                    </p>
                  </div>
                </div>
              </div>

              {/* SIGUIENTE PACIENTE - DISEÑO TIPO TICKET */}
              <div className="relative overflow-hidden rounded-[2rem] border border-indigo-400/20 bg-indigo-500/5 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-bold uppercase tracking-widest flex items-center gap-2 ${textPrimary}`}>
                    <ArrowRight className="text-indigo-400" size={20} />
                    Siguiente en Turno
                  </h3>
                  <Sparkles className="text-amber-400" size={20} />
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/60 rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-3xl">
                      👶
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${textPrimary}`}>{data.siguiente.nombre}</p>
                      <p className={`text-sm ${textMuted} flex items-center gap-1`}>
                        <Clock size={14} /> Cita Programada: <span className="text-indigo-300 font-bold">{data.siguiente.hora}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted} mb-1`}>Tiempo Estimado</p>
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-500 text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                      {data.siguiente.tiempo}
                    </div>
                  </div>
                </div>
              </div>

              {/* ESTADÍSTICAS RÁPIDAS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-5 text-center transition hover:bg-slate-900/50">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-1`}>Espera Promedio</p>
                  <p className={`text-2xl font-black text-sky-400`}>{data.estadisticas.promedio}</p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-5 text-center transition hover:bg-slate-900/50">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-1`}>En Espera</p>
                  <p className={`text-2xl font-black text-indigo-400`}>{data.estadisticas.esperando}</p>
                </div>
                <div className="col-span-2 rounded-3xl border border-white/5 bg-emerald-500/5 p-5 flex items-center justify-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl">✅</div>
                  <p className={`text-xs font-bold ${textPrimary} uppercase tracking-tight`}>
                    Todas las salas operando normalmente
                  </p>
                </div>
              </div>
            </div>

            {/* PANEL DERECHO: COLA COMPLETA */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex flex-col h-full rounded-[2.5rem] border border-white/10 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                  <h3 className={`text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 ${textPrimary}`}>
                    <Users size={18} className="text-sky-400" />
                    Turnos Pendientes
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar max-h-[600px]">
                  {data.restantes.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className={`text-sm ${textMuted}`}>No hay más turnos hoy</p>
                    </div>
                  ) : (
                    data.restantes.map((r, i) => (
                      <div
                        key={i}
                        className="group flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/40 p-4 transition-all hover:bg-slate-800/60 hover:translate-x-1"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-lg group-hover:scale-110 transition">
                            🎈
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${textPrimary}`}>{r.nombre}</p>
                            <p className={`text-[10px] font-medium ${textMuted} uppercase`}>Paciente</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-sky-400">{r.hora}</p>
                          <p className={`text-[10px] font-bold ${textMuted} uppercase`}>Hora</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Footer del panel derecho */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-xl">⭐</span>
                    <p className={`text-[10px] font-bold leading-relaxed ${textPrimary} uppercase tracking-tight`}>
                      Prioridad amigable para <span className="text-amber-400 font-black">{data.siguiente.nombre}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Nota amigable inferior */}
              <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-600 p-6 text-white shadow-xl shadow-indigo-500/20">
                <h4 className="font-black text-lg mb-1 flex items-center gap-2 uppercase tracking-tighter">
                  <Sparkles size={18} /> ¿Sabías que?
                </h4>
                <p className="text-xs font-bold leading-relaxed opacity-90 uppercase">
                  ¡Tenemos pegatinas y sorpresas para todos nuestros pacientes valientes al terminar su consulta! 🎁
                </p>
              </div>
            </div>

          </div>
        )}
      </main>
      
      {/* Footer Estilo Pantalla - Marquee opcional */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-white/10 py-2 px-8 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 overflow-hidden">
           <div className="flex items-center gap-2 whitespace-nowrap">
             <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Sistema En Línea</span>
           </div>
           <div className="flex-1 overflow-hidden">
             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] text-center whitespace-nowrap animate-[scroll_40s_linear_infinite]">
               Clínica Infantil Pro · El mejor cuidado para los más pequeños · Consultorios 1 al 5 Operando · Por favor espere su turno · Bienvenidos · 
             </p>
           </div>
           <div className={`text-[10px] font-black uppercase tracking-widest ${textMuted} whitespace-nowrap`}>
             v2.4.0 Virtual-Board
           </div>
        </div>
      </footer>
      
      {/* Estilos adicionales para animaciones custom */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
