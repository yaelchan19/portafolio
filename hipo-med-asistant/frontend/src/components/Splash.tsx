import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";

interface SplashProps {
  onFinish: () => void;
  durationMs?: number;
  /** Título principal (ej. "Clínica Infantil Pro" o "Procesando…") */
  title?: string;
  /** Subtítulo (ej. "Cuidado pediátrico con corazón") */
  subtitle?: string;
  /** Mensaje de estado (ej. "Cargando…", "Guardando…", "Redirigiendo…") */
  message?: string;
}

const DEFAULT_TITLE = "Clínica Infantil Pro";
const DEFAULT_SUBTITLE = "Cuidado pediátrico con corazón";
const DEFAULT_MESSAGE = "Cargando…";

/** Splash reutilizable: inicio de app o al finalizar procesos (login, registro, confirmar cita, guardar). */
export default function Splash({
  onFinish,
  durationMs = 2500,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  message = DEFAULT_MESSAGE,
}: SplashProps) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => setFadeOut(true), durationMs - 400);
    const finishTimer = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, durationMs);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-sky-500 via-indigo-600 to-rose-500 transition-opacity duration-500 ease-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 shadow-2xl backdrop-blur-sm">
          <Stethoscope className="text-white" size={48} strokeWidth={2} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm font-medium text-white/90 md:text-base">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white/90" />
          <span className="text-xs font-medium uppercase tracking-wider text-white/80">
            {message}
          </span>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-white/60">
        © 2025 · Hospital pediátrico
      </div>
    </div>
  );
}
