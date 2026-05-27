import { FilePlus2 } from "lucide-react";

export default function NuevoSiniestroPage() {
  return (
    <div className="flex flex-1 h-full items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.08]">
          <FilePlus2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Nuevo Siniestro</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Próximamente — formulario con scoring en vivo conectado a <code className="text-xs bg-white/[0.08] px-1.5 py-0.5 rounded">POST /api/py/siniestros/score</code>.
        </p>
      </div>
    </div>
  );
}
