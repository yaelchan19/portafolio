import type { ReactNode } from "react";

interface FormCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Card derecha oscura para formularios (login, register, etc.). */
export default function FormCard({
  title,
  subtitle,
  children,
  footer,
  className = "",
}: FormCardProps) {
  return (
    <div
      className={`w-full rounded-3xl bg-slate-950/90 border border-slate-700/70 p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6 ${className}`}
    >
      {(title || subtitle) && (
        <header className="space-y-1">
          {title && (
            <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-slate-400">{subtitle}</p>
          )}
        </header>
      )}
      <div className="flex flex-col gap-5 flex-1">{children}</div>
      {footer && (
        <footer className="pt-1 border-t border-slate-800/80">{footer}</footer>
      )}
    </div>
  );
}
