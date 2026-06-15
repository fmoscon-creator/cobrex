# COMPARATIVA v8 — CONSOLIDADO FINAL Nativa 1.3.45 vs PWA (Code + Escritorio, cruzado y verificado)
**15-jun-2026.** Une el pase visual de Code (v6) + el de Escritorio (Issue #12 / v7), elemento por elemento, las 6 pantallas. Cada ítem verificado en código por ambos. Citas a archivo:línea nativa.

## A) DIFERENCIAS REALES (lista definitiva para el plan)
🔴 CRÍTICOS
- **C1 — Campana del HEADER (notificaciones → Mis Alertas), falta en las 6 pantallas.** Nativa BellButton: Portfolio:703, Mercados:882, Watchlist:785, IA:320, Alertas:435, Perfil:958. (Code: hecha 5/6; Perfil pendiente por header JS-render.) [D1]
- **C6/C7 — Campana 🔔 POR ACTIVO (crear alerta), falta. SOLO Portfolio (fila assetBottomRow) + Watchlist.** AlertCreateModal solo en esas 2 screens. [D2]
- **C3 — Paywall al abrir para FREE** (App.js:251). (Code: hecho.)
- **C4 — Bug plan ELITE→FREE** (loadUserPlan). (Code: hecho.)
- **C2 — Abre en Mercados** (TabNavigator:90). (Code: hecho.)
- **C5 — Onboarding viejo** → replicar Build 36 (usa íconos 3D PNG — N7).
- **C8 — Labels Pulse hardcodeados ES** (aurex-v3.js:3031-3035). (Code: hecho, i18n 8 idiomas.)
🟠 ALTOS
- **A1/D6 — Mercados: falta tab METALES** (datos ya existen en DATA.metales).
- **A2/D5 — Versión:** mostrar "Cobrex Web 1.3" en DOS lugares (igual en ambos): (1) header Perfil arriba-derecha (PerfilScreen.js:957) — la PWA NO la tiene ahí (falta); (2) Soporte (PerfilScreen.js:895) — la PWA dice "Cobrex v1.0" (index.html:2838) → actualizar.
- **D3 — UpsellBanner contextual de Portfolio** (PortfolioScreen.js:781-790, debajo de Valor Total, antes del Termómetro). 2 variantes: FREE→"activá señales / disponible en PRO"; PRO→"activá análisis / disponible en ELITE". Falta en PWA. [NUEVO v8]
- **D4 — UpsellBanner permanente de Perfil** (PerfilScreen.js:962, visible FREE/PRO). Falta en PWA. [NUEVO v8]
- **i18n ~100-200 strings faltantes** + **A4/E3 _IA_EVENTOS hardcodeado ES** (aurex-v3.js:1977) + **A5/E5 ARS hardcodeado** (1195/1060) → API en vivo (igual que el método nativo de precios).
🟡 MEDIOS / POSICIÓN
- **P1 — LIVE en Portfolio mal ubicado:** nativa lo movió al sortBar (PortfolioScreen.js:867 "Build 16 BUG A: LIVE movido"); la PWA lo tiene en el header. Reubicar.
- **P2 — LIVE de más en Perfil:** la nativa NO tiene LiveIndicator en Perfil; la PWA sí. Quitar.
- **M3 — Doble-$$ en Watchlist** (aurex-features.js:2247) — confirmado visualmente ("$$66.863,70").
- **M4/D7 — Color por lista en Watchlist** (LIST_COLORS 8 colores). Falta en PWA.
- **M7/E4 — console.log de debug en producción** (aurex-v3.js:2114 + 14 total).
- **M5 — "Cómo usar Cobrex"** (ComoUsarAurexBlock) ausente.
- **Alertas — canales:** nativa = 3 cards toggle (WhatsApp/Telegram/Push); PWA = banners apilados. (Menor.)
- **M1 — labels filtros IA** (cosmético).
- **Footer íconos/colores por tab** (M2).

## B) BUGS NATIVOS detectados (regla Fernando: en PWA va bien; nativa se corrige en build futuro)
- **N6 — Date.now() hardcodeado en AlertasScreen nativa** (AlertasScreen.js:434, `lastUpdate={Date.now()}` → el LIVE siempre marca "ahora"). En la PWA el timestamp del LIVE debe ser real.
- **E1 — labels ev_fomc/ev_cpi sin t()** (AlertasScreen.js:87-88).

## C) CORRECCIONES / FALSAS ALARMAS (descartadas tras verificación visual)
- Alertas SÍ tiene su header "Cobrex Alertas + LIVE" (el finding v6 estaba mal).
- Mercados "futuros vs países" = NO es diferencia (ambos tienen los dos; era comparar modos distintos).
- Perfil comparador = NO es diferencia (la nativa también lo tiene).
- IA = sin diferencias.

## REQUISITOS DE PRODUCTO (cerrados)
- Trial 7 días en mensuales PRO/ELITE, visible en TODAS las superficies + "requiere medio de pago" (lo fuerza PayPal). (Code: base hecha; extender a todas las superficies.)
- Geo-pricing por IP (server-side /api/plans). 
- Idioma del dispositivo, fallback EN (Code: hecho).

ESTADO: v8 = comparación COMPLETA, elemento por elemento, cruzada y verificada por Code + Escritorio. Lista para que Fernando ordene la ejecución. NO se aplicó ningún fix nuevo (más allá de los C ya hechos y testeados).
