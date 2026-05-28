import {
  MOCK_SINIESTROS,
  computeStats,
  type Siniestro,
  type NivelRiesgo,
  type Stats,
} from "./mock-data";

// ¡ENCENDEMOS LA API REAL! 🚀
const USE_API = true; 

export type { Siniestro, NivelRiesgo, Stats };

export interface SiniestroFilters {
  niveles?: NivelRiesgo[];
  ramos?: string[];
  fechaDesde?: string;
  fechaHasta?: string;
}

// ─── Client-side filter helper ───────────────────────────────────────────────
function applyFilters(list: Siniestro[], filters: SiniestroFilters): Siniestro[] {
  let result = list;
  if (filters.niveles && filters.niveles.length > 0) {
    result = result.filter((s) => filters.niveles!.includes(s.nivel_riesgo));
  }
  if (filters.ramos && filters.ramos.length > 0) {
    result = result.filter((s) => filters.ramos!.includes(s.ramo));
  }
  if (filters.fechaDesde) {
    result = result.filter((s) => s.fecha_ocurrencia >= filters.fechaDesde!);
  }
  if (filters.fechaHasta) {
    result = result.filter((s) => s.fecha_ocurrencia <= filters.fechaHasta!);
  }
  return result;
}

// ─── Traductor de Datos (Python -> TypeScript) ──────────────────────────────
function mapBackendToUI(sin: any): Siniestro {
  return {
    id_siniestro: sin.id_siniestro,
    id_asegurado: sin.id_asegurado || "ASE-0000",
    nombre_asegurado: sin.asegurados_sinteticos?.nombre_completo || "Asegurado Real",
    ramo: sin.ramo || "Autos",
    cobertura: sin.cobertura || "No especificada",
    fecha_ocurrencia: sin.fecha_ocurrencia || "2024-01-01",
    fecha_reporte: sin.fecha_reporte || "2024-01-01",
    monto_reclamado: sin.monto_reclamado || 0,
    monto_estimado: (sin.monto_reclamado || 0) * 0.9,
    estado: "En revisión",
    descripcion: sin.descripcion_hechos || "Sin descripción proporcionada",
    documentos_completos: true,
    id_proveedor: "PRV-REAL",
    nombre_proveedor: "Proveedor Registrado",
    dias_desde_inicio_poliza: 100,
    dias_entre_ocurrencia_reporte: sin.dias_entre_ocurrencia_reporte || 0,
    historial_siniestros_asegurado: sin.asegurados_sinteticos?.reclamos_12_meses || 0,
    rules_score: sin.score_reglas || 0,
    anomaly_score: 0,
    final_score: sin.score_reglas || 0,
    nivel_riesgo: (sin.nivel_riesgo || "verde").toLowerCase() as NivelRiesgo,
    // Formateamos las alertas para que la UI no falle
    alertas_activas: Array.isArray(sin.alertas) 
      ? sin.alertas.map((a: string) => ({ señal: a, pts: 0 })) 
      : []
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getSiniestros(filters: SiniestroFilters = {}): Promise<Siniestro[]> {
  if (USE_API) {
    // Forzamos "no-store" para que Next.js no guarde caché y siempre muestre la BD fresca
    const res = await fetch(`http://localhost:8000/api/siniestros`, { cache: "no-store" });
    if (!res.ok) throw new Error("Error fetching siniestros");
    
    const rawData = await res.json();
    const listReal = rawData.map(mapBackendToUI);
    
    const sorted = listReal.sort((a: Siniestro, b: Siniestro) => b.final_score - a.final_score);
    return applyFilters(sorted, filters);
  }

  const sorted = [...MOCK_SINIESTROS].sort((a, b) => b.final_score - a.final_score);
  return applyFilters(sorted, filters);
}

export async function getSiniestro(id: string): Promise<Siniestro | null> {
  if (USE_API) {
    const list = await getSiniestros(); // Reutiliza la función de arriba para mapear todo bien
    return list.find((s) => s.id_siniestro === id) ?? null;
  }
  return MOCK_SINIESTROS.find((s) => s.id_siniestro === id) ?? null;
}

export async function getStats(filters: SiniestroFilters = {}): Promise<Stats> {
  const siniestros = await getSiniestros(filters);
  return computeStats(siniestros);
}

export function getRamos(): string[] {
  return [...new Set(MOCK_SINIESTROS.map((s) => s.ramo))].sort();
}