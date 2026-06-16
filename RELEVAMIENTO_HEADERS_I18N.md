# Relevamiento completo — Headers / i18n / layout (PWA vs Nativa)

Confirmado con código real + capturas en vivo (cobrex.io/app, login FREE) + referencia nativa (`~/AurexApp/src`).
Estado: producción = "Cobrex Web 1.6". NADA de esto se toca hasta el OK escrito de Fernando.

## A. Campana mal ubicada en los headers — raíz: `injectHeaderBells` (index.html:4681)

| Pantalla | Qué está mal (confirmado en captura) | Causa en código | Fix |
|---|---|---|---|
| **Alertas** | La campana está en una **fila propia abajo** → deja un **hueco vacío** entre el logo y "Mis Alertas" | 4685-4692: crea `.cobrex-bell-row` (justify-end) como primer hijo, separada del logo | Poner la campana en la línea del logo (`.aurex-hdr-added`), a la derecha (`margin-left:auto`) |
| **Perfil** | La campana queda pegada a "Cobrex Web 1.6", **no a la derecha** del header | 4668: se appendea sin `margin-left:auto` | `margin-left:auto` para empujarla al borde derecho |
| **IA** | Campana levemente fuera de línea (en fila de contadores) | 4667: `closest('div[style*="space-between"]')` agarra la fila equivocada | Apuntar a la fila del logo "Cobrex Señales IA · LIVE" |
| **Nativa** | `BellButton` va a la derecha del header, **misma línea** que el título | — | Patrón a replicar en las 6 pantallas |

## B. Balanza ⚖️ sigue en Watchlist — raíz: inyección aparte NO desactivada

- `_addLegalChip` está como no-op (features.js:5187, correcto), PERO la balanza de Watchlist se inyecta en un bloque **separado** (features.js:5116-5130) que quedó activo.
- Confirmado en captura: chip `⚖️▼` dorado visible en el header de Watchlist.
- **Fix:** no inyectar ese chip (la nativa oculta ⚖️ por `HIDE_HEADER_LEGAL=true`).

## C. LIVE + punto verde mal ubicado en Portfolio

- Hoy: LIVE está a la **derecha**, pegado al chip "Ordenar".
- Nativa (PortfolioScreen.js:868): la barra es `space-between` → **LIVE a la IZQUIERDA**, "Ordenar" a la derecha.
- **Fix:** mover el LIVE a la izquierda de esa barra.

## D. Traducción de Portfolio no es instantánea y deja partes en español

- Raíz: `setLang` (aurex-i18n.js:989) solo re-traduce los `[data-i18n]` estáticos. El contenido armado por JS (filas de activos, card **Termómetro de Riesgo**) **no se vuelve a dibujar** al cambiar idioma → por eso el delay y que queden cosas en español hasta navegar.
- Además "Acción"/"Cripto"/"Activo" están **hardcodeados en español** (aurex-v3.js:1461 y su gemelo en aurex-features.js).
- **Fix:** (1) volver i18n las etiquetas de tipo de activo; (2) registrar `onLangChange` que **re-dibuje** Portfolio (filas + Termómetro), no solo cuando está vacío (hoy features.js:920 solo re-dibuja si el portfolio está vacío).

## E. Bandera de "Español" = 🇦🇷 (debería ser 🇪🇸)

- Hoy: `flags={es:'🇦🇷',...}` (features.js:5164) + label "Español (Argentina)" (index.html:3214).
- Nativa: el selector de idioma (LanguageButton.js:11) usa **🇪🇸 Español**. El 🇦🇷 nativo es solo para formato de números (locale.js), no para la bandera del selector.
- **Fix:** usar 🇪🇸 para 'es' en el selector.

## F. Telegram en Alertas es texto, no un toggle

- Hoy: aparece como una palabra/texto.
- Nativa (AlertasScreen.js): usa `CustomSwitch` (toggle real) + estado `telegramConnected`.
- **Fix:** convertir la fila de Telegram en un toggle que se activa/desliza como los demás.

---

Todo esto se corrige junto, se valida con capturas pantalla-por-pantalla **al lado de la nativa**, y se le muestra a Fernando + Escritorio para el OK antes de publicar. No se declara "listo" — se muestran las pruebas y deciden ellos.
