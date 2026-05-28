"use client";

import { useState } from "react";
import { FilePlus2, ShieldAlert, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NuevoSiniestroPage() {
  // 1. Estados del formulario
  const [formData, setFormData] = useState({
    cobertura: "Robo",
    fechaOcurrencia: "",
    fechaReporte: "",
    montoReclamado: "",
    reclamosPrevios: "0",
    descripcion: "",
  });

  // 2. Estados de la API
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  // 3. Manejador de cambios
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Utilidad para calcular días (necesario para tu regla RF-06)
  const calcularDias = (inicio: string, fin: string) => {
    if (!inicio || !fin) return 0;
    const diffTime = new Date(fin).getTime() - new Date(inicio).getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // 5. Enviar a tu API FastAPI
  const handleSubmit = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const payload = {
        cobertura: formData.cobertura,
        monto_reclamado: parseFloat(formData.montoReclamado) || 0,
        dias_entre_ocurrencia_reporte: calcularDias(formData.fechaOcurrencia, formData.fechaReporte),
        reclamos_12_meses: parseInt(formData.reclamosPrevios) || 0,
        descripcion: formData.descripcion,
      };

      const res = await fetch("http://localhost:8000/api/evaluar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResultado(data);
    } catch (error) {
      console.error("Error evaluando siniestro:", error);
    } finally {
      setLoading(false);
    }
  };

  // 6. Colores dinámicos para el semáforo
  const getColorSemáforo = (nivel: string) => {
    if (nivel === "Rojo") return "text-[var(--rojo)]";
    if (nivel === "Amarillo") return "text-[var(--amarillo)]";
    return "text-[var(--verde)]";
  };

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
                {/* Ramo (Simulado para UI) */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Ramo
                  </label>
                  <select disabled className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-foreground focus:outline-none opacity-70">
                    <option>Autos</option>
                  </select>
                </div>
                
                {/* Cobertura */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Cobertura
                  </label>
                  <select 
                    name="cobertura"
                    value={formData.cobertura}
                    onChange={handleChange}
                    className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-white/[0.06]"
                  >
                    <option value="Robo">Robo</option>
                    <option value="Daños">Daños (Choque)</option>
                    <option value="Responsabilidad Civil">Responsabilidad Civil</option>
                  </select>
                </div>

                {/* Fecha ocurrencia */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Fecha de Ocurrencia
                  </label>
                  <input 
                    type="date"
                    name="fechaOcurrencia"
                    value={formData.fechaOcurrencia}
                    onChange={handleChange}
                    className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-white/[0.06] [color-scheme:dark]"
                  />
                </div>

                {/* Fecha reporte */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Fecha de Reporte
                  </label>
                  <input 
                    type="date"
                    name="fechaReporte"
                    value={formData.fechaReporte}
                    onChange={handleChange}
                    className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-white/[0.06] [color-scheme:dark]"
                  />
                </div>

                {/* Monto reclamado */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Monto Reclamado (MXN)
                  </label>
                  <input 
                    type="number"
                    name="montoReclamado"
                    placeholder="Ej: 15000"
                    value={formData.montoReclamado}
                    onChange={handleChange}
                    className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-white/[0.06]"
                  />
                </div>

                {/* Reclamos en 12 meses (Reemplazando ID Proveedor) */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Reclamos Previos (12 Meses)
                  </label>
                  <input 
                    type="number"
                    name="reclamosPrevios"
                    value={formData.reclamosPrevios}
                    onChange={handleChange}
                    className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-white/[0.06]"
                  />
                </div>

                {/* Descripción — full width */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Descripción del Siniestro
                  </label>
                  <textarea 
                    name="descripcion"
                    placeholder="Pega aquí el texto clonado de prueba o describe los hechos..."
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full h-24 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-white/[0.06] resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !formData.montoReclamado || !formData.descripcion} 
                  className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FilePlus2 className="h-4 w-4" />
                  )}
                  {loading ? "Analizando IA..." : "Evaluar Riesgo"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Se conectará a{" "}
                  <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-[11px]">
                    POST /api/evaluar
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score preview panel */}
        <div>
          <Card className="border-white/[0.08] bg-white/[0.03] h-full">
            <CardHeader className="pb-3 px-5 pt-4 border-b border-white/[0.06]">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ShieldAlert className={`h-4 w-4 ${resultado ? getColorSemáforo(resultado.nivel_riesgo) : "text-muted-foreground"}`} />
                Análisis de FraudIA
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-6 flex flex-col items-center text-center">
              {!resultado ? (
                // ESTADO VACÍO (ESPERANDO DATOS)
                <div className="mt-6">
                  <div className="mb-4 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04] border border-dashed border-white/[0.08]">
                    <ShieldAlert className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm font-medium">Esperando datos</p>
                  <p className="mt-1 text-xs text-muted-foreground max-w-[200px] mx-auto">
                    Completa el formulario y presiona "Evaluar Riesgo" para obtener el score en vivo con la IA.
                  </p>
                </div>
              ) : (
                // ESTADO CON RESULTADOS
                <div className="w-full text-left">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Score Final</p>
                      <h2 className={`text-5xl font-black tabular-nums ${getColorSemáforo(resultado.nivel_riesgo)}`}>
                        {resultado.score_reglas}
                      </h2>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Nivel</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        resultado.nivel_riesgo === "Rojo" ? "bg-[var(--rojo)]/10 text-[var(--rojo)] border-[var(--rojo)]/20" :
                        resultado.nivel_riesgo === "Amarillo" ? "bg-[var(--amarillo)]/10 text-[var(--amarillo)] border-[var(--amarillo)]/20" :
                        "bg-[var(--verde)]/10 text-[var(--verde)] border-[var(--verde)]/20"
                      }`}>
                        {resultado.nivel_riesgo.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Alertas Detectadas</p>
                      {resultado.alertas.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[var(--verde)]" /> No hay alertas críticas.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {resultado.alertas.map((alerta: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm bg-white/[0.04] p-2.5 rounded-lg border border-white/[0.05]">
                              <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${resultado.nivel_riesgo === 'Rojo' ? 'text-[var(--rojo)]' : 'text-[var(--amarillo)]'}`} />
                              <span>{alerta}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/[0.06]">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-indigo-400" /> Veredicto Gemini IA
                      </p>
                      <div className="text-sm leading-relaxed text-foreground/90 bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10">
                        {resultado.explicacion_agente}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}