import { NextRequest, NextResponse } from "next/server";

// INEGI BIE (Banco de Información Económica) API
// Docs: https://www.inegi.org.mx/servicios/api_biinegi.html
// Token leído desde variable de entorno INEGI_TOKEN (configurar en .env.local)
const INEGI_TOKEN = process.env.INEGI_TOKEN;
const INEGI_BASE = "https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR";

export async function GET(request: NextRequest) {
  if (!INEGI_TOKEN) {
    return NextResponse.json({ error: "Token de INEGI no configurado en el servidor." }, { status: 500 });
  }

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
