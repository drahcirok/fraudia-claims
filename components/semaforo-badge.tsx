import { cn } from "@/lib/utils";
import type { NivelRiesgo } from "@/lib/mock-data";

const CONFIG: Record<
  NivelRiesgo,
  { label: string; dot: string; className: string }
> = {
  rojo: {
    label: "Rojo",
    dot: "bg-[var(--rojo)]",
    className: "badge-rojo",
  },
  amarillo: {
    label: "Amarillo",
    dot: "bg-[var(--amarillo)]",
    className: "badge-amarillo",
  },
  verde: {
    label: "Verde",
    dot: "bg-[var(--verde)]",
    className: "badge-verde",
  },
};

interface SemaforoBadgeProps {
  nivel: NivelRiesgo;
  score?: number;
  className?: string;
}

export function SemaforoBadge({ nivel, score, className }: SemaforoBadgeProps) {
  const cfg = CONFIG[nivel];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all",
        cfg.className,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
      {score !== undefined && (
        <span className="opacity-70 font-normal">· {score}</span>
      )}
    </span>
  );
}
