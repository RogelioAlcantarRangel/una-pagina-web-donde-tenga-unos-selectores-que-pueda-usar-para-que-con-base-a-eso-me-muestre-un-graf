"use client";

import { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  INDICATORS,
  GEOGRAPHIES,
  CHART_TYPES,
  parseInegiResponse,
  type ChartDataPoint,
  type ChartType,
} from "@/lib/inegi-config";

function formatValue(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
}

export default function InegiDashboard() {
  const [selectedIndicator, setSelectedIndicator] = useState(INDICATORS[0].id);
  const [selectedGeography, setSelectedGeography] = useState(GEOGRAPHIES[0].id);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("line");
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const currentIndicator = INDICATORS.find((i) => i.id === selectedIndicator);
  const currentGeography = GEOGRAPHIES.find((g) => g.id === selectedGeography);

  // Indicadores que solo funcionan a nivel nacional
  const nationalOnlyIndicators = ["494098", "524271", "6204198547", "6204198549", "702097", "702100"];
  const isNationalOnly = nationalOnlyIndicators.includes(selectedIndicator);

  // Efecto para cambiar automáticamente a "Nacional" cuando se selecciona un indicador que solo tiene datos nacionales
  const handleIndicatorChange = (newIndicatorId: string) => {
    const isNewNationalOnly = nationalOnlyIndicators.includes(newIndicatorId);
    if (isNewNationalOnly && selectedGeography !== "00") {
      setSelectedGeography("00");
    }
    setSelectedIndicator(newIndicatorId);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        indicator: selectedIndicator,
        geography: selectedGeography,
      });
      const response = await fetch(`/api/inegi?${params}`);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Error al obtener datos");
      }

      const parsed = parseInegiResponse(json);
      if (parsed.length === 0) {
        setError("No se encontraron datos para esta combinación de indicador y geografía.");
      } else {
        setData(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedIndicator, selectedGeography]);

  const renderChart = () => {
    if (data.length === 0) return null;

    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 20, bottom: 60 },
    };

    const xAxis = (
      <XAxis
        dataKey="period"
        tick={{ fill: "#9ca3af", fontSize: 11 }}
        angle={-45}
        textAnchor="end"
        height={70}
        interval="preserveStartEnd"
      />
    );

    const yAxis = (
      <YAxis
        tick={{ fill: "#9ca3af", fontSize: 11 }}
        tickFormatter={formatValue}
        width={70}
      />
    );

    const grid = <CartesianGrid strokeDasharray="3 3" stroke="#374151" />;

    const tooltip = (
      <Tooltip
        contentStyle={{
          backgroundColor: "#1f2937",
          border: "1px solid #374151",
          borderRadius: "8px",
          color: "#f9fafb",
        }}
        formatter={(value: number | undefined) => [formatValue(value ?? 0), currentIndicator?.label]}
      />
    );

    const legend = <Legend wrapperStyle={{ color: "#9ca3af" }} />;

    if (selectedChartType === "bar") {
      return (
        <BarChart {...commonProps}>
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          {legend}
          <Bar dataKey="value" name={currentIndicator?.label} fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }

    if (selectedChartType === "area") {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          {legend}
          <Area
            type="monotone"
            dataKey="value"
            name={currentIndicator?.label}
            stroke="#3b82f6"
            fill="url(#colorValue)"
            strokeWidth={2}
          />
        </AreaChart>
      );
    }

    // Default: line
    return (
      <LineChart {...commonProps}>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        {legend}
        <Line
          type="monotone"
          dataKey="value"
          name={currentIndicator?.label}
          stroke="#3b82f6"
          strokeWidth={2}
          dot={data.length < 30 ? { fill: "#3b82f6", r: 4 } : false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    );
  };

  // Group indicators by category
  const categories = Array.from(new Set(INDICATORS.map((i) => i.category)));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              I
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Visualizador INEGI</h1>
              <p className="text-sm text-gray-400">Datos del Banco de Información Económica</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selectors Panel */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Configurar consulta
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Indicator Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Indicador
              </label>
              <select
                value={selectedIndicator}
                onChange={(e) => handleIndicatorChange(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {categories.map((cat) => (
                  <optgroup key={cat} label={cat} className="text-gray-400">
                    {INDICATORS.filter((i) => i.category === cat).map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {currentIndicator && (
                <p className="text-xs text-gray-500">{currentIndicator.description}</p>
              )}
            </div>

            {/* Geography Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Geografía
              </label>
              <select
                value={selectedGeography}
                onChange={(e) => setSelectedGeography(e.target.value)}
                disabled={isNationalOnly}
                className={`bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${isNationalOnly ? 'opacity-60' : ''}`}
              >
                {GEOGRAPHIES.map((geo) => (
                  <option key={`${geo.id}-${geo.label}`} value={geo.id}>
                    {geo.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                {currentGeography?.type === "nacional" ? "Datos nacionales" : "Datos estatales"}
                {isNationalOnly && " (solo nivel nacional)"}
              </p>
            </div>

            {/* Chart Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">
                Tipo de gráfico
              </label>
              <div className="flex gap-2">
                {CHART_TYPES.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => setSelectedChartType(ct.id)}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                      selectedChartType === ct.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700"
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Cargando...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Consultar datos
                </>
              )}
            </button>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          {/* Chart Header */}
          {data.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">{currentIndicator?.label}</h3>
              <p className="text-sm text-gray-400">
                {currentGeography?.label} · {data.length} períodos disponibles ·{" "}
                <span className="text-gray-500">{currentIndicator?.unit}</span>
              </p>
            </div>
          )}

          {/* States */}
          {!hasSearched && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">Selecciona un indicador y haz clic en &#34;Consultar datos&#34;</p>
              <p className="text-gray-600 text-sm mt-1">Los datos se obtendrán directamente de la API del INEGI</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-gray-400">Consultando API del INEGI...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-400 font-medium">Error al obtener datos</p>
              <p className="text-gray-500 text-sm mt-1 max-w-md">{error}</p>
              <button
                onClick={fetchData}
                className="mt-4 text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <>
              <ResponsiveContainer width="100%" height={420}>
                {renderChart() ?? <div />}
              </ResponsiveContainer>

              {/* Stats summary */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-800">
                {[
                  {
                    label: "Último valor",
                    value: formatValue(data[data.length - 1].value),
                    sub: data[data.length - 1].period,
                  },
                  {
                    label: "Primer valor",
                    value: formatValue(data[0].value),
                    sub: data[0].period,
                  },
                  {
                    label: "Máximo",
                    value: formatValue(Math.max(...data.map((d) => d.value))),
                    sub: data.find((d) => d.value === Math.max(...data.map((x) => x.value)))?.period ?? "",
                  },
                  {
                    label: "Mínimo",
                    value: formatValue(Math.min(...data.map((d) => d.value))),
                    sub: data.find((d) => d.value === Math.min(...data.map((x) => x.value)))?.period ?? "",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Datos obtenidos del{" "}
          <a
            href="https://www.inegi.org.mx/servicios/api_biinegi.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 underline"
          >
            Banco de Información Económica del INEGI
          </a>
        </p>
      </main>
    </div>
  );
}
