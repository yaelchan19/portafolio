import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  children?: ReactNode;
}

/** Botón circular para volver atrás. Reutiliza estilos del sistema. */
export default function BackButton({
  onClick,
  label = "Volver",
  className = "",
  children,
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20 hover:scale-110 active:scale-95 ${className}`}
    >
      {children || <ArrowLeft size={20} />}
    </button>
  );
}
