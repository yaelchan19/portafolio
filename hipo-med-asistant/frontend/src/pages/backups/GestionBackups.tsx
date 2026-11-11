import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Database, 
  Download, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Clock, 
  HardDrive,
  ShieldCheck,
  AlertTriangle,
  FileJson,
  CheckCircle2,
  XCircle
} from "lucide-react";
import api from "../../services/api";
import BackButton from "../../components/BackButton";
import {
  pageBg,
  textPrimary,
  textMuted,
  accentBorder,
  accentPrimary,
  textOnAccent,
  surfaceLight,
} from "../../theme/colors";

interface Backup {
  filename: string;
  size: number;
  created_at: string;
  path: string;
}

export default function GestionBackups() {
  const navigate = useNavigate();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const fetchBackups = async () => {
    try {
      const response = await api.get("/backups/");
      setBackups(response.data);
    } catch (err) {
      console.error("Error al cargar backups:", err);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await api.post("/backups/create");
      setMessage({ text: "Copia de seguridad generada con éxito", type: 'success' });
      fetchBackups();
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.detail || "Error al crear la copia de seguridad", 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!confirm("¿Estás seguro de que deseas restaurar la base de datos? Se sobrescribirán todos los datos actuales.")) {
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    try {
      await api.post(`/backups/restore/${filename}`);
      setMessage({ text: "Base de datos restaurada correctamente", type: 'success' });
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.detail || "Error al restaurar la base de datos", 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBackup = async (filename: string) => {
    if (!confirm("¿Deseas eliminar este archivo de respaldo permanentemente?")) {
      return;
    }
    
    try {
      await api.delete(`/backups/${filename}`);
      fetchBackups();
      setMessage({ text: "Respaldo eliminado correctamente", type: 'success' });
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.detail || "Error al eliminar el respaldo", 
        type: 'error' 
      });
    }
  };

  const handleDownloadBackup = async (filename: string) => {
    try {
      // Usamos el endpoint de descarga que configuramos en el backend
      const response = await api.get(`/backups/download/${filename}`, {
        responseType: 'blob', // Importante para manejar archivos binarios/descargas
      });
      
      // Crear un link temporal para disparar la descarga en el navegador
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setMessage({ text: "Descarga iniciada", type: 'success' });
    } catch (err: any) {
      console.error("Error al descargar el backup:", err);
      setMessage({ 
        text: "No se pudo descargar el archivo", 
        type: 'error' 
      });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`min-h-screen ${pageBg} selection:bg-indigo-500/30 overflow-x-hidden pb-20`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 px-4 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <div className="flex flex-col min-w-0">
              <h1 className={`text-xl font-black tracking-tighter md:text-2xl ${textPrimary} flex items-center gap-2 uppercase truncate`}>
                <Database className="text-sky-400 shrink-0" size={24} />
                <span className="truncate">Gestión de Backups</span>
              </h1>
              <p className={`text-[10px] font-bold tracking-widest uppercase ${textMuted} truncate`}>
                Seguridad y Recuperación de Datos
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateBackup}
            disabled={isLoading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 sm:py-3 rounded-2xl ${accentPrimary} ${textOnAccent} text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-500/20`}
          >
            {isLoading ? "Procesando..." : <><Plus size={18} /> Crear Respaldo</>}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        {/* Notificaciones */}
        {message && (
          <div className={`mb-8 p-6 rounded-[2rem] border flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            <p className="text-sm font-black uppercase tracking-tight">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* INFO & STATUS PANEL */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 shadow-2xl">
              <div className="h-20 w-20 bg-sky-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-sky-500/20">
                <ShieldCheck className="text-sky-400" size={40} />
              </div>
              <h3 className={`text-xl font-black ${textPrimary} mb-2 uppercase tracking-tight`}>Protección Activa</h3>
              <p className={`${textMuted} text-xs leading-relaxed uppercase font-bold tracking-wide mb-6`}>
                Garantice la integridad de su información generando copias de seguridad antes de realizar cambios críticos en el sistema.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <HardDrive size={20} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Almacenamiento</p>
                    <p className={`text-sm font-bold ${textPrimary}`}>Local / Seguro</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${textMuted}`}>Último Respaldo</p>
                    <p className={`text-sm font-bold ${textPrimary}`}>
                      {backups.length > 0 ? new Date(backups[0].created_at).toLocaleDateString() : "Ninguno"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-8">
              <div className="flex items-center gap-3 text-amber-400 mb-4">
                <AlertTriangle size={24} />
                <h4 className="text-sm font-black uppercase tracking-widest">Advertencia</h4>
              </div>
              <p className="text-xs text-amber-200/60 font-bold leading-relaxed uppercase tracking-tight">
                La restauración de un backup es un proceso irreversible. <br />
                <span className="text-amber-400/80">Todos los datos actuales serán reemplazados por la versión seleccionada.</span>
              </p>
            </div>
          </div>

          {/* LISTADO DE BACKUPS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className={`text-xl font-black tracking-tight ${textPrimary} uppercase`}>
                Historial de Respaldos
                <span className="ml-3 text-xs font-bold text-sky-400 lowercase tracking-normal bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                  {backups.length} archivos
                </span>
              </h2>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              {backups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-24 rounded-3xl sm:rounded-[3rem] border border-dashed border-white/10 bg-slate-900/10 px-6">
                  <Database className="text-slate-700 mb-4 w-10 h-10 sm:w-12 sm:h-12" />
                  <p className={`text-base sm:text-lg font-medium ${textMuted} text-center`}>No hay respaldos disponibles</p>
                  <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-widest mt-1 text-center">Haga clic en el botón superior para generar uno</p>
                </div>
              ) : (
                backups.map((b) => (
                  <div 
                    key={b.filename}
                    className="group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border border-white/5 bg-slate-900/20 transition-all duration-300 hover:bg-slate-900/40 hover:border-white/10"
                  >
                    <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 flex items-center justify-center rounded-xl sm:rounded-3xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
                      <FileJson className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-base sm:text-lg font-black tracking-tight truncate ${textPrimary} mb-1`}>
                        {b.filename}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${textMuted} flex items-center gap-1`}>
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {new Date(b.created_at).toLocaleString()}
                        </p>
                        <span className="hidden sm:block h-1 w-1 rounded-full bg-slate-700" />
                        <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${textMuted} flex items-center gap-1`}>
                          <HardDrive className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {formatSize(b.size)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                      <button 
                        onClick={() => handleDownloadBackup(b.filename)}
                        className="flex-1 sm:flex-none p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all active:scale-95 flex items-center justify-center"
                        title="Descargar"
                      >
                        <Download className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                        <span className="sm:hidden ml-2 text-[10px] font-bold uppercase">Descargar</span>
                      </button>
                      <button 
                        onClick={() => handleRestoreBackup(b.filename)}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                        title="Restaurar"
                      >
                        <RotateCcw className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                        <span className="sm:hidden ml-2 text-[10px] font-bold uppercase">Restaurar</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteBackup(b.filename)}
                        className="flex-1 sm:flex-none p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95 flex items-center justify-center"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                        <span className="sm:hidden ml-2 text-[10px] font-bold uppercase">Borrar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
