import type { ReactNode } from "react";
import { cardAccents } from "../theme/colors";

export type PageCardAccent = keyof typeof cardAccents;

interface PageCardAction {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  accent: PageCardAccent;
}

interface PageCardStat {
  icon: ReactNode;
  value: string;
  label: string;
  accent: PageCardAccent;
}

type PageCardProps = (PageCardAction | PageCardStat) & {
  className?: string;
};

function isActionCard(props: PageCardProps): props is PageCardAction {
  return "title" in props && "onClick" in props;
}

/** Card reutilizable para acciones (click) o estadísticas. Usa colores del sistema (theme/colors). */
export default function PageCard(props: PageCardProps) {
  const { accent, className = "" } = props;
  const styles = cardAccents[accent];
  const isAction = isActionCard(props);

  const content = (
    <>
      <div className={`w-fit rounded-2xl border p-3 ${styles.bg} ${styles.icon}`}>
        {props.icon}
      </div>
      {isAction ? (
        <>
          <h3 className={`mt-3 text-lg font-semibold ${styles.text}`}>{props.title}</h3>
          {props.subtitle && (
            <p className="mt-0.5 text-sm text-slate-400">{props.subtitle}</p>
          )}
        </>
      ) : (
        <>
          <h3 className={`mt-3 text-2xl font-bold ${styles.text}`}>{props.value}</h3>
          <p className="mt-0.5 text-sm text-slate-400">{props.label}</p>
        </>
      )}
    </>
  );

  const baseClasses = `flex flex-col rounded-2xl border p-6 shadow-lg backdrop-blur-sm transition ${styles.border} bg-slate-900/60 ${className}`;

  if (isAction) {
    return (
      <button
        type="button"
        onClick={props.onClick}
        className={`${baseClasses} text-left hover:bg-slate-800/80 hover:border-slate-600/50 active:scale-[0.98]`}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
