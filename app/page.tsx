"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  TrendingUp,
  DollarSign,
  FileText,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SemaforoBadge } from "@/components/semaforo-badge";
import { MOCK_SINIESTROS, computeStats } from "@/lib/mock-data";
import { getRamos } from "@/lib/data";
import type { NivelRiesgo } from "@/lib/mock-data";

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}

const ALL_NIVELES: NivelRiesgo[] = ["rojo", "amarillo", "verde"];
const ALL_RAMOS = getRamos();

const NIVEL_CONFIG: Record<NivelRiesgo, { label: string; color: string; activeClass: string; borderClass: string }> = {
  rojo:     { label: "Rojo",     color: "var(--rojo)",     activeClass: "bg-[var(--rojo)]/15 text-[var(--rojo)] border-[var(--rojo)]/40",     borderClass: "border-l-[var(--rojo)]" },
  amarillo: { label: "Amarillo", color: "var(--amarillo)", activeClass: "bg-[var(--amarillo)]/15 text-[var(--amarillo)] border-[var(--amarillo)]/40", borderClass: "border-l-[var(--amarillo)]" },
  verde:    { label: "Verde",    color: "var(--verde)",    activeClass: "bg-[var(--verde)]/15 text-[var(--verde)] border-[var(--verde)]/40",     borderClass: "border-l-[var(--verde)]" },
};

export default function DashboardPage() {
  // ── Filter state ─────────────────────────────────────────
  const [activeNiveles, setActiveNiveles] = useState<Set<NivelRiesgo>>(
    new Set(ALL_NIVELES)
  );
  const [selectedRamo, setSelectedRamo] = useState<string>("todos");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const hasActiveFilters =
    activeNiveles.size < ALL_NIVELES.length ||
    selectedRamo !== "todos" ||
    fechaDesde !== "" ||
    fechaHasta !== "";

  function toggleNivel(nivel: NivelRiesgo) {
    setActiveNiveles((prev) => {
      const next = new Set(prev);
      if (next.has(nivel)) {
        // Don't allow deselecting all
        if (next.size === 1) return prev;
        next.delete(nivel);
      } else {
        next.add(nivel);
      }
      return next;
    });
  }

  function clearFilters() {
    setActiveNiveles(new Set(ALL_NIVELES));
    setSelectedRamo("todos");
    setFechaDesde("");
    setFechaHasta("");
  }

  // ── Filtered + sorted data ───────────────────────────────
  const filtered = useMemo(() => {
    let list = [...MOCK_SINIESTROS].sort((a, b) => b.final_score - a.final_score);

    if (activeNiveles.size < ALL_NIVELES.length) {
      list = list.filter((s) => activeNiveles.has(s.nivel_riesgo));
    }
    if (selectedRamo !== "todos") {
      list = list.filter((s) => s.ramo === selectedRamo);
    }
    if (fechaDesde) {
      list = list.filter((s) => s.fecha_ocurrencia >= fechaDesde);
    }
    if (fechaHasta) {
      list = list.filter((s) => s.fecha_ocurrencia <= fechaHasta);
    }
    return list;
  }, [activeNiveles, selectedRamo, fechaDesde, fechaHasta]);

  // ── KPIs derived from filtered list ─────────────────────
  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const pctRojo = stats.total > 0 ? Math.round((stats.rojo / stats.total) * 100) : 0;
  const pctAmarillo = stats.total > 0 ? Math.round((stats.amarillo / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bandeja de Siniestros</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Casos ordenados por nivel de riesgo · Datos de demostración
          </p>
        </div>
      </div>

      {/* KPI cards — clickable semáforo toggles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total — no toggle, just info */}
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Casos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {hasActiveFilters ? "filtrado" : "en revisión"}
            </p>
          </CardContent>
        </Card>

        {/* Rojo — clickable toggle */}
        <button
          id="filter-toggle-rojo"
          onClick={() => toggleNivel("rojo")}
          className={`text-left rounded-xl border transition-all duration-200 ${
            activeNiveles.has("rojo")
              ? "border-l-2 border-[var(--rojo)]/30 border-l-[var(--rojo)] bg-[var(--rojo)]/5 ring-1 ring-[var(--rojo)]/20"
              : "border-white/[0.04] bg-white/[0.01] opacity-50"
          }`}
        >
          <div className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Riesgo Alto
            </span>
            <AlertTriangle className="h-4 w-4 text-[var(--rojo)]/70" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-3xl font-bold text-[var(--rojo)]">{stats.rojo}</div>
            <p className="mt-0.5 text-xs text-muted-foreground">{pctRojo}% del total</p>
          </div>
        </button>

        {/* Amarillo — clickable toggle */}
        <button
          id="filter-toggle-amarillo"
          onClick={() => toggleNivel("amarillo")}
          className={`text-left rounded-xl border transition-all duration-200 ${
            activeNiveles.has("amarillo")
              ? "border-l-2 border-[var(--amarillo)]/30 border-l-[var(--amarillo)] bg-[var(--amarillo)]/5 ring-1 ring-[var(--amarillo)]/20"
              : "border-white/[0.04] bg-white/[0.01] opacity-50"
          }`}
        >
          <div className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Riesgo Medio
            </span>
            <TrendingUp className="h-4 w-4 text-[var(--amarillo)]/70" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-3xl font-bold text-[var(--amarillo)]">{stats.amarillo}</div>
            <p className="mt-0.5 text-xs text-muted-foreground">{pctAmarillo}% del total</p>
          </div>
        </button>

        {/* Verde — clickable toggle */}
        <button
          id="filter-toggle-verde"
          onClick={() => toggleNivel("verde")}
          className={`text-left rounded-xl border transition-all duration-200 ${
            activeNiveles.has("verde")
              ? "border-l-2 border-[var(--verde)]/30 border-l-[var(--verde)] bg-[var(--verde)]/5 ring-1 ring-[var(--verde)]/20"
              : "border-white/[0.04] bg-white/[0.01] opacity-50"
          }`}
        >
          <div className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Riesgo Bajo
            </span>
            <CheckCircle2 className="h-4 w-4 text-[var(--verde)]/70" />
          </div>
          <div className="px-4 pb-4">
            <div className="text-3xl font-bold text-[var(--verde)]">{stats.verde}</div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.verde / stats.total) * 100) : 0}% del total
            </p>
          </div>
        </button>
      </div>

      {/* Monto en riesgo + filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Monto */}
        <Card className="border-white/[0.08] bg-white/[0.03] sm:flex-none">
          <CardHeader className="flex flex-row items-center gap-3 py-3 px-4">
            <DollarSign className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Monto en Riesgo
              </p>
              <p className="text-lg font-bold leading-tight">
                {formatMXN(stats.monto_total_riesgo)}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ramo filter */}
          <div className="relative">
            <select
              id="filter-ramo"
              value={selectedRamo}
              onChange={(e) => setSelectedRamo(e.target.value)}
              className="appearance-none rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 pr-7 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 cursor-pointer hover:bg-white/[0.06] transition-colors"
            >
              <option value="todos">Todos los ramos</option>
              {ALL_RAMOS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Date from */}
          <input
            id="filter-fecha-desde"
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            placeholder="Desde"
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-white/[0.06] transition-colors [color-scheme:dark]"
          />

          {/* Date to */}
          <input
            id="filter-fecha-hasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            placeholder="Hasta"
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-white/[0.06] transition-colors [color-scheme:dark]"
          />

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              id="filter-clear"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
            >
              <X className="h-3 w-3" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Siniestros table */}
      <Card className="border-white/[0.08] bg-white/[0.03]">
        <CardHeader className="px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Siniestros Prioritarios
            </CardTitle>
            <Badge
              variant="outline"
              className="border-white/[0.08] text-muted-foreground text-[11px]"
            >
              {filtered.length} caso{filtered.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">
                Ningún caso coincide con los filtros activos.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="pl-6 text-xs text-muted-foreground/70 font-medium uppercase tracking-wider w-[130px]">
                    ID
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider">
                    Asegurado
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider hidden md:table-cell">
                    Ramo / Cobertura
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider text-right hidden sm:table-cell">
                    Monto
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider text-center w-[90px]">
                    Score
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider w-[120px]">
                    Semáforo
                  </TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((siniestro) => (
                  <TableRow
                    key={siniestro.id_siniestro}
                    className="border-white/[0.04] hover:bg-white/[0.04] cursor-pointer transition-colors group"
                  >
                    <TableCell className="pl-6">
                      <Link href={`/siniestros/${siniestro.id_siniestro}`} className="block">
                        <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          {siniestro.id_siniestro}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/siniestros/${siniestro.id_siniestro}`} className="block">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">
                          {siniestro.nombre_asegurado}
                        </span>
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {siniestro.id_asegurado}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Link href={`/siniestros/${siniestro.id_siniestro}`} className="block">
                        <span className="text-sm">{siniestro.ramo}</span>
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {siniestro.cobertura}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      <Link href={`/siniestros/${siniestro.id_siniestro}`} className="block">
                        <span className="text-sm tabular-nums">
                          {formatMXN(siniestro.monto_reclamado)}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/siniestros/${siniestro.id_siniestro}`} className="block">
                        <span
                          className="text-lg font-bold tabular-nums"
                          style={{
                            color:
                              siniestro.nivel_riesgo === "rojo"
                                ? "var(--rojo)"
                                : siniestro.nivel_riesgo === "amarillo"
                                ? "var(--amarillo)"
                                : "var(--verde)",
                          }}
                        >
                          {siniestro.final_score}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/siniestros/${siniestro.id_siniestro}`} className="block">
                        <SemaforoBadge nivel={siniestro.nivel_riesgo} />
                      </Link>
                    </TableCell>
                    <TableCell className="pr-4">
                      <Link href={`/siniestros/${siniestro.id_siniestro}`}>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
