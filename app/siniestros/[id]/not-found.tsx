import Link from "next/link";
import { FileSearch, ArrowLeft } from "lucide-react";

export default function SiniestroNotFound() {
  return (
    <div className="flex flex-1 h-full items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <FileSearch className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Siniestro no encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          El ID del siniestro no existe en la base de datos. Verifica el identificador e intenta de nuevo.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground px-2.5 text-sm font-medium whitespace-nowrap transition-all dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
          >
            <ArrowLeft className="size-4" />
            Volver a la Bandeja
          </Link>
        </div>
      </div>
    </div>
  );
}
