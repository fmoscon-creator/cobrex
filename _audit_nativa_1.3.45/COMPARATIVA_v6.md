# COMPARATIVA v6 — Cruce ELEMENTO POR ELEMENTO, pantalla por pantalla (visual + código)
**15-jun-2026. Code.** Suma a la v5 el cruce VISUAL que ni Code ni Escritorio habían hecho: comparar cada captura nativa (Build 35/36) contra la PWA renderizada, elemento por elemento, con su posición en pantalla (no solo línea de código).

## ACLARACIÓN CLAVE (confirmada por Fernando + código)
Hay DOS campanas distintas, no confundir:
- **Campana del HEADER** (centro de notificaciones → Mis Alertas): va en el header. Nativa: BellButton.js en las pantallas con header.
- **Campana 🔔 POR ACTIVO** (crear alerta de ese activo): **SOLO en Portfolio y Watchlist**, en cada fila. Confirmado: AlertCreateModal.js se usa SOLO en PortfolioScreen.js y WatchlistScreen.js. NO va en Mercados/IA/Alertas/Perfil.

## POSICIÓN del LIVE por tab (validado con capturas, confirmado por Fernando)
| Tab | Nativa (posición visual) | PWA | ¿Igual? |
|---|---|---|---|
| Portfolio | DEBAJO del Termómetro, a la altura del "Sort by" | en el header | ❌ mal ubicado |
| Mercados | header arriba-derecha (junto a campana) | header | ✅ |
| IA | header arriba-derecha | header | ✅ |
| Alertas | header "Cobrex Alerts" arriba-derecha | la PWA NO tiene ese header | ❌ falta header |
| Watchlist | NO tiene LIVE | NO tiene | ✅ |
| Perfil | NO tiene LIVE | SÍ tiene | ❌ de más |

## PORTFOLIO — elemento por elemento (1ª pantalla cerrada)
- ✅ Coinciden: card Valor Total, Termómetro de Riesgo, filas de activos, timeframes.
- ❌ LIVE mal ubicado (ver arriba).
- ❌ Campana 🔔 por activo: falta en cada fila (C6).
- ❌ **Banner upsell ELITE** "Activá análisis técnico avanzado en tu portfolio · Disponible en ELITE" (nativa i18n.js:376/380 vía UpsellBanner, PortfolioScreen.js:781) — la PWA NO lo renderiza. NUEVO.

## NUEVOS ÍTEMS al plan (de este cruce visual)
- Portfolio: reubicar LIVE (debajo Termómetro/Sort); agregar campana por activo (C6); agregar banner upsell ELITE.
- Alertas: agregar el HEADER de marca "Cobrex Alerts" entero (LIVE + campana) que falta.
- Perfil: quitar el LIVE de más.

## META — honesto
El cruce VISUAL elemento por elemento NO se había hecho (ni Code ni Escritorio); por eso el LIVE, la campana y el banner ELITE aparecieron recién ahora y no en v1-v5. Se está haciendo pantalla por pantalla; Portfolio cerrado, faltan Mercados/Watchlist/IA/Alertas/Perfil + onboarding/modales. Cuando estén todas → plan visual completo (v7 con el aporte independiente de Escritorio).


## ADDENDUM v6 — PASE VISUAL COMPLETO (las 6 pantallas) + CORRECCIONES
Cruce elemento por elemento captura nativa vs PWA renderizada, las 6 pantallas:
- PORTFOLIO: ❌ LIVE mal ubicado (header vs debajo Termómetro/Sort) · ❌ campana por activo falta · ❌ banner upsell ELITE falta. Resto OK.
- MERCADOS: ❌ falta tab Metales · ⚠️ nativa(Futuros)=ticker de futuros vs PWA=tira de países (verificar mismo modo) · ⚠️ menú "⋯" por fila. Resto OK.
- WATCHLIST: ❌ campana por activo falta (C7) · ❌ DOBLE-$$ confirmado VISUALMENTE ("$$66.863,70", aurex-features.js:2247). Resto OK.
- IA: ✅ match fuerte, sin discrepancias nuevas.
- ALERTAS: ✅ CORRECCIÓN — SÍ tiene header "Cobrex Alertas + LIVE" (mi finding v6 "falta header" estaba MAL). ⚠️ canales en banners apilados vs 3 cards toggle nativas. Resto OK.
- PERFIL: ❌ LIVE de más (nativa no tiene) · ❌ falta campana del header (C1 la salteó por header JS-render) · ⚠️ comparador en header (verificar vs nativa). Resto OK.

CORRECCIÓN clave: Alertas NO está sin header (v6 lo decía mal). La verificación visual lo atrapó.
Pendiente verificar (mismo modo): Mercados futuros vs países; Perfil comparador.
Esto completa el pase visual de Code → cruzar con Escritorio para v7.


## RESOLUCIÓN de los 2 "a verificar" (ambos = NO son diferencia)
- Mercados futuros vs países: la PWA tiene AMBOS (ticker futuros aurex-features.js + tira países) y la nativa también (MercadosScreen getPaises + market hours). La diferencia que se veía era solo por comparar modos distintos (captura nativa en Futuros vs render PWA en Mercados). NO es diferencia.
- Perfil comparador: la nativa también tiene comparador en Perfil. NO es diferencia.

## DIFERENCIAS REALES del pase visual (lista limpia para el plan)
- Portfolio: LIVE mal ubicado · campana por activo falta · banner upsell ELITE falta.
- Mercados: falta tab Metales (A1).
- Watchlist: campana por activo falta (C7) · doble-$$ (M3).
- Perfil: LIVE de más · falta campana del header.
- Alertas: header OK (corregido); diferencia menor = canales en banners apilados vs 3 cards toggle.
- IA: sin diferencias.
Pase visual de Code COMPLETO. → cruzar con Escritorio para v7.
