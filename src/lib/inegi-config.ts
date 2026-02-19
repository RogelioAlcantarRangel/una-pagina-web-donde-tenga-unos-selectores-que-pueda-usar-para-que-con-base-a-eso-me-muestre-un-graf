// Indicadores disponibles del INEGI BIE
// Fuente: https://www.inegi.org.mx/app/api/indicadores/

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
  {
    id: "6200093912",
    label: "PIB a precios corrientes",
    description: "Producto Interno Bruto a precios corrientes",
    unit: "Millones de pesos",
    category: "Economía",
  },
  {
    id: "6200093913",
    label: "PIB a precios constantes",
    description: "Producto Interno Bruto a precios constantes de 2013",
    unit: "Millones de pesos",
    category: "Economía",
  },
  {
    id: "216064",
    label: "Inflación (INPC)",
    description: "Índice Nacional de Precios al Consumidor",
    unit: "Índice",
    category: "Precios",
  },
  {
    id: "444663",
    label: "Tasa de desocupación",
    description: "Porcentaje de la PEA que está desocupada",
    unit: "Porcentaje",
    category: "Empleo",
  },
  {
    id: "735927",
    label: "Exportaciones totales",
    description: "Valor total de exportaciones",
    unit: "Millones de dólares",
    category: "Comercio exterior",
  },
  {
    id: "735928",
    label: "Importaciones totales",
    description: "Valor total de importaciones",
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
];

// Geografías disponibles (entidades federativas)
export const GEOGRAPHIES: Geography[] = [
  { id: "0700", label: "Nacional", type: "nacional" },
  { id: "0100", label: "Aguascalientes", type: "estado" },
  { id: "0200", label: "Baja California", type: "estado" },
  { id: "0300", label: "Baja California Sur", type: "estado" },
  { id: "0400", label: "Campeche", type: "estado" },
  { id: "0500", label: "Coahuila", type: "estado" },
  { id: "0600", label: "Colima", type: "estado" },
  { id: "0700", label: "Chiapas", type: "estado" },
  { id: "0800", label: "Chihuahua", type: "estado" },
  { id: "0900", label: "Ciudad de México", type: "estado" },
  { id: "1000", label: "Durango", type: "estado" },
  { id: "1100", label: "Guanajuato", type: "estado" },
  { id: "1200", label: "Guerrero", type: "estado" },
  { id: "1300", label: "Hidalgo", type: "estado" },
  { id: "1400", label: "Jalisco", type: "estado" },
  { id: "1500", label: "Estado de México", type: "estado" },
  { id: "1600", label: "Michoacán", type: "estado" },
  { id: "1700", label: "Morelos", type: "estado" },
  { id: "1800", label: "Nayarit", type: "estado" },
  { id: "1900", label: "Nuevo León", type: "estado" },
  { id: "2000", label: "Oaxaca", type: "estado" },
  { id: "2100", label: "Puebla", type: "estado" },
  { id: "2200", label: "Querétaro", type: "estado" },
  { id: "2300", label: "Quintana Roo", type: "estado" },
  { id: "2400", label: "San Luis Potosí", type: "estado" },
  { id: "2500", label: "Sinaloa", type: "estado" },
  { id: "2600", label: "Sonora", type: "estado" },
  { id: "2700", label: "Tabasco", type: "estado" },
  { id: "2800", label: "Tamaulipas", type: "estado" },
  { id: "2900", label: "Tlaxcala", type: "estado" },
  { id: "3000", label: "Veracruz", type: "estado" },
  { id: "3100", label: "Yucatán", type: "estado" },
  { id: "3200", label: "Zacatecas", type: "estado" },
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
