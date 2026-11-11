import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Stethoscope, 
  ArrowRight,
  MapPin,
  Clock,
  Search,
  Users
} from "lucide-react";
import api from "../../services/api";
import { 
  pageBg, 
  textPrimary, 
  textMuted, 
  accentBorder, 
  surfaceLight, 
  accentBgSoft 
} from "../../theme/colors";

interface Consultorio {
  id: number;
  nombre: string;
  numero: string;
  piso: number;
  especialidad: string;
  medico: string;
  estado: string;
  horario: string;
  ubicacion: string;
}

export default function MisMedicos() {
  const navigate = useNavigate();
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/consultorios")
      .then(res => setConsultorios(res.data))
      .catch(err => console.error("Error fetching doctors:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = consultorios.filter(c => 
    c.medico.toLowerCase().includes(query.toLowerCase()) ||
    c.especialidad.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${pageBg} selection:bg-indigo-500/30`}>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className={`text-3xl font-black ${textPrimary} flex items-center gap-3 uppercase tracking-tighter`}>
                <Stethoscope className="text-indigo-400" size={32} />
                Nuestros Especialistas
              </h1>
              <p className={`${textMuted} text-sm font-bold uppercase tracking-widest mt-1`}>
                Conoce al equipo que cuida de tu salud familiar
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Buscar médico o especialidad..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-indigo-500/50 focus:bg-slate-900/60 outline-none transition-all"
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`h-64 animate-pulse rounded-[2.5rem] ${surfaceLight} border ${accentBorder}`} />
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((c) => (
              <div 
                key={c.id} 
                onClick={() => navigate("/agendar-cita", { state: { consultorio: c } })}
                className={`group relative overflow-hidden rounded-[2.5rem] border ${accentBorder} ${surfaceLight} p-8 shadow-xl transition-all hover:scale-[1.02] hover:shadow-indigo-500/10 cursor-pointer`}
              >
                {/* Badge de estado */}
                <div className="absolute top-6 right-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    c.estado === 'Disponible' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {c.estado}
                  </span>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
                    <User size={48} />
                  </div>
                  
                  <h3 className={`text-xl font-black ${textPrimary} leading-tight mb-1`}>{c.medico}</h3>
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">{c.especialidad}</p>
                  
                  <div className="w-full space-y-3 mb-8 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin size={14} className="text-slate-500" />
                      <span>{c.nombre} • Piso {c.piso}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Clock size={14} className="text-slate-500" />
                      <span>{c.horario}</span>
                    </div>
                  </div>

                  <button 
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group/btn"
                  >
                    Agendar con el Doctor
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-[3rem] border-2 border-dashed border-white/10 p-20 text-center`}>
            <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-slate-700" />
            </div>
            <h3 className={`text-xl font-black ${textPrimary} uppercase tracking-tighter mb-2`}>No se encontraron médicos</h3>
            <p className={textMuted}>Prueba con otros términos de búsqueda.</p>
          </div>
        )}
      </main>
    </div>
  );
}
