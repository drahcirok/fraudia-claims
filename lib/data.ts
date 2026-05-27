/**
 * data.ts — Thin abstraction over mock data / real API.
 * To swap to real API: set USE_API = true (or read from env).
 *
 * When partner delivers FastAPI endpoints, flip USE_API and
 * the rest of the app requires zero changes.
 */

import {
  MOCK_SINIESTROS,
  computeStats,
  type Siniestro,
  type NivelRiesgo,
  type Stats,
} from "./mock-data";

const USE_API = false; // flip to true when partner delivers endpoints

export type { Siniestro, NivelRiesgo, Stats };

export interface SiniestroFilters {
  niveles?: NivelRiesgo[];   // semáforo filter
  ramos?: string[];          // ramo filter
  fechaDesde?: string;       // YYYY-MM-DD
  fechaHasta?: string;       // YYYY-MM-DD
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

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getSiniestros(filters: SiniestroFilters = {}): Promise<Siniestro[]> {
  if (USE_API) {
    const params = new URLSearchParams();
    filters.niveles?.forEach((n) => params.append("nivel", n));
    filters.ramos?.forEach((r) => params.append("ramo", r));
    if (filters.fechaDesde) params.set("desde", filters.fechaDesde);
    if (filters.fechaHasta) params.set("hasta", filters.fechaHasta);

    const res = await fetch(`/api/py/siniestros?${params.toString()}`);
    if (!res.ok) throw new Error("Error fetching siniestros");
    return res.json();
  }

  // Sort by score desc like the real API would
  const sorted = [...MOCK_SINIESTROS].sort((a, b) => b.final_score - a.final_score);
  return applyFilters(sorted, filters);
}

export async function getSiniestro(id: string): Promise<Siniestro | null> {
  if (USE_API) {
    const res = await fetch(`/api/py/siniestros/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Error fetching siniestro");
    return res.json();
  }

  return MOCK_SINIESTROS.find((s) => s.id_siniestro === id) ?? null;
}

export async function getStats(filters: SiniestroFilters = {}): Promise<Stats> {
  const siniestros = await getSiniestros(filters);
  return computeStats(siniestros);
}

/** All unique ramos in dataset — for filter dropdown */
export function getRamos(): string[] {
  return [...new Set(MOCK_SINIESTROS.map((s) => s.ramo))].sort();
}
