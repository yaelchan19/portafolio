import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Stethoscope, MapPin } from "lucide-react";
import FormCard from "../../components/FormCard";
import api from "../../services/api";
import { pageBg, textPrimary, textMuted, accentBorder, surfaceLight } from "../../theme/colors";

interface Consultorio {
  id: number;
  nombre: string;
  numero: string;
  piso: number;
  especialidad: string;
  medico: string;
  estado: "Disponible" | "Ocupado" | "Mantenimiento";
  capacidad: number;
  recursos: string[];
  horario: string;
  ubicacion: string;
  notas?: string;
}

export default function SeleccionarConsultorio() {
  const navigate = useNavigate();
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .get<Consultorio[]>("/consultorios")
      .then((res) => setConsultorios(res.data))
      .catch((err) => console.error(err));
  }, []);

  const visibles = useMemo(() => {
    const disponibles = consultorios.filter((c) => c.estado === "Disponible");
    const q = query.trim().toLowerCase();
    if (!q) return disponibles;
    return disponibles.filter((c) =>
      (c.nombre + " " + c.especialidad + " " + c.medico + " " + c.numero + " " + c.ubicacion).toLowerCase().includes(q)
    );
  }, [consultorios, query]);

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-md md:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-4">
          <div className="text-center">
            <h1 className={`text-xl font-bold md:text-2xl ${textPrimary}`}>Seleccionar Consultorio</h1>
            <p className={`mt-0.5 text-sm ${textMuted}`}>Elige un consultorio disponible para agendar tu cita</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <div className="space-y-8">
          <FormCard title="Buscar">
            <div>
              <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Búsqueda rápida</label>
              <input
                type="text"
                placeholder="Nombre, especialidad, médico…"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </FormCard>

          <section>
            <h2 className={`mb-4 text-lg font-semibold ${textPrimary}`}>Consultorios disponibles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {visibles.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigate("/agendar-cita", { state: { consultorio: c } })}
                  className={`text-left rounded-2xl border ${accentBorder} ${surfaceLight} p-4 transition hover:bg-slate-800/80 hover:border-slate-600/50 active:scale-[0.98]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-slate-600/40 bg-slate-800/60 p-3 text-sky-400">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <p className={`text-base font-semibold ${textPrimary}`}>{c.nombre}</p>
                        <p className={`text-xs ${textMuted}`}>#{c.numero} • Piso {c.piso}</p>
                      </div>
                    </div>
                    <span className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                      Disponible
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className={`flex items-center gap-2 rounded-xl border ${accentBorder} ${surfaceLight} px-3 py-2`}>
                      <Stethoscope size={16} className="text-indigo-400" />
                      <span className={`text-xs ${textMuted}`}>{c.especialidad}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-indigo-400" />
                      <span className={`text-xs ${textMuted}`}>{c.ubicacion}</span>
                    </div>
                  </div>
                </button>
              ))}
              {visibles.length === 0 && (
                <div className={`rounded-2xl border ${accentBorder} ${surfaceLight} p-4`}>
                  <p className={`text-sm ${textMuted}`}>No hay consultorios disponibles según el filtro.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

