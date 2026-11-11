/**
 * Colores del sistema: mismos que Login, Register, AuthLayout, HeroCard, FormCard.
 * Usar en Navbar, PageCard, Dashboard y resto de páginas.
 */

/** Fondo de página (gradiente principal) */
export const pageBg =
  "bg-gradient-to-br from-sky-400 via-indigo-800 to-slate-950";

/** Hero / cards destacadas (gradiente) */
export const heroGradient =
  "bg-gradient-to-br from-sky-400 via-indigo-500 to-rose-500";

/** Superficies oscuras */
export const surface = "bg-slate-950/90";
export const surfaceLight = "bg-slate-900/60";
export const surfaceHover = "bg-slate-800/80";
export const border = "border-slate-700/70";
export const borderLight = "border-slate-700/60";

/** Acentos primarios (botones, enlaces, destaque) */
export const accentPrimary = "bg-gradient-to-r from-indigo-500 to-sky-500";
export const accentFocus = "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/70";
export const accentIcon = "text-sky-400";
export const accentBg = "bg-indigo-500/90";
export const accentBgSoft = "bg-indigo-500/10";
export const accentBorder = "border-indigo-400/30";

/** Peligro / logout */
export const danger = "bg-rose-500/90";
export const dangerHover = "hover:bg-rose-500";

/** Texto */
export const textPrimary = "text-slate-100";
export const textMuted = "text-slate-400";
export const textDim = "text-slate-500";
export const textOnAccent = "text-slate-50";

/** Variantes para cards (PageCard): sky, indigo, rose, neutral */
export const cardAccents = {
  sky: {
    bg: "bg-sky-500/15 border-sky-400/40",
    border: "border-sky-400/30",
    icon: "text-sky-400",
    text: "text-slate-100",
  },
  indigo: {
    bg: "bg-indigo-500/15 border-indigo-400/40",
    border: "border-indigo-400/30",
    icon: "text-indigo-400",
    text: "text-slate-100",
  },
  rose: {
    bg: "bg-rose-500/15 border-rose-400/40",
    border: "border-rose-400/30",
    icon: "text-rose-400",
    text: "text-slate-100",
  },
  neutral: {
    bg: "bg-slate-100/10 border-slate-300/40",
    border: "border-slate-300/30",
    icon: "text-slate-300",
    text: "text-slate-100",
  },
  emerald: {
    bg: "bg-emerald-500/15 border-emerald-400/40",
    border: "border-emerald-400/30",
    icon: "text-emerald-400",
    text: "text-slate-100",
  },
  amber: {
    bg: "bg-amber-500/15 border-amber-400/40",
    border: "border-amber-400/30",
    icon: "text-amber-400",
    text: "text-slate-100",
  },
  violet: {
    bg: "bg-violet-500/15 border-violet-400/40",
    border: "border-violet-400/30",
    icon: "text-violet-400",
    text: "text-slate-100",
  },
} as const;
