import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  Search, 
  FileText, 
  ChevronRight, 
  Clock, 
  User,
  LayoutDashboard
} from "lucide-react";
import api from "../../services/api";
import BackButton from "../../components/BackButton";
import { 
  pageBg, 
  textPrimary, 
  textMuted, 
  accentBorder, 
  surfaceLight, 
  accentFocus,
  accentBgSoft
} from "../../theme/colors";

interface PacienteAtendido {
  id: number;
  paciente_id: number;
  hora: string;
  paciente: string;
  motivo: string;
  genero: string;
  edad: number;
  consultorio: string;
  tutor: string;
}

export default function PacientesAtendidos() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<PacienteAtendido[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState<string>(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const fetchPacientesAtendidos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/medico/atendidos", { params: { fecha: fechaFiltro } });
      setPacientes(response.data);
    } catch (error) {
      console.error("Error al obtener pacientes atendidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientesAtendidos();
  }, [fechaFiltro]);

  const pacientesFiltrados = pacientes.filter(p => 
    p.paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.motivo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${pageBg} selection:bg-indigo-500/30 pb-20`}>
      {/* Header Estilo Centro de Mando */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 px-4 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <div className="flex flex-col">
              <h1 className={`text-xl font-black tracking-tighter md:text-2xl ${textPrimary} flex items-center gap-2 uppercase`}>
                <Users className="text-indigo-400" size={24} />
                Pacientes Atendidos
              </h1>
              <p className={`text-[10px] font-bold tracking-widest uppercase ${textMuted}`}>
                Historial de Consultas Finalizadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end px-4 border-r border-white/10">
              <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-1 flex items-center gap-1`}>
                <Calendar size={12} /> Fecha de Consulta
              </label>
              <input
                type="date"
                className="bg-transparent border-none text-sm font-bold text-white outline-none cursor-pointer [color-scheme:dark]"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Buscar paciente..."
                className={`w-40 md:w-64 rounded-xl border border-white/5 bg-slate-900/40 py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-indigo-500/50 transition-all`}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Filtro Móvil */}
        <div className="md:hidden mb-6 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
          <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-2 block`}>
            Seleccionar Fecha
          </label>
          <input
            type="date"
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none [color-scheme:dark]"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-48 animate-pulse rounded-[2rem] ${surfaceLight} border ${accentBorder}`} />
            ))}
          </div>
        ) : pacientesFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientesFiltrados.map((p) => (
              <div 
                key={p.id}
                className={`group relative overflow-hidden rounded-[2rem] border ${accentBorder} ${surfaceLight} p-6 shadow-xl transition-all hover:scale-[1.02] hover:shadow-indigo-500/10`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className={`font-black ${textPrimary} leading-tight`}>{p.paciente}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                        {p.genero} • {p.edad} años
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-indigo-400">{p.hora}</p>
                    <p className={`text-[9px] font-black uppercase tracking-tighter ${textMuted}`}>Hora Atendido</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock size={14} className="text-slate-500" />
                    <span>Motivo: {p.motivo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <LayoutDashboard size={14} className="text-slate-500" />
                    <span>Consultorio: {p.consultorio}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/medico/expediente/${p.paciente_id}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-indigo-500/20 active:scale-95"
                >
                  <FileText size={16} />
                  Ver Expediente
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-white/5">
            <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-slate-600" />
            </div>
            <h3 className={`text-xl font-black ${textPrimary} uppercase tracking-tighter`}>Sin pacientes atendidos</h3>
            <p className={`${textMuted} mt-2`}>No se encontraron registros para la fecha seleccionada.</p>
          </div>
        )}
      </main>
    </div>
  );
}
