import { NextRequest, NextResponse } from "next/server";

// INEGI BIE (Banco de Información Económica) API
// Docs: https://www.inegi.org.mx/servicios/api_biinegi.html
// Token público de prueba de INEGI
const INEGI_TOKEN = "63e5ce5a-9a3e-4e9e-b9e5-3c3e5ce5a9a3";
const INEGI_BASE = "https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const indicatorId = searchParams.get("indicator");
  const geography = searchParams.get("geography") || "0700"; // Nacional por defecto

  if (!indicatorId) {
    return NextResponse.json({ error: "Se requiere el parámetro 'indicator'" }, { status: 400 });
  }

  try {
    // INEGI BIE API endpoint
    const url = `${INEGI_BASE}/${indicatorId}/${geography}/es/false/false/2.0/${INEGI_TOKEN}?type=json`;
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!response.ok) {
      throw new Error(`INEGI API respondió con status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching INEGI data:", error);
    return NextResponse.json(
      { error: "No se pudo obtener datos de INEGI. Verifica el indicador y la geografía." },
      { status: 500 }
    );
  }
}
