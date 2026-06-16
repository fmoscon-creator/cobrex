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
- **VERIFICADO:** el botón de planes en Perfil (`index.html:2230 <button onclick="abrirModalPlanes()">`, dentro del bloque "Plan actual" `pac-b1`/`plan-actual-card` `:2160,2221`) abre **el mismo `#modal-planes`**. Lo que Fernando ve "todo negro debajo" = **exactamente el problema D2** (overlay translúcido + cuerpo sin fondo opaco en tema claro).
- **AJUSTE PROPUESTO:** mismo que D1/D2.

## SECCIÓN F — Traducción en runtime + formato de números

### F1 · Formato de números fijo en es-AR (coma) aun en inglés
- **NATIVA:** formato **según idioma** — `lib/locale.js:20-28`: `LATAM_LOCALES = ['es-AR','pt-BR','fr-FR','it-IT']` → `{thousands:'.', decimal:','}`; resto (en, zh, hi, ar) → `{thousands:',', decimal:'.'}`. `applyFormat` (`:31-41`) usa esos separadores. → EN muestra `$238.43` (punto), ES `$238,43` (coma).
- **PWA:** hardcodea `toLocaleString('es-AR')` en múltiples lugares → **coma decimal SIEMPRE**, aun en inglés: `index.html:793, 1577, 1710, 1730`; `aurex-features.js:733, 752`. → EN muestra `$238,43` (mal).
- **DIFERENCIA:** la PWA no cambia el separador con el idioma; siempre es-AR.
- **AJUSTE PROPUESTO:** replicar `getSeparators()` por idioma (LATAM → coma, resto → punto) y usarlo en todos los formateos en vez de `toLocaleString('es-AR')` fijo. Existe `applyFormat` en `aurex-features.js:82` — unificar todos los call sites a una función locale-aware.

### F2 · Re-render de Portfolio al cambiar idioma con el selector (a verificar a fondo)
- **NATIVA:** cambia idioma y re-renderiza (React `useT` re-render).
- **PWA:** el selector llama `window._i18n.setLang(code)` (`index.html:3140`, `aurex-features.js:6410`). En prueba aislada `setLang('en')+applyTranslations()` SÍ tradujo los `data-i18n`, pero el contenido **JS-renderizado** de Portfolio (filas de activos, banners) puede no re-renderizarse en runtime + los números quedan en coma (F1). **A confirmar con captura del flujo real del selector** (no del setLang aislado).
- **AJUSTE PROPUESTO:** asegurar que al cambiar idioma se re-rendericen los contenidos JS de cada pantalla (no solo `applyTranslations` de `data-i18n`).

## SECCIÓN G — Tab por tab (emojis, colores, textos, pops)

### G-IA — pantalla IA
Colores base OK: `--green #3FB950`, `--red #F85149`, `--gold #D4A017` (`index.html:79,80,62`) = nativa (`IAScreen.js:40-41`, `#3FB950`/`#F85149`). Los 3 contadores existen en la PWA: alcista verde (`index.html:1797`), bajista rojo (`:1801`), alta-conv dorado (`:1805`) = nativa (`IAScreen.js:325-335`). Emojis ⚡ (alta conv), 💼 (mi portfolio), 📈/📉 coinciden.

- **G-IA-1 · Etiqueta del 3er contador "ALTA CONV-IA" sin traducir**
  - NATIVA: `IAScreen.js:335 <Text…>{t('alta_conv')}</Text>` (traducible).
  - PWA: `index.html:1807 <div … >ALTA CONV-IA</div>` **sin `data-i18n`** (las de alcistas/bajistas SÍ lo tienen, `:1799,:1803`). → en inglés queda "ALTA CONV-IA".
  - AJUSTE: agregar `data-i18n="ia_alta_conv"` (o la clave correspondiente) a ese div. (= la fuga "ALTA CONV" de Escritorio.)

- **G-IA-2 · Badge de dirección por señal hardcodeado (ALCISTA/BAJISTA/ALTA CONV)**
  - NATIVA: `IAScreen.js:414 {sig.direccion==='ALTA CONV-IA' ? t('alta_conv_badge') : … t('alcista_badge') : t('bajista_badge')}` (traducidos).
  - PWA: `dirLabel` hardcodeado `'ALCISTA'/'BAJISTA'/'ALTA CONV'` en `aurex-features.js:2047, 2179, 2319, 2351, 2761`. → en inglés quedan en mayúscula español.
  - AJUSTE: reemplazar cada `dirLabel` por `t('alcista_badge')/t('bajista_badge')/t('alta_conv_badge')`.
  - NOTA: mi scan A3 anterior NO detectó esto (el regex no incluía ALCISTA/ALTA CONV). Validación previa incompleta.

*(Siguen: G-Mercados, G-Watchlist, G-Alertas, G-Perfil, y cada POP — detalle de activo, comparador, crear alerta, ordenar, Pulse, Cómo usar — con sus emojis/colores/textos. EN PROGRESO.)*

## SECCIÓN H — Fugas i18n (las de Escritorio + las que encuentro)
- **H1 · "ALTA CONV-IA"** → ver **G-IA-1** (`index.html:1807` sin `data-i18n` + badges hardcode G-IA-2).
- **H2 · "hace Xs"** (timer LIVE) → ver **A2** (además de traducir, la nativa lo OCULTA por `HIDE_HEADER_LEGAL`).
- **H3 · "Solo favoritos"** → `index.html:4266 chip.innerHTML = '⭐ <span>Solo favoritos</span>'` hardcodeado (filtro favoritos de Mercados). AJUSTE: usar `t('solo_favoritos')` o clave equivalente.
- **H4 · "Oro/Petroleo" y demás variables IA** → `aurex-features.js:2686 var varDefs = [{k:'tendencia',l:'Tendencia 24h'},…,{k:'oro_petroleo',l:'Oro/Petroleo'},…]` **hardcodeado en español** (segundo varDefs; el de `:2333` sí usa `t('mkt_var6_label')`). → en inglés muestra "Oro/Petroleo", "Tendencia 24h", etc. AJUSTE: usar los `t('mkt_varN_label')` como en `:2333`.
- **H5 · "Act. HH:MM"** → estático `index.html:1677 id="tf-time" data-i18n="mkt_tf_ahora">Act. ahora` SÍ tiene i18n; falta confirmar el update dinámico de la hora ("Act. " + hora) por si hardcodea el prefijo. EN PROGRESO.

## SECCIÓN I — Validación Escritorio (Issue #17) incorporada + hallazgos nuevos (todos re-verificados por Code, línea por línea)

### I1 · Campana por activo — líneas PWA exactas (confirma B1/B2)
- **Portfolio:** PWA `aurex-features.js:1000` → `<span onclick="…openCreateAlert(item.simbolo…)">🔔</span>` está **en la fila del precio/eliminar (superior)**, antes de `deletePortfolioItem`. Nativa: `PortfolioScreen.js:966` en `assetBottomRow`. ❌ posición incorrecta (= B1).
- **Watchlist:** PWA `aurex-features.js:2255` → 🔔 junto al tacho `wlRemoveAsset` (`:2256`), arriba del comentario "Bottom row" (`:2258`). Nativa: `WatchlistScreen.js:990-995` en la bottom row. ❌ posición incorrecta (= B2).

### I2 · POP "Crear Alerta" (openCreateAlert) — botones Sube/Baja con color equivocado (HALLAZGO NUEVO)
- **NATIVA:** `components/AlertCreateModal.js:74-76` → `isUp = direccion==='arriba'; accentColor = isUp ? C.green : C.red; accentBg = isUp ? ${C.green}1A : ${C.red}1A`. → ▲ Sube = **verde**, ▼ Baja = **rojo**.
- **PWA:** `index.html:4525 function seg(active){ … border … (active?'var(--gold)':'var(--border2)') … background … (active?'var(--gold)':'var(--bg)') … }`. La MISMA `seg()` se usa para ▲ (`seg(dir==='arriba')`) y ▼ (`seg(dir==='abajo')`) → el botón seleccionado es **dorado en ambas direcciones**, sin distinguir sube/baja.
- **DIFERENCIA:** PWA dorado para sube y baja; nativa verde (sube) / rojo (baja).
- **AJUSTE PROPUESTO:** que `seg()` reciba la dirección y use `var(--green)` cuando es 'arriba' y `var(--red)` cuando es 'abajo' (borde+fondo+texto), como `AlertCreateModal.js:74-76`.

### I3 · "Ult. cierre" hardcodeado en Watchlist (H6, confirmado)
- **NATIVA:** usa `t('ult_cierre')` (p.ej. `PortfolioScreen.js`).
- **PWA:** `aurex-features.js:2250 <span …>Ult. cierre</span>` hardcodeado (rama `mktClosed && !isCrypto`). → en inglés queda "Ult. cierre".
- **AJUSTE:** `t('ult_cierre')`.
- *(Escritorio también marcó "Accion" y "Hoy" cerca; pendiente confirmar línea exacta — los reviso.)*

### I4 · Timer en header IA ("· ahora")
- **PWA:** `index.html:1793 <span id="ia-live-time" data-i18n="ia_ahora">· ahora</span>` (está traducido, pero) → por **A2** la nativa OCULTA el timer (`HIDE_HEADER_LEGAL`); debe no mostrarse, igual que en todos los headers.

### I5 · Cards de lista Watchlist (M4) — OK
- PWA `index.html:2117-2118`: borde = `isSel?list.color:var(--border)`, nombre `color:list.color`, ⭐ si `is_primary`. = Nativa `WatchlistScreen.js:828-834`. (Pendiente confirmar el `listDot` coloreado, nativa `:854`.)

> **Coincidencias Escritorio↔Code (doble verificación):** balanza headers (A1 = Escritorio brand.js:L11), campana Portfolio/Watchlist (B1/B2 = Escritorio C6/C7), colores sube/baja dorados (I2 = Escritorio L4525), "Ult. cierre"/hardcodes IA (H4/H6/G-IA = Escritorio A3 parcial). Lo de Escritorio que verifiqué línea por línea coincide; nada se da por cierto sin leer el código.

## SECCIÓN G-Mercados — pantalla Mercados / Cobrex Pulse

### G-M-1 · Emojis del Pulse distintos (nivel emoji)
- **NATIVA `MercadosScreen.js:39-40`** (`pulseEmoji`): `😨`=😨 (Miedo Extremo ≤20), `😟`=😟 (Miedo ≤40), `😐`=😐 (Neutral ≤60), `😏`=😏 (Codicia ≤80), `🤑`=🤑 (Codicia Extrema).
- **PWA `aurex-v3.js:3051-3055`**: 😱 (≤20), 😰 (≤40), 😐 (≤60), 😏 (≤80), 🤑 (>80). Además **inconsistencia interna**: `:3054` usa 😏 pero `:3068` usa 😊 para Codicia.
- **DIFERENCIA:** Miedo Extremo PWA 😱 vs nativa 😨; Miedo PWA 😰 vs nativa 😟; Codicia PWA inconsistente (😏/😊).
- **AJUSTE:** usar 😨/😟/😐/😏/🤑 (idéntico a `pulseEmoji`) y unificar `:3054` y `:3068` a 😏.

### G-M-2 · Colores y filtros del Pulse — OK
- Colores por zona `#C62828/#FF6B6B/var(--gold)/var(--green)/#00E676` (`aurex-v3.js:3051-3055,3120`) = nativa (`MercadosScreen.js:42`). ✓
- Filtros: `🌐 GLOBAL / 🪙 CRIPTO / 📈 ACCIONES / 🛢️ COMOD / ⚡ FUTUROS` (`aurex-v3.js:3197`) = emojis nativos (`MercadosScreen.js:194-198`). ✓ *(menor: `catLabels` en `:3197` están hardcodeados en mayúscula; la nativa usa `i18n('pulse_global')` etc.)*

### G-M-3 · "Acciones/Cripto/ETF…" hardcodeado (H7)
- **PWA `aurex-features.js:4174`**: `tipoLabel = s.tipo==='accion'?'Acciones':…'cripto'?'Cripto':…'Metal':'Mat. Prima':'Bono':'Otro'` **hardcodeado** (vs `:1641` que sí usa `t('mkt_tipo_*')`).
- **AJUSTE:** usar `t('mkt_tipo_accion')` etc. como en `:1641`. (= la fuga "Accion" de Escritorio.)

## SECCIÓN G-Alertas — pantalla Alertas (15 toggles)
- **OK:** 4 secciones con iconos/colores = nativa: IA 🤖 `#A78BFA` (`index.html:1936,1947 al_sec_ia`), Pulse 💓 `#EC4899` (`:1962 al_sec_pulse`), Precio 💰 (`:1977 al_sec_precio`), Eventos 📅 (`:1989`). Títulos de sección con `data-i18n`. Nativa `AlertasScreen.js:52-91` (mismos 15 ids, iconos 🤖/💓/💰/📅, colores `#A78BFA/#EC4899/C.gold/#3B82F6`).
- **G-AL-1 · Pop "alertas activas" con labels hardcodeados (fuga):** `index.html:950 var toggleLabels = ['Cambio de senal','Alta Conviccion','Umbral probabilidad','Senal en Portfolio','Cambio de zona','Por categoria','Termometro de Riesgo','Precio objetivo','Variacion brusca','Nuevo maximo/minimo','FED FOMC','CPI / PBI','Apertura mercados','Earnings portfolio','Geopolitica GDELT']` — **15 labels en español sin acentos**, usados en el modal de resumen (`alert-info-modal`, `:951-952`). La nativa usa `t('alert_ia_cambio')` etc. (`AlertasScreen.js:56-91`). → en inglés ese pop queda en español.
  - **AJUSTE:** reemplazar el array por `t()` de cada toggle. (También el array `sections` `:944` con títulos hardcodeados.)

---
## ESTADO DE COBERTURA (para Escritorio)
**Hecho y verificado con líneas:** A (headers ⚖️/timer/LIVE), B (campana por activo Portfolio/Watchlist), C (pop Mis Alertas colores), D (paywall estructura+overlay+trial), E (Planes en Perfil = D), F (formato números + runtime), G-IA (contador+badges), H1-H4.
**EN PROGRESO (mismo nivel de detalle + capturas):** G-Mercados · G-Watchlist (lista colores, comparador) · G-Alertas (15 toggles) · G-Perfil (elementos restantes) · cada POP (detalle de activo, comparador, crear alerta, ordenar, Pulse, Cómo usar) · H5.
**Regla:** nada se aplica ni se manda a Escritorio hasta que esté 100% y con OK escrito de Fernando.
