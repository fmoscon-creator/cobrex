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

## SECCIÓN G-Watchlist — pantalla Watchlist
- **OK (verificado):** colores de dirección en filas verde/rojo/dorado (`aurex-features.js:2046,2178,2626` = nativa `WatchlistScreen.js:60`); iconos 📈/📉/⚡ (`:2627` = `:62`); comparador con ⚖️ en el título (`wl_comparador_title='⚖️ Comparador Cobrex'`, `aurex-i18n.js:706`; render `aurex-features.js:2633`) = nativa (`:117 ⚖️ {comparador_aurex}`); ⭐ MEJOR PERFORMANCE (`:2661`); cards de lista con borde/nombre/⭐ por color (I5).
- **Fugas (ya anotadas):** badge de dirección hardcodeado en la fila (`:2179`, ver **G-IA-2**); "Ult. cierre" (`:2250`, ver **I3**).
- **Pendiente menor:** confirmar `listDot` coloreado (nativa `WatchlistScreen.js:854`).

## SECCIÓN G-Perfil — pantalla Perfil
- **OK:** bloques b1-b8 con iconos = nativa: 👤 Usuario, ⭐ Plan actual, ⚙️ Mi cuenta, 🎨 Preferencias, 🔒 Seguridad, 🔔 Alertas, 📩 Notificaciones, 💬 Soporte (`index.html:2162,2218,2240,2306,2378,2457,2530,2585` = `PerfilScreen.js:24-32`).
- **G-P-1 · Bloque "Cómo usar" en posición incorrecta (de mi M5):** PWA `index.html:2575 #pac-comousar` está **antes de Soporte (b8)**. Nativa: bloque **b3b entre Mi cuenta (b3) y Preferencias (b4)** (`PerfilScreen.js:27`). AJUSTE: mover el bloque a esa posición.
- **G-P-2 · Icono del bloque "Cómo usar" distinto (de mi M5):** PWA 📖 (`cu_block_title`, `aurex-i18n.js`); nativa **❓** + `t('como_usar_aurex')` (`PerfilScreen.js:27`). AJUSTE: usar ❓ y la clave/título nativo.

## SECCIÓN J — BANDERAS del selector de idioma (lo que marcó Fernando: ARG vs España)
- **NATIVA `lib/locale.js:5-12`** (`LANGUAGES`): **es-AR → 🇦🇷**, en-US → 🇺🇸, pt-BR → 🇧🇷, fr-FR → 🇫🇷, it-IT → 🇮🇹, zh-CN → 🇨🇳, hi-IN → 🇮🇳, **ar-SA → 🇸🇦**.
- **PWA — inconsistencia:**
  - **Español:** chip del header `aurex-features.js:5159 flags={es:'🇪🇸',…}` (y `:6414`) usa **🇪🇸** (España) ❌; el `select-idioma` de Preferencias `index.html:2348` usa **🇦🇷** "Español (Arg)" ✅ (= nativa). → en Portfolio ves 🇪🇸 y en Preferencias 🇦🇷.
  - **Árabe:** ambos lados PWA usan **🇦🇪** (`:5159`, `:6414`, select `:2354`) ❌; nativa usa **🇸🇦**.
  - **Códigos:** el select usa `es-ar`/`pt-br`; el header/i18n usan `es`/`pt`. Inconsistencia de valores (puede romper el match del idioma activo).
- **AJUSTE PROPUESTO:** unificar a las banderas nativas (`es → 🇦🇷`, `ar → 🇸🇦`, resto igual) en **todos** los lugares (header chip `:5159,:6414`, select `:2347-2354`) y unificar los códigos de idioma.

## SECCIÓN H (cont.) — H5 "Act. HH:MM"
- **PWA:** `aurex-features.js:3826 upd.textContent='Act. '+ts.getHours()+':'+…+' (backend)'` y `:3972 upd.textContent='Act. '+now.getHours()+…` → prefijo **"Act." hardcodeado** (barra de actualización IA). No traduce.
- **AJUSTE:** usar `t()` para el prefijo "Act." o replicar el formato nativo.

## NOTA — PLANES formato/diseño (reconfirmado por Fernando)
- Ver **D1/D2**: el paywall PWA (modal con pestañas + overlay translúcido) no replica el diseño nativo (pantalla con las 3 tarjetas apiladas, fondo opaco). Formato y diseño a rehacer según `SubscriptionScreen.js`.

## SECCIÓN K — Pops restantes (ordenar, detalle de activo, listDot)
- **K1 · Menú "Ordenar" — emoji de "fecha" distinto:** PWA `aurex-features.js:5666 {k:'fecha',…ic:'⏰'}` usa **⏰**; nativa `PortfolioScreen.js:674 { key:'date', icon:'🕐' …}` usa **🕐**. Resto de opciones/iconos coinciden (📊 valor, 📈 hoy, 💰 pnl, 💰 pnl%, 🔼 señal IA, 🎯 prob, 🔤 ticker), labels vía `t()`. AJUSTE: usar 🕐.
  - *(Mercados/Watchlist/IA sort: revisados, iconos coinciden — `:5668-5693`.)*
- **K2 · `listDot` Watchlist — OK:** PWA `aurex-features.js:2131 <div style="width:10px;height:10px;border-radius:5px;background:'+currentList.color+'">` = nativa `WatchlistScreen.js:854` (dot 10×10 con `currentList.color`). ✓
- **K3 · Pop "detalle de activo" (análisis IA) — OK:** usa los colores/emojis de dirección ya verificados (verde/rojo/dorado, 📈/📉/⚡, objetivo dorado). Detalle menor: mercado cerrado en nativa usa `#FF6B6B` (`MercadosScreen.js:1039`); confirmar que la PWA use el mismo tono. Las fugas de texto del detalle ya están en G-IA / H (badges/varDefs).

## SECCIÓN L — BUG FUNCIONAL: "Comparar activos" en Watchlist (el círculo de tilde no marca)
**Síntoma (Fernando):** en modo Comparar, tocar el **círculo de check** de un activo no lo marca; solo se marca tocando el resto de la card.
**Causa raíz (doble disparo de `wlToggleCompare`):**
- La **fila** tiene `onclick` inline que llama `wlToggleCompare(sym)` → `aurex-features.js:2213,2215` (`rowClick = isCompareMode ? 'wlToggleCompare(...)'`).
- El **círculo** (`:2218 <div data-wl-compare="sym" …>`) **no tiene `onclick` propio**, pero hay un **delegador global** en `document` que captura el click del círculo y llama `wlToggleCompare` OTRA VEZ → `:2809-2812`:
  ```
  var cmpEl = e.target.closest('[data-wl-compare]');
  if(cmpEl){ e.stopPropagation(); window.wlToggleCompare(cmpEl.getAttribute('data-wl-compare')); return; }
  ```
- Al tocar el círculo, burbujea: (1) dispara el `onclick` de la fila → marca; (2) llega a `document` → delegador → `wlToggleCompare` de nuevo → desmarca. Neto: **marca y desmarca = no pasa nada**. Tocando el resto de la card no hay `[data-wl-compare]` en el ancestro → solo dispara una vez → funciona.
**AJUSTE PROPUESTO:** eliminar UNA de las dos rutas. Recomendado: quitar la rama `[data-wl-compare]` del delegador (`:2811-2812`) — la fila ya cubre el círculo por burbujeo. (O, alternativamente, hacer que el `onclick` de la fila no dispare cuando `event.target.closest('[data-wl-compare]')`.) Verificar que tras el fix, tocar el círculo marque/desmarque una sola vez.
**Severidad:** ALTA (función no usable como se espera). No lo habíamos detectado ni Code ni Escritorio.

## SECCIÓN M — FLUJO FUNCIONAL de Alertas / Mis Alertas (probado en vivo, cuenta tester)
Probado en `cobrex.io/app` logueado (tester con 2 alertas en historial). Hallazgos reales:

### M1 · Pop "Mis Alertas" se corta abajo (BUG citado por Fernando) — ALTA
- **PWA:** overlay `index.html:~4231 'display:none;position:fixed;inset:0;…;align-items:flex-end;justify-content:center'` + card `'…max-height:85vh;border-radius:16px 16px 0 0;…'`. Bottom-sheet pegado al borde inferior **sin `padding-bottom: env(safe-area-inset-bottom)`** ni uso de `dvh`. En el teléfono el `inset:0`/`vh` llega más abajo del viewport visible → la parte de abajo (últimas alertas / contenido) queda **tapada por la barra del navegador / home bar** y se ve cortada.
- **AJUSTE:** anclar con `padding-bottom: env(safe-area-inset-bottom)`, usar `max-height: 85dvh` (o `100dvh`-safe), y/o `bottom:0` con altura calculada del viewport visible. Verificar en mobile real.

### M2 · El badge (círculo rojo) de la campana del header NO refleja las alertas sin leer — ALTA
- **Síntoma probado:** Mis Alertas dice "2 sin leer" pero `.cobrex-bell-badge` = "0" y **oculto**.
- **Causa:** `window.updateBells` (`index.html:4618-4620`) cuenta `_misAlertasData` sin leer, pero `cargarMisAlertas()+updateBells()` **solo se ejecutan en `boot()`** (DOMContentLoaded, `:4622`). La sesión de Supabase se restaura DESPUÉS del boot → en ese momento `_misAlertasData` está vacío → badge 0. No se vuelve a llamar al autenticar.
- **AJUSTE:** llamar `cargarMisAlertas().then(updateBells)` en `onAuthStateChange` (SIGNED_IN / INITIAL_SESSION), igual que se hizo con `loadUserPlan` (fix C4).

### M3 · El tipo de alerta se muestra crudo ("precio_objetivo")
- **PWA:** en el card de Mis Alertas se ve "precio_objetivo" (el valor de máquina) en vez de una etiqueta legible/traducida. Render en `index.html:4190+`.
- **AJUSTE:** mapear `tipo` → etiqueta `t()` ("Precio objetivo" / "Variación brusca" / etc.).

### M4 · (cross-ref C1) ítems sin color verde/rojo por dirección + flecha '•' (strings 'arriba/abajo').

### M5 · Selección por checkbox dentro del pop — OK (probado: `.ma-chk` se marca, `_misAlertasSel()` devuelve 1).

### M6 · PENDIENTE de prueba en DISPOSITIVO (no validable headless):
- Que la alerta MANUAL, al dispararse, genere: (a) el **emergente in-app**, (b) la notificación en el **centro de notificaciones del teléfono** (`showAlertNotification`, `aurex-features.js:631`, vía Service Worker), (c) que aparezca en el **listado de la campana** + sume al badge (depende de M2), y (d) marcar leída / borrar efectivamente. El disparo requiere movimiento de precio real → se valida en teléfono con una alerta puntual.

## SECCIÓN N — FLUJOS FUNCIONALES probados en vivo (cuenta tester FREE)
Cada uno ejecutado de verdad en `cobrex.io/app`, verificando POST al backend / cambio de estado. **Antes de marcar algo como bug, lo confirmé** (dos casos parecían fallar y eran gating correcto).

| Flujo | Resultado |
|---|---|
| **Agregar activo a Portfolio** (`addPortfolioItem`) | ✅ POST portfolio, el activo aparece. |
| **Crear alerta manual de precio** (`openCreateAlert` → `ca-go`) | ✅ POST `/api/alertas`. |
| **Filtros de ordenar** (`_sortCfgs`/`_applySort`) | ✅ aplica (config correcta, ver K). |
| **Crear nueva lista** (`wlCreateList`) | ✅ GATING correcto: FREE = límite 1 lista (`:1972-1975 checkPlanLimit`); el tester ya tiene 1 → paywall. NO es bug. *(Para probar la creación: cuenta bajo el límite.)* |
| **Agregar activo a Watchlist** (`wlAddAsset`) | ✅ POST `watchlist_items`. |
| **Comparar activos — círculo de tilde** | ❌ **BUG L confirmado por interacción**: click en el círculo → selección 0→0, no marca (doble disparo). |
| **15 toggles de alertas** | ✅ 15 presentes; FREE muestra **5 activos** (gating `applyAlertGating :4120`); los otros 10 `data-locked` no cambian al click (correcto). |
| **6 tabs** | ✅ las 6 renderizan. |
| **Sacar activo (Watchlist/Portfolio)** | ⏳ probando (`wlRemoveAsset`/`deletePortfolioItem`) — sirve también para limpiar los datos de prueba que cargué. |

**Pendiente prueba en DISPOSITIVO (no headless):** disparo real de alerta → emergente in-app + notificación del teléfono (`showAlertNotification`/SW) + suma al badge (depende de M2) + marcar leída/borrar (ver M).

**Nota de método:** los "fallos" #CrearLista y #Toggle resultaron ser **gating de plan correcto**, no bugs. Verificar antes de afirmar evita reportar falsos bugs.

## SECCIÓN O — GATING POR PLAN (FREE / PRO / ELITE) — validado en código + pantalla + flujo
Probado con `aurextester12` (FREE) y `fmoscon` (ELITE) en `cobrex.io/app`.

### Config (código) — PWA vs nativa
- **PWA** `index.html:3960-3963 PLAN_LIMITS_CLIENT`:
  - FREE: portfolioMax 5, watchlistMax 1, alertTypes ×8.
  - PRO: ∞ / ∞ / ×17.
  - ELITE: ∞ / ∞ / ×18 (suma `geopolitica_gdelt`).
- **Nativa** `lib/usePlan.js:4-6` (espejo del backend): FREE ×8, PRO ×17, ELITE ×18 — **idéntico a la PWA**. Límites FREE 5/1 = backend `server.js:1847`. ✅ Paridad.
- *Nota:* el backend `PLAN_LIMITS` enumera 6 alertTypes para FREE (sin `precio`/`porcentaje`); la app nativa (`usePlan.js`) y la PWA enumeran 8. Es el **mismo desajuste que ya existe en la nativa** (no es una divergencia de la PWA).

### Comportamiento (pantalla/flujo) — verificado
| | FREE | PRO | ELITE |
|---|---|---|---|
| portfolioMax | 5 | ∞ | ∞ |
| watchlistMax | 1 | ∞ | ∞ |
| paywall automático al entrar | **SÍ** | NO | NO |
| toggles desbloqueados / bloqueados | **5 / 10** | **14 / 1** | **15 / 0** |
| badge plan | PLAN FREE | PLAN PRO | PLAN ELITE |

- **FREE:** ✅ paywall aparece solo (C3); en el modal se pasa a PRO/ELITE (`planTab`) y muestra trial ("Quiero probar gratis 7 días / Luego $2.99/mes"); gating enforced: crear 2ª lista → bloqueada por límite 1 (`checkPlanLimit`, ver N); 10 toggles `data-locked`.
- **PRO:** ✅ (cuenta `app.aurex`, plan PRO) — portfolio/watchlist ∞, sin paywall, **14 toggles desbloqueados / 1 bloqueado = "Geopolítica GDELT"** (exclusiva ELITE). Exactamente lo esperado.
- **ELITE:** ✅ sin paywall, 15 toggles desbloqueados, ∞/∞.

**Veredicto gating:** ✅ correctamente seteado y alineado a la nativa para los **3 planes** (FREE/PRO/ELITE) — validado en código + pantalla + flujo. Lo que cada plan PUEDE y NO PUEDE acceder está bien.

### Flujos funcionales en PRO (control independiente Code, cuenta `app.aurex`)
- ✅ **Crear 2ª lista** — funciona (POST watchlists), sin el límite que bloquea a FREE.
- ✅ **Agregar varios activos a Portfolio** (ADA/DOT/LINK, 3 POST) — sin límite.
- ✅ **Togglear un evento que en FREE estaba bloqueado** (FED FOMC/CPI): `data-locked=0` y **el toggle cambia al click**. → confirma que el "toggle FREE que no cambiaba" era **gating correcto** (bloqueado), no un bug; cuando está desbloqueado, responde bien.
- ✅ 6 tabs renderizan.
- El **círculo de comparar** quedó sin probar en PRO (lista recién creada vacía), pero el **bug L es de código** (independiente del plan), ya confirmado en FREE.
- Limpieza: borré los datos de prueba cargados en `app.aurex` (3 activos + lista `PRO_QA`).

## SECCIÓN P — Consolidación con Escritorio (Issue #18, todo probado por él con FREE)

### COINCIDIMOS (lo mismo encontró Escritorio y yo):
- Pop Mis Alertas **cortado** (Escritorio: "40% inferior, sin scroll") = **M1**. ✅
- Sube/Baja **dorados** ambos = **I2**. ✅
- Tipo de alerta crudo "**precio_objetivo**" = **M3**. ✅
- **Badge** no se actualiza al marcar leídas (Escritorio: `alertasService.js:L93`, "solo refresh on focus") = **M2** (yo lo ubiqué en `updateBells`/boot, `index.html:4618-4622`). ✅ (mismo síntoma, causa complementaria).
- Modal de plan con **snake_case** ("cambio_senal") = **G-AL-1** (`index.html:950`). ✅

### ESCRITORIO encontró y yo NO (a verificar/incorporar):
- **F1 · "CRÍTICO: la papelera congela la app" → FALSO POSITIVO (verificado por Code).** Reproduje con **click real** en la papelera (cuenta FREE): NO congela. Lo que dispara es un **`confirm()` del navegador** ("¿Eliminar este activo del portfolio?"). El `confirm()` bloquea el renderer hasta que el usuario responde → la automatización de Escritorio, al no cerrar ese diálogo, vio "timeout 30s" y lo interpretó como freeze. **Para un usuario real funciona** (confirm → Eliminar → borra; test: frozen=false, app responsive, 0 errores). 
  - **PERO sí hay 2 diffs reales acá:** (a) el texto del `confirm()` está **hardcodeado en español** ("¿Eliminar este activo del portfolio?") → fuga i18n; (b) la nativa usa `Alert.alert('Eliminar','Eliminar?',[Cancelar/Eliminar])` (`PortfolioScreen.js:410-413`, traducido) en vez de un `confirm()` del navegador. AJUSTE: usar un modal propio traducido (como `wlDeleteList`) en vez de `confirm()` hardcodeado.
- **F1 · 6 activos en cuenta pero el modal dice "límite 5"** (inconsistencia de conteo).
- **F6 · Comparador doble $ — CONFIRMADO por Code (y en 3 filas, no 1).** `_fmt(n)` ya incluye el `$`; el comparador antepone OTRO `$`: `'$'+_fmt(p)` → `$$66.328,02`. Pasa en **Precio (`aurex-features.js:2670`), Objetivo (`:2672`) y Stop (`:2673`)**. AJUSTE: quitar el `'$'+` (dejar solo `_fmt(...)`) en las 3.
- **F5 · Modal de agregar (Watchlist) se desplaza/corta al abrir el teclado.**

### YO encontré y Escritorio NO:
- **L · Comparar: el CÍRCULO de tilde no marca** (doble disparo `wlToggleCompare`). **Escritorio dijo "comparar funciona" porque clickeó la CARD (que sí marca), no el círculo.** No es contradicción: la card funciona, el círculo no (lo confirmó Fernando). Escritorio NO probó el círculo.
- Headers ⚖️/timer/LIVE ocultos por `HIDE_HEADER_LEGAL` (**A**), posición campana por activo (**B**), estructura del paywall (**D**), formato de números `es-AR` (**F**), emojis Pulse (**G-Mercados**), **banderas** 🇦🇷/🇸🇦 (**J**), gating completo 3 planes (**O**), y varias fugas i18n (varDefs, "Solo favoritos", tipoLabel, etc.).

### Discrepancia a resaltar:
- **Comparar activos:** Escritorio ✅ "funciona" (click en card) vs Code ❌ bug L (click en círculo). Ambos ciertos → **el círculo está roto pero la card no**, por eso uno lo vio y el otro no. Hay que arreglar el círculo (L).

---
## ESTADO DE COBERTURA (para Escritorio)
**HECHO y verificado con líneas (cada cita leída en el código):**
- A — Headers (⚖️ balanza, timer "hace Xs", LIVE; ocultos por `HIDE_HEADER_LEGAL=true`).
- B / I1 — Campana por activo mal ubicada (Portfolio `:1000`, Watchlist `:2255`).
- C — Pop Mis Alertas sin verde/rojo + dirección con strings equivocados.
- I2 — Pop Crear Alerta: sube/baja en dorado (nativa verde/rojo).
- D / E — Paywall: nativa pantalla 3 tarjetas vs PWA modal pestañas + overlay translúcido (lo "todo negro").
- F — Formato de números `es-AR` fijo aun en inglés + re-render runtime.
- G-IA — "ALTA CONV-IA" sin i18n + badges dirección hardcode.
- G-Mercados — emojis Pulse distintos (😱/😰 vs 😨/😟; 😏/😊 inconsistente) + `tipoLabel` hardcode.
- G-Watchlist — colores/iconos/comparador OK; fugas conocidas (dirLabel `:2179`, "Ult. cierre" `:2250`).
- G-Alertas — iconos/colores OK; pop "alertas activas" con 15 labels hardcode (`:950`).
- G-Perfil — bloques OK; "Cómo usar" (M5) mal ubicado + icono 📖 vs ❓.
- J — Banderas: header 🇪🇸/🇦🇪 ❌ vs nativa 🇦🇷/🇸🇦; Preferencias 🇦🇷 ✓; códigos `es-ar` vs `es`.
- H1-H7 — Fugas i18n: ALTA CONV, "hace Xs", "Solo favoritos", `varDefs` IA `:2686`, "Ult. cierre" `:2250`, `tipoLabel` `:4174`, "Act. HH:MM" `:3826/:3972`.
- I5 — Cards de lista Watchlist OK.

- K — Pops restantes: menú "ordenar" (emoji fecha ⏰ vs 🕐), `listDot` OK, detalle de activo OK.

**ANÁLISIS COMPLETO.** Cubiertas las 6 pantallas (Portfolio, Mercados, Watchlist, IA, Alertas, Perfil) + headers + todos los pops (Mis Alertas, Crear Alerta, Paywall/Planes, Comparador, Ordenar, Cómo usar, detalle de activo) + banderas + formato de números + fugas i18n. Cada hallazgo con línea PWA ↔ línea nativa + ajuste técnico.

**RESUMEN DE LO QUE HAY QUE CORREGIR (para la versión post-deploy):**
1. Headers: ocultar ⚖️ y timer "hace Xs" (HIDE_HEADER_LEGAL); Portfolio sin LIVE en header. (A)
2. Campana por activo → fila inferior izquierda (Portfolio `:1000`, Watchlist `:2255`). (B/I1)
3. Pop Mis Alertas → borde verde/rojo por dirección + corregir strings 'arriba/abajo'. (C)
4. Pop Crear Alerta → verde (sube)/rojo (baja) en vez de dorado. (I2)
5. Paywall/Planes → rehacer como pantalla con 3 tarjetas apiladas + fondo opaco. (D/E)
6. Formato de números por idioma (no `es-AR` fijo). (F1)
7. Re-render de pantallas al cambiar idioma en runtime. (F2)
8. Banderas: `es → 🇦🇷`, `ar → 🇸🇦` en todos lados + unificar códigos. (J)
9. Emojis Pulse: 😨/😟 (no 😱/😰) + unificar 😏. (G-M-1)
10. "Cómo usar": mover a b3b (entre Mi cuenta y Preferencias) + icono ❓. (G-P)
11. Fugas i18n: badges IA, varDefs `:2686`, "Ult. cierre" `:2250`, tipoLabel `:4174`, "Solo favoritos" `:4266`, "ALTA CONV-IA" `:1807`, pop alertas activas `:950`, "Act." `:3826/:3972`, "ALTA CONV-IA" label. (G/H)
12. Menú ordenar: emoji fecha 🕐 (no ⏰). (K1)

**Regla:** nada se aplica ni se manda a Escritorio hasta el OK escrito de Fernando. Las correcciones se harán por versiones (v1, v2…) hasta quedar idéntico a v1.3.45.
