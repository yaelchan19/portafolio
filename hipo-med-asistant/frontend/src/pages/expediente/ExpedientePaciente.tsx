import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Printer, Plus, Save, X, Pencil, Trash2, Settings, TrendingUp, Ruler, Scale } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import FormCard from "../../components/FormCard";
import Splash from "../../components/Splash";
import BackButton from "../../components/BackButton";
import api from "../../services/api";
import {
  pageBg,
  textPrimary,
  textMuted,
  textOnAccent,
  accentPrimary,
  accentBorder,
  surfaceLight,
  accentFocus,
  accentBg,
  danger,
} from "../../theme/colors";

interface Alergia {
  id: number;
  nombre: string;
}

interface Medicamento {
  id: number;
  nombre: string;
  dosis: string;
}

interface Entrada {
  id: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  altura?: string;
  peso?: string;
  temperatura?: string;
}

interface PacienteState {
  id?: number;
  paciente: string;
  genero?: string;
  edad: number;
  tutor?: string;
  email?: string;
  telefono?: string;
  motivo?: string;
  estado?: string;
  consultorio?: string;
}

const TIPOS_ENTRADA = [
  { value: "Revisión", label: "🩺 Revisión" },
  { value: "Vacunación", label: "💉 Vacunación" },
  { value: "Enfermedad", label: "🤒 Enfermedad" },
  { value: "Lesión", label: "🩹 Lesión" },
  { value: "Especialista", label: "👨‍⚕️ Especialista" },
] as const;

const ICONO_TIPO: Record<string, string> = {
  Revisión: "🩺",
  Vacunación: "💉",
  Enfermedad: "🤒",
  Lesión: "🩹",
  Especialista: "👨‍⚕️",
};

const inputClass = `w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ${accentFocus}`;
const inputIconCenter = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 text-lg";
const inputIconTop = "pointer-events-none absolute left-3 top-3 text-sky-400 text-lg";

export default function ExpedientePaciente() {
  const { state } = useLocation() as { state?: PacienteState | null };
  const navigate = useNavigate();
  const params = useParams();
  const pacienteId = params.id ? parseInt(params.id) : state?.id ?? 1;
  const [paciente, setPaciente] = useState<PacienteState>({ paciente: "Paciente", edad: 0, tutor: "" });

  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarFormMedico, setMostrarFormMedico] = useState(false);
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  
  const [nuevaAlergia, setNuevaAlergia] = useState("");
  const [nuevoMedicamento, setNuevoMedicamento] = useState({ nombre: "", dosis: "" });
  const [editandoAlergia, setEditandoAlergia] = useState<{ id: number; nombre: string } | null>(null);
  const [editandoMedicamento, setEditandoMedicamento] = useState<{ id: number; nombre: string; dosis: string } | null>(null);
  const [form, setForm] = useState({
    tipo: "Revisión",
    altura: "",
    peso: "",
    temperatura: "",
    descripcion: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    tipo: "Revisión",
    altura: "",
    peso: "",
    temperatura: "",
    descripcion: "",
  });
  const [showProcessSplash, setShowProcessSplash] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [printOptions, setPrintOptions] = useState({
    includeDescripcion: true,
    includeAltura: true,
    includePeso: true,
    includeTemp: true,
  });

  const userStr = localStorage.getItem("usuario");
  const user = userStr ? JSON.parse(userStr) : null;
  const canEdit = user?.rol === "admin" || user?.rol === "medico";

  const fetchExpediente = () => {
    api
      .get(`/expedientes/${pacienteId}/`)
      .then((res) => {
        const data = res.data;
        if (data?.perfil) {
          setPaciente({
            id: data.perfil.id,
            paciente: data.perfil.paciente,
            genero: data.perfil.genero,
            edad: data.perfil.edad,
            tutor: data.perfil.tutor,
            email: data.perfil.email,
            telefono: data.perfil.telefono,
            consultorio: data.perfil.consultorio || state?.consultorio,
          });
        }
        if (Array.isArray(data?.entradas)) {
          const mapped: Entrada[] = data.entradas.map((e: {
            id: number;
            tipo: string;
            descripcion: string;
            fecha: string;
            altura?: string;
            peso?: string;
            temperatura?: string;
          }) => ({
            id: e.id,
            tipo: e.tipo,
            descripcion: e.descripcion,
            fecha: e.fecha,
            altura: e.altura,
            peso: e.peso,
            temperatura: e.temperatura,
          }));
          setEntradas(mapped);
        }
        if (Array.isArray(data?.alergias)) {
          setAlergias(data.alergias);
        }
        if (Array.isArray(data?.medicamentos)) {
          setMedicamentos(data.medicamentos);
        }
      })
      .catch(() => {
        setPaciente(state ?? { paciente: "Paciente", edad: 0, tutor: "" });
      });
  };

  useEffect(() => {
    fetchExpediente();
  }, [pacienteId, state]);

  const guardarEntrada = async () => {
    if (!form.descripcion.trim()) {
      alert("Ingresa la descripción");
      return;
    }
    try {
      const payload = {
        tipo: form.tipo,
        descripcion: form.descripcion,
        altura: form.altura || undefined,
        peso: form.peso || undefined,
        temperatura: form.temperatura || undefined,
      };
      const res = await api.post(`/expedientes/${pacienteId}/entradas/`, payload);
      const nueva: Entrada = {
        id: res.data.id,
        tipo: res.data.tipo,
        descripcion: res.data.descripcion,
        fecha: res.data.fecha,
        altura: res.data.altura,
        peso: res.data.peso,
        temperatura: res.data.temperatura,
      };
      setEntradas([nueva, ...entradas]);
      setForm({ tipo: "Revisión", altura: "", peso: "", temperatura: "", descripcion: "" });
      setMostrarForm(false);
      setShowProcessSplash(true);
    } catch {
      alert("Error al guardar la entrada");
    }
  };

  // CRUD Unificado Alergias y Medicamentos
  const guardarDatosMedicos = async () => {
    const tieneAlergia = nuevaAlergia.trim() !== "";
    const tieneMedicamento = nuevoMedicamento.nombre.trim() !== "";

    if (!tieneAlergia && !tieneMedicamento) {
      alert("Por favor, ingresa al menos una alergia o un medicamento.");
      return;
    }

    try {
      const promesas = [];
      if (tieneAlergia) {
        promesas.push(api.post(`/expedientes/${pacienteId}/alergias`, { nombre: nuevaAlergia }));
      }
      if (tieneMedicamento) {
        promesas.push(api.post(`/expedientes/${pacienteId}/medicamentos`, nuevoMedicamento));
      }

      await Promise.all(promesas);
      
      setNuevaAlergia("");
      setNuevoMedicamento({ nombre: "", dosis: "" });
      fetchExpediente();
      setMostrarFormMedico(false);
      alert("Información guardada correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la información médica.");
    }
  };

  const guardarEdicionAlergia = async () => {
    if (!editandoAlergia || !editandoAlergia.nombre.trim()) return;
    try {
      await api.put(`/expedientes/${pacienteId}/alergias/${editandoAlergia.id}`, { nombre: editandoAlergia.nombre });
      setEditandoAlergia(null);
      fetchExpediente();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar alergia");
    }
  };

  const eliminarAlergia = async (alergiaId: number) => {
    if (!confirm("¿Deseas eliminar esta alergia?")) return;
    try {
      await api.delete(`/expedientes/${pacienteId}/alergias/${alergiaId}`);
      fetchExpediente();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar alergia");
    }
  };

  const guardarEdicionMedicamento = async () => {
    if (!editandoMedicamento || !editandoMedicamento.nombre.trim()) return;
    try {
      await api.put(`/expedientes/${pacienteId}/medicamentos/${editandoMedicamento.id}`, {
        nombre: editandoMedicamento.nombre,
        dosis: editandoMedicamento.dosis
      });
      setEditandoMedicamento(null);
      fetchExpediente();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar medicamento");
    }
  };

  const eliminarMedicamento = async (medicamentoId: number) => {
    if (!confirm("¿Deseas eliminar este medicamento?")) return;
    try {
      await api.delete(`/expedientes/${pacienteId}/medicamentos/${medicamentoId}`);
      fetchExpediente();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar medicamento");
    }
  };

  if (showProcessSplash) {
    return (
      <Splash
        title="Entrada guardada"
        subtitle="Se registró en el historial médico."
        message="Procesando…"
        durationMs={1200}
        onFinish={() => setShowProcessSplash(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-md md:px-6">
        <div className="mx-auto flex max-w-5xl items-center gap-2 sm:gap-4">
          <BackButton />
          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4">
            <h1 className={`text-lg sm:text-xl font-bold md:text-2xl ${textPrimary} truncate`}>
              📋 Historial Médico
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className="rounded-xl border border-white/20 bg-white/10 px-2 sm:px-3 py-2 text-[10px] sm:text-xs text-white transition hover:bg-white/20"
              onClick={() => setShowPrintOptions(!showPrintOptions)}
              title="Opciones PDF"
            >
              <span className="inline-flex items-center gap-1.5 sm:gap-2">
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Opciones PDF</span>
              </span>
            </button>
            <button
            type="button"
            title="Imprimir"
            onClick={() => {
              const estilo = `
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                  @page { margin: 15mm; }
                  body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.5; padding: 20px; }
                  .header { display: flex; align-items: center; gap: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
                  .logo-box { width: 50px; height: 50px; background: #6366f1; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 24px; }
                  .clinic-info h1 { margin: 0; font-size: 20px; font-weight: 900; color: #4338ca; text-transform: uppercase; letter-spacing: -0.025em; }
                  .clinic-info p { margin: 0; font-size: 12px; color: #64748b; font-weight: 600; }
                  .section { margin-bottom: 25px; background: #f8fafc; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; }
                  .section-title { font-size: 10px; font-weight: 900; color: #6366f1; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
                  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
                  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
                  .data-item { margin-bottom: 5px; }
                  .data-label { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
                  .data-value { font-size: 13px; font-weight: 700; color: #1e293b; }
                  .tag { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: #e0e7ff; color: #4338ca; margin-right: 5px; margin-bottom: 5px; border: 1px solid #c7d2fe; }
                  .tag-alert { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }
                  table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px; }
                  th { text-align: left; font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; padding: 10px; border-bottom: 2px solid #e2e8f0; }
                  td { padding: 12px 10px; font-size: 12px; font-weight: 600; color: #334155; border-bottom: 1px solid #f1f5f9; }
                  .footer { text-align: center; margin-top: 40px; font-size: 9px; color: #94a3b8; font-weight: 700; text-transform: uppercase; border-top: 1px solid #f1f5f9; padding-top: 20px; }
                </style>
              `;
              const allEmptyNotes = entradas.every((e) => !e.descripcion || e.descripcion.trim().length === 0);
              const cols = [
                { key: "fecha", label: "Fecha", enabled: true },
                { key: "tipo", label: "Tipo", enabled: true },
                { key: "descripcion", label: "Descripción", enabled: printOptions.includeDescripcion && !allEmptyNotes },
                { key: "altura", label: "Alt (cm)", enabled: printOptions.includeAltura },
                { key: "peso", label: "Peso (kg)", enabled: printOptions.includePeso },
                { key: "temperatura", label: "Temp (°C)", enabled: printOptions.includeTemp },
              ].filter((c) => c.enabled);
              const thead = cols.map((c) => `<th>${c.label}</th>`).join("");
              const filas = entradas
                .map((e) => {
                  const celdas = cols
                    .map((c) => {
                      const v =
                        c.key === "fecha" ? new Date(e.fecha).toLocaleDateString("es-MX") :
                        c.key === "tipo" ? e.tipo :
                        c.key === "descripcion" ? (e.descripcion || "") :
                        c.key === "altura" ? (e.altura ?? "—") :
                        c.key === "peso" ? (e.peso ?? "—") :
                        c.key === "temperatura" ? (e.temperatura ?? "—") : "";
                      return `<td>${v}</td>`;
                    })
                    .join("");
                  return `<tr>${celdas}</tr>`;
                })
                .join("");
              const contenido = `
                <!doctype html>
                <html>
                  <head>
                    <meta charset="utf-8" />
                    <title>Expediente - ${paciente.paciente}</title>
                    ${estilo}
                  </head>
                  <body>
                    <div class="header">
                      <div class="logo-box">H</div>
                      <div class="clinic-info">
                        <h1>Clínica Infantil</h1>
                        <p>Historial Expediente Médico</p>
                        <p style="margin-top: 4px; font-size: 11px; color: #4338ca; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">${paciente.consultorio || "Consultorio General"}</p>
                      </div>
                    </div>

                    <div class="section">
                      <div class="section-title">Perfil del Paciente</div>
                      <div class="grid">
                        <div class="data-item">
                          <div class="data-label">Nombre Completo</div>
                          <div class="data-value">${paciente.paciente}</div>
                        </div>
                        <div class="data-item">
                          <div class="data-label">Edad y Género</div>
                          <div class="data-value">${paciente.edad} años · ${paciente.genero ?? "No especificado"}</div>
                        </div>
                        <div class="data-item">
                          <div class="data-label">Tutor Responsable</div>
                          <div class="data-value">${paciente.tutor ?? "—"}</div>
                        </div>
                        <div class="data-item">
                          <div class="data-label">Información de Contacto</div>
                          <div class="data-value">${paciente.email ?? "—"} · ${paciente.telefono ?? "—"}</div>
                        </div>
                      </div>
                    </div>

                    <div class="section">
                      <div class="section-title">Signos Vitales Actuales</div>
                      <div class="grid-3">
                        <div style="text-align: center; background: white; padding: 15px; border-radius: 15px; border: 1px solid #e2e8f0;">
                          <div class="data-label">Altura</div>
                          <div class="data-value" style="font-size: 18px; color: #6366f1;">${entradas[0]?.altura ?? "—"} cm</div>
                        </div>
                        <div style="text-align: center; background: white; padding: 15px; border-radius: 15px; border: 1px solid #e2e8f0;">
                          <div class="data-label">Peso</div>
                          <div class="data-value" style="font-size: 18px; color: #6366f1;">${entradas[0]?.peso ?? "—"} kg</div>
                        </div>
                        <div style="text-align: center; background: white; padding: 15px; border-radius: 15px; border: 1px solid #e2e8f0;">
                          <div class="data-label">Temperatura</div>
                          <div class="data-value" style="font-size: 18px; color: #6366f1;">${entradas[0]?.temperatura ?? "—"} °C</div>
                        </div>
                      </div>
                    </div>

                    <div class="grid">
                      <div class="section">
                        <div class="section-title">Alergias Conocidas</div>
                        ${alergias.length > 0 
                          ? alergias.map(a => `<span class="tag tag-alert">${a.nombre}</span>`).join('')
                          : '<div style="font-size: 12px; color: #94a3b8; font-style: italic;">No se reportan alergias</div>'
                        }
                      </div>
                      <div class="section">
                        <div class="section-title">Medicamentos Actuales</div>
                        ${medicamentos.length > 0 
                          ? medicamentos.map(m => `<div style="margin-bottom: 8px;"><div class="data-value" style="font-size: 12px;">${m.nombre}</div><div class="data-label">${m.dosis || 'Sin dosis especificada'}</div></div>`).join('')
                          : '<div style="font-size: 12px; color: #94a3b8; font-style: italic;">Sin medicamentos activos</div>'
                        }
                      </div>
                    </div>

                    <div class="section">
                      <div class="section-title">Historial de Consultas</div>
                      <table>
                        <thead>
                          <tr>${thead}</tr>
                        </thead>
                        <tbody>
                          ${filas}
                        </tbody>
                      </table>
                    </div>

                    <div class="footer">
                      Este documento es un resumen oficial del historial médico del paciente.<br>
                      Generado el ${new Date().toLocaleString("es-MX")} · Clínica Infantil Pro
                    </div>
                  </body>
                </html>
              `;
              const iframe = document.createElement("iframe");
              iframe.style.position = "fixed";
              iframe.style.right = "0";
              iframe.style.bottom = "0";
              iframe.style.width = "0";
              iframe.style.height = "0";
              iframe.style.border = "0";
              document.body.appendChild(iframe);
              const doc = iframe.contentDocument || iframe.ownerDocument;
              if (!doc) return;
              doc.open();
              doc.write(contenido);
              doc.close();
              iframe.onload = () => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                setTimeout(() => {
                  document.body.removeChild(iframe);
                }, 1000);
              };
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            >
              <Printer size={22} />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        {showPrintOptions && (
          <div className={`mb-4 rounded-2xl border ${accentBorder} ${surfaceLight} p-4`}>
            <p className={`mb-2 text-sm ${textPrimary}`}>Selecciona columnas para imprimir</p>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={printOptions.includeDescripcion}
                  onChange={(e) => setPrintOptions({ ...printOptions, includeDescripcion: e.target.checked })}
                />
                <span className={textPrimary}>Descripción</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={printOptions.includeAltura}
                  onChange={(e) => setPrintOptions({ ...printOptions, includeAltura: e.target.checked })}
                />
                <span className={textPrimary}>Altura</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={printOptions.includePeso}
                  onChange={(e) => setPrintOptions({ ...printOptions, includePeso: e.target.checked })}
                />
                <span className={textPrimary}>Peso</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={printOptions.includeTemp}
                  onChange={(e) => setPrintOptions({ ...printOptions, includeTemp: e.target.checked })}
                />
                <span className={textPrimary}>Temperatura</span>
              </label>
            </div>
          </div>
        )}
        <div className="space-y-8">
          {/* Perfil */}
          <FormCard title="Paciente">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-3xl">
                {paciente.genero === "Masculino" ? "👦" : paciente.genero === "Femenino" ? "👧" : "👶"}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className={`text-xl font-semibold ${textPrimary}`}>{paciente.paciente}</h2>
                <div className="mt-1 flex flex-wrap gap-2">
                  <span className={`rounded-lg border ${accentBorder} ${surfaceLight} px-2.5 py-0.5 text-xs font-medium ${textPrimary}`}>
                    {paciente.edad} años
                  </span>
                  <span className={`rounded-lg border ${accentBorder} ${surfaceLight} px-2.5 py-0.5 text-xs font-medium ${textPrimary}`}>
                    {paciente.genero ?? "Niño/a"}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${textMuted}`}>👩 Tutor: {paciente.tutor ?? "—"}</p>
                <p className={`text-sm ${textMuted}`}>📅 Fecha de nacimiento estimada</p>
              </div>
            </div>
          </FormCard>

          {/* Estadísticas vitales */}
          <FormCard title="📊 Estadísticas Vitales Actuales">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className={`rounded-xl border ${accentBorder} ${surfaceLight} p-4 text-center`}>
                <p className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>{entradas[0]?.altura ?? "—"} cm</p>
                <p className={`text-[10px] sm:text-xs font-medium ${textMuted}`}>ALTURA</p>
              </div>
              <div className={`rounded-xl border ${accentBorder} ${surfaceLight} p-4 text-center`}>
                <p className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>{entradas[0]?.peso ?? "—"} kg</p>
                <p className={`text-[10px] sm:text-xs font-medium ${textMuted}`}>PESO</p>
              </div>
              <div className={`rounded-xl border ${accentBorder} ${surfaceLight} p-4 text-center`}>
                <p className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>{entradas[0]?.temperatura ?? "—"} °C</p>
                <p className={`text-[10px] sm:text-xs font-medium ${textMuted}`}>TEMPERATURA</p>
              </div>
            </div>
          </FormCard>

          {/* Evolución Pediátrica (Gráficas) */}
          <FormCard title="📈 Evolución Pediátrica" subtitle="Seguimiento de crecimiento (Peso y Talla)">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {/* Gráfica de Peso */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Scale size={16} className="text-indigo-400" />
                  <h4 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${textPrimary}`}>Curva de Peso (kg)</h4>
                </div>
                <div className="h-48 sm:h-64 w-full bg-slate-900/20 rounded-2xl border border-white/5 p-2 sm:p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...entradas].reverse().filter(e => e.peso)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis 
                        dataKey="fecha" 
                        stroke="#94a3b8" 
                        fontSize={9} 
                        tickFormatter={(f) => new Date(f).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                      />
                      <Line type="monotone" dataKey="peso" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} name="Peso (kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfica de Talla */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Ruler size={16} className="text-sky-400" />
                  <h4 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${textPrimary}`}>Curva de Talla (cm)</h4>
                </div>
                <div className="h-48 sm:h-64 w-full bg-slate-900/20 rounded-2xl border border-white/5 p-2 sm:p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...entradas].reverse().filter(e => e.altura)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis 
                        dataKey="fecha" 
                        stroke="#94a3b8" 
                        fontSize={9} 
                        tickFormatter={(f) => new Date(f).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                      />
                      <Line type="monotone" dataKey="altura" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} name="Talla (cm)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </FormCard>

          {/* Alergias y medicamentos */}
          <FormCard title="⚠️ Alergias y Medicamentos">
            {canEdit && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMostrarFormMedico(!mostrarFormMedico)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 ${mostrarFormMedico ? "border border-slate-500 bg-slate-800/60 text-slate-200" : `${accentBg} ${textOnAccent}`}`}
                >
                  {mostrarFormMedico ? (
                    <>
                      <X size={18} />
                      Cerrar
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Agregar Registro
                    </>
                  )}
                </button>
              </div>
            )}
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Listado de Alergias */}
              <div className="space-y-4">
                <h4 className={`text-sm font-bold ${textPrimary} flex items-center gap-2`}>
                  Alergias Conocidas
                </h4>
                <div className="space-y-2">
                  {alergias.length === 0 ? (
                    <p className={`text-xs italic ${textMuted}`}>Sin alergias registradas</p>
                  ) : (
                    alergias.map((a) => (
                      <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2 sm:py-2.5 text-sm group gap-2">
                        {editandoAlergia?.id === a.id ? (
                          <div className="flex flex-col sm:flex-row flex-1 items-start sm:items-center gap-2">
                            <input
                              type="text"
                              className="w-full sm:flex-1 bg-slate-900 border border-indigo-500/50 rounded-lg px-3 py-1 text-sm text-white outline-none"
                              value={editandoAlergia.nombre}
                              onChange={(e) => setEditandoAlergia({ ...editandoAlergia, nombre: e.target.value })}
                              onKeyDown={(e) => e.key === 'Enter' && guardarEdicionAlergia()}
                            />
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button 
                                onClick={guardarEdicionAlergia} 
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                              >
                                <Save size={14} />
                                Guardar
                              </button>
                              <button 
                                onClick={() => setEditandoAlergia(null)} 
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-lg bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
                              >
                                <X size={14} />
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className={`${textPrimary} truncate`}>{a.nombre}</span>
                            {canEdit && (
                              <div className="flex gap-3 sm:gap-2">
                                <button 
                                  onClick={() => setEditandoAlergia(a)} 
                                  className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                                  title="Editar alergia"
                                >
                                  <Pencil size={14} />
                                  <span className="text-[10px] font-bold uppercase">Editar</span>
                                </button>
                                <button 
                                  onClick={() => eliminarAlergia(a.id)} 
                                  className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
                                  title="Eliminar alergia"
                                >
                                  <Trash2 size={14} />
                                  <span className="text-[10px] font-bold uppercase">Eliminar</span>
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Listado de Medicamentos */}
              <div className="space-y-4">
                <h4 className={`text-sm font-bold ${textPrimary} flex items-center gap-2`}>
                  Medicamentos Actuales
                </h4>
                <div className="space-y-2">
                  {medicamentos.length === 0 ? (
                    <p className={`text-xs italic ${textMuted}`}>Sin medicamentos registrados</p>
                  ) : (
                    medicamentos.map((m) => (
                      <div key={m.id} className="rounded-xl border border-white/10 bg-slate-900/40 p-3 sm:p-4 group">
                        {editandoMedicamento?.id === m.id ? (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Nombre</label>
                              <input
                                type="text"
                                className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg px-3 py-1.5 text-sm text-white outline-none"
                                value={editandoMedicamento.nombre}
                                onChange={(e) => setEditandoMedicamento({ ...editandoMedicamento, nombre: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Dosis</label>
                              <input
                                type="text"
                                className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none"
                                value={editandoMedicamento.dosis}
                                onChange={(e) => setEditandoMedicamento({ ...editandoMedicamento, dosis: e.target.value })}
                                placeholder="Dosis..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={guardarEdicionMedicamento} 
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500/20 px-3 py-2 text-[10px] font-bold uppercase text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                              >
                                <Save size={14} />
                                Guardar
                              </button>
                              <button 
                                onClick={() => setEditandoMedicamento(null)} 
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-[10px] font-bold uppercase text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
                              >
                                <X size={14} />
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-bold ${textPrimary} truncate`}>{m.nombre}</p>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${textMuted} truncate`}>{m.dosis || "Sin dosis"}</p>
                            </div>
                            {canEdit && (
                              <div className="flex gap-4 sm:gap-2 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                                <button 
                                  onClick={() => setEditandoMedicamento(m)} 
                                  className="flex-1 sm:flex-none inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                                  title="Editar medicamento"
                                >
                                  <Pencil size={14} />
                                  <span className="text-[10px] font-bold uppercase">Editar</span>
                                </button>
                                <button 
                                  onClick={() => eliminarMedicamento(m.id)} 
                                  className="flex-1 sm:flex-none inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
                                  title="Eliminar medicamento"
                                >
                                  <Trash2 size={14} />
                                  <span className="text-[10px] font-bold uppercase">Eliminar</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* FORMULARIO UNIFICADO DE CARGA */}
            {mostrarFormMedico && (
              <div className={`mt-8 rounded-2xl border ${accentBorder} bg-slate-900/40 p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300`}>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${textMuted} flex items-center gap-2`}>
                  <Plus size={16} />
                  Nuevo Registro Médico
                </h4>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Alergia (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: Penicilina..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                      value={nuevaAlergia}
                      onChange={(e) => setNuevaAlergia(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Medicamento (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Nombre..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                        value={nuevoMedicamento.nombre}
                        onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, nombre: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dosis y Frecuencia</label>
                      <input
                        type="text"
                        placeholder="Ej: 5ml cada 8h..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-slate-400 outline-none focus:border-indigo-500/50 transition-all"
                        value={nuevoMedicamento.dosis}
                        onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, dosis: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && guardarDatosMedicos()}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={guardarDatosMedicos}
                    className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-black text-white transition hover:bg-indigo-500 active:scale-[0.98] shadow-xl shadow-indigo-600/20 uppercase tracking-widest"
                  >
                    <Save size={20} />
                    <span className="truncate">Guardar Información</span>
                  </button>
                  <button
                    onClick={() => setMostrarFormMedico(false)}
                    className="px-6 py-3 sm:py-0 rounded-2xl border border-slate-700 bg-slate-800 text-[10px] font-black uppercase text-slate-400 hover:bg-slate-700 hover:text-white transition-all tracking-widest"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </FormCard>

          {/* Historial médico */}
          <FormCard title="📚 Historial Médico">
            {canEdit && (
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
                      Agregar Entrada
                    </>
                  )}
                </button>
              </div>
            )}
            {mostrarForm && (
              <div className="space-y-4 rounded-2xl border border-slate-700/70 bg-slate-900/40 p-4">
                <h3 className={`font-semibold ${textPrimary}`}>🩺 Nueva Entrada Médica</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Tipo</label>
                    <select
                      value={form.tipo}
                      onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                      className={inputClass}
                    >
                      {TIPOS_ENTRADA.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Altura (cm)</label>
                    <span className={inputIconCenter}>📏</span>
                    <input
                      placeholder="Altura en cm"
                      value={form.altura}
                      onChange={(e) => setForm({ ...form, altura: e.target.value })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
              <div className="relative">
                    <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Peso (kg)</label>
                    <span className={inputIconCenter}>⚖️</span>
                    <input
                      placeholder="Peso en kg"
                      value={form.peso}
                      onChange={(e) => setForm({ ...form, peso: e.target.value })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
              <div className="relative sm:col-span-3">
                <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Temperatura (°C)</label>
                <span className={inputIconCenter}>🌡️</span>
                <input
                  placeholder="Temperatura en °C"
                  value={form.temperatura}
                  onChange={(e) => setForm({ ...form, temperatura: e.target.value })}
                  className={`${inputClass} pl-10`}
                />
              </div>
                </div>
                <div className="relative">
                  <label className={`mb-1.5 block text-xs font-medium ${textMuted}`}>Notas médicas</label>
                  <span className={inputIconTop}>📝</span>
                  <textarea
                    className={`${inputClass} min-h-[120px] resize-none pl-11`}
                    placeholder="Descripción detallada de la consulta..."
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={guardarEntrada}
                    className={`inline-flex items-center gap-2 rounded-xl ${accentPrimary} px-4 py-2.5 text-sm font-semibold ${textOnAccent} transition hover:brightness-110`}
                  >
                    <Save size={18} />
                    Guardar entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setMostrarForm(false)}
                    className={`inline-flex items-center gap-2 rounded-xl ${danger} px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500`}
                  >
                    <X size={18} />
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4">
              {entradas.length === 0 ? (
                <p className={`text-center py-8 text-sm italic ${textMuted}`}>No hay entradas en el historial</p>
              ) : (
                entradas.map((e) => (
                  <div
                    key={e.id}
                    className={`rounded-xl border ${accentBorder} ${surfaceLight} p-4 sm:p-5`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <b className={`text-sm sm:text-base ${textPrimary}`}>
                        {ICONO_TIPO[e.tipo] ?? "📄"} {e.tipo}
                      </b>
                      <small className={`text-[10px] sm:text-xs ${textMuted}`}>{e.fecha}</small>
                    </div>
                    <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${textPrimary}`}>{e.descripcion}</p>
                    {(e.altura || e.peso || e.temperatura) && (
                      <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        {e.altura && <span className={textMuted}>📏 {e.altura} cm</span>}
                        {e.peso && <span className={textMuted}>⚖️ {e.peso} kg</span>}
                        {e.temperatura && <span className={textMuted}>🌡️ {e.temperatura} °C</span>}
                      </div>
                    )}
                    {canEdit && (
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                        <button
                          type="button"
                          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg border ${accentBorder} ${surfaceLight} px-3 py-2 text-[10px] sm:text-sm font-bold uppercase ${textPrimary} hover:bg-white/5 transition-colors`}
                          onClick={() => {
                            setEditingId(e.id);
                            setEditForm({
                              tipo: e.tipo,
                              descripcion: e.descripcion,
                              altura: e.altura ?? "",
                              peso: e.peso ?? "",
                              temperatura: e.temperatura ?? "",
                            });
                          }}
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                        <button
                          type="button"
                          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-[10px] sm:text-sm font-bold uppercase text-rose-100 hover:bg-rose-500 transition-colors`}
                          onClick={async () => {
                            if (!confirm("¿Eliminar esta entrada permanentemente?")) return;
                            try {
                              await api.delete(`/expedientes/${pacienteId}/entradas/${e.id}`);
                              setEntradas((prev) => prev.filter((x) => x.id !== e.id));
                            } catch {
                              alert("Error al eliminar la entrada");
                            }
                          }}
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    )}
                    {editingId === e.id && (
                      <div className="mt-4 space-y-4 rounded-xl border border-indigo-500/30 bg-slate-900/60 p-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Tipo</label>
                            <select
                              value={editForm.tipo}
                              onChange={(ev) => setEditForm({ ...editForm, tipo: ev.target.value })}
                              className={inputClass}
                            >
                              {TIPOS_ENTRADA.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Altura (cm)</label>
                            <div className="relative">
                              <span className={inputIconCenter}>📏</span>
                              <input
                                value={editForm.altura}
                                onChange={(ev) => setEditForm({ ...editForm, altura: ev.target.value })}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Peso (kg)</label>
                            <div className="relative">
                              <span className={inputIconCenter}>⚖️</span>
                              <input
                                value={editForm.peso}
                                onChange={(ev) => setEditForm({ ...editForm, peso: ev.target.value })}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5 sm:col-span-3">
                            <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Temperatura (°C)</label>
                            <div className="relative">
                              <span className={inputIconCenter}>🌡️</span>
                              <input
                                value={editForm.temperatura}
                                onChange={(ev) => setEditForm({ ...editForm, temperatura: ev.target.value })}
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Notas médicas</label>
                          <div className="relative">
                            <span className={inputIconTop}>📝</span>
                            <textarea
                              rows={4}
                              value={editForm.descripcion}
                              onChange={(ev) => setEditForm({ ...editForm, descripcion: ev.target.value })}
                              className={`${inputClass} min-h-[100px] resize-y pl-10 pt-3`}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const payload = {
                                  tipo: editForm.tipo,
                                  descripcion: editForm.descripcion,
                                  altura: editForm.altura || undefined,
                                  peso: editForm.peso || undefined,
                                  temperatura: editForm.temperatura || undefined,
                                };
                                const res = await api.put(`/expedientes/${pacienteId}/entradas/${e.id}/`, payload);
                                setEntradas((prev) =>
                                  prev.map((x) =>
                                    x.id === e.id
                                      ? {
                                          id: res.data.id,
                                          tipo: res.data.tipo,
                                          descripcion: res.data.descripcion,
                                          fecha: res.data.fecha,
                                          altura: res.data.altura,
                                          peso: res.data.peso,
                                          temperatura: res.data.temperatura,
                                        }
                                      : x
                                  )
                                );
                                setEditingId(null);
                              } catch {
                                alert("Error al actualizar la entrada");
                              }
                            }}
                            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl ${accentPrimary} px-4 py-3 text-sm font-black uppercase tracking-widest ${textOnAccent} transition hover:brightness-110 shadow-lg shadow-indigo-500/20`}
                          >
                            <Save size={18} />
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-black uppercase tracking-widest text-slate-400 hover:bg-slate-700 hover:text-white transition-all`}
                          >
                            <X size={18} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </FormCard>
        </div>
      </main>
    </div>
  );
}
