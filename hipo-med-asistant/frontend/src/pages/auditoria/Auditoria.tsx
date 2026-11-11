import { useEffect, useState } from "react";
import { ShieldCheck, User, Calendar, Info, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";
import { pageBg, textPrimary, textMuted, accentBorder, surfaceLight } from "../../theme/colors";
import BackButton from "../../components/BackButton";

interface Log {
  id: number;
  usuario: string;
  accion: string;
  tabla: string;
  registro_id: number;
  detalles: string;
  fecha: string;
}

export default function Auditoria() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchLogs = () => {
    setLoading(true);
    api.get(`/auditoria/?skip=${page * limit}&limit=${limit}`)
      .then(res => setLogs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'CREAR': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'EDITAR': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'ELIMINAR': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'LOGIN': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className={`min-h-screen ${pageBg} p-4 sm:p-8`}>
      <header className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${textPrimary} flex items-center gap-3 uppercase tracking-tighter truncate`}>
              <ShieldCheck className="text-emerald-400 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
              Auditoría de Cambios
            </h1>
            <p className={`${textMuted} text-[10px] sm:text-sm font-bold uppercase tracking-widest mt-1`}>
              Registro histórico de actividades del sistema
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button 
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5 bg-slate-900/40 text-slate-400 disabled:opacity-30 hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-[10px] sm:text-xs uppercase tracking-widest">
            Pág {page + 1}
          </span>
          <button 
            onClick={() => setPage(page + 1)}
            disabled={logs.length < limit}
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5 bg-slate-900/40 text-slate-400 disabled:opacity-30 hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center rounded-3xl sm:rounded-[3rem] border border-dashed border-white/10 bg-slate-900/10 px-6">
            <Info className="mx-auto text-slate-700 mb-4 w-10 h-10 sm:w-12 sm:h-12" />
            <p className={`text-sm sm:text-lg font-medium ${textMuted}`}>No hay registros de auditoría disponibles</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all group`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1">
                  {/* Fecha */}
                  <div className="flex flex-row sm:flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 min-w-0 sm:min-w-[100px] gap-2 sm:gap-1 self-start sm:self-auto w-full sm:w-auto">
                    <Calendar className="text-slate-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-0 items-center">
                      <span className="text-[10px] sm:text-xs font-black text-white tabular-nums">
                        {new Date(log.fecha).toLocaleDateString()}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                        {new Date(log.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${getAccionColor(log.accion)}`}>
                        {log.accion}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
                        Tabla: <span className="text-slate-300">{log.tabla || 'N/A'}</span> <span className="hidden sm:inline">(ID: {log.registro_id || '—'})</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <User className="text-indigo-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                      <p className={`text-[11px] sm:text-sm font-bold ${textPrimary} truncate`}>
                        Por: <span className="text-indigo-300">{log.usuario}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {log.detalles && (
                  <div className="w-full lg:max-w-md lg:flex-1">
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/20 border border-white/5 overflow-hidden">
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase mb-1.5 sm:mb-2">Detalles del cambio:</p>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-mono line-clamp-2 group-hover:line-clamp-none transition-all break-words">
                        {log.detalles}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
