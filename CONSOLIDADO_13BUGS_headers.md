# Consolidado — Auditoría headers/i18n (Escritorio 13 bugs × Code 6 frentes)

Cruce de la auditoría DOM-en-vivo de Escritorio (13 bugs) con el relevamiento de Code (frentes A-F).
Producción = "Cobrex Web 1.6". Coincidencia total, sin discrepancias de fondo. 2 ya resueltos en web-1.7.

| Escritorio | Frente Code | ¿Coinciden? | Estado / nota |
|---|---|---|---|
| **1** Card FREE sin badge "Plan actual" | (no estaba en A-F) | — | ✅ **YA ARREGLADO en web-1.7**: agregué `#free-plan-actual-badge` (se muestra si plan=FREE). Escritorio auditó 1.6, por eso no lo vio. |
| **2** Flash de Mercados antes del login | (no estaba en A-F) | — | ✅ **YA ARREGLADO en web-1.7**: `startApp(dest)` navega síncrono a Perfil (login), sin pasar por Mercados. |
| **3** Campana Portfolio entre logo y bandera (tapa idioma) | A | ✅ | `injectHeaderBells`/`headerOf` la mete en el grupo izquierdo. Fix: al extremo derecho del header. |
| **4** Campana Alertas en fila aparte (hueco) | A | ✅ | features.js:4685 crea `.cobrex-bell-row`. Fix: inline a la derecha del logo. |
| **5** Campana Perfil sin margin-left:auto | A | ✅ | Fix: `margin-left:auto`. |
| **6** Campana IA fila aparte (hueco) | A | ✅ | Mismo patrón que Alertas. Fix: línea del logo. |
| **7** Balanza ⚖️ en Watchlist | B | ✅ | Aclaración: el chip `⚖️▼` (features.js:5119-5130) abre **Aviso Legal** (`_openAvisoLegal`), no es selector de listas. Igual: hay que **no inyectarlo** (HIDE_HEADER_LEGAL). |
| **8** Chips "Accion"/"Cripto" no traducen | D | ✅ | **Dato útil de Escritorio**: las claves `mkt_tipo_accion`/`mkt_tipo_cripto` (8 idiomas) YA EXISTEN en aurex-i18n.js:464-465. Las filas hardcodean el texto en vez de usarlas. Fix: usar las claves + re-render. |
| **9** Termómetro de Riesgo no traduce | D | ✅ | Render JS sin i18n. Fix: i18n + re-render en onLangChange. |
| **10** Selector idioma no instantáneo (parcial) | D | ✅ | setLang no re-dibuja contenido JS. Fix: onLangChange → re-render Portfolio. |
| **11** Bandera "Español" = 🇦🇷 | E | ✅ | Nativa (LanguageButton.js:11) = 🇪🇸. Fix: 🇪🇸 para 'es'. |
| **12** LIVE Portfolio a la derecha | C | ✅ | **Dato útil**: existe `movePortfolioLive()` (index.html:4701-4715) que lo inserta como primer hijo del sort-bar, pero el sort-bar no es space-between. Nativa (PortfolioScreen.js:868): LIVE izquierda, Ordenar derecha. Fix: sort-bar `justify-content:space-between`. |
| **13** Telegram "Connect" texto, no toggle | F | ✅ | Nativa usa `CustomSwitch`. Fix: toggle activable. |

## Conclusión
- **11 de 13** = exactamente lo que relevó Code (frentes A-F), con detalles de código extra de Escritorio (claves i18n ya existen; función movePortfolioLive existe).
- **2 de 13** (badge FREE + flash) ya están resueltos en web-1.7 (no deployado).
- 0 discrepancias. Una sola corrección menor: el ⚖️ de Watchlist es el chip de Aviso Legal, no un selector de listas.

Plan: corregir los 11 restantes sobre web-1.7 (que ya trae el badge + el flash + el flujo de planes 1.6), validar con capturas pantalla-por-pantalla vs nativa, mostrar a Fernando + Escritorio, y deployar solo con OK escrito.
