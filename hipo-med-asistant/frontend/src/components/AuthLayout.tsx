import type { ReactNode } from "react";
import BackButton from "./BackButton";

interface AuthLayoutProps {
  hero: ReactNode;
  form: ReactNode;
  className?: string;
}

/** Layout de dos columnas para login/register: hero a la izquierda, formulario a la derecha. */
export default function AuthLayout({ hero, form, className = "" }: AuthLayoutProps) {
  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br from-sky-400 via-indigo-800 to-slate-950 flex items-center justify-center px-4 py-8 relative ${className}`}
    >
      <div className="absolute top-6 left-6 z-10">
        <BackButton />
      </div>
      <div className="w-full max-w-5xl mx-auto grid gap-8 lg:grid-cols-2 items-stretch">
        {hero}
        <div className="flex items-center">{form}</div>
      </div>
    </div>
  );
}
