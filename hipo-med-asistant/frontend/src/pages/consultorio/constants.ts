export type EstadoConsultorio = "Disponible" | "Ocupado" | "Mantenimiento";

export const ESTADOS_CONSULTORIO: EstadoConsultorio[] = [
  "Disponible",
  "Ocupado",
  "Mantenimiento",
];

export const estadoBadgeClass: Record<EstadoConsultorio, string> = {
  Disponible: "bg-emerald-500/20 border-emerald-400/40 text-emerald-200",
  Ocupado: "bg-amber-500/20 border-amber-400/40 text-amber-200",
  Mantenimiento: "bg-rose-500/20 border-rose-400/40 text-rose-200",
};

