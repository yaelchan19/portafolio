import type { ReactNode } from "react";

interface HeroCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Card izquierda con gradiente y decoración, para login/register. */
export default function HeroCard({
  icon,
  title,
  subtitle,
  children,
  footer,
  className = "",
}: HeroCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-indigo-500 to-rose-500 p-8 text-white shadow-2xl flex flex-col justify-between ${className}`}
    >
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-900/40 shadow-xl shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-sky-100/90 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-6 space-y-4 text-sm flex-1">{children}</div>

      {footer && <div className="relative z-10 mt-6">{footer}</div>}
    </div>
  );
}
