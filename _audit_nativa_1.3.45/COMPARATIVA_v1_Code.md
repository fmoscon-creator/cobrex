# COMPARATIVA v1 — Nativa 1.3.45 vs PWA (análisis de Code)

**15-jun-2026.** Hecho leyendo el código y mirando capturas reales. Cada hallazgo citado a archivo:línea.

**CAVEAT:** Las capturas nativas disponibles son **Build 35/36** (Dropbox/AUREX/CAPTURAS PANTALLAS). El código analizado es **1.3.45 (build 45, commit 308e4d9)**. Difieren en algunos puntos (ej. footer: Build 35 usa emoji, build 45 usa SVG). Se cita el **código 1.3.45 como verdad** y las capturas como referencia visual.

Esto es **v1**. Pedido: que ESCRITORIO sume su análisis (ya entregó Issue #6 de aurex-app) → consolidar **v2**.

| Pantalla/Zona | Elemento | Nativa 1.3.45 (archivo:línea) | PWA (archivo:línea) | Diferencia | Fuente |
|---|---|---|---|---|---|
| HEADER (todas las tabs) | Campana/centro de notificaciones | BellButton en el header de las 6 pantallas → navega a 'MisAlertas'. MercadosScreen.js:882 (y PortfolioScreen/IAScreen/WatchlistScreen/AlertasScreen/PerfilScreen importan y usan BellButton.js). Componente BellButton.js (campana + badge de no leídas). | NO existe. index.html:1807-1810 el header = logo + 'Cobrex Mercados' + LIVE, sin campana. Arriba-derecha hay un comparador (⚖️), no campana. | 🔴 FALTA campana de notificaciones + badge en las 6 tabs | Code✓ + Escritorio#6 |
| HEADER (Perfil) | Versión visible | PerfilScreen.js:895 y :957 muestran v{APP_VERSION} (versión real, ej 1.3.45). | No muestra versión en el header (captura Perfil: arriba-derecha = comparador). | 🟠 Falta versión en header | Code✓ + Escritorio#6 |
| FOOTER (tab bar) | Pantalla inicial | Abre en MERCADOS. TabNavigator.js:90 initialRouteName='Mercados'. | Abre en PORTFOLIO. index.html ~4078 navTo('portfolio') al cargar. | 🔴 Distinta pantalla inicial | Code✓ |
| FOOTER (tab bar) | Orden de tabs | Portfolio, Mercados, Watchlist, IA, Alertas, Perfil. TabNavigator.js:99-104. | Mismo orden. index.html:3999-4019. | ✅ Coincide | Code✓ |
| FOOTER (tab bar) | Íconos | SVG propios duotono con COLOR por tab. TabNavigator.js renderIcon (Portfolio maletín verde #3FB950, Mercados chart dorado, Watchlist ojo azul, IA estrella violeta #BC8CFF, Alertas campana roja #FF7B72, Perfil persona). Colores TabNavigator.js:17-18. (Caveat: captura Build 35 usa emojis 👀/🤖 — el código build45 ya usa SVG). | Íconos distintos y monocromos (dorado activo / gris). index.html:3999-4019 (btn-portfolio…btn-perfil). | 🟡 Íconos no actualizados (forma + color por tab) | Code✓ + Escritorio#6 |
| APERTURA | Paywall al abrir | Tras login, si el plan NO es PRO/ELITE abre la pantalla de planes. App.js:251 (Build 36). | No hay auto-apertura de paywall al abrir. | 🔴 Falta paywall al abrir (FREE) | Code✓ + Fernando |
| ONBOARDING | Onboarding nuevo | Onboarding NUEVO Build 36 (capturas IOS BUILD 36 v1.1 ONBOARDING NUEVO: splash + slides nuevos). | Onboarding VIEJO (2 slides 500+/10 variables/7 mercados). index.html obs1/obs2 (~1189-1268). | 🔴 Onboarding desactualizado | Fernando + Code✓ |
| MERCADOS | Filtros de tipo | 8 tabs: acciones, cripto, futuros, METALES, commodities, etfs(etf_bonos), divisas, stable. MercadosScreen.js:171-179 (getTABS). | 7 tabs: cripto, acciones, stable&defi, futuros, commodities, divisas, etf&bonos (verificado por DOM en vivo). FALTA METALES, orden distinto, Stable/ETF fusionados. | 🟠 Falta METALES + orden/fusión distintos | Code✓ + Escritorio#6 |
| IA | Filtros | 10: todo, alcista, bajista, alta, cripto, accion, etf, metal, commodity, bono. IAScreen.js:38-49 (getFilters). | 10: todo, alcista, bajista, conf.IA, cripto, acciones, etf, metales, mat.primas, bonos (DOM en vivo). Mismo set; nombres/labels distintos. | 🟡 Coincide el set; difieren nombres de 'alta'/'commodity' | Code✓ (Escritorio marcó nombres) |
| PORTFOLIO / WATCHLIST | Campana por activo (crear alerta) | Entrada visible por activo → AlertCreateModal (AlertCreateModal.js). BellButton/entrada en cada fila. | openCreateAlert existe (index.html) pero ESCONDIDA dentro del detalle/menú, NO visible en la fila (DOM: 0 campanas visibles por fila). | 🔴 Campana por activo no visible | Code✓ + Escritorio#6 |
| PLAN | Reconocer plan real (ELITE) | Plan real en backend OK: usuarios.plan de fmoscon = ELITE (verificado vía /api/usuario). Nativa lo refleja. | BUG: loadUserPlan() NO se llama al loguear — onAuthStateChange (index.html:1089-1099) tiene 0 llamadas a loadUserPlan; solo un poll en DOMContentLoaded (index.html:4528-4534) que se rinde y deja FREE. La función ANDA (con el id real de fmoscon devuelve ELITE), pero no se la dispara tras restaurar sesión → muestra FREE. | 🔴 BUG: ELITE se muestra como FREE | Code✓ (root cause) |
| PERFIL / Soporte | Versión mostrada | Versión real (PerfilScreen.js:895/957). | 'Cobrex v1.0' hardcodeada vieja. index.html:2835. | 🟠 Versión desactualizada | Code✓ + Escritorio#6 |
| WATCHLIST | Bug doble $$ en precios | (referencia: precio formateado normal) | Reportado por Escritorio #6 (doble $$ en precios de Watchlist). A confirmar el render exacto (aurex-features.js). | 🟡 BUG reportado por Escritorio — a verificar | Escritorio#6 |
| PRECIOS/PLANES | Precios dinámicos | Dinámicos (RevenueCat), geo. | Dinámicos (PayPal /api/plans), geo AR/Global (index.html ~4505). Funciona (AR $2.99 / Global $4.99 verificado en vivo). | ✅ Funciona | Code✓ |
| PULSE / IA ENGINE | Motor + Pulse | 10 variables IA + Pulse 14 fuentes. | Mismas 10 variables (aurex-features.js:2680) + Pulse 14 (aurex-features.js:4366). Pulse visual presente. | ✅ Coincide | Code✓ |

## Cruce con Escritorio (Issue #6 de fmoscon-creator/aurex-app)
- Coincidimos en: campana header ausente, campana por activo Portfolio/Watchlist ausente, filtros Mercados (Metales sin tab, orden/fusión), footer monocromo, versión no visible.
- Yo sumo (root-causeado): bug ELITE→FREE (loadUserPlan no se llama al loguear), paywall al abrir ausente, onboarding viejo, abre en Portfolio (no Mercados).
- A verificar de Escritorio: bug doble $$ Watchlist; nombres exactos de filtros IA.

## Método (para que Escritorio valide)
- Código PWA: repo público fmoscon-creator/cobrex, carpeta app/.
- Código nativo 1.3.45: repo privado fmoscon-creator/AurexApp rama dev (ya actualizado a 308e4d9).
- Capturas nativas: Dropbox/AUREX/CAPTURAS PANTALLAS (Build 35/36).
