# Auditoría PWA cobrex.io/app ↔ App nativa v1.3.45 — DIFERENCIAS para ajuste post-deploy

**Estado:** EN PROGRESO (auditoría de cero, sin aplicar ningún cambio). Para revisión de Escritorio.
**Método:** lectura real del código de ambos lados + capturas. Cada hallazgo cita **línea PWA ↔ línea nativa**, la diferencia exacta y el ajuste técnico propuesto. NADA se aplica hasta autorización escrita de Fernando.
**Repos:** PWA = `fmoscon-creator/cobrex` (`/app/`), commit live `6db020a`. Nativa = `fmoscon-creator/AurexApp` rama `dev` `308e4d9` = v1.3.45/build45 (`/src/`).
**Clave que cambia TODO:** `lib/brand.js:11 → export const HIDE_HEADER_LEGAL = true;` — la nativa OCULTA elementos del header que la PWA muestra.

---

## SECCIÓN A — HEADERS (las 6 pantallas)

### A1 · ⚖️ Balanza (comparador/aviso legal) en el header
- **NATIVA:** envuelta en `{!HIDE_HEADER_LEGAL && (…⚖️…)}` → `PortfolioScreen.js:698-702`, `MercadosScreen.js:876`, `IAScreen.js:314`, `AlertasScreen.js:429`. Como `HIDE_HEADER_LEGAL = true` (`brand.js:11`), **la ⚖️ NO se muestra** en v1.3.45.
- **PWA:** la muestra. Se inyecta en los headers desde `aurex-features.js:5089` (`// Chip ⚖️ Aviso Legal en headers`), render p.ej. `index.html:2667 <span style="font-size:16px">⚖️</span>`. Comentarios `index.html:1841,2053` ("ya está en ⚖️ del header como nativa") = supuesto equivocado: la nativa la tiene pero OCULTA.
- **DIFERENCIA:** PWA muestra ⚖️ en los headers; la nativa NO.
- **AJUSTE PROPUESTO:** no inyectar el chip ⚖️ en los headers (desactivar el bloque de `aurex-features.js:5089` y/o el span de header), replicando `HIDE_HEADER_LEGAL = true`.

### A2 · Timer "· hace X min/seg" al lado de LIVE
- **NATIVA:** `components/LiveIndicator.js` → el timestamp está gateado `{lastUpdate && !HIDE_HEADER_LEGAL ? (…· hace…) : null}`. Con `HIDE_HEADER_LEGAL = true`, **el timer NO se muestra**; el LiveIndicator solo pinta **punto verde + "LIVE"**.
- **PWA:** muestra el timer. Portfolio: `index.html:1276 <span id="liveTimePort">`; genérico `index.html:1617 <span id="liveTime">`; lógica que escribe "· hace Xs / · hace X min" en `index.html:753-754, 765-766` y `aurex-features.js:3836-3837`.
- **DIFERENCIA:** PWA muestra "· hace Xs"; la nativa no.
- **AJUSTE PROPUESTO:** ocultar `#liveTimePort` y `#liveTime` (no escribir el texto del timer), dejando solo punto verde + "LIVE".

### A3 · LIVE en el header de Portfolio
- **NATIVA:** `PortfolioScreen.js` **NO importa `LiveIndicator`** → no hay LIVE en el header. El LIVE de Portfolio está en la **barra del chip Ordenar**: `PortfolioScreen.js:867-871` → punto verde pulsante 6×6 (`C.green`, `usePulseAnim`) + "LIVE" (verde, 9px, bold). **Sin timer.**
- **PWA:** el `.live` (punto + LIVE + `liveTimePort`) nace en el **header** (`index.html:1276`), y `window.movePortfolioLive` (`index.html:4635`) lo mueve a la barra del sort (`portfolio-sort-btn`). CSS: `.live` `index.html:194`, `.ldot` `index.html:195` (punto verde pulsante).
- **DIFERENCIA:** posición ya queda en la barra de orden (OK tras P1), PERO arrastra el timer `liveTimePort` (ver A2) que la nativa no tiene.
- **AJUSTE PROPUESTO:** mantener el LIVE en la barra de orden (como está) y ocultar el `liveTimePort` (queda punto verde + "LIVE", igual a `PortfolioScreen.js:869-871`).

> Nota: en Mercados/IA/Alertas la nativa SÍ muestra punto verde + "LIVE" en el header (vía `LiveIndicator`, sin timer). Hay que confirmar pantalla por pantalla que la PWA muestre exactamente eso (punto+LIVE) sin timer ni ⚖️. (Pendiente capturas A-sección 2.)

---

## SECCIÓN B — CAMPANA 🔔 POR ACTIVO (Portfolio y Watchlist)

### B1 · Posición de la campana por activo — PORTFOLIO
- **NATIVA:** la 🔔 va en la **fila INFERIOR del activo, pegada a la izquierda**: `PortfolioScreen.js:966-979` → `TouchableOpacity` dentro de `assetBottomRow`, `style={{ … marginRight: 'auto' }}`, emoji `\u{1F514}` color `C.gold`. El chevron `›` (`:957`) y el tacho 🗑️ (`:961`) están en la fila SUPERIOR (la fila tocable), separados de la campana.
- **PWA:** la 🔔 se agregó **pegada al chevron `›`** (fila superior) en `aurex-features.js` (bloque C6, antes del `›`). → posición distinta a la nativa.
- **DIFERENCIA:** nativa = campana en fila inferior, extremo izquierdo; PWA = campana junto al chevron (fila superior).
- **AJUSTE PROPUESTO:** mover la 🔔 a la fila inferior del activo, alineada a la izquierda (`margin-right:auto`), separada del chevron/tacho, igual a `assetBottomRow`.

### B2 · Posición de la campana por activo — WATCHLIST
- **NATIVA:** 🔔 en la **fila inferior** junto a los botones de período: `WatchlistScreen.js:990-995` ("Bottom row: 🔔 (Build 8) + period buttons"), `setAlertCreateAsset({ simbolo: item.ticker, tipo_activo: tipo, … })`.
- **PWA:** la 🔔 se agregó **junto al tacho `wlRemoveAsset`** (bloque C7) → posición distinta.
- **DIFERENCIA:** nativa = campana en fila inferior con los períodos; PWA = campana junto al tacho.
- **AJUSTE PROPUESTO:** mover la 🔔 a la fila inferior (junto a los botones de período), separada del tacho, igual a `WatchlistScreen.js:990-995`.

---

## SECCIÓN C — POP "MIS ALERTAS" (se abre al tocar la campana)

### C1 · Color verde/rojo del card según sube/baja
- **NATIVA:** cada card tiene **borde izquierdo de 4px verde (sube) / rojo (baja)**: `MisAlertasScreen.js:236-237` `const isUp = aSrc.direccion === 'arriba'; const dirColor = isUp ? C.green : C.red;` y `:254-255` `borderLeftWidth: 4, borderLeftColor: dirColor`. Además ícono circular tintado `${dirColor}26` (`:266`) + emoji 📈/📉 (`:238`) + palabra ALCISTA/BAJISTA (`:239`).
- **PWA:** card con borde uniforme gris `index.html:4224` `… border:1px solid var(--border) …` → **sin** color por dirección. Y la dirección se detecta con strings equivocados `index.html:4193` `(al.direccion==='subio'||'up') ? '▲' : (('bajo'||'down') ? '▼' : '•')` — el backend usa **'arriba'/'abajo'**, así que nunca matchea y muestra **'•'** (neutro) en vez de ▲/▼.
- **DIFERENCIA:** PWA = card gris uniforme + flecha neutra; nativa = borde izq. verde/rojo + ícono tintado + ▲/▼ (📈/📉).
- **AJUSTE PROPUESTO:** (a) calcular `isUp = direccion==='arriba'` (corregir strings) y `dirColor = isUp ? var(--green) : var(--red)`; (b) agregar `border-left:4px solid <dirColor>` al card (`index.html:4224`); (c) tintar el ícono y usar ▲/📈 vs ▼/📉.

---

## SECCIÓN D — PAYWALL (pantalla de planes)

### D1 · Diseño general: pantalla completa con 3 tarjetas apiladas (nativa) vs modal con pestañas (PWA)
- **NATIVA:** `SubscriptionScreen.js:205-235` → `SafeAreaView` + `ScrollView` a **pantalla completa** (`st.container backgroundColor C.bg`, `st.scroll padding:20`). Muestra **las 3 tarjetas apiladas verticalmente** (FREE `:233`, loop PRO/ELITE `:255-309`), cada una `st.card` (`:348` bg `C.card`; PRO acento `C.purple`, ELITE acento `C.gold` — `:260`). Arriba: Saltar/Volver, título `elegir_plan` (24px), subtítulo `todos_planes_incluyen`, links Términos/Privacidad azul `#58A6FF` (`:222-231`).
- **PWA:** `index.html:2733 #modal-planes` = **modal overlay** (`background:rgba(0,0,0,0.85)`, `:2734`) con **pestañas FREE/PRO/ELITE** (`planTab`, `:3229`) que muestran **un plan por vez** (`plan-panel-FREE/PRO/ELITE`, `:3060,3145`). No apila las 3.
- **DIFERENCIA:** estructura totalmente distinta — nativa apila 3 tarjetas en pantalla con scroll; PWA usa modal con pestañas.
- **AJUSTE PROPUESTO:** rehacer el paywall PWA como vista de pantalla completa con las 3 tarjetas apiladas (FREE→PRO→ELITE), sin pestañas, replicando `SubscriptionScreen.js`. (Cambio grande.)

### D2 · Fondo/overlay que se transparenta (tema claro)
- **NATIVA:** fondo sólido `C.bg` (no overlay translúcido) — `st.container` `:343`.
- **PWA:** outer `#modal-planes` `background:rgba(0,0,0,0.85)` (`:2734`), header interno `background:var(--bg)` (`:2739`), cuerpo SIN fondo propio → en tema claro queda mezcla claro/oscuro y el Perfil de atrás se filtra (captura `x_planes.png`).
- **DIFERENCIA:** nativa = pantalla opaca; PWA = overlay translúcido que deja ver el Perfil detrás → se ve roto.
- **AJUSTE PROPUESTO:** si se mantiene como modal, el cuerpo debe tener fondo opaco `var(--bg)`; si se rehace como pantalla (D1), queda resuelto.

### D3 · Botón de compra / Trial
- **NATIVA:** botón por tarjeta `st.buyBtn` con bg del acento (`:298`), texto blanco. Trial: `🚀 ` (PRO) / `👑 ` (ELITE) + `probar_gratis_dias` (`:305`); nota `trial_despues` debajo (`:308`). Botón FREE de salida gris `freeContinueBtn` (`#E7E9ED`, `:372`).
- **PWA:** botones `btn-pro-monthly`/`btn-elite-monthly` (`index.html:3132,3200`) abren PayPal; trial por `trialPass()` (`:4576`). Funcionan, pero el layout roto (D1/D2) los tapa (Fernando: "no se ve el botón de trial / no se puede comprar").
- **AJUSTE PROPUESTO:** resolver D1/D2 y verificar botón por tarjeta con acento + emoji (🚀/👑) + nota trial, igual a `SubscriptionScreen.js:298-308`.

## SECCIÓN E — "PLANES" dentro de Perfil
*(pendiente: leer bloque `plan-panel-*` / `planTab` en Perfil (`index.html:3060+`) — lo "todo negro debajo". Probable mismo origen que D2. A confirmar con captura del bloque real + líneas.)*

## PENDIENTE (sigo, mismo detalle, con capturas):
- **SECCIÓN F — TRADUCCIÓN runtime + formato de números**: al cambiar idioma con el selector (no al cargar); formato `$238,43` (coma) vs `$238.43` en EN.
- **SECCIÓN G — cada TAB**: emojis, colores de texto, cada POP/modal que abre (detalle de activo, comparador, crear alerta, ordenar, filtros IA, Pulse, Cómo usar, etc.) — elemento por elemento.
- **SECCIÓN H — fugas i18n** que reportó Escritorio: "hace Xs", "Act. HH:MM", "ALTA CONV", "Solo favoritos", "Oro:".
