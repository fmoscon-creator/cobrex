# COMPARATIVA v5 — Consolidado Code + Escritorio (verificación cruzada v4 + Issue #9)
**15-jun-2026.** Escritorio verificó la v4 punto por punto (Issue #9): confirmó TODO lo de Code, resolvió los 2 ⚠️ y sumó 5 hallazgos nuevos. Code verificó esos 5 en el código y los cita. Esta v5 = v4 + estos cierres.

## CONFIRMADO POR AMBOS (de la v4)
Estructuras de datos coinciden (15 tipos alerta, 10 vars IA, 14 Pulse, 7 países, 5 TF, 5 filtros Pulse, 10 filtros IA, límites de plan). Componentes casi todos presentes. Único componente ausente real: BellButton (campana header). Defectos = lista v2/v3/v4.

## ⚠️ RESUELTOS (eran "a verificar" en v4)
- LIST_COLORS (colores por lista de Watchlist): DIFERENCIA REAL — la PWA NO tiene sistema de color por lista (el campo no existe en el watchlist de localStorage). Nativa: WatchlistScreen.js:34 (8 colores). 🟡 MEDIO.
- ComoUsarAurexBlock ("Cómo usar Cobrex"): AUSENTE confirmado en PWA (0 resultados). Nativa: components/ComoUsarAurexBlock.js. 🟡 MEDIO.

## HALLAZGOS NUEVOS (Escritorio E1-E5, verificados y citados por Code)
- E1 🟡 NATIVA: labels ev_fomc/ev_cpi hardcodeados sin t() — AlertasScreen.js:87-88 ('FED FOMC' / 'CPI / PBI'). Son siglas; inconsistente pero menor. (Por la regla de Fernando: en PWA va traducido igual.)
- E2 ⚪ INFO: anon key de Supabase visible en repo público (cobrex). Es la MISMA que la nativa y la PWA es pública por hosting; aceptable si RLS está bien. Sin documentar. No es secreto de pago.
- E3 🟠 PWA: `_IA_EVENTOS` hardcodeado en español — aurex-v3.js:1977 (banner de eventos macro, se ve en ES en cualquier idioma). Suma al gap i18n.
- E4 🟡 PWA: logs de debug en producción — aurex-v3.js:2114 `console.log('INPUTS BTC PWA:'…)` + 14 console.log en total entre aurex-v3.js y aurex-features.js. Hay que limpiarlos.
- E5 🟠 PWA: tipos de cambio ARS HARDCODEADOS (1195 blue / 1060 oficial) — aurex-v3.js:609,610,618 + aurex-features.js:675,676,684. Sin actualización por API → el conversor de divisas muestra valores viejos.

## LISTA DEFINITIVA CONSOLIDADA v5 (para decidir fixes)
🔴 CRÍTICOS: 1 Campana header · 2 Abre en Portfolio (no Mercados) · 3 Sin paywall al abrir FREE · 4 BUG ELITE→FREE (loadUserPlan no en onAuthStateChange) · 5 Onboarding viejo · 6/7 Campana por activo Portfolio/Watchlist no visible · labels Pulse hardcodeados ES (aurex-v3.js:3031-3035).
🟠 ALTOS: 8 Mercados sin tab Metales + orden · 9 Versión 'v1.0' (index.html:2835) · i18n ~100-200 strings faltantes · E3 _IA_EVENTOS hardcodeado ES · E5 ARS hardcodeado (conversor desactualizado).
🟡 MEDIOS: 10 Labels IA (Conf.IA/Mat.Primas) · 11 Footer monocromo · 12 BUG doble-$$ Watchlist (aurex-features.js:2247) · LIST_COLORS (sin color por lista) · ComoUsarAurexBlock ausente · E1 labels nativa sin t() · E4 console.log debug.
⚪ INFO: E2 anon key pública (documentar).

NO se aplicó ningún fix. → Vuelve a Escritorio para cierre.
