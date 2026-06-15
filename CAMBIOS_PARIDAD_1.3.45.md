# Cuadro de cambios — PWA cobrex.io/app → paridad con la app nativa v1.3.45

**Deploy:** 15-jun-2026 · commit `6db020a` en `main` (producción) · reversión: tag `safe-pre-paypal-pwa-13jun`
**Diff completo para revisar (Escritorio):** https://github.com/fmoscon-creator/cobrex/compare/90583fe...6db020a
**Archivos tocados:** `app/index.html`, `app/aurex-v3.js`, `app/aurex-features.js`, `app/aurex-i18n.js`, `app/assets/onboarding/` (5 PNG nuevos)

> Cómo validar el onboarding sin borrar datos: abrir **`https://cobrex.io/app/index.html?resetOnboarding=1`**
> Validar logueado: usar tu cuenta. Validar idiomas: cambiar el idioma del dispositivo/navegador (la PWA lo detecta) o el selector de idioma en Perfil.

---

## LOTE 1 — Críticos + visuales

| # | Cambio | Dónde validar (pantalla / paso) | Resultado esperado |
|---|--------|---------------------------------|--------------------|
| **C1** | Campana de notificaciones en el header | Las **6 pantallas** (Mercados, Portfolio, Watchlist, IA, Alertas, Perfil) | Arriba a la derecha hay una 🔔; al tocarla abre "Mis Alertas". Antes faltaba en varias. |
| **C2** | Pantalla inicial | Entrar logueado | Abre en **Mercados** (antes abría en Portfolio). Igual que la nativa. |
| **C3** | Paywall para FREE | Usuario **FREE**, al abrir la app | A ~1,5 s aparece el modal de planes (una vez por sesión). |
| **C4** | Bug de plan ELITE→FREE | Usuario **ELITE** (tu cuenta) | Muestra **ELITE** y no se baja solo a FREE al iniciar. |
| **C6** | Campana por activo — Portfolio | Portfolio → tocar un activo (detalle) | Aparece 🔔 que crea alerta para ese activo. |
| **C7** | Campana por activo — Watchlist | Watchlist → menú de un activo | Aparece 🔔 que crea alerta. (Solo Portfolio y Watchlist, igual que la nativa.) |
| **C8** | Cobrex Pulse en 8 idiomas | Mercados → Pulse | Las 5 zonas (Miedo Extremo / Miedo / Neutral / Codicia / Codicia Extrema) traducidas al idioma activo. |
| **M3** | Doble signo $$ | Watchlist | El precio muestra **un solo** `$` (antes salía `$$`). |
| **A1** | Pestaña "Metales" + orden | Mercados (pestañas superiores) | Orden nativo: Acciones / Cripto / Futuros / **Metales** / Commodities / ETF & Bonos / Divisas / Stable & DeFi. |
| **A2** | Versión "Cobrex Web 1.3" | Perfil (header arriba der.) **y** Perfil → Soporte | En ambos lados dice **"Cobrex Web 1.3"** (alineado a iOS 1.3, aclarando que es web). |
| **P1** | Posición del LIVE — Portfolio | Portfolio | El indicador **LIVE** está en la línea del filtro "Ordenar", debajo del Termómetro (igual a la nativa). |
| **P2** | LIVE en Perfil | Perfil | **No** hay indicador LIVE (la nativa tampoco lo tiene). |
| **D3** | Banner upsell — Portfolio | Usuario **FREE** en Portfolio | Banner "Activá señales IA para estos activos / Disponible en PRO". |
| **M7** | Limpieza | (técnico) | Se quitó un `console.log` de debug. Sin efecto visible. |

---

## LOTE 2 — Lo que faltaba para la paridad total

| # | Cambio | Dónde validar (pantalla / paso) | Resultado esperado |
|---|--------|---------------------------------|--------------------|
| **M2** | Footer multicolor | Barra inferior, tocando cada pestaña | Cada ícono/etiqueta activa con su color nativo: **Portfolio verde** `#3FB950` · **Mercados dorado** `#D4A017` · **Watchlist azul** `#58A6FF` · **IA violeta** `#BC8CFF` · **Alertas rojo** `#FF7B72` · **Perfil gris** `#C9D1D9`. |
| **A4** | Eventos IA traducidos | IA → panel de eventos | Los eventos (FED / IPC EEUU / NVIDIA) y el badge "IMPACTO ALTO/MEDIO" salen en el idioma activo (antes solo español). |
| **M4** | Color por lista — Watchlist | Watchlist → crear lista | 8 colores de selección; el primer dorado ahora es el hex nativo `#D4A017`. |
| **M5** | Bloque "Cómo usar Cobrex" | Perfil → bloque **"📖 Cómo usar Cobrex"** | Acordeón con 7 secciones (Portfolio, Mercados, Watchlist, IA, Alertas, Perfil, Plan actual); cada una abre la lista de funciones con emoji + texto, traducido. Réplica del nativo. |
| **A5** | Cotización ARS en vivo | Portfolio → convertidor de moneda | El ARS usa la cotización **real** (dólar blue ~1.460), no el valor viejo hardcodeado (1.195). Es función exclusiva de la web. |
| **GEO** | Precios por IP | Abrir desde Argentina vs exterior | Desde **AR**: PRO $2.99 / ELITE $4.99. Desde **exterior**: PRO $4.99 / ELITE $9.99. (La web no puede leer el país de la cuenta App Store, lo deduce por IP.) |
| **C5** | Onboarding Build 36 | `cobrex.io/app/index.html?resetOnboarding=1` | 4 slides con los **íconos 3D reales** + fondo constelación + logo/COBREX + título/subtítulo traducidos + dots + botón "Siguiente" y, en el último, **"Crear cuenta gratis" + "Ya tengo cuenta"**. Reemplaza el onboarding viejo (collage de capturas). |
| **A3** | Sin fugas de español | Cualquier pantalla en inglés/otro idioma | Revisado: IA "al precio objetivo" → "to target price" y la descripción de plan en Perfil ahora traducen. Scan automático: **0 textos en español** cuando el idioma es otro. |

---

## Validación independiente

**Escritorio (revisión de código por GitHub):** revisar el diff `90583fe...6db020a` archivo por archivo, confirmando que cada cambio replica la nativa (`AurexApp` v1.3.45) y que no rompe nada existente.

**Post-deploy (visual, ambos):** recorrer la tabla pantalla por pantalla en `cobrex.io/app` (logueado y sin loguear / FREE y ELITE / al menos 2 idiomas), marcando OK / observación por fila.

**Ya verificado por Code (Playwright, Chrome real):** sintaxis OK · 0 errores de código en las 6 pantallas en español e inglés · onboarding nuevo renderiza en vivo · footer 6 colores exactos · campana en las 6 pantallas · ARS en vivo 1.460 · geo AR=$2.99 · 0 fugas de español.
