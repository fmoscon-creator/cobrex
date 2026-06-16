# Cobrex Web 1.7 — CUADRO MAESTRO de TODOS los ajustes (para revisión de Escritorio)

Rama `web-1.7` (NO deployada). `main` = producción **1.6**. Esto lista TODO: los fixes de flujo/UI
(definidos antes del tema traducciones) + la traducción i18n total. Diff: `main...web-1.7`.

---

## YA EN PRODUCCIÓN (Cobrex Web 1.6 — contexto, no requiere re-revisión)
- Paywall como pantalla de inicio tras login FREE (full-screen, con "Saltar ✕"). 
- Perfil → Planes con PESTAÑAS FREE/PRO/ELITE; el botón abre el paywall.
- Compra/trial apunta a planes **Cobrex** (no más AUREX); plan_ids viejos AUREX reemplazados por Cobrex.
- Post-login → Mercados; onboarding reaparece al re-loguear; BUG C (cobrex_paywall_seen) limpiado en logout.
- Links Términos/Privacidad + botón "Continuar con FREE" en el paywall.

---

## A) FIXES DE FLUJO / UI / LAYOUT que trae la 1.7 (lo de "antes de traducciones")

| # | Ajuste | Archivo:lugar | Estado |
|---|--------|---------------|--------|
| A1 | **Flash de Mercados** al salir del onboarding ("Ya tengo cuenta") → ahora va directo a login, sin pasar por Mercados | index.html `startApp(dest)` síncrono a 'perfil' | ✅ validado (0 frames Mercados) |
| A2 | **Badge "Plan actual"** en la card FREE del paywall (= nativa SubscriptionScreen.js:245) | index.html `#free-plan-actual-badge` + `_updateFreeBadge()` | ✅ validado |
| A3 | **Campana del header** bien ubicada en las 6 pantallas: Alertas e IA ya no en fila aparte (sin el hueco), Perfil al extremo derecho, Portfolio sin tapar la bandera | index.html `injectHeaderBells` (bell margin-left:auto + Alertas inline) | ✅ validado captura |
| A4 | **Balanza ⚖️ eliminada** del header de Watchlist (nativa la oculta, HIDE_HEADER_LEGAL) | aurex-features.js (bloque wlChip removido) | ✅ validado captura |
| A5 | **LIVE a la izquierda** de la barra "Ordenar" en Portfolio (nativa PortfolioScreen.js:868) | index.html `movePortfolioLive` (bar width:100% space-between) | ✅ validado captura |
| A6 | **Bandera Español → 🇪🇸** (antes 🇦🇷) en el selector y el modal de idioma (= nativa LanguageButton.js) | aurex-features.js:5164/6420 + index.html select | ✅ validado |
| A7 | **Telegram en Alertas = TOGGLE** real que se activa/desliza (antes era texto "Conectar") | index.html toggle `.toggle-sw` + connectTelegram | ✅ |

## B) TRADUCCIÓN i18n TOTAL (8 idiomas)
Causa raíz: el contenido dinámico (filas, Termómetro, motivos, alertas, sort, gauge, banners) no se
re-dibujaba al cambiar idioma + algunos textos hardcodeados. Solución: claves i18n + `onLangChange`
re-renderiza todo. **Motivos IA** portados de la nativa (`aiMotivos.js` Build 42).
- Portfolio (filas "Acción/Cripto", Termómetro, Hoy, Ordenar, banner) · Watchlist (tipos) · IA (motivos,
  "al precio objetivo", sort) · Alertas (chips + descripciones disparadas + Mis Alertas) · Perfil (sub-sectores,
  upsell, header, celular) · Mercados (título, Solo favoritos, Futuros, fear&greed, gauge Pulse) · Footer (5 tabs) ·
  Paywall (precios /mes→/月, /año→/年, botones anuales, ANUAL/Ahorrás) · Modales (Crear Alerta, Detalle, Mis
  Alertas, Agregar Watchlist, Ordenar, Comparar).
- **Validación:** 0 fugas de español en **chino + árabe + hindi** en las 6 tabs + paywall + modales.

## NO se traduce (correcto, = nativa)
Nombres propios de activos (Bitcoin, Apple…), marcas (Cobrex, FREE/PRO/ELITE, Telegram), tickers, números.

## Archivos tocados
`app/index.html`, `app/aurex-i18n.js`, `app/aurex-v3.js`, `app/aurex-features.js` (+ docs).

## Pendiente: revisión Escritorio + OK escrito Fernando → merge a main (deploy). Reversión: tag `safe-web-1.3-pre14`.
