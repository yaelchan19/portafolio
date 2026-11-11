import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Stethoscope, MapPin, Clock, Users, CheckCircle, Plus, X } from "lucide-react";
import FormCard from "../../components/FormCard";
import Splash from "../../components/Splash";
import BackButton from "../../components/BackButton";
import api from "../../services/api";
import { AxiosError } from "axios";
import { pageBg, textPrimary, textMuted, accentBorder, surfaceLight, accentBg, textOnAccent, danger, dangerHover } from "../../theme/colors";
import { ESTADOS_CONSULTORIO, estadoBadgeClass } from "./constants";
import type { EstadoConsultorio } from "./constants";

interface Consultorio {
  id: number;
  nombre: string;
  numero: string;
  piso: number;
  especialidad: string;
  medico: string;
  estado: EstadoConsultorio;
  capacidad: number;
  recursos: string[];
  horario: string;
  ubicacion: string;
  notas?: string;
}

const inputClass = `w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none`;

export default function SeleccionConsultorio() {
  const navigate = useNavigate();
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoConsultorio | "Todos">("Todos");
  const [seleccionado, setSeleccionado] = useState<Consultorio | null>(null);
  const [showProcessSplash, setShowProcessSplash] = useState(false);
  const [query, setQuery] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"" | "error" | "success">("");
  const [form, setForm] = useState({
    nombre: "",
    numero: "",
    piso: 1,
    especialidad: "",
    medico: "",
    estado: "Disponible" as EstadoConsultorio,
    capacidad: 1,
    recursosInput: "",
    horario: "",
    ubicacion: "",
    notas: "",
  });
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [formEdit, setFormEdit] = useState({
    nombre: "",
    numero: "",
    piso: 1,
    especialidad: "",
    medico: "",
    estado: "Disponible" as EstadoConsultorio,
    capacidad: 1,
    recursosInput: "",
    horario: "",
    ubicacion: "",
    notas: "",
  });
  const [doctores, setDoctores] = useState<{ id: number; nombre: string }[]>([]);
  const [showDocSuggestions, setShowDocSuggestions] = useState(false);
  const [docSearch, setDocSearch] = useState("");

  const filteredDoctores = useMemo(() => {
    return doctores.filter(d => 
      d.nombre.toLowerCase().includes(docSearch.toLowerCase())
    );
  }, [doctores, docSearch]);

  useEffect(() => {
    api
      .get<Consultorio[]>("/consultorios/")
      .then((res) => setConsultorios(res.data))
      .catch((err) => console.error(err));
    
    // Cargar doctores registrados
    api
      .get("/usuarios/?rol=medico")
      .then((res) => setDoctores(res.data))
      .catch((err) => console.error("Error cargando médicos:", err));
  }, []);

  const visibles = useMemo(() => {
    const byEstado = filtroEstado === "Todos" ? consultorios : consultorios.filter((c) => c.estado === filtroEstado);
    const q = query.trim().toLowerCase();
    if (!q) return byEstado;
    return byEstado.filter((c) =>
      (c.nombre + " " + c.especialidad + " " + c.medico + " " + c.numero + " " + c.ubicacion).toLowerCase().includes(q)
    );
  }, [consultorios, filtroEstado, query]);

  if (showProcessSplash) {
    return (
      <Splash
        title="Consultorio seleccionado"
        subtitle={seleccionado ? seleccionado.nombre : "Procesando selección…"}
        message="Redirigiendo al panel…"
        durationMs={1400}
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
        <div className="mx-auto flex max-w-5xl items-center gap-3 sm:gap-4">
          <BackButton />
          <div className="flex-1 text-center min-w-0">
            <h1 className={`text-lg sm:text-xl font-bold md:text-2xl ${textPrimary} truncate`}>
              🏥 Selección De Consultorio
            </h1>
            <p className={`mt-0.5 text-[10px] sm:text-sm ${textMuted} truncate`}>Elige el espacio adecuado para tu atención</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <div className="space-y-8">
          <FormCard
            title="Filtrar y buscar"
            subtitle="Encuentra el consultorio ideal por estado"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Estado</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as EstadoConsultorio | "Todos")}
                  className={inputClass}
                >
                  <option value="Todos">Todos</option>
                  {ESTADOS_CONSULTORIO.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Búsqueda rápida</label>
                <input
                  type="text"
                  placeholder="Nombre, especialidad, médico…"
                  className={inputClass}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </FormCard>

          <FormCard title="Nuevo consultorio" subtitle="Completa los datos y crea un consultorio">
            {tipoMensaje && (
              <div className={`rounded-xl border px-4 py-3 text-sm ${tipoMensaje === "error" ? "border-rose-400/40 bg-rose-500/10 text-rose-100" : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"}`}>
                {mensaje}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMostrarForm(!mostrarForm)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 ${mostrarForm ? "border border-slate-500 bg-slate-800/60 text-slate-200" : `${accentBg} ${textOnAccent}`}`}
              >
                {mostrarForm ? (
                  <>
                    <X size={18} />
                    Cerrar
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Agregar Consultorio
                  </>
                )}
              </button>
            </div>
            {mostrarForm && (
              <div className="space-y-4 rounded-2xl border border-slate-700/70 bg-slate-900/40 p-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Nombre</label>
                    <input
                      className={inputClass}
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Número</label>
                    <input
                      className={inputClass}
                      value={form.numero}
                      onChange={(e) => setForm({ ...form, numero: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Piso</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={form.piso}
                      onChange={(e) => setForm({ ...form, piso: Number(e.target.value) })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Especialidad</label>
                    <input
                      className={inputClass}
                      value={form.especialidad}
                      onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Médico Responsable</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          className={inputClass}
                          placeholder="Buscar o escribir nombre..."
                          value={form.medico}
                          onChange={(e) => {
                            setForm({ ...form, medico: e.target.value });
                            setDocSearch(e.target.value);
                            setShowDocSuggestions(true);
                          }}
                          onFocus={() => setShowDocSuggestions(true)}
                        />
                        {showDocSuggestions && docSearch && (
                          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                            {filteredDoctores.length > 0 ? (
                              filteredDoctores.map((d) => (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => {
                                    setForm({ ...form, medico: d.nombre });
                                    setShowDocSuggestions(false);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-indigo-600 transition-colors"
                                >
                                  {d.nombre}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-2.5 text-xs text-slate-500 italic">
                                No se encontraron médicos registrados. Puedes escribir el nombre manualmente.
                              </div>
                            )}
                            <div className="border-t border-slate-700 px-4 py-2 bg-slate-950/50">
                              <button
                                type="button"
                                onClick={() => setShowDocSuggestions(false)}
                                className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300"
                              >
                                Cerrar sugerencias
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Estado</label>
                    <select
                      className={inputClass}
                      value={form.estado}
                      onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoConsultorio })}
                    >
                      {ESTADOS_CONSULTORIO.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Capacidad</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={form.capacidad}
                      onChange={(e) => setForm({ ...form, capacidad: Number(e.target.value) })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Recursos (separar por coma)</label>
                    <input
                      className={inputClass}
                      value={form.recursosInput}
                      onChange={(e) => setForm({ ...form, recursosInput: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Horario</label>
                    <input
                      className={inputClass}
                      value={form.horario}
                      onChange={(e) => setForm({ ...form, horario: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Ubicación</label>
                    <input
                      className={inputClass}
                      value={form.ubicacion}
                      onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Notas</label>
                    <textarea
                      className={inputClass}
                      value={form.notas}
                      onChange={(e) => setForm({ ...form, notas: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 ${accentBg} ${textOnAccent}`}
                    onClick={async () => {
                      if (!form.nombre || !form.numero || !form.especialidad || !form.medico || !form.horario || !form.ubicacion) return;
                      const recursos = form.recursosInput
                        .split(",")
                        .map((r) => r.trim())
                        .filter((r) => r.length > 0);
                      const payload = {
                        nombre: form.nombre,
                        numero: form.numero,
                        piso: form.piso,
                        especialidad: form.especialidad,
                        medico: form.medico,
                        estado: form.estado,
                        capacidad: form.capacidad,
                        recursos,
                        horario: form.horario,
                        ubicacion: form.ubicacion,
                        notas: form.notas || null,
                      };
                      try {
                        const res = await api.post<Consultorio>("/consultorios/", payload);
                        setConsultorios((prev) => [...prev, res.data]);
                        setMensaje("Consultorio creado correctamente");
                        setTipoMensaje("success");
                        setMostrarForm(false);
                        setForm({
                          nombre: "",
                          numero: "",
                          piso: 1,
                          especialidad: "",
                          medico: "",
                          estado: "Disponible",
                          capacidad: 1,
                          recursosInput: "",
                          horario: "",
                          ubicacion: "",
                          notas: "",
                        });
                        setTimeout(() => setShowProcessSplash(true), 300);
                      } catch (e) {
                        if (e instanceof AxiosError) {
                          const detail = e.response?.data?.detail;
                          setMensaje(typeof detail === "string" ? detail : "Error al crear consultorio");
                          setTipoMensaje("error");
                        } else {
                          setMensaje("Error inesperado");
                          setTipoMensaje("error");
                        }
                      }
                    }}
                  >
                    <CheckCircle size={18} />
                    Crear consultorio
                  </button>
                </div>
              </div>
            )}
          </FormCard>

          <section>
            <h2 className={`mb-4 text-lg font-semibold ${textPrimary}`}>Consultorios disponibles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {visibles.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSeleccionado(c);
                    setMostrarEditar(false);
                    setFormEdit({
                      nombre: c.nombre,
                      numero: c.numero,
                      piso: c.piso,
                      especialidad: c.especialidad,
                      medico: c.medico,
                      estado: c.estado,
                      capacidad: c.capacidad,
                      recursosInput: c.recursos.join(", "),
                      horario: c.horario,
                      ubicacion: c.ubicacion,
                      notas: c.notas || "",
                    });
                  }}
                  className={`text-left rounded-2xl border ${accentBorder} ${surfaceLight} p-4 transition hover:bg-slate-800/80 hover:border-slate-600/50 active:scale-[0.98]`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl sm:rounded-2xl border border-slate-600/40 bg-slate-800/60 p-2 sm:p-3 text-sky-400 shrink-0">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm sm:text-base font-semibold ${textPrimary} truncate`}>{c.nombre}</p>
                        <p className={`text-[10px] sm:text-xs ${textMuted} truncate`}>#{c.numero} • Piso {c.piso} • {c.especialidad}</p>
                      </div>
                    </div>
                    <span className={`self-start rounded-xl border px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium ${estadoBadgeClass[c.estado]}`}>
                      {c.estado}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <div className={`flex items-center gap-2 rounded-xl border ${accentBorder} ${surfaceLight} px-3 py-2 min-w-0`}>
                      <Stethoscope size={14} className="text-indigo-400 shrink-0" />
                      <span className={`text-[10px] sm:text-xs ${textMuted} truncate`}>{c.medico}</span>
                    </div>
                    <div className={`flex items-center gap-2 rounded-xl border ${accentBorder} ${surfaceLight} px-3 py-2 min-w-0`}>
                      <Clock size={14} className="text-indigo-400 shrink-0" />
                      <span className={`text-[10px] sm:text-xs ${textMuted} truncate`}>{c.horario}</span>
                    </div>
                    <div className={`flex items-center gap-2 rounded-xl border ${accentBorder} ${surfaceLight} px-3 py-2 min-w-0`}>
                      <Users size={14} className="text-indigo-400 shrink-0" />
                      <span className={`text-[10px] sm:text-xs ${textMuted} truncate`}>Cap. {c.capacidad}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 min-w-0">
                    <MapPin size={14} className="text-indigo-400 shrink-0" />
                    <span className={`text-[10px] sm:text-xs ${textMuted} truncate`}>{c.ubicacion}</span>
                  </div>
                </button>
              ))}
              {visibles.length === 0 && (
                <div className={`rounded-2xl border ${accentBorder} ${surfaceLight} p-4`}>
                  <p className={`text-sm ${textMuted}`}>No hay consultorios para el filtro seleccionado.</p>
                </div>
              )}
            </div>
          </section>

          {seleccionado && (
            <FormCard
              title="Detalle del consultorio"
              subtitle="Información completa antes de confirmar"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-lg font-semibold ${textPrimary}`}>{seleccionado.nombre}</p>
                    <p className={`text-sm ${textMuted}`}>#{seleccionado.numero} • Piso {seleccionado.piso} • {seleccionado.especialidad}</p>
                  </div>
                  <span className={`rounded-xl border px-3 py-1 text-xs font-medium ${estadoBadgeClass[seleccionado.estado]}`}>
                    {seleccionado.estado}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={`rounded-2xl border ${accentBorder} ${surfaceLight} p-3`}>
                    <p className={`text-xs font-medium ${textMuted}`}>Médico asignado</p>
                    <p className={`mt-1 text-sm ${textPrimary}`}>{seleccionado.medico}</p>
                  </div>
                  <div className={`rounded-2xl border ${accentBorder} ${surfaceLight} p-3`}>
                    <p className={`text-xs font-medium ${textMuted}`}>Horario</p>
                    <p className={`mt-1 text-sm ${textPrimary}`}>{seleccionado.horario}</p>
                  </div>
                </div>
                <div className={`rounded-2xl border ${accentBorder} ${surfaceLight} p-3`}>
                  <p className={`text-xs font-medium ${textMuted}`}>Recursos</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {seleccionado.recursos.map((r, i) => (
                      <span key={i} className="rounded-lg border border-slate-600/40 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-300">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                {seleccionado.notas && (
                  <div className={`rounded-2xl border ${accentBorder} ${surfaceLight} p-3`}>
                    <p className={`text-xs font-medium ${textMuted}`}>Notas</p>
                    <p className={`mt-1 text-sm ${textPrimary}`}>{seleccionado.notas}</p>
                  </div>
                )}
                <div className="flex gap-2 justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 ${accentBg} ${textOnAccent}`}
                      onClick={() => setMostrarEditar(!mostrarEditar)}
                    >
                      <Plus size={18} />
                      Editar
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${danger} ${textOnAccent} ${dangerHover}`}
                      onClick={async () => {
                        try {
                          await api.delete(`/consultorios/${seleccionado.id}/`);
                          setConsultorios((prev) => prev.filter((x) => x.id !== seleccionado.id));
                          setSeleccionado(null);
                          setMensaje("Consultorio eliminado");
                          setTipoMensaje("success");
                        } catch (e) {
                          if (e instanceof AxiosError) {
                            const detail = e.response?.data?.detail;
                            setMensaje(typeof detail === "string" ? detail : "Error al eliminar consultorio");
                            setTipoMensaje("error");
                          } else {
                            setMensaje("Error inesperado");
                            setTipoMensaje("error");
                          }
                        }
                      }}
                    >
                      <X size={18} />
                      Eliminar
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 ${accentBg} ${textOnAccent}`}
                      onClick={() => setShowProcessSplash(true)}
                      disabled={seleccionado.estado !== "Disponible"}
                      title={seleccionado.estado !== "Disponible" ? "Solo se pueden confirmar consultorios disponibles" : "Confirmar selección"}
                    >
                      <CheckCircle size={18} />
                      Confirmar selección
                    </button>
                  </div>
                </div>
                {mostrarEditar && (
                  <div className="space-y-4 rounded-2xl border border-slate-700/70 bg-slate-900/40 p-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Nombre</label>
                        <input className={inputClass} value={formEdit.nombre} onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })} />
                      </div>
                      <div>
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Número</label>
                        <input className={inputClass} value={formEdit.numero} onChange={(e) => setFormEdit({ ...formEdit, numero: e.target.value })} />
                      </div>
                      <div>
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Piso</label>
                        <input type="number" className={inputClass} value={formEdit.piso} onChange={(e) => setFormEdit({ ...formEdit, piso: Number(e.target.value) })} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Especialidad</label>
                        <input className={inputClass} value={formEdit.especialidad} onChange={(e) => setFormEdit({ ...formEdit, especialidad: e.target.value })} />
                      </div>
                      <div className="relative">
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Médico Responsable</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          className={inputClass}
                          placeholder="Buscar o escribir nombre..."
                          value={formEdit.medico}
                          onChange={(e) => {
                            setFormEdit({ ...formEdit, medico: e.target.value });
                            setDocSearch(e.target.value);
                            setShowDocSuggestions(true);
                          }}
                          onFocus={() => setShowDocSuggestions(true)}
                        />
                        {showDocSuggestions && docSearch && (
                          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                            {filteredDoctores.length > 0 ? (
                              filteredDoctores.map((d) => (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => {
                                    setFormEdit({ ...formEdit, medico: d.nombre });
                                    setShowDocSuggestions(false);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-indigo-600 transition-colors"
                                >
                                  {d.nombre}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-2.5 text-xs text-slate-500 italic">
                                No se encontraron médicos registrados. Puedes escribir el nombre manualmente.
                              </div>
                            )}
                            <div className="border-t border-slate-700 px-4 py-2 bg-slate-950/50">
                              <button
                                type="button"
                                onClick={() => setShowDocSuggestions(false)}
                                className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300"
                              >
                                Cerrar sugerencias
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                      <div>
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Estado</label>
                        <select className={inputClass} value={formEdit.estado} onChange={(e) => setFormEdit({ ...formEdit, estado: e.target.value as EstadoConsultorio })}>
                          {ESTADOS_CONSULTORIO.map((e) => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Capacidad</label>
                        <input type="number" className={inputClass} value={formEdit.capacidad} onChange={(e) => setFormEdit({ ...formEdit, capacidad: Number(e.target.value) })} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Recursos (separar por coma)</label>
                        <input className={inputClass} value={formEdit.recursosInput} onChange={(e) => setFormEdit({ ...formEdit, recursosInput: e.target.value })} />
                      </div>
                      <div>
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Horario</label>
                        <input className={inputClass} value={formEdit.horario} onChange={(e) => setFormEdit({ ...formEdit, horario: e.target.value })} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Ubicación</label>
                        <input className={inputClass} value={formEdit.ubicacion} onChange={(e) => setFormEdit({ ...formEdit, ubicacion: e.target.value })} />
                      </div>
                      <div className="sm:col-span-3">
                        <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Notas</label>
                        <textarea className={inputClass} value={formEdit.notas} onChange={(e) => setFormEdit({ ...formEdit, notas: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 ${accentBg} ${textOnAccent}`}
                        onClick={async () => {
                          const recursos = formEdit.recursosInput.split(",").map((r) => r.trim()).filter((r) => r.length > 0);
                          const payload = {
                            nombre: formEdit.nombre,
                            numero: formEdit.numero,
                            piso: formEdit.piso,
                            especialidad: formEdit.especialidad,
                            medico: formEdit.medico,
                            estado: formEdit.estado,
                            capacidad: formEdit.capacidad,
                            recursos,
                            horario: formEdit.horario,
                            ubicacion: formEdit.ubicacion,
                            notas: formEdit.notas || null,
                          };
                          try {
                            const res = await api.put<Consultorio>(`/consultorios/${seleccionado.id}/`, payload);
                            setConsultorios((prev) => prev.map((x) => (x.id === seleccionado.id ? res.data : x)));
                            setSeleccionado(res.data);
                            setMostrarEditar(false);
                            setMensaje("Consultorio actualizado");
                            setTipoMensaje("success");
                          } catch (e) {
                            if (e instanceof AxiosError) {
                              const detail = e.response?.data?.detail;
                              setMensaje(typeof detail === "string" ? detail : "Error al actualizar consultorio");
                              setTipoMensaje("error");
                            } else {
                              setMensaje("Error inesperado");
                              setTipoMensaje("error");
                            }
                          }
                        }}
                      >
                        <CheckCircle size={18} />
                        Guardar cambios
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </FormCard>
          )}
        </div>
      </main>
    </div>
  );
}
