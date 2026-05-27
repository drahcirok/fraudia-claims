"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError(
  { reset }: {
    error: Error & { digest?: string };
    reset: () => void;
  }
) {
  return (
    <div className="flex flex-1 h-full items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--rojo)]/10 border border-[var(--rojo)]/20">
          <AlertTriangle className="h-8 w-8 text-[var(--rojo)]" />
        </div>
        <h2 className="text-lg font-semibold">Error al cargar la bandeja</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No se pudieron cargar los siniestros. Es posible que el servidor no esté disponible.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset}>
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  );
}
