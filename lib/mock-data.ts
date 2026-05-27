export type NivelRiesgo = "rojo" | "amarillo" | "verde";

export interface Alerta {
  señal: string;
  pts: number;
  detalle?: string;
  tipo?: "CRÍTICA";
  clasificacion?: string;
}

export interface Siniestro {
  id_siniestro: string;
  id_asegurado: string;
  nombre_asegurado: string;
  ramo: string;
  cobertura: string;
  fecha_ocurrencia: string;
  fecha_reporte: string;
  monto_reclamado: number;
  monto_estimado: number;
  estado: string;
  descripcion: string;
  documentos_completos: boolean;
  id_proveedor: string;
  nombre_proveedor: string;
  dias_desde_inicio_poliza: number;
  dias_entre_ocurrencia_reporte: number;
  historial_siniestros_asegurado: number;
  rules_score: number;
  anomaly_score: number;
  final_score: number;
  nivel_riesgo: NivelRiesgo;
  alertas_activas: Alerta[];
}

export interface Stats {
  total: number;
  rojo: number;
  amarillo: number;
  verde: number;
  monto_total_riesgo: number;
}

export function computeStats(siniestros: Siniestro[]): Stats {
  return {
    total: siniestros.length,
    rojo: siniestros.filter((s) => s.nivel_riesgo === "rojo").length,
    amarillo: siniestros.filter((s) => s.nivel_riesgo === "amarillo").length,
    verde: siniestros.filter((s) => s.nivel_riesgo === "verde").length,
    monto_total_riesgo: siniestros
      .filter((s) => s.nivel_riesgo !== "verde")
      .reduce((sum, s) => sum + s.monto_reclamado, 0),
  };
}

export const MOCK_SINIESTROS: Siniestro[] = [
  // ── ROJOS ────────────────────────────────────────────────
  {
    id_siniestro: "SIN-2024-0981",
    id_asegurado: "ASE-4421",
    nombre_asegurado: "Rodrigo Fuentes Álvarez",
    ramo: "Autos",
    cobertura: "Robo",
    fecha_ocurrencia: "2024-05-02",
    fecha_reporte: "2024-05-09",
    monto_reclamado: 285000,
    monto_estimado: 270000,
    estado: "En revisión",
    descripcion: "Vehículo reportado robado en estacionamiento. Sin testigos. Llave original perdida.",
    documentos_completos: false,
    id_proveedor: "PRV-0091",
    nombre_proveedor: "Taller Norteño S.A.",
    dias_desde_inicio_poliza: 8,
    dias_entre_ocurrencia_reporte: 7,
    historial_siniestros_asegurado: 3,
    rules_score: 88,
    anomaly_score: 91,
    final_score: 89,
    nivel_riesgo: "rojo",
    alertas_activas: [
      { señal: "Borde de vigencia", pts: 8, detalle: "8 días desde inicio de póliza" },
      { señal: "Demora denuncia robo", pts: 8, detalle: "168 horas de demora" },
      { señal: "Alta frecuencia asegurado", pts: 8, detalle: "3 siniestros en 18 meses" },
      { señal: "Documentos incompletos", pts: 4 },
      { señal: "RF-01: Cobertura PTxRB", pts: 0, tipo: "CRÍTICA", clasificacion: "Rojo" },
    ],
  },
  {
    id_siniestro: "SIN-2024-0754",
    id_asegurado: "ASE-1138",
    nombre_asegurado: "María Elena Gutiérrez",
    ramo: "Autos",
    cobertura: "Daños",
    fecha_ocurrencia: "2024-04-18",
    fecha_reporte: "2024-04-25",
    monto_reclamado: 94500,
    monto_estimado: 80000,
    estado: "En revisión",
    descripcion: "Colisión frontal reportada sin tercero identificado. Daños severos en capó y motor.",
    documentos_completos: true,
    id_proveedor: "PRV-0217",
    nombre_proveedor: "Auto Express Monterrey",
    dias_desde_inicio_poliza: 22,
    dias_entre_ocurrencia_reporte: 7,
    historial_siniestros_asegurado: 2,
    rules_score: 78,
    anomaly_score: 82,
    final_score: 79,
    nivel_riesgo: "rojo",
    alertas_activas: [
      { señal: "Borde de vigencia", pts: 4, detalle: "22 días desde inicio de póliza" },
      { señal: "Reporte tardío", pts: 5, detalle: "7 días entre ocurrencia y reporte" },
      { señal: "Alta frecuencia asegurado", pts: 4, detalle: "2 siniestros en 18 meses" },
      { señal: "Daño severo sin tercero identificado", pts: 5 },
    ],
  },
  {
    id_siniestro: "SIN-2024-0612",
    id_asegurado: "ASE-7720",
    nombre_asegurado: "Sofía Ramírez Castro",
    ramo: "Hogar",
    cobertura: "Incendio",
    fecha_ocurrencia: "2024-03-29",
    fecha_reporte: "2024-04-02",
    monto_reclamado: 420000,
    monto_estimado: 390000,
    estado: "En revisión",
    descripcion: "Incendio en cocina. Documentos de la póliza con inconsistencias en fechas de emisión.",
    documentos_completos: false,
    id_proveedor: "PRV-0445",
    nombre_proveedor: "Reconstrucciones del Norte",
    dias_desde_inicio_poliza: 14,
    dias_entre_ocurrencia_reporte: 4,
    historial_siniestros_asegurado: 1,
    rules_score: 82,
    anomaly_score: 78,
    final_score: 81,
    nivel_riesgo: "rojo",
    alertas_activas: [
      { señal: "Borde de vigencia", pts: 4, detalle: "14 días desde inicio de póliza" },
      { señal: "Documentos inconsistentes/alterados", pts: 10, detalle: "2 docs con inconsistencias" },
      { señal: "RF-02: Posible falsificación documental", pts: 0, tipo: "CRÍTICA", clasificacion: "Rojo" },
    ],
  },
  {
    id_siniestro: "SIN-2024-0899",
    id_asegurado: "ASE-5567",
    nombre_asegurado: "Lucía Torres Vega",
    ramo: "Autos",
    cobertura: "Robo",
    fecha_ocurrencia: "2024-04-05",
    fecha_reporte: "2024-04-07",
    monto_reclamado: 210000,
    monto_estimado: 195000,
    estado: "En revisión",
    descripcion: "Robo de vehículo en vía pública. Denuncia presentada 48 horas después del evento.",
    documentos_completos: true,
    id_proveedor: "PRV-0338",
    nombre_proveedor: "Valuadores Asociados MX",
    dias_desde_inicio_poliza: 62,
    dias_entre_ocurrencia_reporte: 2,
    historial_siniestros_asegurado: 1,
    rules_score: 76,
    anomaly_score: 70,
    final_score: 74,
    nivel_riesgo: "rojo",
    alertas_activas: [
      { señal: "Demora denuncia robo", pts: 8, detalle: "48 horas de demora" },
      { señal: "RF-01: Cobertura PTxRB", pts: 0, tipo: "CRÍTICA", clasificacion: "Rojo" },
    ],
  },
  {
    id_siniestro: "SIN-2024-1320",
    id_asegurado: "ASE-6603",
    nombre_asegurado: "Gerardo Blanco Medina",
    ramo: "Salud",
    cobertura: "Gastos Médicos Mayores",
    fecha_ocurrencia: "2024-06-03",
    fecha_reporte: "2024-06-15",
    monto_reclamado: 580000,
    monto_estimado: 480000,
    estado: "En revisión",
    descripcion: "Hospitalización de urgencia. Facturas de proveedor médico no certificado. Historial de 4 reclamaciones previas.",
    documentos_completos: false,
    id_proveedor: "PRV-0812",
    nombre_proveedor: "Clínica San Benito (no certificada)",
    dias_desde_inicio_poliza: 9,
    dias_entre_ocurrencia_reporte: 12,
    historial_siniestros_asegurado: 4,
    rules_score: 91,
    anomaly_score: 88,
    final_score: 90,
    nivel_riesgo: "rojo",
    alertas_activas: [
      { señal: "Borde de vigencia", pts: 8, detalle: "9 días desde inicio de póliza" },
      { señal: "Alta frecuencia asegurado", pts: 8, detalle: "4 siniestros en 18 meses" },
      { señal: "Reporte tardío", pts: 5, detalle: "12 días entre ocurrencia y reporte" },
      { señal: "Documentos incompletos", pts: 4 },
      { señal: "Proveedor recurrente en casos observados", pts: 5 },
      { señal: "RF-03: Coincidencia con lista restrictiva", pts: 0, tipo: "CRÍTICA", clasificacion: "Rojo" },
    ],
  },
  {
    id_siniestro: "SIN-2024-1488",
    id_asegurado: "ASE-2240",
    nombre_asegurado: "Valeria Montoya Serna",
    ramo: "Vida",
    cobertura: "Muerte Accidental",
    fecha_ocurrencia: "2024-07-10",
    fecha_reporte: "2024-07-22",
    monto_reclamado: 1200000,
    monto_estimado: 1200000,
    estado: "En revisión",
    descripcion: "Reclamación por muerte accidental. Beneficiario no convivía con el asegurado. Póliza contratada 18 días antes.",
    documentos_completos: false,
    id_proveedor: "PRV-0001",
    nombre_proveedor: "Ajustadores Centrales S.A.",
    dias_desde_inicio_poliza: 18,
    dias_entre_ocurrencia_reporte: 12,
    historial_siniestros_asegurado: 0,
    rules_score: 84,
    anomaly_score: 95,
    final_score: 87,
    nivel_riesgo: "rojo",
    alertas_activas: [
      { señal: "Borde de vigencia", pts: 4, detalle: "18 días desde inicio de póliza" },
      { señal: "Reporte tardío", pts: 5, detalle: "12 días entre ocurrencia y reporte" },
      { señal: "Documentos incompletos", pts: 4 },
      { señal: "Monto ≥95% de suma asegurada", pts: 4, detalle: "100% de la cobertura" },
      { señal: "RF-04: Dinámica del accidente físicamente imposible", pts: 0, tipo: "CRÍTICA", clasificacion: "Rojo" },
    ],
  },
  // ── AMARILLOS ─────────────────────────────────────────────
  {
    id_siniestro: "SIN-2024-1102",
    id_asegurado: "ASE-3305",
    nombre_asegurado: "Carlos Mendoza Pérez",
    ramo: "Autos",
    cobertura: "Responsabilidad Civil",
    fecha_ocurrencia: "2024-05-10",
    fecha_reporte: "2024-05-16",
    monto_reclamado: 135000,
    monto_estimado: 120000,
    estado: "Pago Total",
    descripcion: "Siniestro de RC con tercero. Proveedor figura en registro interno de observaciones.",
    documentos_completos: true,
    id_proveedor: "PRV-0091",
    nombre_proveedor: "Taller Norteño S.A.",
    dias_desde_inicio_poliza: 185,
    dias_entre_ocurrencia_reporte: 6,
    historial_siniestros_asegurado: 1,
    rules_score: 58,
    anomaly_score: 63,
    final_score: 60,
    nivel_riesgo: "amarillo",
    alertas_activas: [
      { señal: "Proveedor recurrente en casos observados", pts: 5 },
      { señal: "Reporte tardío", pts: 3 },
      { señal: "Monto ≥95% de suma asegurada", pts: 4, detalle: "97% de la cobertura" },
    ],
  },
  {
    id_siniestro: "SIN-2024-1055",
    id_asegurado: "ASE-3310",
    nombre_asegurado: "Ana Cristina Varela",
    ramo: "Hogar",
    cobertura: "Robo a casa habitación",
    fecha_ocurrencia: "2024-05-01",
    fecha_reporte: "2024-05-06",
    monto_reclamado: 185000,
    monto_estimado: 160000,
    estado: "En revisión",
    descripcion: "Robo con posible fractura de candado. Sin evidencia de entrada forzada en puertas.",
    documentos_completos: false,
    id_proveedor: "PRV-0551",
    nombre_proveedor: "Ajustadores del Pacífico",
    dias_desde_inicio_poliza: 29,
    dias_entre_ocurrencia_reporte: 5,
    historial_siniestros_asegurado: 2,
    rules_score: 52,
    anomaly_score: 58,
    final_score: 54,
    nivel_riesgo: "amarillo",
    alertas_activas: [
      { señal: "Borde de vigencia", pts: 4, detalle: "29 días desde inicio de póliza" },
      { señal: "Alta frecuencia asegurado", pts: 4, detalle: "2 siniestros en 18 meses" },
      { señal: "Documentos incompletos", pts: 4 },
      { señal: "Reporte tardío", pts: 3 },
    ],
  },
  {
    id_siniestro: "SIN-2024-1210",
    id_asegurado: "ASE-9901",
    nombre_asegurado: "Patricia Morales Ibáñez",
    ramo: "Autos",
    cobertura: "Daños",
    fecha_ocurrencia: "2024-05-18",
    fecha_reporte: "2024-05-23",
    monto_reclamado: 158000,
    monto_estimado: 140000,
    estado: "En revisión",
    descripcion: "Volcadura en carretera de madrugada. Sin pasajeros adicionales. Relato con inconsistencias menores.",
    documentos_completos: true,
    id_proveedor: "PRV-0217",
    nombre_proveedor: "Auto Express Monterrey",
    dias_desde_inicio_poliza: 41,
    dias_entre_ocurrencia_reporte: 5,
    historial_siniestros_asegurado: 1,
    rules_score: 44,
    anomaly_score: 55,
    final_score: 47,
    nivel_riesgo: "amarillo",
    alertas_activas: [
      { señal: "Reporte tardío", pts: 3 },
      { señal: "Accidente múltiple de madrugada", pts: 3 },
      { señal: "Proveedor recurrente en casos observados", pts: 5 },
    ],
  },
  {
    id_siniestro: "SIN-2024-1380",
    id_asegurado: "ASE-7712",
    nombre_asegurado: "Héctor Zavala Fuentes",
    ramo: "Salud",
    cobertura: "Gastos Médicos Menores",
    fecha_ocurrencia: "2024-06-14",
    fecha_reporte: "2024-06-21",
    monto_reclamado: 62000,
    monto_estimado: 55000,
    estado: "En revisión",
    descripcion: "Consultas de especialista con recetas duplicadas. Dos reclamaciones similares en 3 meses.",
    documentos_completos: true,
    id_proveedor: "PRV-0630",
    nombre_proveedor: "Centro Médico Integral",
    dias_desde_inicio_poliza: 90,
    dias_entre_ocurrencia_reporte: 7,
    historial_siniestros_asegurado: 2,
    rules_score: 48,
    anomaly_score: 52,
    final_score: 49,
    nivel_riesgo: "amarillo",
    alertas_activas: [
      { señal: "Reporte tardío", pts: 5, detalle: "7 días entre ocurrencia y reporte" },
      { señal: "Alta frecuencia asegurado", pts: 4, detalle: "2 siniestros en 18 meses" },
      { señal: "Monto ≥95% de suma asegurada", pts: 4, detalle: "96% de la cobertura" },
    ],
  },
  {
    id_siniestro: "SIN-2024-1455",
    id_asegurado: "ASE-5521",
    nombre_asegurado: "Daniela Ríos Castañeda",
    ramo: "Hogar",
    cobertura: "Daños por agua",
    fecha_ocurrencia: "2024-07-02",
    fecha_reporte: "2024-07-07",
    monto_reclamado: 98000,
    monto_estimado: 85000,
    estado: "En revisión",
    descripcion: "Inundación en sótano. Valuación de daños supera el estimado inicial en 15%. Proveedor sin historial previo.",
    documentos_completos: false,
    id_proveedor: "PRV-0770",
    nombre_proveedor: "Restauraciones Rápidas GDL",
    dias_desde_inicio_poliza: 55,
    dias_entre_ocurrencia_reporte: 5,
    historial_siniestros_asegurado: 1,
    rules_score: 42,
    anomaly_score: 50,
    final_score: 44,
    nivel_riesgo: "amarillo",
    alertas_activas: [
      { señal: "Documentos incompletos", pts: 4 },
      { señal: "Reporte tardío", pts: 3 },
      { señal: "Monto ≥95% de suma asegurada", pts: 4, detalle: "98% de la cobertura" },
    ],
  },
  {
    id_siniestro: "SIN-2024-1530",
    id_asegurado: "ASE-8810",
    nombre_asegurado: "Miguel Ángel Soto Lara",
    ramo: "Vida",
    cobertura: "Invalidez Permanente",
    fecha_ocurrencia: "2024-07-20",
    fecha_reporte: "2024-07-28",
    monto_reclamado: 350000,
    monto_estimado: 320000,
    estado: "En revisión",
    descripcion: "Dictamen de invalidez emitido por médico no adscrito a la aseguradora. Segundo dictamen solicitado.",
    documentos_completos: true,
    id_proveedor: "PRV-0002",
    nombre_proveedor: "Peritos Médicos Asociados",
    dias_desde_inicio_poliza: 130,
    dias_entre_ocurrencia_reporte: 8,
    historial_siniestros_asegurado: 0,
    rules_score: 46,
    anomaly_score: 48,
    final_score: 47,
    nivel_riesgo: "amarillo",
    alertas_activas: [
      { señal: "Reporte tardío", pts: 5, detalle: "8 días entre ocurrencia y reporte" },
      { señal: "Documentos inconsistentes/alterados", pts: 5, detalle: "1 doc con inconsistencias" },
    ],
  },
  // ── VERDES ────────────────────────────────────────────────
  {
    id_siniestro: "SIN-2024-0333",
    id_asegurado: "ASE-2091",
    nombre_asegurado: "Juan Pablo Herrera",
    ramo: "Autos",
    cobertura: "Daños",
    fecha_ocurrencia: "2024-02-14",
    fecha_reporte: "2024-02-15",
    monto_reclamado: 48000,
    monto_estimado: 52000,
    estado: "Pagado",
    descripcion: "Colisión leve en crucero. Testigo presente. Documentos completos y consistentes.",
    documentos_completos: true,
    id_proveedor: "PRV-0112",
    nombre_proveedor: "Centro de Colisión Plus",
    dias_desde_inicio_poliza: 342,
    dias_entre_ocurrencia_reporte: 1,
    historial_siniestros_asegurado: 0,
    rules_score: 0,
    anomaly_score: 12,
    final_score: 4,
    nivel_riesgo: "verde",
    alertas_activas: [],
  },
  {
    id_siniestro: "SIN-2024-0441",
    id_asegurado: "ASE-8832",
    nombre_asegurado: "Roberto Salinas Noriega",
    ramo: "Autos",
    cobertura: "Responsabilidad Civil",
    fecha_ocurrencia: "2024-03-11",
    fecha_reporte: "2024-03-14",
    monto_reclamado: 67500,
    monto_estimado: 70000,
    estado: "Pagado",
    descripcion: "Accidente con lesionados. Tercero identificado. RC cubierta. Sin irregularidades notables.",
    documentos_completos: true,
    id_proveedor: "PRV-0222",
    nombre_proveedor: "Taller Mecánico San Miguel",
    dias_desde_inicio_poliza: 220,
    dias_entre_ocurrencia_reporte: 3,
    historial_siniestros_asegurado: 0,
    rules_score: 15,
    anomaly_score: 22,
    final_score: 17,
    nivel_riesgo: "verde",
    alertas_activas: [],
  },
  {
    id_siniestro: "SIN-2024-0278",
    id_asegurado: "ASE-6614",
    nombre_asegurado: "Fernando Castillo Ríos",
    ramo: "Autos",
    cobertura: "Daños",
    fecha_ocurrencia: "2024-01-28",
    fecha_reporte: "2024-01-29",
    monto_reclamado: 32000,
    monto_estimado: 35000,
    estado: "Pagado",
    descripcion: "Daño por granizo. Fotos de evidencia presentadas. Valuación de perito independiente.",
    documentos_completos: true,
    id_proveedor: "PRV-0120",
    nombre_proveedor: "Peritajes Rápidos GDL",
    dias_desde_inicio_poliza: 410,
    dias_entre_ocurrencia_reporte: 1,
    historial_siniestros_asegurado: 0,
    rules_score: 0,
    anomaly_score: 8,
    final_score: 2,
    nivel_riesgo: "verde",
    alertas_activas: [],
  },
  {
    id_siniestro: "SIN-2024-1001",
    id_asegurado: "ASE-1190",
    nombre_asegurado: "Claudia Espinoza Reyes",
    ramo: "Hogar",
    cobertura: "Robo a casa habitación",
    fecha_ocurrencia: "2024-05-28",
    fecha_reporte: "2024-05-29",
    monto_reclamado: 25000,
    monto_estimado: 27000,
    estado: "Pagado",
    descripcion: "Robo menor de electrónicos. Denuncia en ministerio público presentada al día siguiente. Fotos y lista de bienes entregadas.",
    documentos_completos: true,
    id_proveedor: "PRV-0300",
    nombre_proveedor: "Ajuste Directo CDMX",
    dias_desde_inicio_poliza: 660,
    dias_entre_ocurrencia_reporte: 1,
    historial_siniestros_asegurado: 0,
    rules_score: 0,
    anomaly_score: 5,
    final_score: 2,
    nivel_riesgo: "verde",
    alertas_activas: [],
  },
  {
    id_siniestro: "SIN-2024-1150",
    id_asegurado: "ASE-4455",
    nombre_asegurado: "Tomás Guerrero Ibarra",
    ramo: "Salud",
    cobertura: "Gastos Médicos Menores",
    fecha_ocurrencia: "2024-06-02",
    fecha_reporte: "2024-06-03",
    monto_reclamado: 8500,
    monto_estimado: 9000,
    estado: "Pagado",
    descripcion: "Consulta de urgencias y medicamentos. Receta y ticket de farmacia entregados.",
    documentos_completos: true,
    id_proveedor: "PRV-0410",
    nombre_proveedor: "Hospital Ángeles GDL",
    dias_desde_inicio_poliza: 180,
    dias_entre_ocurrencia_reporte: 1,
    historial_siniestros_asegurado: 1,
    rules_score: 4,
    anomaly_score: 10,
    final_score: 6,
    nivel_riesgo: "verde",
    alertas_activas: [],
  },
  {
    id_siniestro: "SIN-2024-1290",
    id_asegurado: "ASE-3380",
    nombre_asegurado: "Isabela Moreno Díaz",
    ramo: "Vida",
    cobertura: "Muerte Natural",
    fecha_ocurrencia: "2024-06-20",
    fecha_reporte: "2024-06-21",
    monto_reclamado: 500000,
    monto_estimado: 500000,
    estado: "Pagado",
    descripcion: "Fallecimiento por enfermedad crónica preexistente documentada. Historial médico completo. Beneficiario cónyuge registrado.",
    documentos_completos: true,
    id_proveedor: "PRV-0001",
    nombre_proveedor: "Ajustadores Centrales S.A.",
    dias_desde_inicio_poliza: 1200,
    dias_entre_ocurrencia_reporte: 1,
    historial_siniestros_asegurado: 0,
    rules_score: 0,
    anomaly_score: 15,
    final_score: 5,
    nivel_riesgo: "verde",
    alertas_activas: [],
  },
];

export interface RamoAlertas {
  ramo: string;
  total: number;
  rojo: number;
  amarillo: number;
  verde: number;
}

export function computeAlertasPorRamo(siniestros: Siniestro[]): RamoAlertas[] {
  const groups = new Map<string, { total: number; rojo: number; amarillo: number; verde: number }>();
  for (const s of siniestros) {
    if (!groups.has(s.ramo)) groups.set(s.ramo, { total: 0, rojo: 0, amarillo: 0, verde: 0 });
    const g = groups.get(s.ramo)!;
    g.total += s.alertas_activas.length;
    if (s.nivel_riesgo === "rojo") g.rojo += s.alertas_activas.length;
    else if (s.nivel_riesgo === "amarillo") g.amarillo += s.alertas_activas.length;
    else g.verde += s.alertas_activas.length;
  }
  return Array.from(groups.entries())
    .map(([ramo, v]) => ({ ramo, ...v }))
    .sort((a, b) => b.total - a.total);
}

export interface ProveedorRanking {
  id_proveedor: string;
  nombre_proveedor: string;
  casos: number;
  alertas: number;
  monto_total: number;
}

export function computeProveedorRanking(siniestros: Siniestro[]): ProveedorRanking[] {
  const groups = new Map<string, ProveedorRanking>();
  for (const s of siniestros) {
    if (!groups.has(s.id_proveedor)) {
      groups.set(s.id_proveedor, {
        id_proveedor: s.id_proveedor,
        nombre_proveedor: s.nombre_proveedor,
        casos: 0,
        alertas: 0,
        monto_total: 0,
      });
    }
    const g = groups.get(s.id_proveedor)!;
    g.casos += 1;
    g.alertas += s.alertas_activas.length;
    g.monto_total += s.monto_reclamado;
  }
  return Array.from(groups.values())
    .sort((a, b) => b.alertas - a.alertas);
}

// Legacy static stats (for components that don't use filters yet)
export const MOCK_STATS = computeStats(MOCK_SINIESTROS);
