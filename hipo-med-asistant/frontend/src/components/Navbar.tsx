import type { ReactNode } from "react";
import { Menu, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { borderLight, textPrimary, accentBg, danger, dangerHover } from "../theme/colors";

export interface NavItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  highlight?: boolean;
  active?: boolean;
}

interface NavbarProps {
  logo: ReactNode;
  items: NavItem[];
  profile?: { label: string; icon: ReactNode; onClick: () => void };
  logout: { label: string; icon: ReactNode; onClick: () => void };
  mobileOpen: boolean;
  onMobileToggle: () => void;
  className?: string;
  showBack?: boolean;
}

/** Barra de navegación con logo, enlaces y menú móvil. Colores del sistema. */
export default function Navbar({
  logo,
  items,
  profile,
  logout,
  mobileOpen,
  onMobileToggle,
  className = "",
  showBack = true,
}: NavbarProps) {
  const navigate = useNavigate();

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between gap-4 border-b ${borderLight} bg-[#020617] md:bg-slate-950/90 px-4 py-3 md:backdrop-blur-md md:px-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 active:scale-95 md:h-9 md:w-9"
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className={`flex items-center gap-3 text-lg font-bold ${textPrimary} transition-transform hover:scale-105`}>
          {logo}
        </div>
      </div>

      <nav className="hidden items-center gap-1.5 md:flex">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className={`group relative inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              item.highlight
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 hover:brightness-110"
                : item.active
                  ? "bg-white/10 text-white shadow-md"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className={`transition-transform duration-300 group-hover:scale-110 ${item.highlight ? "" : item.active ? "text-sky-300" : "text-sky-400 group-hover:text-sky-300"}`}>
              {item.icon}
            </span>
            {item.label}
            {!item.highlight && (
              <span className={`absolute bottom-1 left-4 right-4 h-0.5 origin-left bg-sky-400 transition-transform duration-300 ${item.active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
            )}
          </button>
        ))}
        
        {profile && (
          <button
            type="button"
            onClick={profile.onClick}
            className={`group ml-2 inline-flex items-center gap-2.5 rounded-2xl bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-700/80 hover:text-white hover:shadow-lg hover:shadow-slate-500/10`}
            title={profile.label}
          >
            <span className="text-emerald-400 transition-transform duration-300 group-hover:scale-110">
              {profile.icon}
            </span>
            <span className="hidden lg:inline">{profile.label}</span>
          </button>
        )}

        <button
          type="button"
          onClick={logout.onClick}
          className={`group ml-2 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95`}
        >
          <span className="transition-transform duration-300 group-hover:rotate-12">
            {logout.icon}
          </span>
          {logout.label}
        </button>
      </nav>

      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800/80 hover:text-white md:hidden"
        onClick={onMobileToggle}
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={onMobileToggle}
            aria-hidden
          />
          <nav className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-2 border-l ${borderLight} bg-[#020617] p-6 shadow-2xl md:hidden`}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Menú Principal</span>
              <button onClick={onMobileToggle} className="p-2 rounded-xl bg-white/5 text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-1.5">
              {items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.onClick();
                    onMobileToggle();
                  }}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all ${
                    item.active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : item.highlight
                        ? "bg-white/10 text-white border border-white/10"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={`${item.active ? "text-white" : "text-sky-400"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/5">
              {profile && (
                <button
                  type="button"
                  onClick={() => {
                    profile.onClick();
                    onMobileToggle();
                  }}
                  className="flex items-center gap-4 rounded-2xl bg-slate-800/80 px-5 py-4 text-left text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
                >
                  <span className="text-emerald-400">{profile.icon}</span>
                  {profile.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  logout.onClick();
                  onMobileToggle();
                }}
                className={`flex items-center gap-4 rounded-2xl bg-rose-600/10 border border-rose-500/20 px-5 py-4 text-left text-sm font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all`}
              >
                <span className="rotate-0 group-hover:rotate-12 transition-transform">
                  {logout.icon}
                </span>
                {logout.label}
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
