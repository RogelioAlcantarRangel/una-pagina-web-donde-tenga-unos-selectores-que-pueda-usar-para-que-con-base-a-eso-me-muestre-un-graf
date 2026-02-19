// Indicadores disponibles del INEGI BIE
// Fuente: https://www.inegi.org.mx/app/api/indicadores/desarrolladores/
// Usando el método Catálogo para encontrar IDs válidos

// Nota: El INPC (Índice Nacional de Precios al Consumidor) no está disponible en BISE
// Los indicadores de empleo/desocupación requieren suscripción a INEGI API

// Indicadores verificados que funcionan con la API:
// - 1002000001-3: Población (demografía)
// - 494098: PIB trimestral a precios constantes 2013
// - 524271: PIB a precios corrientes (anual)
// - 6204198547: Exportaciones totales (USD, mensual)
// - 6204198549: Importaciones totales (USD, mensual)
// - 702097: Variación anual personal ocupado (%)
// - 6207061361: ITAEE Total (disponible por estado)
// - 6207061369: ITAEE Actividades primarias (disponible por estado)

export interface Indicator {
  id: string;
  label: string;
  description: string;
  unit: string;
  category: string;
}

export interface Geography {
  id: string;
  label: string;
  type: "nacional" | "estado";
}

export interface ChartDataPoint {
  period: string;
  value: number;
}

// Indicadores populares del INEGI
export const INDICATORS: Indicator[] = [
  {
    id: "1002000001",
    label: "Población total",
    description: "Población total del país",
    unit: "Personas",
    category: "Demografía",
  },
  // ECONOMÍA - PIB
  {
    id: "494098",
    label: "PIB trimestral (precios constantes 2013)",
    description: "Producto Interno Bruto a precios de 2013",
    unit: "Millones de pesos (2013)",
    category: "Economía",
  },
  {
    id: "524271",
    label: "PIB anual (precios corrientes)",
    description: "Producto Interno Bruto a precios actuales",
    unit: "Millones de pesos",
    category: "Economía",
  },
  // PRECIOS - No hay INPC en BISE, usamos indicador de empleo como proxy
  {
    id: "702097",
    label: "Variación personal ocupado",
    description: "Variación anual del índice de personal ocupado",
    unit: "Porcentaje",
    category: "Precios",
  },
  // EMPLEO
  {
    id: "702100",
    label: "Personal ocupado",
    description: "Índice de personal ocupado total",
    unit: "Índice base 2013=100",
    category: "Empleo",
  },
  // COMERCIO EXTERIOR
  {
    id: "6204198547",
    label: "Exportaciones totales",
    description: "Valor total de exportaciones (FOB)",
    unit: "Millones de dólares",
    category: "Comercio exterior",
  },
  {
    id: "6204198549",
    label: "Importaciones totales",
    description: "Valor total de importaciones (FOB)",
    unit: "Millones de dólares",
    category: "Comercio exterior",
  },
  {
    id: "1002000002",
    label: "Población masculina",
    description: "Población masculina total",
    unit: "Personas",
    category: "Demografía",
  },
  {
    id: "1002000003",
    label: "Población femenina",
    description: "Población femenina total",
    unit: "Personas",
    category: "Demografía",
  },
  // ITAEE - Disponibles por entidad federativa
  {
    id: "6207061361",
    label: "ITAEE Total",
    description: "Indicador Trimestral de la Actividad Económica Estatal - Total",
    unit: "Variación %",
    category: "Economía",
  },
  {
    id: "6207061369",
    label: "ITAEE Actividades primarias",
    description: "Indicador Trimestral de la Actividad Económica Estatal - Actividades primarias",
    unit: "Variación %",
    category: "Economía",
  },
];

// Geografías disponibles (entidades federativas)
// IDs según INEGI: 00 = Nacional, 01-32 = estados
export const GEOGRAPHIES: Geography[] = [
  { id: "00", label: "Nacional", type: "nacional" },
  { id: "01", label: "Aguascalientes", type: "estado" },
  { id: "02", label: "Baja California", type: "estado" },
  { id: "03", label: "Baja California Sur", type: "estado" },
  { id: "04", label: "Campeche", type: "estado" },
  { id: "05", label: "Coahuila", type: "estado" },
  { id: "06", label: "Colima", type: "estado" },
  { id: "07", label: "Chiapas", type: "estado" },
  { id: "08", label: "Chihuahua", type: "estado" },
  { id: "09", label: "Ciudad de México", type: "estado" },
  { id: "10", label: "Durango", type: "estado" },
  { id: "11", label: "Guanajuato", type: "estado" },
  { id: "12", label: "Guerrero", type: "estado" },
  { id: "13", label: "Hidalgo", type: "estado" },
  { id: "14", label: "Jalisco", type: "estado" },
  { id: "15", label: "Estado de México", type: "estado" },
  { id: "16", label: "Michoacán", type: "estado" },
  { id: "17", label: "Morelos", type: "estado" },
  { id: "18", label: "Nayarit", type: "estado" },
  { id: "19", label: "Nuevo León", type: "estado" },
  { id: "20", label: "Oaxaca", type: "estado" },
  { id: "21", label: "Puebla", type: "estado" },
  { id: "22", label: "Querétaro", type: "estado" },
  { id: "23", label: "Quintana Roo", type: "estado" },
  { id: "24", label: "San Luis Potosí", type: "estado" },
  { id: "25", label: "Sinaloa", type: "estado" },
  { id: "26", label: "Sonora", type: "estado" },
  { id: "27", label: "Tabasco", type: "estado" },
  { id: "28", label: "Tamaulipas", type: "estado" },
  { id: "29", label: "Tlaxcala", type: "estado" },
  { id: "30", label: "Veracruz", type: "estado" },
  { id: "31", label: "Yucatán", type: "estado" },
  { id: "32", label: "Zacatecas", type: "estado" },
];

export const CHART_TYPES = [
  { id: "line", label: "Línea" },
  { id: "bar", label: "Barras" },
  { id: "area", label: "Área" },
] as const;

export type ChartType = (typeof CHART_TYPES)[number]["id"];

// Parsear respuesta de la API de INEGI
export function parseInegiResponse(data: unknown): ChartDataPoint[] {
  try {
    const typedData = data as {
      Series?: Array<{
        OBSERVATIONS?: Array<{
          TIME_PERIOD?: string;
          OBS_VALUE?: string;
        }>;
      }>;
    };
    const series = typedData?.Series?.[0];
    if (!series?.OBSERVATIONS) return [];

    return series.OBSERVATIONS
      .filter((obs) => obs.OBS_VALUE && obs.OBS_VALUE !== "")
      .map((obs) => ({
        period: obs.TIME_PERIOD ?? "",
        value: parseFloat(obs.OBS_VALUE ?? "0"),
      }))
      .filter((d) => !isNaN(d.value))
      .sort((a, b) => a.period.localeCompare(b.period));
  } catch {
    return [];
  }
}
