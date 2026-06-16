# Cobrex Web 1.7 — Cierre i18n total (todas las superficies)

Rama `web-1.7` (NO deployada, main = producción 1.6). Trabajo: traducción completa de TODA la app
en los 8 idiomas, + los fixes de headers/layout/flujo previos.

## Validación final (Playwright, login real FREE, scan automático)
**Barrido en 3 idiomas no-latinos (chino, árabe, hindi) — donde cualquier español salta a la vista:**
- Mercados · Portfolio · Watchlist · IA · Alertas · Perfil → **0 fugas en los 3 idiomas** ✅
- Paywall (FREE/PRO/ELITE) → 100% traducido, incluido precios "/月" "/年" y botones anuales ✅
- Modales (Crear Alerta, Detalle activo, Mis Alertas, Agregar Watchlist, Ordenar, Comparar) → traducen ✅

## Qué se tradujo (lo que faltaba)
- **Filas de activos** ("Acción"/"Cripto") → claves `mkt_tipo_*` + re-render en `onLangChange` (Portfolio y Watchlist).
- **Termómetro de Riesgo** → re-render en `onLangChange` (ya usaba `t()`).
- **Motivos de las señales IA** → portado de la nativa (`lib/aiMotivos.js` Build 42): `buildAiMotivos(sig)`
  genera las 5 justificaciones localizadas (claves `ai_motivo1..5` copiadas de la nativa) y reemplaza
  los `sig.motivos` que venían del **backend en español**. Mismo enfoque que la app nativa.
- **Descripciones de Alertas disparadas** (Señal fuerte/Supera umbral/Zona soporte-resistencia/Sobre…/24hs)
  → claves `al_d_*` + `calculateAlerts` re-corre en `onLangChange`.
- **Headers** (títulos Perfil/Alertas), **footer** (5 tabs), **Mis Alertas** (modal), **Comparar** (labels),
  **fear&greed** (Miedo/Codicia), **gauge Pulse** (recompute del label), **combo Mercados/Futuros**,
  **Solo favoritos**, **subtítulo upsell Perfil**, **bandera Español → 🇪🇸**.
- **Paywall precios**: el `data-pxr` ya no destruye los spans `data-i18n` (`/mes`→`/月`, `/año`→`/年`);
  sufijos `ANUAL/Ahorrás/año/mes` vía `t()`; botones anuales con precio separado del texto traducido.

## Lo que NO se traduce (correcto, = nativa)
Nombres propios de activos (Bitcoin, Apple, MercadoLibre…), marcas (Cobrex, FREE/PRO/ELITE, Telegram),
tickers, números. La nativa tampoco los traduce.

## Archivos
`app/index.html`, `app/aurex-i18n.js`, `app/aurex-v3.js`, `app/aurex-features.js`.
Diff completo: https://github.com/fmoscon-creator/cobrex/compare/main...web-1.7

## Pendiente: OK escrito de Fernando + revisión Escritorio → merge a main (deploy).
