import { FilePlus2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NuevoSiniestroPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
          <FilePlus2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Nuevo Siniestro</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Ingresa los datos del caso para obtener un score de riesgo en vivo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form area */}
        <div className="lg:col-span-2">
          <Card className="border-white/[0.08] bg-white/[0.03]">
            <CardHeader className="pb-3 px-5 pt-4 border-b border-white/[0.06]">
              <CardTitle className="text-sm font-semibold">Datos del Siniestro</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Ramo */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Ramo
                  </label>
                  <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center text-sm text-muted-foreground/50">
                    Autos, Hogar, Salud, Vida
                  </div>
                </div>
                {/* Cobertura */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Cobertura
                  </label>
                  <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center text-sm text-muted-foreground/50">
                    Tipo de cobertura
                  </div>
                </div>
                {/* Fecha ocurrencia */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Fecha de Ocurrencia
                  </label>
                  <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center text-sm text-muted-foreground/50">
                    YYYY-MM-DD
                  </div>
                </div>
                {/* Fecha reporte */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Fecha de Reporte
                  </label>
                  <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center text-sm text-muted-foreground/50">
                    YYYY-MM-DD
                  </div>
                </div>
                {/* Monto reclamado */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Monto Reclamado (MXN)
                  </label>
                  <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center text-sm text-muted-foreground/50">
                    $ 0.00
                  </div>
                </div>
                {/* Monto estimado */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Monto Estimado (MXN)
                  </label>
                  <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center text-sm text-muted-foreground/50">
                    $ 0.00
                  </div>
                </div>
                {/* ID Asegurado */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    ID Asegurado
                  </label>
                  <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center text-sm text-muted-foreground/50">
                    ASE-0000
                  </div>
                </div>
                {/* ID Proveedor */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    ID Proveedor
                  </label>
                  <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center text-sm text-muted-foreground/50">
                    PRV-0000
                  </div>
                </div>
                {/* Descripción — full width */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Descripción del Siniestro
                  </label>
                  <div className="h-24 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-muted-foreground/50">
                    Describe los detalles del caso...
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button disabled className="gap-2">
                  <FilePlus2 className="h-4 w-4" />
                  Evaluar Riesgo
                </Button>
                <p className="text-xs text-muted-foreground">
                  Se conectará a{" "}
                  <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-[11px]">
                    POST /api/py/siniestros/score
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score preview panel */}
        <div>
          <Card className="border-white/[0.08] bg-white/[0.03]">
            <CardHeader className="pb-3 px-5 pt-4 border-b border-white/[0.06]">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ShieldAlert className="h-4 w-4 text-[var(--chart-1)]" />
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] border border-dashed border-white/[0.08]">
                <ShieldAlert className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium">Esperando datos</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-[200px]">
                Completa el formulario y presiona &#8220;Evaluar Riesgo&#8221; para obtener el score en vivo con semáforo y lista de alertas.
              </p>
              <div className="mt-4 w-full space-y-2">
                <div className="shimmer h-2.5 rounded-full w-full" />
                <div className="shimmer h-2.5 rounded-full w-3/4" />
                <div className="shimmer h-2.5 rounded-full w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
