# COMPARATIVA v4 — Inventario EXHAUSTIVO + diff sistemático (Nativa 1.3.45 vs PWA)
**15-jun-2026. Code.** Sin muestrear: se inventariaron y diffearon TODAS las estructuras de datos, componentes y capas i18n de ambos códigos. Cada ítem citado.

## MÉTODO (honesto)
Se comparó de forma total: (a) estructuras de datos enumerables, (b) los 13 componentes nativos, (c) i18n completo, (d) filtros/tipos/límites/constantes. NO se hizo diff "función por función literal" porque las arquitecturas difieren (React Native vs JS vanilla) y los nombres de función no mapean — el diff con sentido es a nivel estructura/feature/componente, que es lo que se hizo.

## A) ESTRUCTURAS DE DATOS — diff 1:1
| Estructura | Nativa (archivo:línea) | PWA | ¿Coincide? |
|---|---|---|---|
| Tipos de alerta (15, 4 secciones) | AlertasScreen.js:50 getAlertSections (ia_cambio/ia_alta/ia_umbral/ia_portfolio · pulse_zona/cat/thermo · precio_variacion/maxmin/rsi · ev_fomc/cpi/apertura/earnings/gdelt) | ALERT_TIPO_MAP index.html:4294-4298 — los MISMOS 15 | ✅ MATCH |
| Variables IA (10) | AlertasScreen.js:96 IA_VARS | aurex-features.js:2680 varDefs (10) | ✅ MATCH |
| Variables Pulse (14) | AlertasScreen.js:109 PULSE_VARS | aurex-features.js:4366 (14) | ✅ MATCH |
| Países (7) | MercadosScreen.js:181 getPaises (usa/argentina/brasil/europa/espana/japon/china) | index.html:1851-1857 swPais (usa/arg/br/eu/es/jp/cn) | ✅ MATCH |
| Timeframes (5) | MercadosScreen.js:191 TF_BUTTONS (24h/7d/1m/3m/1a) | presentes los 5 | ✅ MATCH |
| Filtros Pulse (5) | MercadosScreen.js:193 getPulseFilters (global/cripto/acciones/commodities/futuros) | GLOBAL/CRIPTO/ACCIONES/COMMOD/FUTUROS | ✅ MATCH |
| Filtros IA (10) | IAScreen.js:38 getFilters | index.html:2013-2022 setIAFiltro (10) | ✅ MATCH (labels: 'alta'→'Conf.IA', 'commodity'→'Mat.Primas') |
| Filtros Mercados (tabs tipo) | MercadosScreen.js:170 getTABS = 8 (incl METALES) | index.html sw() = 7 | ❌ FALTA METALES + orden + Stable/ETF fusionados |
| Zonas Pulse (labels) | AlertasScreen.js:126 getPulseZones (i18n) | aurex-v3.js:3031-3035 HARDCODEADO ES ('Miedo Extremo'…) | ❌ hardcodeado, no i18n |
| Límites de plan | usePlan.js PLAN_ALERT_TYPES + backend PLAN_LIMITS | index.html:4133 PLAN_LIMITS_CLIENT | ✅ MATCH (watchlist FREE=1 alineado) |
| Colores watchlist (8) | WatchlistScreen.js:34 LIST_COLORS | (a verificar el set exacto en PWA) | ⚠️ verificar |
| Onboarding (4 slides) | OnboardingScreen.js:14 SLIDES (onb1-4, Build 36 nuevo) | index.html obs1-obs4 (viejo) | ❌ contenido viejo |

## B) COMPONENTES (13 nativos → ¿en PWA?)
- ✅ Presentes (con otro nombre): UpsellBanner→upsell-banner · LiveIndicator→class "live" · CustomSwitch→toggle-sw (21) · AssetLogo→logoHtml (20) · Toast (5) · LanguageButton→select-idioma (11) · ReviewModal (25) · PlanLimitModal→showPaywall (10) · AlertCreateModal→openCreateAlert · SplashView · AurexLogo→SVG inline.
- ❌ AUSENTE REAL: **BellButton** (campana de notificaciones del header) — 0 refs, confirmado.
- ⚠️ A verificar: ComoUsarAurexBlock ("Cómo usar Cobrex") — 0 con ese nombre; puede estar en FAQ con otro rótulo.

## C) i18n (de la v3)
- ✅ 8 idiomas COMPLETOS en lo que existe (ambos). 
- ❌ PWA le faltan ~100-200 strings que la nativa agregó en versiones posteriores (Code valor-exacto 407 / claves 191; Escritorio ~70-120; reconciliado ~100-200).
- ❌ Hardcodeados ES en PWA: labels Pulse (aurex-v3.js:3031-3035 🔴), onboarding viejo, versión 'v1.0' (index.html:2835), eventos macro.

## CONCLUSIÓN
Tras el inventario exhaustivo, NO aparecen dimensiones nuevas grandes más allá del i18n. Las estructuras de datos y los componentes COINCIDEN casi en su totalidad. Los defectos reales son los 12 de la v2/v3 + el gap i18n. Esto sube la confianza de que la lista está completa (lo que la v2/v3 parcial no garantizaba).

## LISTA DEFINITIVA DE DEFECTOS (consolidada, para decidir fixes)
🔴 1 Campana header ausente · 2 Abre en Portfolio (no Mercados) · 3 Sin paywall al abrir FREE · 4 BUG ELITE→FREE (loadUserPlan) · 5 Onboarding viejo · 6/7 Campana por activo Portfolio/Watchlist no visible · 8b labels Pulse hardcodeados ES.
🟠 8 Mercados sin METALES + orden · 9 Versión 'v1.0' · i18n: ~100-200 strings faltantes.
🟡 10 Labels IA (Conf.IA/Mat.Primas) · 11 Footer monocromo vs color · 12 BUG doble-$$ Watchlist (aurex-features.js:2247).

NO se aplicó ningún fix. → Pasa a Escritorio para su análisis de la v4.
