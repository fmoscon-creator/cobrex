# PLAN DE AJUSTE — PWA → paridad con Nativa 1.3.45 (cómo se corrige cada punto)
**15-jun-2026. Code.** Para revisión de Escritorio ANTES de ejecutar. NADA aplicado todavía. Cada ítem: defecto + archivo:línea + cómo se ajusta + decisión/riesgo.

## REQUISITOS DE PRODUCTO (cerrados con Fernando)
**R1 — Trial 7 días en mensuales PRO/ELITE, visible en TODAS las superficies.** Hoy existe (trialPass, index.html:4565+, /api/plans trial:true en mensuales) pero solo en los botones Section A. Ajuste: extender trialPass a TODAS las superficies de planes — modal abrirModalPlanes (index.html:3217), paywall que se auto-abre (ver C3), y banner upsell del Perfil (2427). Agregar texto "7 días gratis, luego $X/mes — requiere medio de pago" (lo exige PayPal en el checkout; plan PayPal ya es ciclo TRIAL 7d $0 → REGULAR auto-cobro). 8 idiomas.
**R2 — Geo-pricing por IP (server-side).** Hoy la PWA detecta AR por timezone/locale. Ajuste: en el backend /api/plans leer la IP real (X-Forwarded-For detrás del proxy Railway) → lookup de país → devolver precios AR para IPs de Argentina, globales para el resto. La PWA deja de adivinar por timezone. Borde conocido: VPN (le pasa a toda web).

## 🔴 CRÍTICOS
**C1 — Campana de notificaciones en el header (6 tabs).** Falta: index.html:1807-1810 (y los otros 5 headers, junto a .live). Nativa: BellButton.js + badge no-leídas → MisAlertas. Ajuste: agregar ícono campana 🔔 a cada header (al lado del LIVE), con badge = nº de no-leídas (de window._misAlertasData / alertas_historial, ya existe ~4337), onclick → abre la vista "Mis Alertas" (ya existe ~4327-4413). Aplicar igual en las 6 pantallas.
**C2 — Abre en Portfolio, debe abrir en Mercados.** index.html ~4078 navTo('portfolio') al cargar. Nativa: TabNavigator.js:90 initialRouteName='Mercados'. Ajuste: cambiar el navTo inicial a 'mercados'. (1 línea.)
**C3 — Sin paywall al abrir para FREE.** Nativa: App.js:251 (si plan≠PRO/ELITE auto-abre planes tras login). Ajuste: tras resolver loadUserPlan, si plan==='FREE', auto-abrir abrirModalPlanes (index.html:3217). RESUELTO: IGUAL que iOS — réplica exacta de la lógica nativa (App.js:251: tras login, si plan≠PRO/ELITE auto-abre planes).
**C4 — BUG plan ELITE→FREE.** Causa: loadUserPlan NO se llama en onAuthStateChange (index.html:1089-1099); solo el poll de DOMContentLoaded (4528-4534) que se rinde. Ajuste: llamar window.loadUserPlan() dentro de onAuthStateChange en los eventos SIGNED_IN e INITIAL_SESSION, así el plan se lee SIEMPRE cuando se conoce al usuario. (fmoscon=ELITE en backend, la función ya devuelve ELITE con su id — solo falta dispararla.) Bajo riesgo, alto impacto.
**C5 — Onboarding viejo.** PWA obs1-obs4 (index.html:1190-1420) con copy viejo ("500+/10 variables/7 mercados"). Nativa: OnboardingScreen.js SLIDES (Build 36 nuevo, capturas en Dropbox). Ajuste: reescribir las 4 slides de la PWA para igualar el contenido/visual del Build 36. RESUELTO: replicar el Build 36 EXACTO (textos de OnboardingScreen.js + capturas). Sin preguntar.
**C6/C7 — Campana por activo (crear alerta) en Portfolio y Watchlist.** openCreateAlert existe pero escondida en el detalle/menú. Ajuste: agregar un 🔔 VISIBLE en cada fila de activo — Portfolio (render de fila aurex-features.js ~989) y Watchlist (~2213) — que llame openCreateAlert(sym, tipo). Igual que la campana por fila de la nativa.
**C8 — Labels del gauge Pulse hardcodeados en ES.** aurex-v3.js:3031-3035 ('Miedo Extremo'/'Miedo'/'Neutral'/'Codicia'/'Codicia Extrema') se ven en español en cualquier idioma. Nativa: getPulseZones con t(). Ajuste: crear 5 claves i18n (8 idiomas) y reemplazar los literales por t(). (Idem en aurex-features.js si está duplicado.)

## 🟠 ALTOS
**A1 — Mercados: falta tab METALES + orden + Stable/ETF fusionados.** PWA: index.html:1838-1846 (tabs vía sw()), 7 tabs. Nativa: MercadosScreen.js:170-179, 8 tabs (acciones/cripto/futuros/metales/commodities/etfs/divisas/stable). Ajuste: agregar tab 'metales' (los datos existen: sección metales en DATA/YF_MAP), reordenar al orden nativo, y separar Stable de ETF. Verificar que sw('metales') filtre los activos de metales.
**A2 — Versión "Cobrex v1.0" + no visible en header Perfil.** index.html:2835. Ajuste: (a) reemplazar 'Cobrex v1.0' por la versión real; (b) mostrar la versión arriba-derecha del header de Perfil (como PerfilScreen.js:895). RESUELTO (Fernando): mostrar "Cobrex Web 1.3" (alineado a iOS 1.3, aclarando que es web).
**A3 — i18n: ~100-200 strings que la nativa tiene y la PWA no.** Ajuste: portar a aurex-i18n.js las claves/textos que faltan (los agregados en versiones posteriores de iOS), en los 8 idiomas. Es trabajo de contenido grande; se hace por tandas. Incluye traducir lo hardcodeado (ver C8, A4, A5).
**A4 — _IA_EVENTOS hardcodeado en ES.** aurex-v3.js:1977 (banner de eventos macro). Ajuste: pasar los textos a i18n (8 idiomas) o traducir dinámicamente.
**A5 — Tipos de cambio ARS hardcodeados (1195/1060).** aurex-v3.js:609-618 + aurex-features.js:675-684 (sin API → conversor desactualizado). Ajuste: traer la cotización ARS (blue/oficial) desde una API en vivo (el backend la cachea, ej. cada 1h). RESUELTO: Code lo resuelve replicando la MISMA fuente/método de la nativa (revisar prices.js/conversor nativo y replicar).

## 🟡 MEDIOS
**M1 — Labels filtros IA.** Alinear etiquetas exactas a la nativa (ya coinciden visualmente: Conf.IA/Mat.Primas). Ajuste menor de copy i18n.
**M2 — Footer monocromo vs multicolor.** index.html:3999-4019 (SVG monocromo). Nativa: TabNavigator.js renderIcon + TAB_COLOR (Portfolio verde #3FB950, Mercados dorado, Watchlist azul #58A6FF, IA estrella violeta #BC8CFF, Alertas campana roja #FF7B72, Perfil gris). Ajuste: reemplazar los paths SVG por los duotono de la nativa + color por tab.
**M3 — BUG doble-$$ Watchlist.** aurex-features.js:2247 muestra '$'+precioFmt donde precioFmt=_fmt(precio) (2187) que YA trae '$'. Ajuste: quitar el '$' duplicado en 2247 (dejar solo precioFmt). Verificar _fmt.
**M4 — Sin color por lista (Watchlist).** Nativa: LIST_COLORS (8 colores) por lista. PWA no tiene el campo. Ajuste: agregar campo color a la lista (creación + storage) + paleta de 8 + render del color.
**M5 — "Cómo usar Cobrex" ausente.** Nativa: components/ComoUsarAurexBlock.js. Ajuste: agregar un bloque "Cómo usar Cobrex" (replicar contenido nativo).
**M6 — E1: labels ev_fomc/ev_cpi sin t() (bug de la NATIVA, AlertasScreen.js:87-88).** Por la regla de Fernando: en la PWA esos labels van traducidos (i18n) igual; la nativa se corrige en build futuro.
**M7 — E4: console.log de debug en producción.** aurex-v3.js:2114 ('INPUTS BTC PWA') + 14 console.log entre los 2 JS. Ajuste: removerlos.

## ⚪ INFO
**I1 — E2: anon key Supabase pública.** Es la anon key (no secreto de pago), protegida por RLS, y la web es pública por hosting. Ajuste: documentarlo + verificar que RLS esté activo en todas las tablas. Sin cambio de código.

---
**ORDEN SUGERIDO (a confirmar por Fernando):** críticos primero (C4 plan es el de mayor impacto y menor riesgo → 1ro; C2 inicial; C1 campana; C6/C7 campanas activo; C3 paywall; C8 Pulse i18n; C5 onboarding), luego altos (A1 Metales, A2 versión, A5 ARS, A4/A3 i18n), luego medios. R1/R2 (trial+geo IP) se integran con C3/A-pricing.
**DECISIONES: TODAS RESUELTAS = IGUAL A v1.3.45.** Regla fija de Fernando: todo idéntico a la nativa 1.3.45; Code resuelve cualquier decisión replicando la nativa, sin preguntar. (Versión='Cobrex Web 1.3'.)
NADA se ejecuta hasta OK de Fernando + opinión de Escritorio.


## ÍTEMS NUEVOS DE LA v8 (agregados al plan)
- D3 Portfolio UpsellBanner contextual (2 variantes FREE→señales/PRO, PRO→análisis/ELITE) — PortfolioScreen.js:781-790. AGREGAR debajo de Valor Total, antes del Termómetro.
- D4 Perfil UpsellBanner permanente (FREE/PRO) — PerfilScreen.js:962. AGREGAR.
- P1 LIVE Portfolio → mover al sortBar (PortfolioScreen.js:867), sacar del header.
- P2 LIVE Perfil → quitar (nativa no tiene).
- A2 Versión "Cobrex Web 1.3" en DOS lugares iguales: header Perfil arriba-der (falta) + Soporte (index.html:2838, dice v1.0).
- N6 (bug nativo Date.now en Alertas) → en PWA el LIVE con timestamp real.
- N7 Onboarding Build 36 usa íconos 3D PNG (para C5).

## ESTADO DE EJECUCIÓN (al 15-jun)
HECHO + TESTEADO: C2 (abre Mercados), C3 (paywall FREE), C4 (bug ELITE→FREE), C8 (Pulse i18n), M3 (doble-$$ Watchlist), C6/C7 (campana por activo Portfolio+Watchlist), C1 (campana header 5/6).
PENDIENTE: C1 Perfil (header JS-render) · P1/P2 (LIVE) · D3/D4 (banners) · A1 (Metales) · A2 (versión 2 lugares) · A3/A4/A5 (i18n/ARS) · M2 (footer color) · M4 (color lista) · M5 (cómo usar) · C5 (onboarding) · trial en todas las superficies · geo por IP.
NO deployado todavía (se deploya cuando el bloque esté completo y testeado).
