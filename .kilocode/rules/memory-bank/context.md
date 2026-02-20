# Active Context: Next.js Starter Template

## Current State

**Template Status**: ✅ Ready for development

The template is a clean Next.js 16 starter with TypeScript and Tailwind CSS 4. It's ready for AI-assisted expansion to build any type of application.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] INEGI data visualizer: selectors (indicator, geography, chart type) + recharts chart + API proxy route
- [x] INEGI API token moved to `.env.local` (env var `INEGI_TOKEN`); removed hardcoded fallback from `route.ts`; added `.env.example`
- [x] Fixed INEGI API URL format: correct segment order `INDICATOR/{id}/es/{geography}/false/BISE/2.0/{token}`
- [x] Fixed geography IDs: 2-digit codes (`00`=Nacional, `01`–`32`=estados)
- [x] Fixed indicator IDs: replaced broken IDs with verified working ones from INEGI BIE catalog
  - Demografía: `1002000001-3` (población) ✅
  - Economía: `494098` (PIB trimestral precios 2013), `524271` (PIB anual precios corrientes) ✅
  - Precios: `702097` (variación personal ocupado) - INPC no disponible en BISE ❌
  - Empleo: `702100` (personal ocupado) ✅
  - Comercio exterior: `6204198547` (exportaciones), `6204198549` (importaciones) ✅
- [x] Added auto-switch to "Nacional" geography for indicators that only have national data
- [x] Added ITAEE indicators that work at state level:
  - `6207061361`: ITAEE Total (disponible por entidad federativa) ✅
  - `6207061369`: ITAEE Actividades primarias (disponible por entidad federativa) ✅
  - `6207061377`: ITAEE Actividades secundarias (disponible por entidad federativa) ✅
  - `6207061373`: ITAEE Actividades terciarias (disponible por entidad federativa) ✅
- [x] Fixed exposed INEGI token: changed .env.example to use placeholder, created .env.local with real token
- [x] Updated deploy configuration: ensured environment variables are properly configured for production
- [x] Improved chart type adaptation: added recommendedChart property to indicators, automatic chart switching based on indicator type
- [x] Verified data availability: confirmed 2020 limit is due to INEGI API data availability, not code restrictions

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The template is ready. Next steps depend on user requirements:

1. What type of application to build
2. What features are needed
3. Design/branding preferences

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2025-02-19 | Correcciones de revisión: token sin fallback, `.env.example`, `lang="es"`, tech.md actualizado, script lint a `next lint` |
| 2026-02-20 | Fixed exposed INEGI token: updated .env.example with placeholders, created .env.local, configured deploy environment variables |
| 2026-02-20 | Improved chart adaptation: added recommendedChart property, automatic switching based on indicator type; verified 2020 data limit is API availability |
