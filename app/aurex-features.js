/* v=1774807550559 */
// Cache inmediato: renderizar portfolio del cache al iniciar (sin esperar auth/fetch)
(function _loadPortCacheImmediate(){
  try {
    var cached = JSON.parse(localStorage.getItem('aurex_port_items_cache') || 'null');
    // Restaurar precios cacheados ANTES de renderizar
    var cachedPrices = JSON.parse(localStorage.getItem('aurex_pc_prices_cache') || 'null');
    var cachedChange24 = JSON.parse(localStorage.getItem('aurex_pc_change24_cache') || 'null');
    var cachedIAPrecios = JSON.parse(localStorage.getItem('aurex_ia_precios_cache') || 'null');
    if (cachedPrices) window._pcPrices = cachedPrices;
    if (cachedChange24) window._pcChange24 = cachedChange24;
    if (cachedIAPrecios) window._IA_PRECIOS = cachedIAPrecios;
    var cachedMktState = JSON.parse(localStorage.getItem('aurex_pc_mktstate_cache') || 'null');
    if (cachedMktState) window._pcMarketState = cachedMktState;
    if (cached && cached.length > 0) {
      window._portItemsCached = cached;
      function _restoreFromCache(){
        // Restore header inmediato
        try {
          var hdr = JSON.parse(localStorage.getItem('aurex_port_header_cache') || 'null');
          if (hdr) {
            var el = function(id){ return document.getElementById(id); };
            if(el('port-total') && hdr.total) el('port-total').textContent = hdr.total;
            if(el('port-pnl-usd') && hdr.pnlUsd){ el('port-pnl-usd').textContent = hdr.pnlUsd; el('port-pnl-usd').style.color = hdr.pnlUsdColor || ''; }
            if(el('port-pnl-pct') && hdr.pnlPct){ el('port-pnl-pct').textContent = hdr.pnlPct; el('port-pnl-pct').style.color = hdr.pnlPctColor || ''; }
            if(el('port-cnt-badge') && hdr.cnt) el('port-cnt-badge').textContent = hdr.cnt;
            // Hoy y emoji se restauran después de que _initHoyIndicator los cree
            if(hdr.hoyPct || hdr.emoji) {
              window._cachedHoy = hdr;
            }
          }
        } catch(e){}
        if (!window._portItems || window._portItems.length === 0) {
          if (typeof _renderPortfolioItems === 'function') _renderPortfolioItems(cached);
        }
      }
      // DOM puede ya estar listo (script cargado vía document.write)
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _restoreFromCache);
      } else {
        _restoreFromCache();
      }
    }
  } catch(e){}
})();
/* _fmt(n, tipo) - formato visual de numeros segun idioma del usuario
   tipos: 'precio' | 'pct' | 'usd' | 'qty'
   Solo usar en capa visual - NUNCA en calculos
*/
// Buscar activo en TODAS las secciones (IA_ACTIVOS + comm + metales + futuros + etfs)
// Idéntico a nativa ALL_ASSETS — busca por símbolo en todas las categorías
window._findAssetGlobal = function(sym) {
  if(!sym) return null;
  var acts = window._IA_ACTIVOS || [];
  for(var i=0;i<acts.length;i++){ if(acts[i].s===sym) return acts[i]; }
  // Buscar en datos extra (comm, metales, futuros, etfs, bonos)
  var d = window._mktDataSections;
  if(d){
    var sections = ['comm','metales','futuros','bonos','etf','divisas'];
    for(var si=0;si<sections.length;si++){
      var sec = d[sections[si]];
      if(sec){ for(var j=0;j<sec.length;j++){ if(sec[j].s===sym) return sec[j]; } }
    }
    // acciones por país
    if(d.acciones){
      var paises = Object.keys(d.acciones);
      for(var pi=0;pi<paises.length;pi++){
        var arr = d.acciones[paises[pi]];
        if(arr){ for(var k=0;k<arr.length;k++){ if(arr[k].s===sym) return arr[k]; } }
      }
    }
  }
  return null;
};

// F1 (web-1.4): locale de número según idioma activo. LATAM (es/pt/fr/it) → es-AR (coma decimal); resto (en/zh/hi/ar) → en-US (punto). = nativa lib/locale.js.
window._numLocale = function(){ var l=(window._i18n&&window._i18n.getLang)?window._i18n.getLang():'es'; return ['es','pt','fr','it'].indexOf(l)!==-1?'es-AR':'en-US'; };

function _fmt(n, tipo) {
  if (n === null || n === undefined || isNaN(n)) return '--';
  // F1 (web-1.4): formato según idioma activo (= nativa lib/locale.js). LATAM (es-AR/pt-BR/fr-FR/it-IT) → coma decimal; resto (en/zh/hi/ar) → punto.
  var _lang = (window._i18n && window._i18n.getLang) ? window._i18n.getLang() : 'es';
  var isLatam = ['es','pt','fr','it'].indexOf(_lang) !== -1;
  var sep = isLatam
    ? { thousands: '.', decimal: ',' }
    : { thousands: ',', decimal: '.' };
  function applyFormat(num, decimals) {
    var fixed = Math.abs(num).toFixed(decimals);
    var parts = fixed.split('.');
    var intPart = parts[0];
    var decPart = parts[1] || '';
    var intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep.thousands);
    var result = decPart.length > 0
      ? intFormatted + sep.decimal + decPart
      : intFormatted;
    return (num < 0 ? '-' : '') + result;
  }
  if (tipo === 'qty') return applyFormat(n, 0);
  if (tipo === 'pct') { var sign = n >= 0 ? '+' : ''; return sign + applyFormat(n, 2) + '%'; }
  if (tipo === 'usd') return '$' + applyFormat(n, 2);
  var abs = Math.abs(n);
  var dec;
  if (abs >= 1000)        dec = 2;
  else if (abs >= 1)      dec = 2;
  else if (abs >= 0.01)   dec = 4;
  else if (abs >= 0.0001) dec = 6;
  else                    dec = 8;
  return '$' + applyFormat(n, dec);
}


(function(){var p=new URLSearchParams(window.location.search);if(p.get('resetOnboarding')==='1'){['aurex_onboarding_done','onboardingDone','aurex_onboarding','onboarding_done'].forEach(function(k){localStorage.removeItem(k);});var u=new URL(window.location.href);u.searchParams.delete('resetOnboarding');history.replaceState(null,'',u.toString());}})();
var BACKEND_URL='https://aurex-app-production.up.railway.app';
var USER_WA=localStorage.getItem('aurex_wa_numero')||'';
function saveWANumero(n){USER_WA=n;localStorage.setItem('aurex_wa_numero',n);}
var obPlan='FREE';
function obSelectPlan(p){obPlan=p;var ids={'FREE':'obpf','PRO':'obpp','ELITE':'obpe'};Object.keys(ids).forEach(function(k){var el=document.getElementById(ids[k]);if(!el)return;el.style.border=k===p?'2px solid '+(k==='PRO'?'#A78BFA':'var(--gold)'):'1px solid #2E2E45';});}
function obNext(s){['obs1','obs2','obs3','obs4'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});var el=document.getElementById('obs'+s);if(el)el.style.display='flex';}
function obFinish(){var n=(document.getElementById('ob-nombre')||{}).value||'',w=(document.getElementById('ob-wa')||{}).value||'';if(n)localStorage.setItem('aurex_nombre',n);if(w){localStorage.setItem('aurex_wa_numero',w);saveWANumero(w);}localStorage.setItem('aurex_plan',obPlan);localStorage.setItem('aurex_onboarding_done','1');var ob=document.getElementById('onboarding');if(ob){ob.style.transition='opacity 0.4s';ob.style.opacity='0';setTimeout(function(){ob.style.display='none';var ph2=document.querySelector('.phone');if(ph2)ph2.style.display='flex';;},400);}setTimeout(function(){var b=document.createElement('div');b.style.cssText='position:fixed;top:60px;left:0;right:0;z-index:9999;margin:0 12px;background:linear-gradient(135deg,#16A34A,#22C55E);border-radius:12px;padding:14px 16px;color:white;font-size:14px;font-weight:600;text-align:center';b.textContent=(window._i18n?window._i18n.t('pw_bienvenido'):'Bienvenido')+(n?', '+n:'')+(window._i18n?window._i18n.t('pw_cobrex_listo'):'! Cobrex esta listo.');document.body.appendChild(b);setTimeout(function(){b.remove();},4000);},500);}
function initOnboarding(){if(localStorage.getItem('aurex_onboarding_done'))return;var ob=document.getElementById('onboarding');if(!ob)return;ob.style.display='block';var ph=document.querySelector('.phone');if(ph)ph.style.display='none';;var w=document.getElementById('ob-wa');if(w&&localStorage.getItem('aurex_wa_numero'))w.value=localStorage.getItem('aurex_wa_numero');var nEl=document.getElementById('ob-nombre');if(nEl&&localStorage.getItem('aurex_nombre'))nEl.value=localStorage.getItem('aurex_nombre');}
setTimeout(initOnboarding,800);
function initConstellacion(){var container=document.getElementById('ob-stars');var svg=document.getElementById('ob-clines');if(!container||!svg)return;var W=container.offsetWidth||window.innerWidth;var H=container.offsetHeight||window.innerHeight;svg.setAttribute('viewBox','0 0 '+W+' '+H);var stars=[];for(var i=0;i<28;i++){var x=Math.random()*W;var y=Math.random()*H;var size=Math.random()*2+1;var delay=Math.random()*3;var dur=Math.random()*2+1.5;stars.push({x:x,y:y});var s=document.createElement('div');s.style.cssText='position:absolute;border-radius:50%;background:#F5C842;width:'+size+'px;height:'+size+'px;left:'+x+'px;top:'+y+'px;animation:starPulse '+dur+'s '+delay+'s ease-in-out infinite;opacity:0.6;';container.appendChild(s);}for(var a=0;a<stars.length;a++){for(var b=a+1;b<stars.length;b++){var dx=stars[a].x-stars[b].x;var dy=stars[a].y-stars[b].y;var dist=Math.sqrt(dx*dx+dy*dy);if(dist<90){var op=(1-dist/90)*0.25;var l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',stars[a].x);l.setAttribute('y1',stars[a].y);l.setAttribute('x2',stars[b].x);l.setAttribute('y2',stars[b].y);l.setAttribute('stroke','var(--gold)');l.setAttribute('stroke-width','0.5');l.setAttribute('opacity',op);svg.appendChild(l);}}}};
setTimeout(initConstellacion,900);
var YF_MAP={'AAPL':{tab:'acciones',pais:'usa',s:'AAPL'},'NVDA':{tab:'acciones',pais:'usa',s:'NVDA'},'MSFT':{tab:'acciones',pais:'usa',s:'MSFT'},'TSLA':{tab:'acciones',pais:'usa',s:'TSLA'},'META':{tab:'acciones',pais:'usa',s:'META'},'GOOGL':{tab:'acciones',pais:'usa',s:'GOOGL'},'AMZN':{tab:'acciones',pais:'usa',s:'AMZN'},'GGAL':{tab:'acciones',pais:'arg',s:'GGAL'},'YPF':{tab:'acciones',pais:'arg',s:'YPF'},'VALE':{tab:'acciones',pais:'br',s:'VALE3'},'PBR':{tab:'acciones',pais:'br',s:'PETR4'},'SPY':{tab:'etf',s:'SPY'},'QQQ':{tab:'etf',s:'QQQ'},'GLD':{tab:'etf',s:'GLD'},'GC=F':{tab:'comm',s:'XAU'},'SI=F':{tab:'comm',s:'XAG'},'CL=F':{tab:'comm',s:'WTI'},'ES=F':{tab:'futuros',s:'ES1!'},'NQ=F':{tab:'futuros',s:'NQ1!'},'EURUSD=X':{tab:'divisas',s:'EUR/USD'}}
// === DATA: items de cada tab de Mercados ===
var DATA={
  cripto: [
    {s:'BTC',n:'Bitcoin',tab:'cripto'},{s:'ETH',n:'Ethereum',tab:'cripto'},{s:'SOL',n:'Solana',tab:'cripto'},
    {s:'BNB',n:'BNB',tab:'cripto'},{s:'XRP',n:'XRP',tab:'cripto'},{s:'ADA',n:'Cardano',tab:'cripto'},
    {s:'AVAX',n:'Avalanche',tab:'cripto'},{s:'DOT',n:'Polkadot',tab:'cripto'},{s:'LINK',n:'Chainlink',tab:'cripto'},
    {s:'MATIC',n:'Polygon',tab:'cripto'},{s:'DOGE',n:'Dogecoin',tab:'cripto'},{s:'SHIB',n:'Shiba Inu',tab:'cripto'},
    {s:'LTC',n:'Litecoin',tab:'cripto'},{s:'UNI',n:'Uniswap',tab:'cripto'},{s:'ATOM',n:'Cosmos',tab:'cripto'},
    {s:'ETC',n:'Ethereum Classic',tab:'cripto'},{s:'XLM',n:'Stellar',tab:'cripto'},{s:'ALGO',n:'Algorand',tab:'cripto'},
    {s:'ICP',n:'Internet Computer',tab:'cripto'},{s:'FIL',n:'Filecoin',tab:'cripto'},{s:'HBAR',n:'Hedera',tab:'cripto'},
    {s:'VET',n:'VeChain',tab:'cripto'},{s:'SAND',n:'The Sandbox',tab:'cripto'},{s:'MANA',n:'Decentraland',tab:'cripto'},
    {s:'THETA',n:'Theta Network',tab:'cripto'},{s:'AAVE',n:'Aave',tab:'cripto'},{s:'MKR',n:'Maker',tab:'cripto'},
    {s:'GRT',n:'The Graph',tab:'cripto'},{s:'SNX',n:'Synthetix',tab:'cripto'},{s:'COMP',n:'Compound',tab:'cripto'},
    {s:'CRV',n:'Curve DAO',tab:'cripto'},{s:'1INCH',n:'1inch',tab:'cripto'},{s:'LDO',n:'Lido DAO',tab:'cripto'},
    {s:'ARB',n:'Arbitrum',tab:'cripto'},{s:'OP',n:'Optimism',tab:'cripto'},{s:'IMX',n:'Immutable X',tab:'cripto'},
    {s:'APT',n:'Aptos',tab:'cripto'},{s:'SUI',n:'Sui',tab:'cripto'},{s:'SEI',n:'Sei',tab:'cripto'},
    {s:'INJ',n:'Injective',tab:'cripto'},{s:'TIA',n:'Celestia',tab:'cripto'},{s:'JUP',n:'Jupiter',tab:'cripto'},
    {s:'NEAR',n:'NEAR Protocol',tab:'cripto'},{s:'FTM',n:'Fantom',tab:'cripto'},{s:'ROSE',n:'Oasis Network',tab:'cripto'},
    {s:'ZEC',n:'Zcash',tab:'cripto'},{s:'DASH',n:'Dash',tab:'cripto'},{s:'XMR',n:'Monero',tab:'cripto'},
    {s:'BCH',n:'Bitcoin Cash',tab:'cripto'},{s:'TON',n:'Toncoin',tab:'cripto'}
  ],
  stable: [
    {s:'USDT',n:'Tether',tab:'stable'},{s:'USDC',n:'USD Coin',tab:'stable'},{s:'DAI',n:'Dai',tab:'stable'}
  ],
  acciones: {
    usa: [
      {s:'AAPL',n:'Apple'},{s:'NVDA',n:'NVIDIA'},{s:'MSFT',n:'Microsoft'},{s:'GOOGL',n:'Alphabet A'},
      {s:'AMZN',n:'Amazon'},{s:'META',n:'Meta'},{s:'TSLA',n:'Tesla'},{s:'AVGO',n:'Broadcom'},
      {s:'ORCL',n:'Oracle'},{s:'JPM',n:'JPMorgan'},{s:'V',n:'Visa'},{s:'MA',n:'Mastercard'},
      {s:'BAC',n:'Bank of America'},{s:'WFC',n:'Wells Fargo'},{s:'GS',n:'Goldman Sachs'},
      {s:'MS',n:'Morgan Stanley'},{s:'AXP',n:'AmEx'},{s:'BLK',n:'BlackRock'},{s:'SCHW',n:'Schwab'},
      {s:'LLY',n:'Eli Lilly'},{s:'UNH',n:'UnitedHealth'},{s:'JNJ',n:'J&J'},{s:'MRK',n:'Merck'},
      {s:'ABBV',n:'AbbVie'},{s:'PFE',n:'Pfizer'},{s:'TMO',n:'Thermo Fisher'},{s:'ABT',n:'Abbott'},
      {s:'COST',n:'Costco'},{s:'WMT',n:'Walmart'},{s:'HD',n:'Home Depot'},{s:'PG',n:'Procter Gamble'},
      {s:'KO',n:'Coca-Cola'},{s:'PEP',n:'PepsiCo'},{s:'MCD',n:'McDonalds'},{s:'SBUX',n:'Starbucks'},
      {s:'NKE',n:'Nike'},{s:'AMD',n:'AMD'},{s:'INTC',n:'Intel'},{s:'QCOM',n:'Qualcomm'},
      {s:'TXN',n:'Texas Instruments'},{s:'AMAT',n:'Applied Materials'},{s:'MU',n:'Micron'},
      {s:'NFLX',n:'Netflix'},{s:'DIS',n:'Disney'},{s:'SPOT',n:'Spotify'},{s:'COIN',n:'Coinbase'},
      {s:'HOOD',n:'Robinhood'},{s:'PYPL',n:'PayPal'},{s:'SQ',n:'Block'},{s:'MSTR',n:'MicroStrategy'},
      {s:'MARA',n:'Marathon Digital'},{s:'RIOT',n:'Riot Platforms'},{s:'PLTR',n:'Palantir'},
      {s:'ARM',n:'ARM Holdings'},{s:'SMCI',n:'Super Micro'},{s:'AI',n:'C3.ai'},
      {s:'UBER',n:'Uber'},{s:'ABNB',n:'Airbnb'},{s:'DASH',n:'DoorDash'},
      {s:'XOM',n:'ExxonMobil'},{s:'CVX',n:'Chevron'},{s:'COP',n:'ConocoPhillips'},
      {s:'F',n:'Ford'},{s:'GM',n:'General Motors'},{s:'RIVN',n:'Rivian'},
      {s:'BA',n:'Boeing'},{s:'CAT',n:'Caterpillar'},{s:'GE',n:'GE Aerospace'},
      {s:'RTX',n:'RTX Corp'},{s:'LMT',n:'Lockheed Martin'},{s:'T',n:'AT&T'},
      {s:'VZ',n:'Verizon'},{s:'TMUS',n:'T-Mobile'},{s:'CMCSA',n:'Comcast'},
      {s:'AMT',n:'American Tower'},{s:'PLD',n:'Prologis'},{s:'BRK-B',n:'Berkshire B'},
      {s:'SPGI',n:'S&P Global'},{s:'BX',n:'Blackstone'},{s:'NDAQ',n:'Nasdaq Inc'},
      {s:'NOW',n:'ServiceNow'},{s:'CRM',n:'Salesforce'},{s:'ADBE',n:'Adobe'},
      {s:'BABA',n:'Alibaba ADR'},{s:'RBLX',n:'Roblox'},{s:'LYFT',n:'Lyft'},
      {s:'SOUN',n:'SoundHound AI'},{s:'LCID',n:'Lucid Motors'},{s:'SLB',n:'Schlumberger'},
      {s:'EOG',n:'EOG Resources'},{s:'DHR',n:'Danaher'},{s:'BMY',n:'Bristol Myers'},
      {s:'TGT',n:'Target'},{s:'LRCX',n:'Lam Research'}
    ],
    arg: [
      {s:'GGAL',n:'Galicia'},{s:'YPF',n:'YPF'},{s:'BMA',n:'Banco Macro'},{s:'CEPU',n:'Central Puerto'},
      {s:'PAMP',n:'Pampa Energia'},{s:'LOMA',n:'Loma Negra'},{s:'SUPV',n:'Supervielle'},
      {s:'BBAR',n:'BBVA Argentina'},{s:'TECO2',n:'Telecom Argentina'},{s:'TXAR',n:'Ternium Argentina'},
      {s:'CRES',n:'Cresud'},{s:'IRSA',n:'IRSA'},{s:'BYMA',n:'Bolsas y Mercados'},
      {s:'HARG',n:'Holcim Argentina'},{s:'DGCU2',n:'Distribuidora Gas'},{s:'TRAN',n:'Transener'},
      {s:'EDN',n:'Edenor'},{s:'COME',n:'Sociedad Comercial'},{s:'AUSO',n:'Autopistas Urbanas'},
      {s:'BOLT',n:'Boldt'},{s:'INVJ',n:'Inversiones y Representaciones'},{s:'MOLI',n:'Molinos Rio'},
      {s:'SAMI',n:'San Miguel'},{s:'RICH',n:'Laboratorio Richmond'},{s:'METR',n:'Metrogas'},{s:'DESP',n:'Despegar'}
    ],
    brasil: [
      {s:'PBR',n:'Petrobras'},{s:'VALE',n:'Vale'},{s:'ITUB',n:'Itau Unibanco'},{s:'BBD',n:'Bradesco'},
      {s:'ABEV',n:'Ambev'},{s:'ERJ',n:'Embraer'},{s:'BRFS',n:'BRF Foods'},{s:'VTEX',n:'VTEX'},
      {s:'NU',n:'Nubank'},{s:'MELI',n:'MercadoLibre'},{s:'XP',n:'XP Inc'},{s:'STNE',n:'StoneCo'},
      {s:'PAGS',n:'PagSeguro'},{s:'ARCO',n:'Arcos Dorados'},{s:'CIB',n:'Bancolombia'},{s:'SQM',n:'SQM Chile'},{s:'BSAC',n:'Banco Santander Chile'},
      {s:'IFS',n:'Intercorp Financial'},{s:'BAP',n:'Credicorp Peru'},
      {s:'VNET',n:'21Vianet Group'},{s:'CPFE3.SA',n:'CPFL Energia'},
      {s:'WEGE3.SA',n:'WEG SA'},{s:'RENT3.SA',n:'Localiza'},{s:'RAIL3.SA',n:'Rumo Logistica'}
    ],
    europa: [
      {s:'ASML',n:'ASML'},{s:'SAP',n:'SAP'},{s:'NVS',n:'Novartis'},{s:'NSRGY',n:'Nestle'},
      {s:'RHHBY',n:'Roche'},{s:'VWAGY',n:'Volkswagen'},{s:'SIEGY',n:'Siemens'},
      {s:'SHEL',n:'Shell'},{s:'BP',n:'BP'},{s:'GSK',n:'GSK'},{s:'UL',n:'Unilever'},
      {s:'RIO',n:'Rio Tinto'},{s:'BHP',n:'BHP Group'},{s:'AZN',n:'AstraZeneca'},
      {s:'HSBC',n:'HSBC'},{s:'STM',n:'STMicroelectronics'},{s:'EADSF',n:'Airbus'},
      {s:'IDEXY',n:'Inditex/Zara'},{s:'LVMUY',n:'LVMH'},{s:'SAN',n:'Santander'},
      {s:'BBVA',n:'BBVA'},{s:'ALIZF',n:'Allianz'},{s:'BAYZF',n:'Bayer'},
      {s:'HNNMY',n:'H&M'},{s:'INGA',n:'ING Group'}
    ],
    japon: [
      {s:'TM',n:'Toyota'},{s:'SONY',n:'Sony'},{s:'HMC',n:'Honda'},{s:'NTDOY',n:'Nintendo'},
      {s:'SFTBY',n:'SoftBank'},{s:'7267.T',n:'Honda Motor'},{s:'6758.T',n:'Sony Group'},
      {s:'9984.T',n:'SoftBank Group'},{s:'7203.T',n:'Toyota Motor'},{s:'6861.T',n:'Keyence'},
      {s:'6367.T',n:'Daikin'},{s:'8306.T',n:'Mitsubishi UFJ'},{s:'9432.T',n:'NTT'},
      {s:'7974.T',n:'Nintendo Co'},{s:'6501.T',n:'Hitachi'},{s:'6702.T',n:'Fujitsu'},
      {s:'4519.T',n:'Chugai Pharma'},{s:'2914.T',n:'Japan Tobacco'},{s:'8058.T',n:'Mitsubishi Corp'},
      {s:'6594.T',n:'Nidec'}
    ],
    china: [
      {s:'BABA',n:'Alibaba'},{s:'BIDU',n:'Baidu'},{s:'JD',n:'JD.com'},{s:'PDD',n:'PDD Holdings'},
      {s:'NTES',n:'NetEase'},{s:'XPEV',n:'XPeng'},{s:'NIO',n:'NIO'},{s:'LI',n:'Li Auto'},
      {s:'TCEHY',n:'Tencent'},{s:'9988.HK',n:'Alibaba HK'},{s:'0700.HK',n:'Tencent HK'},
      {s:'3690.HK',n:'Meituan'},{s:'9618.HK',n:'JD HK'},{s:'2318.HK',n:'Ping An'},
      {s:'1398.HK',n:'ICBC'},{s:'0941.HK',n:'China Mobile'},{s:'2628.HK',n:'China Life'},
      {s:'0388.HK',n:'HK Exchanges'},{s:'1810.HK',n:'Xiaomi'},{s:'9999.HK',n:'NetEase HK'}
    ]
  },
  etf: [
    {s:'SPY',n:'S&P 500 ETF'},{s:'QQQ',n:'Nasdaq 100'},{s:'IWM',n:'Russell 2000'},
    {s:'VTI',n:'Total Market'},{s:'VOO',n:'Vanguard S&P'},{s:'DIA',n:'Dow Jones'},
    {s:'GLD',n:'Gold ETF'},{s:'SLV',n:'Silver ETF'},{s:'IAU',n:'iShares Gold'},
    {s:'GDX',n:'Gold Miners'},{s:'GDXJ',n:'Jr Gold Miners'},
    {s:'IBIT',n:'iShares Bitcoin'},{s:'GBTC',n:'Grayscale BTC'},{s:'BITO',n:'Bitcoin Futures'},
    {s:'TLT',n:'US 20Y Bond'},{s:'IEF',n:'US 7-10Y Bond'},{s:'SHY',n:'US 1-3Y Bond'},
    {s:'HYG',n:'High Yield Bond'},{s:'LQD',n:'Inv Grade Corp'},{s:'EMB',n:'Emerging Bonds'},
    {s:'XLE',n:'Energy ETF'},{s:'XLF',n:'Financial ETF'},{s:'XLK',n:'Tech ETF'},
    {s:'XLV',n:'Health ETF'},{s:'XLI',n:'Industrial ETF'},{s:'XLP',n:'Consumer Staples'},
    {s:'ARKK',n:'ARK Innovation'},{s:'ARKG',n:'ARK Genomic'},{s:'ARKW',n:'ARK Web 3.0'},
    {s:'EEM',n:'Emerging Markets'},{s:'EWZ',n:'Brazil ETF'},{s:'FXI',n:'China ETF'},
    {s:'EWJ',n:'Japan ETF'},{s:'VGK',n:'Europe ETF'},{s:'EWG',n:'Germany ETF'},
    {s:'PDBC',n:'Diversified Comm'},{s:'USO',n:'Oil ETF'},{s:'UNG',n:'Natural Gas ETF'},
    {s:'CPER',n:'Copper ETF'},{s:'DBB',n:'Base Metals ETF'}
  ],
  comm: [
    {s:'GC=F',n:'Oro Futuro'},{s:'CL=F',n:'Petroleo WTI'},{s:'SI=F',n:'Plata Futuro'},
    {s:'NG=F',n:'Gas Natural'},{s:'HG=F',n:'Cobre Futuro'},{s:'BZ=F',n:'Brent Crude'},
    {s:'RB=F',n:'Nafta RBOB'},{s:'KC=F',n:'Cafe Futuro'},{s:'SB=F',n:'Azucar Futuro'},
    {s:'CC=F',n:'Cacao Futuro'},{s:'ZW=F',n:'Trigo Futuro'},{s:'ZC=F',n:'Maiz Futuro'},
    {s:'ZS=F',n:'Soja Futuro'},{s:'CT=F',n:'Algodon Futuro'},{s:'LE=F',n:'Ganado Futuro'},
    {s:'HE=F',n:'Cerdo Futuro'},{s:'LBS=F',n:'Madera Futuro'},{s:'OJ=F',n:'Jugo Naranja'},
    {s:'JO',n:'Cafe ETN'},{s:'WEAT',n:'Trigo ETF'}
  ],
  metales: [
    {s:'GLD',n:'Oro'},{s:'SLV',n:'Plata'},{s:'CPER',n:'Cobre ETF'},{s:'PPLT',n:'Platino ETF'},
    {s:'PALL',n:'Paladio ETF'},{s:'JJU',n:'Aluminio ETF'},{s:'JJZ',n:'Zinc ETF'},
    {s:'SLX',n:'Steel/Hierro ETF'},{s:'DBB',n:'Base Metals ETF'},{s:'ALUM',n:'Aluminio'}
  ],
  futuros: [
    {s:'ES=F',n:'S&P 500 Fut'},{s:'NQ=F',n:'Nasdaq Fut'},{s:'YM=F',n:'Dow Fut'},
    {s:'RTY=F',n:'Russell Fut'},{s:'GC=F',n:'Oro Fut'},{s:'SI=F',n:'Plata Fut'},
    {s:'CL=F',n:'WTI Crude Fut'},{s:'BZ=F',n:'Brent Fut'},{s:'NG=F',n:'Gas Natural Fut'},
    {s:'ZB=F',n:'T-Bond Fut'},{s:'ZN=F',n:'T-Note 10Y Fut'},{s:'ZF=F',n:'T-Note 5Y Fut'},
    {s:'HG=F',n:'Cobre Fut'},{s:'VX=F',n:'VIX Fut'},{s:'DX=F',n:'Dolar Index Fut'},
    {s:'6E=F',n:'Euro Fut'},{s:'6J=F',n:'Yen Fut'},{s:'6B=F',n:'Libra Fut'},
    {s:'ZC=F',n:'Maiz Fut'},{s:'ZS=F',n:'Soja Fut'}
  ],
  bonos: [
    {s:'TLT',n:'US 20Y Bond'},{s:'IEF',n:'US 7-10Y Bond'},{s:'SHY',n:'US 1-3Y Bond'},
    {s:'HYG',n:'High Yield'},{s:'LQD',n:'Inv Grade Corp'},{s:'AGG',n:'US Bond Agg'},
    {s:'EMB',n:'Emerging Bonds'},{s:'BND',n:'Total Bond ETF'},{s:'TIP',n:'TIPS Inflation'},
    {s:'JNK',n:'Junk Bonds'},{s:'MUB',n:'Muni Bond ETF'},{s:'BNDX',n:'Intl Bond ETF'},
    {s:'AL30',n:'Bono ARG 2030'},{s:'GD30',n:'Global ARG 2030'},{s:'AL35',n:'Bono ARG 2035'}
  ],
  divisas: [
    {s:'EURUSD=X',n:'EUR/USD'},{s:'USDJPY=X',n:'USD/JPY'},{s:'GBPUSD=X',n:'GBP/USD'},
    {s:'USDCNY=X',n:'USD/CNY'},{s:'USDARS=X',n:'USD/ARS'}
  ]
};
var _activeTab='cripto', _activePais='usa';

// === RENDER: dibuja los items en #cnt ===
function _buildSparklineSVG(closes, isUp) {
  if(!closes||closes.length<2) return '<div style="width:64px;height:28px;"></div>';
  var W=64,H=28,pad=2;
  var min=Math.min.apply(null,closes),max=Math.max.apply(null,closes),range=max-min||1;
  var pts=closes.map(function(v,i){var x=pad+(i/(closes.length-1))*(W-pad*2);var y=H-pad-((v-min)/range)*(H-pad*2);return x.toFixed(1)+','+y.toFixed(1);});
  var color=isUp?'var(--green)':'var(--red)';
  var gid='sg'+(isUp?'g':'r')+Math.floor(Math.random()*9999);
  var areaPath='M'+pts[0]+' L'+pts.join(' L')+' L'+(W-pad).toFixed(1)+','+(H-pad)+' L'+pad.toFixed(1)+','+(H-pad)+' Z';
  return '<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" style="overflow:visible;display:block"><defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="'+color+'" stop-opacity="0.3"/><stop offset="100%" stop-color="'+color+'" stop-opacity="0"/></linearGradient></defs><path d="'+areaPath+'" fill="url(#'+gid+')" /><polyline points="'+pts.join(' ')+'" fill="none" stroke="'+color+'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function _buildDotsHTML(scores) {
  if(!scores) return '';
  var keys=['tendencia','rsi','volumen','volatilidad','correlacion','oro_petroleo','macro','earnings','macd','soporte_resist'];
  var dots='';
  keys.forEach(function(k){var v=scores[k]||0;if(v>0.01)dots+='<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--green);margin:0 1px;flex-shrink:0"></span>';else if(v<-0.01)dots+='<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--red);margin:0 1px;flex-shrink:0"></span>';});
  return dots?'<div style="display:flex;align-items:center;flex-wrap:wrap;gap:1px;margin-top:3px;justify-content:flex-end;">'+dots+'</div>':'';
}

function _getActivoScores(sym) {
  if(!sym) return null;
  var signals = window._iaSignals || [];
  for(var i=0;i<signals.length;i++){ if(signals[i].simbolo===sym) return signals[i].scores||null; }
  // fallback: buscar por ySymbol en _IA_ACTIVOS
  var act = (window._IA_ACTIVOS||[]).find(function(a){return a.s===sym;});
  if(act && act.ySymbol && act.ySymbol!==sym){
    for(var j=0;j<signals.length;j++){ if(signals[j].simbolo===act.ySymbol) return signals[j].scores||null; }
  }
  // fallback: scores sintéticos basados en seed del símbolo
  if(act) {
    var seed=_iaSeed(sym);
    return {tendencia:seed>0.5?0.05:-0.05,rsi:seed>0.6?-0.03:0.03,volumen:0.01,volatilidad:-0.02,correlacion:0.02,oro_petroleo:0,macro:-0.01,earnings:0,macd:0,soporte_resist:0};
  }
  // fallback universal: score sintético para cualquier ticker no registrado
  var seed=_iaSeed(sym);
  return {tendencia:seed>0.5?0.05:-0.05,rsi:seed>0.6?-0.03:0.03,volumen:0.01,volatilidad:-0.02,correlacion:0.02,oro_petroleo:0,macro:-0.01,earnings:0,macd:0,soporte_resist:0};
}

function renderTab(tab, pais){
  _activeTab=tab; _activePais=pais||'usa';
  var cnt=document.getElementById('cnt');
  if(!cnt) return;
  if(typeof _renderComboBanner==='function') _renderComboBanner('mkt-combo-banner');
  if(typeof _renderMktNewsBanner==='function') _renderMktNewsBanner('mkt-news-banner');
  var pulseMap={cripto:'CRIPTO',stable:'CRIPTO',acciones:'ACCIONES',etfs:'ACCIONES',futuros:'FUTUROS',metales:'COMOD',bonos:'COMOD'};
  if(typeof _renderFearGreed==='function'){window._pulseActiveFilter=pulseMap[tab]||'GLOBAL';_renderFearGreed('mkt-fear-greed');}
  var _paisMap={br:'brasil',eu:'europa',es:'europa',jp:'japon',cn:'china'};var _paisKey=_paisMap[pais]||pais;var arr=tab==='acciones'?(DATA.acciones[_paisKey]||DATA.acciones.usa):(DATA[tab]||[]);
  cnt.innerHTML='';
  window._mktRenderedSyms={};
  arr.forEach(function(item){ _appendMktRow(cnt, item, tab); });
  window._editMode=false;
  var ebtn=document.getElementById('edit-btn'),ebanner=document.getElementById('edit-banner');
  if(ebtn){ebtn.textContent=(window._i18n?window._i18n.t('pw_editar_orden'):' Editar orden');ebtn.classList.remove('on');}
  if(ebanner) ebanner.style.display='none';
  window._activeTf=window._activeTf||'24h';
  if(tab==='cripto'||tab==='stable') fetchBinance(tab);
  else fetchYahoo(tab, pais, window._activeTf);
  // Background load
  setTimeout(function(){ _loadMktBackground(tab, pais); }, 1200);
}

function _getMktLogo(item,tab){
  var t=tab||item.tab||'';
  if(t==='cripto'||t==='stable') return 'https://assets.coincap.io/assets/icons/'+item.s.toLowerCase().replace('=f','').replace('=x','')+'@2x.png';
  if(t==='acciones'||t==='etf') return 'https://financialmodelingprep.com/image-stock/'+item.s+'.png';
  var lbl=item.s.replace(/[^A-Z0-9]/g,'').substring(0,4);var fs=lbl.length>3?'9':'11';return 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2228%22 height=%2228%22><circle cx=%2214%22 cy=%2214%22 r=%2214%22 fill=%22%23334%22/><text x=%2214%22 y=%2218%22 text-anchor=%22middle%22 font-size=%22'+fs+'%22 font-family=%22Arial,sans-serif%22 font-weight=%22bold%22 fill=%22%23ccc%22>'+lbl+'</text></svg>';
}
function _appendMktRow(cnt, item, tab) {
  if(window._mktRenderedSyms[item.s]) return;
  window._mktRenderedSyms[item.s]=true;
  var scores = _getActivoScores(item.s);
  var dotsHtml = _buildDotsHTML(scores);
  var row=document.createElement('div');
  row.className='item-row'; row.id='row-'+item.s;
  row.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer;gap:10px;';
  row.innerHTML=
    '<img src="'+_getMktLogo(item,tab)+'" data-s="'+item.s+'" style="width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0;" onerror="var _s=this.dataset.s.replace(/[^A-Z0-9]/g,\x27\x27).substring(0,4);var _f=_s.length>3?\x279\x27:\x2711\x27;this.src=\x27data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2228%22 height=%2228%22><circle cx=%2214%22 cy=%2214%22 r=%2214%22 fill=%22%23334%22/><text x=%2214%22 y=%2218%22 text-anchor=%22middle%22 font-size=%22\x27+_f+\x27%22 font-family=%22Arial,sans-serif%22 font-weight=%22bold%22 fill=%22%23ccc%22>\x27+_s+\x27</text></svg>\x27;this.onerror=null;">'+
    '<div style="display:flex;flex-direction:column;min-width:70px;flex-shrink:0;">'+
      '<span style="color:var(--text);font-weight:600;font-size:14px;">'+item.s+'</span>'+
      '<span style="color:var(--textSec);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;">'+item.n+'</span>'+
    '</div>'+
    '<div id="spark-'+item.s+'" style="flex:1;display:flex;align-items:center;justify-content:center;min-width:64px;max-width:80px;">'+
      '<div style="display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:2px;">'+_buildDotsHTML(_getActivoScores(item.simbolo))+'</div>'+
    '</div>'+
    '<div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;flex-shrink:0;">'+
      '<span id="p-'+item.s+'" style="color:var(--text);font-size:13px;font-weight:600;">...</span>'+
      '<div style="display:flex;align-items:center;gap:3px;justify-content:flex-end;">'+
        '<span id="lbl-'+item.s+'" style="font-size:9px;color:var(--gold);font-weight:700;display:none;"></span>'+
        '<span id="c-'+item.s+'" style="font-size:11px;color:var(--textSec);">...</span>'+
      '</div>'+
      dotsHtml+
    '<div style="display:flex;gap:2px;margin-top:2px;">'+['24h','7d','1m','3m','1a'].map(function(p){return '<span class="mkt-tf-btn" data-tf="'+p+'" ontouchstart="stf(null,\''+p+'\')" onclick="stf(null,\''+p+'\')" style="font-size:9px;padding:1px 3px;border-radius:3px;background:'+(p==='24h'?'var(--gold)':'var(--border)')+';color:'+(p==='24h'?'#111':'var(--textSec)')+';cursor:pointer;touch-action:manipulation;">'+p+'</span>';}).join('')+'</div>'+
    '</div>';
  // TAP → tarjeta de detalle (paridad nativa MercadosScreen L1294 onPress → showSearchDetail).
  // Long-press (menú de acciones) se engancha aparte en _attachAllMercadosLP.
  row.addEventListener('click', function(e){
    if(e.target && e.target.closest && e.target.closest('.mkt-tf-btn')) return; // botones de timeframe
    if(document.getElementById('longpress-overlay')) return;                    // si el long-press acaba de abrir el menú
    if(window._mktShowDetailCard) window._mktShowDetailCard(item);
  });
  cnt.appendChild(row);
}

// === BINANCE: cripto y stable ===
function fetchBinance(tab){
  var arr=DATA[tab]||[];
  var stableFixed={USDT:1};
  if(stableFixed[arr[0]&&arr[0].s]){
    arr.forEach(function(item){
      var pel=document.getElementById('p-'+item.s),cel=document.getElementById('c-'+item.s);
      if(item.s==='USDT'||stableFixed[item.s]){if(pel)pel.textContent='$1.0000';if(cel){cel.textContent='+0.00%';cel.style.color='var(--textSec)';}return;}
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol='+item.s+'USDT').then(function(r){return r.json();}).then(function(t){var pr=parseFloat(t.lastPrice),pc=parseFloat(t.priceChangePercent)||0;if(pel)pel.textContent=_fmt(pr,'precio');if(cel){cel.textContent=_fmt(pc,'pct');cel.style.color=pc>=0?'var(--green)':'var(--red)';}}).catch(function(){ fetch('https://aurex-app-production.up.railway.app/api/crypto-prices').then(function(r){return r.json();}).then(function(d){if(d&&d.prices&&d.prices[item.s]){var p=d.prices[item.s];if(pel)pel.textContent=_fmt(p.price,'precio');if(!window._pcPrices)window._pcPrices={};window._pcPrices[item.s]=p.price;}}).catch(function(){}); });
    });
    return;
  }
  var syms=arr.map(function(x){return '"'+x.s+'USDT"';}).join(',');
  fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=['+syms+']')
    .then(function(r){return r.json();})
    .then(function(list){
      list.forEach(function(t){
        var sym=t.symbol.replace('USDT',''),price=parseFloat(t.lastPrice),pct=parseFloat(t.priceChangePercent);
        var pel=document.getElementById('p-'+sym),cel=document.getElementById('c-'+sym);
        if(pel) pel.textContent=_fmt(price,'precio');
        if(cel){cel.textContent=_fmt(pct,'pct');cel.style.color=pct>=0?'var(--green)':'var(--red)';}
      });
    }).catch(function(){
      // Fallback: backend Railway crypto-prices (CryptoCompare/Kraken/CoinGecko)
      fetch('https://aurex-app-production.up.railway.app/api/crypto-prices')
        .then(function(r){return r.json();})
        .then(function(d){
          if(d && d.prices){
            Object.keys(d.prices).forEach(function(sym){
              var p=d.prices[sym];
              if(p && p.price){
                var pel=document.getElementById('p-'+sym),cel=document.getElementById('c-'+sym);
                if(pel) pel.textContent=_fmt(p.price,'precio');
                if(!window._pcPrices) window._pcPrices={};
                window._pcPrices[sym]=p.price;
              }
            });
          }
        }).catch(function(){});
    });
  // Fetch sparklines for cripto (batch klines)
  arr.forEach(function(item){
    fetch('https://api.binance.com/api/v3/klines?symbol='+item.s+'USDT&interval=1d&limit=7')
      .then(function(r){return r.json();})
      .then(function(kl){
        var closes=kl.map(function(k){return parseFloat(k[4]);});
        var isUp=closes.length>1&&closes[closes.length-1]>=closes[0];
        var sparkEl=document.getElementById('spark-'+item.s);
        if(sparkEl) sparkEl.innerHTML=_buildSparklineSVG(closes,isUp);
      }).catch(function(){});
  });
}

// === YAHOO: acciones, etf, comm, futuros, divisas ===
function fetchYahoo(tab,pais,tf){
  var range=tf==='7d'?'7d':tf==='1m'?'1mo':tf==='3m'?'3mo':tf==='1a'?'1y':'2d';
  var interval=(tf==='3m'||tf==='1a')?'1wk':'1d';
  var _paisMap={br:'brasil',eu:'europa',es:'europa',jp:'japon',cn:'china'};var _paisKey=_paisMap[pais]||pais;var _bgKey=tab==='acciones'?'acciones_'+(_paisKey||'usa'):tab;var _bgExtra=(window._BG_EXTRA&&window._BG_EXTRA[_bgKey]||[]).map(function(s){return{s:s,n:s};});var arr=(tab==='acciones'?(DATA.acciones[_paisKey]||DATA.acciones.usa):(DATA[tab]||[])).concat(_bgExtra);
  Promise.all(arr.map(function(item){
    return (function(){var _ySym=(pais==='arg'?({PAMP:'PAM',TECO2:'TEO',CRES:'CRESY',IRSA:'IRS',TXAR:'TX',BYMA:'BYMA.BA',HARG:'HARG.BA',DGCU2:'DGCU2.BA',TRAN:'TRAN.BA',COME:'COME.BA',AUSO:'AUSO.BA',INVJ:'INVJ.BA',MOLI:'MOLI.BA',SAMI:'SAMI.BA',RICH:'RICH.BA',METR:'METR.BA',BOLT:'BOLT.BA'}[item.s]||item.s):(pais==='eu'||pais==='es')?({INGA:'ING'}[item.s]||item.s):item.s);return fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol='+_ySym+'&interval='+interval+'&range='+range);})()
      .then(function(r){return r.json();})
      .then(function(d){
        var meta=d.chart&&d.chart.result&&d.chart.result[0]?d.chart.result[0].meta:null;
        if(!meta)return;
        var price=meta.regularMarketPrice;if(!price)return;
        var mktState=meta.marketState||'';
        var lastTradeTs=(meta.regularMarketTime||0)*1000,nowMs=Date.now(),msSinceTrade=nowMs-lastTradeTs;
        var nowNY=new Date(nowMs-5*3600000),dayNY=nowNY.getUTCDay(),isWeekend=(dayNY===0||dayNY===6);
        var isClosed=(mktState==='CLOSED'||mktState==='PRE'||mktState==='PREPRE'||mktState==='POST'||mktState==='POSTPOST'||mktState===''&&(isWeekend||msSinceTrade>7200000));
        var pel=document.getElementById('p-'+item.s),cel=document.getElementById('c-'+item.s),lbl=document.getElementById('lbl-'+item.s);
        var closes=d.chart&&d.chart.result&&d.chart.result[0]&&d.chart.result[0].indicators&&d.chart.result[0].indicators.quote&&d.chart.result[0].indicators.quote[0]?d.chart.result[0].indicators.quote[0].close:null;
        var validCloses=closes?closes.filter(function(c){return c!=null&&!isNaN(c);}):[];
        if(tf&&tf!=='24h'){
          var firstClose=null;if(closes){for(var i=0;i<closes.length;i++){if(closes[i]!=null){firstClose=closes[i];break;}}}
          var pct2=firstClose&&firstClose>0?((price-firstClose)/firstClose*100):0;
          if(pel)pel.textContent=_fmt(price,'precio');
          if(cel){cel.textContent=_fmt(pct2,'pct');cel.style.color=pct2>=0?'var(--green)':'var(--red)';}
          if(lbl) lbl.style.display='none';
        } else {
          var prevClose=meta.chartPreviousClose||meta.previousClose||price;
          var pct=prevClose>0?((price-prevClose)/prevClose*100):0;
          if(pel)pel.textContent=_fmt(price,'precio');
          if(cel){cel.textContent=_fmt(pct,'pct');cel.style.color=pct>=0?'var(--green)':'var(--red)';}
          if(lbl){if(isClosed){lbl.textContent=(window._i18n?window._i18n.t('pw_ult_cierre'):'Ult. cierre');lbl.style.display='inline';}else{lbl.style.display='none';}}
        }
        // Sparkline from Yahoo closes
        if(validCloses.length>=2){
          var isUp=validCloses[validCloses.length-1]>=validCloses[0];
          var sparkEl=document.getElementById('spark-'+item.s);
          if(sparkEl) sparkEl.innerHTML=_buildSparklineSVG(validCloses,isUp);
        }
      }).catch(function(){ fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+_ySym+'?interval='+interval+'&range='+range).then(function(r){return r.json();}).then(function(d){var meta=d.chart&&d.chart.result&&d.chart.result[0]?d.chart.result[0].meta:null;if(!meta)return;var price=meta.regularMarketPrice;if(!price)return;var prevClose=meta.chartPreviousClose||meta.previousClose||price;var pct=prevClose>0?((price-prevClose)/prevClose*100):0;if(pel)pel.textContent=_fmt(price,'precio');if(cel){cel.textContent=_fmt(pct,'pct');cel.style.color=pct>=0?'var(--green)':'var(--red)';}}).catch(function(){}); });
  }));
}

// === BACKGROUND LOADING: carga activos adicionales ===
var _BG_EXTRA = {
  cripto: ['DOGE','SHIB','PEPE','TON','SUI','APT','ARB','OP','INJ','TIA','SEI','NEAR','FIL','LTC','BCH','ETC','ATOM','ALGO','VET','HBAR','MANA','SAND','CRV','AAVE','UNI','SUSHI','CAKE','1INCH','IMX','PENDLE','WLD','STRK','BLUR','ORDI','SATS','BONK','WIF','FLOKI','GALA','CHZ','DYDX','SNX','COMP','ZRX','BAL','BAND','SKL','NKN','CTSI','STMX','ANKR','CELR','COTI','GAS'],
  acciones_usa: ['HOOD','MSTR','COIN','RBLX','PLTR','SNOW','DKNG','RIVN','LCID','NIO','BABA','JD','PDD','BIDU','DJT','GME','AMC','BBBYQ','SOFI','UPST','AFRM','OPEN','WISH','CLOV','UWMC','SPCE','NKLA','RIDE','HYLN','XL','SUNW','BEEM','MAXN','ARRY','NOVA','RUN','SEDG','ENPH','FSLR','CSIQ','DAQO'],
  etf: ['IBIT','FBTC','ARKK','ARKG','ARKW','ARKF','ARKQ','SARK','TQQQ','SQQQ','SPXU','UPRO','TNA','TZA','UVXY','VXX','SVXY','EEM','EFA','VEA','VWO','VXUS','IXUS','ACWI','VT','IVV','IWM','MDY','VBR','VBK','VTWO','VIG','VYM','SCHD','HDV','DVY','PFF','PFFD','PFIG','PFRL'],
  comm: ['ZC=F','ZW=F','ZS=F','ZO=F','ZM=F','ZL=F','KC=F','CT=F','OJ=F','SB=F','CC=F','LE=F','HE=F','GF=F','LH=F','PL=F','PA=F','HG=F'],
  futuros: ['YM=F','RTY=F','NKD=F','FDAX=F','FGBL=F','ZN=F','ZB=F','ZF=F','ZT=F','GE=F','6E=F','6J=F','6B=F','6C=F','6A=F','BTC=F','MBT=F'],
  divisas: ['EURUSD=X','USDJPY=X','GBPUSD=X','USDCAD=X','AUDUSD=X','USDCHF=X','NZDUSD=X','USDMXN=X','USDBRL=X','USDARS=X','USDCNY=X','USDKRW=X','USDSGD=X','USDHKD=X','USDNOK=X','USDSEK=X','USDDKK=X']
};

function _loadMktBackground(tab, pais){
  var cnt=document.getElementById('cnt');
  if(!cnt||window._activeTab!==tab) return;
  var extras=[];
  if(tab==='cripto'||tab==='stable'){
    // For cripto, fetch top volume pairs from Binance
    fetch('https://api.binance.com/api/v3/ticker/24hr')
      .then(function(r){return r.json();})
      .then(function(all){
        if(window._activeTab!==tab) return;
        var usdtPairs=all.filter(function(t){return t.symbol.endsWith('USDT')&&parseFloat(t.quoteVolume)>1000000;});
        usdtPairs.sort(function(a,b){return parseFloat(b.quoteVolume)-parseFloat(a.quoteVolume);});
        var added=0;
        usdtPairs.slice(0,120).forEach(function(t){
          var sym=t.symbol.replace('USDT','');
          if(window._mktRenderedSyms[sym]) return;
          if(added>=60) return;
          added++;
          var item={s:sym,n:sym,tab:tab};
          _appendMktRow(cnt,item,tab);
          // Set price immediately from ticker data
          var price=parseFloat(t.lastPrice),pct=parseFloat(t.priceChangePercent);
          var pel=document.getElementById('p-'+sym),cel=document.getElementById('c-'+sym);
          if(pel) pel.textContent=_fmt(price,'precio');
          if(cel){cel.textContent=_fmt(pct,'pct');cel.style.color=pct>=0?'var(--green)':'var(--red)';}
          // Sparkline
          fetch('https://api.binance.com/api/v3/klines?symbol='+sym+'USDT&interval=1d&limit=7')
            .then(function(r2){return r2.json();})
            .then(function(kl){
              var closes=kl.map(function(k){return parseFloat(k[4]);});
              var isUp=closes.length>1&&closes[closes.length-1]>=closes[0];
              var sparkEl=document.getElementById('spark-'+sym);
              if(sparkEl) sparkEl.innerHTML=_buildSparklineSVG(closes,isUp);
            }).catch(function(){});
        });
        // Loading indicator removed
        var li=document.getElementById('mkt-bg-loading');
        if(li) li.remove();
      }).catch(function(){});
  } else {
    // For acciones/etf/comm etc - load extended list
    var bgKey = tab==='acciones'?'acciones_'+(pais||'usa'):tab;
    var bgList = _BG_EXTRA[bgKey] || _BG_EXTRA[tab] || [];
    bgList.forEach(function(sym){
      if(window._mktRenderedSyms[sym]) return;
      var item={s:sym,n:sym};
      _appendMktRow(cnt,item,tab);
    });
    if(bgList.length>0) fetchYahoo(tab, pais, window._activeTf||'24h');
  }
}

// === sw: cambio de tab en Mercados ===
window.sw=function(tab,el){
  document.querySelectorAll('#screen-mercados .tab').forEach(function(t){t.classList.remove('on');});
  if(el) el.classList.add('on');
  var pr=document.getElementById('pais-row');
  if(pr) pr.style.display=tab==='acciones'?'flex':'none';
  renderTab(tab, _activePais);
};

// === swPais: cambio de país en acciones ===
window.swPais=function(pais,el){
  document.querySelectorAll('#pais-row .pais').forEach(function(t){t.classList.remove('on');});
  if(el) el.classList.add('on');
  renderTab('acciones', pais);
};

;

// === stf: cambio de timeframe ===
window.stf=function(el,tf){
  window._activeTf=tf;
  document.querySelectorAll('.tfs .tf').forEach(function(t){t.classList.remove('on');});
  if(el) el.classList.add('on');
  document.querySelectorAll('.mkt-tf-btn').forEach(function(b){b.style.background=b.dataset.tf===tf?'var(--gold)':'var(--border)';b.style.color=b.dataset.tf===tf?'#111':'var(--textSec)';});
  var tfEl=document.getElementById('tf-time');
  if(tfEl){
    var labels={'24h':t('mkt_tf_ahora'),'7d':t('mkt_tf_7d'),'1m':t('mkt_tf_1m'),'3m':t('mkt_tf_3m'),'1a':t('mkt_tf_1y')};
    tfEl.textContent=labels[tf]||t('mkt_tf_ahora');
  }
  if(_activeTab==='cripto'||_activeTab==='stable'){
    // Cripto: use Binance for 24h, Yahoo for historical
    if(tf==='24h') fetchBinance(_activeTab);
    else fetchYahoo(_activeTab, _activePais, tf);
  } else {
    fetchYahoo(_activeTab, _activePais, tf);
  }
};

// === toggleEdit: modo edición con flechas â²â¼ ===
window._editMode=false;
window.toggleEdit=function(){
  window._editMode=!window._editMode;
  var btn=document.getElementById('edit-btn');
  var banner=document.getElementById('edit-banner');
  if(btn){
    btn.textContent=window._editMode?(window._i18n?window._i18n.t('pw_listo'):' Listo'):(window._i18n?window._i18n.t('pw_editar_orden'):' Editar orden');
    btn.classList.toggle('on',window._editMode);
  }
  if(banner) banner.style.display=window._editMode?'flex':'none';
  // Add/remove arrow buttons on each row
  var rows=document.querySelectorAll('#cnt .item-row');
  rows.forEach(function(row,idx){
    var existing=row.querySelector('.reorder-arrows');
    if(window._editMode){
      if(!existing){
        var arrowDiv=document.createElement('div');
        arrowDiv.className='reorder-arrows';
        arrowDiv.style.cssText='display:flex;flex-direction:column;gap:2px;margin-left:8px;';
        var upBtn=document.createElement('button');
        upBtn.textContent='â²';
        upBtn.style.cssText='background:var(--border);border:none;color:var(--gold);font-size:12px;cursor:pointer;padding:2px 6px;border-radius:4px;';
        upBtn.onclick=function(e){e.stopPropagation();_moveRow(row,-1);};
        var dnBtn=document.createElement('button');
        dnBtn.textContent='â¼';
        dnBtn.style.cssText='background:var(--border);border:none;color:var(--gold);font-size:12px;cursor:pointer;padding:2px 6px;border-radius:4px;';
        dnBtn.onclick=function(e){e.stopPropagation();_moveRow(row,1);};
        arrowDiv.appendChild(upBtn);
        arrowDiv.appendChild(dnBtn);
        row.appendChild(arrowDiv);
      }
    } else {
      if(existing) existing.remove();
    }
  });
};

// === _moveRow: move row up (-1) or down (+1) ===
window._moveRow=function(row,dir){
  var cnt=document.getElementById('cnt');
  if(!cnt)return;
  var rows=[...cnt.querySelectorAll('.item-row')];
  var idx=rows.indexOf(row);
  var newIdx=idx+dir;
  if(newIdx<0||newIdx>=rows.length)return;
  if(dir===-1){
    cnt.insertBefore(row,rows[newIdx]);
  } else {
    var next=rows[newIdx].nextSibling;
    if(next) cnt.insertBefore(row,next);
    else cnt.appendChild(row);
  }
};

function updateItemRT(tab,pais,sk,price,pct){var arr=tab==='acciones'?DATA.acciones[pais]||[]:DATA[tab]||[];var it=arr.find(function(x){return x.s===sk;});if(!it||!price)return;it.p=price>=1000?_fmt(price,'precio'):_fmt(price,'precio');it.c=_fmt(pct,'pct');it.up=pct>=0?1:0;}

function yahooFinanceRT(){}

renderTab(_activeTab||'cripto');setInterval(function(){ if(_activeTab==='cripto'||_activeTab==='stable') fetchBinance(_activeTab); else fetchYahoo(_activeTab,_activePais); },30000);
var swReg=null;
function initPushNotifications(){if(!('serviceWorker' in navigator))return;navigator.serviceWorker.register('/app/service-worker.js').then(function(r){swReg=r;if(Notification.permission==='granted')updateNotifButton(true);}).catch(function(){});}
function requestPushPermission(){if(!('Notification' in window)){alert((window._i18n?window._i18n.t('pw_safari_pwa'):'Agrega Cobrex a pantalla de inicio desde Safari.'));return;}if(Notification.permission==='granted'){showTestNotification();return;}Notification.requestPermission().then(function(p){if(p==='granted'){updateNotifButton(true);showTestNotification();}}).catch(function(){});}
function showTestNotification(){if(swReg&&Notification.permission==='granted')swReg.showNotification((window._i18n?window._i18n.t('pw_alertas_activas_t'):'Cobrex - Alertas Activas'),{body:(window._i18n?window._i18n.t('pw_recibiras_alertas'):'Recibirás alertas de precio.'),icon:'https://fmoscon-creator.github.io/aurex-app/icon-192.png',tag:'aurex-test'});}
function showAlertNotification(s,p,o){if(swReg&&Notification.permission==='granted')swReg.showNotification((window._i18n?window._i18n.t('pw_alerta_disp'):'ALERTA - ')+s,{body:'$'+p.toLocaleString(window._numLocale())+' obj:$'+o.toLocaleString(window._numLocale()),icon:'https://fmoscon-creator.github.io/aurex-app/icon-192.png',tag:'aurex-'+s,renotify:true});}
function updateNotifButton(on){var b=document.getElementById('notif-btn');if(!b)return;b.style.background=on?'#16A34A':'var(--gold)';b.textContent=on?(window._i18n?window._i18n.t('pw_activas'):'Activas'):(window._i18n?window._i18n.t('pw_activar'):'Activar');}
initPushNotifications();
function checkAlertasLocal(){if(typeof ALERTAS==='undefined')return;ALERTAS.forEach(function(a){if(!a.activa)return;var actual=typeof getAlertActual==='function'?getAlertActual(a):null;if(!actual)return;if((a.cond==='mayor'&&actual>=a.precio)||(a.cond==='menor'&&actual<=a.precio)){if(!a._disparada){a._disparada=true;var b=document.createElement('div');b.style.cssText='position:fixed;top:60px;left:0;right:0;z-index:9999;margin:0 12px;background:#16A34A;border-radius:12px;padding:12px 16px;color:white;font-size:13px;font-weight:600';b.textContent=(window._i18n?window._i18n.t('pw_alerta_disp'):'ALERTA - ')+a.s;document.body.appendChild(b);setTimeout(function(){b.remove();},5000);if(typeof showAlertNotification==='function')showAlertNotification(a.s,actual,a.precio);}}});}
setInterval(checkAlertasLocal,30000);
fetch(BACKEND_URL+'/').then(function(r){return r.json();}).then(function(d){if(d.status==='ok')console.log('Backend v'+d.version+' OK');}).catch(function(){});

// ============================================================
// === CONVERSOR DE MONEDAS — Binance + fallback fiat =========
// ============================================================

if(!window._pcPrices) window._pcPrices = {};

// Abrir modal
window.openPortConversor = function(){
  var modal = document.getElementById('port-conv-modal');
  if(!modal) return;
  modal.style.display = 'flex';
  pcLoadPrices();
};

// Cerrar modal (nombre que usa el HTML)
window.closePortConvModal = function(){
  var modal = document.getElementById('port-conv-modal');
  if(modal) modal.style.display = 'none';
};

// Cargar precios reales desde Binance
function pcLoadPrices(){
  var rateEl = document.getElementById('pc-rate');
  if(rateEl) rateEl.textContent = t('port_conv_loading');

  // Binance: BTC, ETH, SOL, USDT en USDT (= USD)
  fetch('https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22%2C%22ETHUSDT%22%2C%22SOLUSDT%22%5D')
    .then(function(r){ return r.json(); })
    .then(function(list){
      list.forEach(function(t){
        var sym = t.symbol.replace('USDT','');
        window._pcPrices[sym] = parseFloat(t.price);
      });
      window._liveLastFetch = Date.now();
      window._pcPrices['USDT'] = 1;
      window._pcPrices['USD']  = 1;
      // Tipos de cambio fiat (actualizables)
      window._pcPrices['ARS']    = 1195;  // Blue aprox
      window._pcPrices['ARS_OF'] = 1060;  // Oficial aprox
      window._pcPrices['EUR']    = 0.92;
      window._pcPrices['BRL']    = 5.70;
      if(rateEl) rateEl.textContent = t('port_conv_live');
      updatePortConv();
    })
    .catch(function(){
      // Fallback offline
      window._pcPrices = { BTC:66000, ETH:2000, SOL:83, USDT:1, USD:1, ARS:1195, ARS_OF:1060, EUR:0.92, BRL:5.70 };
      if(rateEl) rateEl.textContent = t('port_conv_offline');
      updatePortConv();
    });
}

// Calcular y mostrar resultado
window.updatePortConv = function(){
  var amtEl  = document.getElementById('pc-amount');
  var fromEl = document.getElementById('pc-from');
  var toEl   = document.getElementById('pc-to');
  var resEl  = document.getElementById('pc-result');
  var rateEl = document.getElementById('pc-rate');
  if(!amtEl || !fromEl || !toEl || !resEl) return;

  var amt  = parseFloat(amtEl.value);
  if(isNaN(amt) || amt < 0) { resEl.textContent = '—'; return; }
  var from = fromEl.value;
  var to   = toEl.value;
  var p    = window._pcPrices;
  if(!p[from] || !p[to]) { resEl.textContent = (window._i18n?window._i18n.t('pw_cargando'):'Cargando...'); return; }

  var FIAT  = ['USD','ARS','ARS_OF','EUR','BRL','USDT'];
  var isCrypto = function(s){ return FIAT.indexOf(s) === -1; };

  // Todo pasa por USD como pivote
  var amtUSD;
  if(from === 'USD' || from === 'USDT'){
    amtUSD = amt;
  } else if(isCrypto(from)){
    amtUSD = amt * p[from];          // Ej: 2 ETH * 2000 = 4000 USD
  } else {
    amtUSD = amt / p[from];          // Ej: 1000 ARS / 1195 = 0.837 USD
  }

  var result;
  if(to === 'USD' || to === 'USDT'){
    result = amtUSD;
  } else if(isCrypto(to)){
    result = amtUSD / p[to];         // Ej: 4000 / 66000 = 0.0606 BTC
  } else {
    result = amtUSD * p[to];         // Ej: 0.837 * 5.70 = 4.77 BRL
  }

  // Formatear
  var fmt;
  if(isCrypto(to)){
    fmt = result.toFixed(8).replace(/\.?0+$/, '') + ' ' + to;
  } else {
    fmt = result.toLocaleString(window._numLocale(),{minimumFractionDigits:2,maximumFractionDigits:2}) + ' ' + to;
  }
  resEl.textContent = fmt;

  // Tasa de referencia: 1 FROM = ? TO
  var oneUSD;
  if(from === 'USD' || from === 'USDT'){ oneUSD = 1; }
  else if(isCrypto(from)){ oneUSD = p[from]; }
  else { oneUSD = 1 / p[from]; }

  var oneTo;
  if(to === 'USD' || to === 'USDT'){ oneTo = oneUSD; }
  else if(isCrypto(to)){ oneTo = oneUSD / p[to]; }
  else { oneTo = oneUSD * p[to]; }

  var fmtRate;
  if(isCrypto(to)){
    fmtRate = oneTo.toFixed(8).replace(/\.?0+$/,'');
  } else {
    fmtRate = oneTo.toLocaleString(window._numLocale(),{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  if(rateEl) rateEl.textContent = '1 ' + from + ' = ' + fmtRate + ' ' + to;
};

// Intercambiar monedas
window.swapPortConv = function(){
  var fromEl = document.getElementById('pc-from');
  var toEl   = document.getElementById('pc-to');
  if(!fromEl || !toEl) return;
  var tmp = fromEl.value;
  fromEl.value = toEl.value;
  toEl.value = tmp;
  updatePortConv();
};


// ============================================================
// === PORTFOLIO PERSISTENTE — Supabase ========================
// ============================================================

var SUPA_URL = 'https://dklljnfhlzmfsfmxrpie.supabase.co';
var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbGxqbmZobHptZnNmbXhycGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzI3NDcsImV4cCI6MjA5MDEwODc0N30.FxegnijMue_K9jPqzY7gwNABaVpyyB6Io_ZkWLMSX9k';

// Headers comunes para Supabase
function supaHeaders(token){
  var h = {
    'apikey': SUPA_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
  if(token) h['Authorization'] = 'Bearer ' + token;
  else h['Authorization'] = 'Bearer ' + SUPA_KEY;
  return h;
}

// Obtener el token de sesión actual del usuario
function getSupaToken(){
  try {
    var sb = window._supabase || (window.supabase && window.supabase.createClient ? null : null);
    if(window._supabase) return window._supabase.auth.getSession();
    return Promise.resolve({ data: { session: null } });
  } catch(e) { return Promise.resolve({ data: { session: null } }); }
}

// ââ CARGAR portfolio del usuario desde Supabase ââ
window.loadPortfolioSupa = function(){
  // Mostrar datos anteriores de localStorage inmediatamente (como nativa mantiene state)
  try {
    var cached = JSON.parse(localStorage.getItem('aurex_port_items_cache') || 'null');
    if (cached && cached.length > 0 && !window._portItems) {
      _renderPortfolioItems(cached);
    }
  } catch(e){}
  try {
    if(window._supabase){
      window._supabase.auth.getSession().then(function(res){
        if(res.data && res.data.session){
          _fetchPortfolio(res.data.session.access_token, res.data.session.user.id);
        } else {
          _renderPortfolioEmpty();
        }
      });
    } else {
      _renderPortfolioEmpty();
    }
  } catch(e) { _renderPortfolioEmpty(); }
};

function _fetchPortfolio(token, userId){
  fetch(SUPA_URL + '/rest/v1/portfolio?user_id=eq.' + userId + '&order=created_at.desc', {
    headers: supaHeaders(token)
  })
  .then(function(r){ return r.json(); })
  .then(function(items){
    if(!items || items.length===0){ _renderPortfolioEmpty(); return; }
    // Primero renderizar con precios de cache
    _renderPortfolioItems(items);
    // Luego buscar precios frescos para los símbolos del portfolio
    _refreshPortPrices(items);
  })
  .catch(function(){
    try{var cached=localStorage.getItem('aurex_port_items_cache');if(cached){var items=JSON.parse(cached);if(items&&items.length>0){window._portItems=items;_renderPortfolioItems(items);_refreshPortPrices(items);return;}}}catch(e){}
    _renderPortfolioEmpty();
  });
}

function _refreshPortPrices(items){
  if(!items || items.length===0) return;
  var syms = items.map(function(i){ return i.simbolo; });
  var CRIPTO = ['BTC','ETH','SOL','BNB','XRP','ADA','AVAX','DOT','LINK','MATIC','USDT','USDC','DOGE','SHIB','LTC','ATOM','UNI','NEAR','APT','ARB','OP','TRX','TON','SUI','PEPE','WIF','FIL','INJ','RUNE'];
  var cryptoSyms = syms.filter(function(s){ return CRIPTO.indexOf(s)>=0; });
  var yahooSyms = syms.filter(function(s){ return CRIPTO.indexOf(s)<0; });
  var pending = cryptoSyms.length + yahooSyms.length;
  if(pending===0){ _renderPortfolioItems(items); return; }
  function done(){ pending--; if(pending<=0) _renderPortfolioItems(items); }
  cryptoSyms.forEach(function(sym){
    var pair = sym==='USDT'||sym==='USDC' ? sym+'BUSD' : sym+'USDT';
    fetch('https://api.binance.com/api/v3/ticker/24hr?symbol='+pair)
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(!window._pcPrices) window._pcPrices = {};
        if(!window._pcChange24) window._pcChange24 = {};
        window._liveLastFetch = Date.now();
        if(d.lastPrice){ window._pcPrices[sym] = parseFloat(d.lastPrice); }
        if(d.priceChangePercent !== undefined){ window._pcChange24[sym] = parseFloat(d.priceChangePercent); }
        // Fetch 52-week high/low via Binance klines (weekly, 52 bars)
        fetch('https://api.binance.com/api/v3/klines?symbol='+pair+'&interval=1w&limit=52')
          .then(function(kr){ return kr.json(); })
          .then(function(kd){
            if(!Array.isArray(kd)||kd.length===0) return;
            var lows = kd.map(function(k){ return parseFloat(k[3]); });
            var highs = kd.map(function(k){ return parseFloat(k[2]); });
            if(!window._pc52Low) window._pc52Low={};
            if(!window._pc52High) window._pc52High={};
            window._pc52Low[sym] = Math.min.apply(null, lows);
            window._pc52High[sym] = Math.max.apply(null, highs);
          }).catch(function(){});
        done();
      }).catch(function(){ fetch('https://aurex-app-production.up.railway.app/api/crypto-prices').then(function(r){return r.json();}).then(function(d){if(d&&d.prices&&d.prices[sym]){if(!window._pcPrices)window._pcPrices={};window._pcPrices[sym]=d.prices[sym].price;}}).catch(function(){}).finally(done); });
  });
  yahooSyms.forEach(function(sym){
    fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol='+sym+'&interval=1d&range=1d')
      .then(function(r){ return r.json(); })
      .then(function(d){
        try{
          var meta = d.chart.result[0].meta;
          if(!window._pcPrices) window._pcPrices = {};
          if(!window._pcChange24) window._pcChange24 = {};
          if(meta.regularMarketPrice){ window._pcPrices[sym] = parseFloat(meta.regularMarketPrice); }
          var _prevClose = meta.previousClose || meta.chartPreviousClose;
          if(_prevClose && meta.regularMarketPrice){
            window._pcChange24[sym] = ((meta.regularMarketPrice - _prevClose) / _prevClose * 100);
            if(!window._pcMarketState) window._pcMarketState={};
            window._pcMarketState[sym]=meta.marketState||'CLOSED';
            if(!window._pcMarketTime) window._pcMarketTime={};
            window._pcMarketTime[sym]=(meta.regularMarketTime||0)*1000;
            if(!window._pcPrevClose) window._pcPrevClose={};
            window._pcPrevClose[sym]=_prevClose;
          }
          if(!window._pc52Low) window._pc52Low={};
          if(!window._pc52High) window._pc52High={};
          if(meta.fiftyTwoWeekLow) window._pc52Low[sym]=meta.fiftyTwoWeekLow;
          if(meta.fiftyTwoWeekHigh) window._pc52High[sym]=meta.fiftyTwoWeekHigh;
        }catch(e){}
        done();
      }).catch(function(){ fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+sym+'?interval=1d&range=1d').then(function(r){return r.json();}).then(function(d){try{var meta=d.chart.result[0].meta;if(!window._pcPrices)window._pcPrices={};if(meta.regularMarketPrice)window._pcPrices[sym]=parseFloat(meta.regularMarketPrice);var _prevClose=meta.previousClose||meta.chartPreviousClose;if(_prevClose&&meta.regularMarketPrice){if(!window._pcChange24)window._pcChange24={};window._pcChange24[sym]=((meta.regularMarketPrice-_prevClose)/_prevClose*100);}}catch(e){}}).catch(function(){}).finally(done); });
  });
}

function _renderPortfolioEmpty(){
  var cnt = document.getElementById('port-cnt');
  if(!cnt) return;
  // No borrar si ya hay items renderizados del cache (evita flash vacío)
  if(window._portItems && window._portItems.length > 0) return;
  cnt.innerHTML = '<div style="text-align:center;padding:40px 20px;">' +
    '<div style="font-size:40px;margin-bottom:12px;">Cobrex</div>' +
    '<div style="font-size:14px;font-weight:700;color:var(--textSec);margin-bottom:6px;">'+t('port_empty_title')+'</div>' +
    '<div style="font-size:12px;color:var(--textSec);margin-bottom:20px;">'+t('port_empty_desc')+'</div>' +
    '<button onclick="openPortModal()" style="background:var(--gold);color:var(--bg);border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;">'+t('port_empty_btn')+'</span>' +
  '</div>';
}
// Etiqueta de tipo de activo traducible (usa las claves mkt_tipo_* que ya existen; fallback para los sin clave).
window._tipoLabel = function(tipo){
  var t=(tipo||'cripto').toLowerCase();
  var map={cripto:'mkt_tipo_cripto',stable:'mkt_tipo_cripto',accion:'mkt_tipo_accion',etf:'mkt_tipo_etf',bono:'mkt_ia_bonos',metal:'mkt_ia_metales',materia_prima:'mkt_ia_materias',commodity:'mkt_ia_materias'};
  var I=window._i18n;
  if(map[t] && I && I.t) return I.t(map[t]);
  return (I&&I.t)?I.t('mkt_tipo_activo'):(tipo||'Activo');
};
// web-1.7: motivos del análisis IA generados EN LA APP y traducidos (réplica nativa lib/aiMotivos.js Build 42).
// Reemplaza los sig.motivos que vienen del backend en español por las 5 justificaciones localizadas.
window.buildAiMotivos = function(sig){
  if(!sig) return [];
  var T=function(k){ try{ return (window._i18n&&window._i18n.t)?window._i18n.t(k):k; }catch(e){ return k; } };
  var dir=(sig.direccion||'').toUpperCase(); var isBaj=dir.indexOf('BAJ')>=0;
  var p=parseFloat(sig.precio)||0, p24=parseFloat(sig.precio24h)||0;
  var chg=(p>0&&p24>0)?((p-p24)/p24*100):0;
  var pct=(chg>=0?'+':'-')+Math.abs(chg).toFixed(1)+'%';
  var rsi=(sig.rsi!=null)?Math.round(parseFloat(sig.rsi)):50;
  var vol=(sig.volatilidad!=null)?(parseFloat(sig.volatilidad)*100).toFixed(1)
         :(sig.scores&&sig.scores.volatilidad!=null)?(parseFloat(sig.scores.volatilidad)*100).toFixed(1)
         :Math.abs(chg).toFixed(1);
  return [
    (isBaj?T('ai_motivo1_baj'):T('ai_motivo1_alc')).replace('{pct}',pct),
    (isBaj?T('ai_motivo2_baj'):T('ai_motivo2_alc')).replace('{rsi}',String(rsi)),
    T('ai_motivo3'),
    (isBaj?T('ai_motivo4_baj'):T('ai_motivo4_alc')).replace('{vol}',vol),
    T('ai_motivo5')
  ];
};
// web-1.7: al cambiar idioma re-dibujar el Portfolio (filas + Termómetro + botón Ordenar), no solo el estado vacío.
function _retranslateSortBtn(tab){
  try{
    var sb=document.getElementById(tab+'-sort-btn');
    if(sb && window._sortCfgs && window._sortCfgs[tab]){
      var cur=_getSort(tab); var o=window._sortCfgs[tab].opts.find(function(x){return x.k===cur;})||window._sortCfgs[tab].opts[0];
      sb.innerHTML=t('port_sort_btn_prefix')+' <span class="sort-value">'+t(o.lk)+'</span> <span class="sort-arrow">↓</span>';
    }
  }catch(e){}
}
if(window._i18n) window._i18n.onLangChange(function(){
  if(window._portItems && window._portItems.length>0){
    _renderPortfolioItems(window._portItems);
    if(typeof _renderThermoRisk==='function') try{ _renderThermoRisk(window._portItems); }catch(e){}
  } else { _renderPortfolioEmpty(); }
  _retranslateSortBtn('portfolio'); _retranslateSortBtn('mercados'); _retranslateSortBtn('ia');
  // banner upsell de Portfolio (usa claves i18n, solo falta re-llamarlo) + label "Hoy"
  try{ if(window._updatePfBanner) window._updatePfBanner(); }catch(e){}
  try{ var hl=document.getElementById('port-hoy-label'); if(hl) hl.textContent=' '+t('hoy'); }catch(e){}
  // IA: re-dibujar la lista de señales (resumen "al precio objetivo" + motivos buildAiMotivos) en el idioma nuevo
  try{ if(window._iaSignals && window._iaSignals.length>0 && typeof _renderIALista==='function') _renderIALista(window._iaSignals); }catch(e){}
  try{ if(window._iaSignals && window._iaSignals.length>0 && typeof _actualizarContadores==='function') _actualizarContadores(window._iaSignals); }catch(e){}
  // IA: el sort es #ia-sort-inline (no -sort-btn) → re-traducir su valor visible
  try{ var iasv=document.querySelector('#ia-sort-inline .sort-value'); if(iasv && window._sortCfgs && window._sortCfgs.ia){ var c=_getSort('ia'); var o=window._sortCfgs.ia.opts.find(function(x){return x.k===c;})||window._sortCfgs.ia.opts[0]; iasv.textContent=t(o.lk); } }catch(e){}
  // Watchlist (chips de tipo cripto/accion) + combo banner Mercados/Futuros
  try{ if(window.renderWatchCnt) window.renderWatchCnt(); }catch(e){}
  try{ if(typeof _renderComboBanner==='function') _renderComboBanner('mkt-combo-banner'); }catch(e){}
  try{ if(typeof _renderFearGreed==='function'){ _renderFearGreed('mkt-fear-greed'); _renderFearGreed('port-fear-greed'); } }catch(e){}  // gauge "46 — Neutral" en Mercados y Portfolio (label ya usa t())
  // Solo favoritos (chip usa t() pero no se re-dibuja)
  try{ var fc=document.getElementById('only-favs-chip'); if(fc && window.t){ var sp=fc.querySelector('span'); if(sp) sp.textContent=window.t('solo_favoritos'); } }catch(e){}
});

function _renderPortfolioItems(items){
  var cnt = document.getElementById('port-cnt');
  if(!cnt) return;
  if(!items || items.length === 0){ _renderPortfolioEmpty(); return; }
  var savedOrder = JSON.parse(localStorage.getItem('aurex_port_order') || '[]');
  if(savedOrder.length > 0){
    var ordered = [], rem = items.slice();
    savedOrder.forEach(function(oid){
      var xi = rem.findIndex(function(i){ return i.id === oid; });
      if(xi >= 0){ ordered.push(rem.splice(xi,1)[0]); }
    });
    items = ordered.concat(rem);
  }
  window._portItems = items;
  try { localStorage.setItem('aurex_port_items_cache', JSON.stringify(items)); } catch(e){}
  var prcs = window._pcPrices || {};
  var fmtNum = function(n,d){ return n.toLocaleString(window._numLocale(),{minimumFractionDigits:d||2,maximumFractionDigits:d||2}); };
  cnt.innerHTML = items.map(function(item, idx){
    var rowAct = window._findAssetGlobal ? window._findAssetGlobal(item.simbolo) : null;
    if(!rowAct){ var rowActs=window._IA_ACTIVOS||[]; for(var ri2=0;ri2<rowActs.length;ri2++){if(rowActs[ri2].s===item.simbolo){rowAct=rowActs[ri2];break;}} }
    var precio = prcs[item.simbolo] || item.precio_compra;
    var valor = item.cantidad * precio;
    var ch24 = window._pcChange24 && window._pcChange24[item.simbolo] !== undefined ? window._pcChange24[item.simbolo] : (precio > 0 && item.precio_compra > 0 ? ((precio - item.precio_compra)/item.precio_compra*100) : 0);
    var cc = ch24 >= 0 ? 'var(--green)' : 'var(--red)';
    var cs = ch24 >= 0 ? '+' : '';
    var isCrypto = (item.tipo||'').toLowerCase() === 'cripto' || (item.tipo||'').toLowerCase() === 'stable';
    // Idéntico a nativa PortfolioScreen.js líneas 776-781
    var _now = new Date();
    var _utcH = _now.getUTCHours();
    var _utcDay = _now.getUTCDay();
    var _isWeekend = (_utcDay === 0 || _utcDay === 6);
    var _nyseOpen = _utcH >= 14 && _utcH < 21;
    var mktClosed = !isCrypto && (_isWeekend || !_nyseOpen);
    var prevCloseVal = !isCrypto && window._pcPrevClose && window._pcPrevClose[item.simbolo];
    var prevClosePct = prevCloseVal && window._pcPrices && window._pcPrices[item.simbolo] && prevCloseVal > 0 ? ((window._pcPrices[item.simbolo]-prevCloseVal)/prevCloseVal*100) : null;
    if(mktClosed && prevClosePct !== null){ cc = prevClosePct >= 0 ? 'var(--green)' : 'var(--red)'; cs = prevClosePct >= 0 ? '+' : ''; }
    var nowUtc = new Date();
    var nowMin = nowUtc.getUTCHours()*60+nowUtc.getUTCMinutes();
    var nyseOpenMin = 13*60+30;
    var nyseCloseMin = 20*60;
    var isWeekend = nowUtc.getUTCDay()===0||nowUtc.getUTCDay()===6;
    var minsToOpen = 0;
    if(mktClosed){
      if(isWeekend){
        var daysToMon = (8-nowUtc.getUTCDay())%7||7;
        minsToOpen = daysToMon*24*60 - nowMin + nyseOpenMin;
      } else if(nowMin < nyseOpenMin){
        minsToOpen = nyseOpenMin - nowMin;
      } else {
        minsToOpen = (24*60 - nowMin) + nyseOpenMin;
      }
    }
            var upColor = idx === 0 ? 'var(--border)' : 'var(--textSec)';
    var dnColor = idx === items.length-1 ? 'var(--border)' : 'var(--textSec)';
    var upCursor = idx === 0 ? 'default' : 'pointer';
    var dnCursor = idx === items.length-1 ? 'default' : 'pointer';
    return '<div id="port-row-'+item.id+'" style="padding:10px 12px 8px;border-bottom:1px solid var(--border2);">' +
      '<div style="display:flex;align-items:center;gap:6px;">' +
      '<div style="display:flex;flex-direction:column;gap:1px;margin-right:2px;flex-shrink:0;">' +
        '<div onclick="movePortfolioItem(\''+item.id+'\', -1)" style="width:18px;height:16px;display:flex;align-items:center;justify-content:center;font-size:11px;color:'+upColor+';cursor:'+upCursor+';">&#9650;</div>' +
        '<div onclick="movePortfolioItem(\''+item.id+'\', 1)" style="width:18px;height:16px;display:flex;align-items:center;justify-content:center;font-size:11px;color:'+dnColor+';cursor:'+dnCursor+';">&#9660;</div>' +
      '</div>' +
      (function(){
        var sig = _getSignalForSym(item.simbolo);
        var dir = sig ? (sig.direccion||'').toLowerCase() : '';
        var logoBg = dir==='alcista' ? '#1A3A2A' : dir==='bajista' ? '#3A1A1A' : (rowAct && rowAct.color ? rowAct.color : '#333');
        if(rowAct && rowAct.logo) {
          return '<div style="width:28px;height:28px;border-radius:50%;background:'+logoBg+';display:flex;align-items:center;justify-content:center;margin-right:8px;flex-shrink:0;overflow:hidden"><img src="'+rowAct.logo+'" style="width:22px;height:22px;border-radius:50%;object-fit:cover" onerror="this.outerHTML=\'<span style=font-size:10px;font-weight:700;color:#fff>'+item.simbolo.substring(0,3)+'</span>\'" /></div>';
        }
        var fallbackBg = rowAct && rowAct.color ? rowAct.color : logoBg;
        return '<div style="width:28px;height:28px;border-radius:50%;background:'+fallbackBg+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;margin-right:8px;flex-shrink:0;">'+item.simbolo.replace('=F','').substring(0,3)+'</div>';
      })() +
      '<div style="flex:1;min-width:0;cursor:pointer;overflow:hidden;" onclick="openPortItemDetail(\x27'+item.id+'\x27)">' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
          '<span style="font-weight:700;color:var(--text);font-size:14px;">'+item.simbolo+'</span>' +
          '<span style="font-size:10px;padding:1px 6px;border-radius:5px;background:var(--border);color:var(--textSec);">'+window._tipoLabel(item.tipo)+'</span>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--textSec);margin-top:2px;">'+item.cantidad+' u. @ $'+fmtNum(item.precio_compra)+'</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;justify-content:center;min-width:48px;max-width:64px;">'+_buildDotsHTML(_getActivoScores(item.simbolo))+'</div>' +
      '<div style="margin-left:auto;text-align:right;flex-shrink:0;">' +
        '<div style="font-size:14px;font-weight:700;color:var(--text);">$'+fmtNum(valor)+'</div>' +
      '</div>' +
      '<span style="font-size:18px;color:var(--gold);font-weight:700;margin-left:2px;margin-right:-4px;">&#8250;</span>' +
      '<div onclick="deletePortfolioItem(\''+item.id+'\')" style="font-size:15px;color:var(--textDim);cursor:pointer;padding:4px;" title="'+t('wl_eliminar')+'">&#128465;</div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px;padding-left:50px;">' +
      '<span onclick="event.stopPropagation();if(window.openCreateAlert)openCreateAlert(\''+item.simbolo+'\',\''+(item.tipo||'')+'\')" style="cursor:pointer;font-size:15px;color:var(--gold);flex-shrink:0" title="'+t('al_ca_crear')+'">🔔</span>' +
      '<div style="display:flex;align-items:center;gap:4px;">' +
        (isCrypto ? '<span style="font-size:8px;color:var(--green);font-weight:700;border:0.5px solid var(--green);border-radius:3px;padding:0.5px 3px;margin-right:2px;">24/7</span>' : '') +
        (mktClosed && !isCrypto ? '<span style="font-size:9px;color:var(--gold);font-weight:700;margin-right:2px;">'+(window.t?window.t('pw_ult_cierre'):'Ult. cierre')+'</span>' : '') +
        '<span id="pct-'+item.id+'" style="font-size:11px;font-weight:600;color:'+cc+';">'+(mktClosed && prevClosePct!==null ? _fmt(prevClosePct,'pct') : _fmt(ch24,'pct'))+'</span>' +
        '<div style="display:flex;gap:2px;">' +
          ['24h','7d','1m','3m','1y'].map(function(p){ return '<span onclick="portPeriod(\''+item.id+'\',\''+item.simbolo+'\',\''+item.tipo+'\',\''+p+'\')" id="pp-'+p+'-'+item.id+'" style="font-size:9px;padding:1px 3px;border-radius:3px;background:'+(p==='24h'?'var(--gold)':'var(--border)')+';color:'+(p==='24h'?'var(--bg)':'var(--textSec)')+';cursor:pointer;touch-action:manipulation;">'+p+'</span>'; }).join('') +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
  }).join('');
  _updateTotals(items);
  setTimeout(function(){ if(window._initPortDropdowns) window._initPortDropdowns(); }, 50);
}



// === Portfolio currency switch: USD / USDT / BTC ===
window._portCurrency = 'USD'; // default

window._updatePortTotalDisplay = function() {
  var el = document.getElementById('port-total');
  var badge = document.getElementById('port-curr-badge');
  var total = window._portTotalUSD || 0;
  var cur = window._portCurrency || 'USD';
  var fmtNum = function(n,d){ return n.toLocaleString(window._numLocale(),{minimumFractionDigits:d!==undefined?d:2,maximumFractionDigits:d!==undefined?d:2}); };

  if(cur === 'BTC') {
    var btcPrice = window._pcPrices && window._pcPrices['BTC'] ? window._pcPrices['BTC'] : 0;
    if(btcPrice > 0) {
      var btcVal = total / btcPrice;
      if(el) el.textContent = 'â¿ ' + fmtNum(btcVal, 5);
    } else {
      if(el) el.textContent = 'â¿ ---';
    }
    if(badge) { badge.textContent = 'BTC'; badge.style.color='#F7931A'; badge.style.borderColor='#F7931A40'; }
  } else if(cur === 'USDT') {
    if(el) el.textContent = 'â® ' + fmtNum(total);
    if(badge) { badge.textContent = 'USDTâ®'; badge.style.color='#26A17B'; badge.style.borderColor='#26A17B40'; }
  } else {
    if(el) el.textContent = 'USD ' + fmtNum(total);
    if(badge) { badge.textContent = '$'; badge.style.color='#000'; badge.style.borderColor='var(--gold)'; }
  }
};

window._cyclePortCurrency = function() {
  var cur = window._portCurrency || 'USD';
  if(cur === 'USD') window._portCurrency = 'USDT';
  else if(cur === 'USDT') window._portCurrency = 'BTC';
  else window._portCurrency = 'USD';
  window._updatePortTotalDisplay();
};

window.portTotalPeriod = function(btn, period) {
  // Update active button styles
  var btns = document.querySelectorAll('#port-period-row .port-period-btn');
  btns.forEach(function(b) {
    b.style.background = '#222';
    b.style.color = '#aaa';
    b.style.fontWeight = '400';
    b.classList.remove('on');
  });
  btn.style.background = '#F59E0B';
  btn.style.color = '#000';
  btn.style.fontWeight = '700';
  btn.classList.add('on');

  var items = window._portItems;
  var prices = window._IA_PRECIOS;
  if(!items || !prices || Object.keys(prices).length === 0) return;

  var totalNow = 0, totalBefore = 0;
  var allHavePrev = true;

  items.forEach(function(item) {
    var p = prices[item.simbolo];
    if(!p) return;
    var qty = parseFloat(item.cantidad) || 0;
    var pNow = parseFloat(p.precio) || 0;
    totalNow += qty * pNow;

    if(period === 'max') {
      // Desde compra
      var pBefore = parseFloat(item.precio_compra) || pNow;
      totalBefore += qty * pBefore;
    } else if(period === '24h') {
      var p24 = parseFloat(p.precio24h) || pNow;
      totalBefore += qty * p24;
    } else {
      // For 7d, 1m, 1y - use available data or fallback
      var pPrev = parseFloat(p.precio24h) || pNow;
      totalBefore += qty * pPrev;
      allHavePrev = false;
    }
  });

  var diffUSD = totalNow - totalBefore;
  var diffPct = totalBefore > 0 ? ((totalNow - totalBefore) / totalBefore * 100) : 0;

  var pnlUSD = document.getElementById('port-pnl-usd');
  var pnlPct = document.getElementById('port-pnl-pct');
  var pnlSpan = document.querySelector('#port-pnl-row span:last-child');

  if(pnlUSD) pnlUSD.textContent = (diffUSD >= 0 ? '+' : '') + '$' + Math.abs(diffUSD).toLocaleString(navigator.language||'en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  if(pnlPct) pnlPct.textContent = _fmt(diffPct,'pct');
  if(pnlSpan) pnlSpan.textContent = period === 'max' ? t('port_period_buy') : period;

  if(pnlUSD) pnlUSD.style.color = diffUSD >= 0 ? '#3fb950' : '#f85149';
  if(pnlPct) pnlPct.style.color = diffUSD >= 0 ? '#3fb950' : '#f85149';
  // F2: sincronizar indicador Hoy con el % del PnL del período seleccionado
  if (typeof window._refreshHoyPct === 'function') window._refreshHoyPct();
  var pColor = diffUSD >= 0 ? '#22c55e' : '#ef4444';
  var pctTxt = _fmt(diffPct,'pct');
  var amtTxt = (diffUSD >= 0 ? '+' : '-') + '$' + Math.abs(diffUSD).toLocaleString(navigator.language||'en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  var pPct = document.getElementById('port-period-pct');
  var pAmt = document.getElementById('port-period-amt');
  if(pPct) { pPct.textContent = pctTxt; pPct.style.color = pColor; }
  if(pAmt) { pAmt.textContent = amtTxt; pAmt.style.color = pColor; }
};


window.movePortfolioItem = function(id, direction){
  var items = window._portItems;
  if(!items) return;
  var idx = items.findIndex(function(i){ return i.id === id; });
  if(idx < 0) return;
  var ni = idx + direction;
  if(ni < 0 || ni >= items.length) return;
  var tmp = items[idx]; items[idx] = items[ni]; items[ni] = tmp;
  localStorage.setItem('aurex_port_order', JSON.stringify(items.map(function(i){ return i.id; })));
  _renderPortfolioItems(items);
};

window.portPeriod = function(id, simbolo, tipo, period){
  ['24h','7d','1m','1y'].forEach(function(p){
    var btn = document.getElementById('pp-'+p+'-'+id);
    if(!btn) return;
    btn.style.background = p === period ? 'var(--gold)' : 'var(--border)';
    btn.style.color = p === period ? 'var(--bg)' : 'var(--textSec)';
  });
  var pctEl = document.getElementById('pct-'+id);
  if(!pctEl) return;
  if(period === '24h'){
    var cv = window._pcChange24 && window._pcChange24[simbolo] !== undefined ? window._pcChange24[simbolo] : null;
    if(cv !== null){ pctEl.style.color = cv>=0?'var(--green)':'var(--red)'; pctEl.textContent = _fmt(cv,'pct'); }
    return;
  }
  pctEl.textContent = '...';
  var daysMap = {}; daysMap['7d']=7; daysMap['1m']=30; daysMap['1y']=365;
  var days = daysMap[period] || 7;
  var CRIPTO = ['BTC','ETH','SOL','BNB','XRP','ADA','AVAX','DOT','LINK','MATIC','DOGE','SHIB','LTC','ATOM','UNI','FIL','NEAR','APT','ARB','OP'];
  if(CRIPTO.indexOf(simbolo) >= 0){
    var intv = days <= 7 ? '4h' : '1d';
    var lim = days <= 7 ? 42 : days;
    fetch('https://api.binance.com/api/v3/klines?symbol='+simbolo+'USDT&interval='+intv+'&limit='+lim)
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(!d || d.length < 2){ pctEl.textContent = '--'; return; }
        var first = parseFloat(d[0][1]);
        var last = parseFloat(d[d.length-1][4]);
        var pct = first > 0 ? ((last-first)/first*100) : 0;
        pctEl.style.color = pct>=0?'var(--green)':'var(--red)';
        pctEl.textContent = _fmt(pct,'pct');
      }).catch(function(){ pctEl.textContent = '--'; });
  } else {
    var yurl = 'https://aurex-app-production.up.railway.app/api/yahoo?symbol='+simbolo+'&interval=1d&range='+days+'d';
    fetch(yurl)
      .then(function(r){ return r.json(); })
      .then(function(d){
        var res = d.chart && d.chart.result && d.chart.result[0];
        if(!res){ pctEl.textContent = '--'; return; }
        var closes = res.indicators.quote[0].close;
        var fp = closes.find(function(p){ return p != null; });
        var lp = closes.slice().reverse().find(function(p){ return p != null; });
        if(!fp || !lp){ pctEl.textContent = '--'; return; }
        var pct = ((lp-fp)/fp*100);
        pctEl.style.color = pct>=0?'var(--green)':'var(--red)';
        pctEl.textContent = _fmt(pct,'pct');
      }).catch(function(){ pctEl.textContent = '--'; });
  }
};


function _updateTotals(items){
  var prcs = window._pcPrices || {};
  var total = 0, totalCosto = 0, bestPct = -Infinity, bestSym = '—';
  var hasPrices = false;
  items.forEach(function(item){
    var precioReal = prcs[item.simbolo];
    if(precioReal) hasPrices = true;
    var precio = precioReal || 0;
    total += item.cantidad * precio;
    totalCosto += item.cantidad * item.precio_compra;
    var pnl = precioReal && item.precio_compra > 0 ? ((precioReal - item.precio_compra) / item.precio_compra * 100) : 0;
    if(pnl > bestPct){ bestPct = pnl; bestSym = item.simbolo; }
  });
  var fmtNum = function(n,d){ return n.toLocaleString(window._numLocale(),{minimumFractionDigits:d||2,maximumFractionDigits:d||2}); };
  var el = function(id){ return document.getElementById(id); };
  // Si no hay precios reales, no sobreescribir — dejar cache del header visible
  if(!hasPrices) return;
  window._portTotalUSD = total;
  _updatePortTotalDisplay();
  if(el('port-count')) el('port-count').textContent = items.length;
  if(el('port-cnt-badge')) el('port-cnt-badge').textContent = items.length;
  if(el('port-best')) el('port-best').textContent = items.length > 0 ? (bestSym + ' ' + _fmt(bestPct,'pct')) : '—';
  if(el('port-best-badge')) { el('port-best-badge').textContent = items.length > 0 ? (bestSym + ' ' + _fmt(bestPct,'pct')) : '—'; el('port-best-badge').style.color = bestPct >= 0 ? '#22c55e' : '#ef4444'; }
  // F2: reinsertar emoji + asegurar indicador Hoy tras refresh de badge
  if (typeof window._initHoyIndicator === 'function') window._initHoyIndicator();
  // Cachear precios cuando realmente existen (no antes)
  try {
    if(window._pcPrices && Object.keys(window._pcPrices).length > 0) localStorage.setItem('aurex_pc_prices_cache', JSON.stringify(window._pcPrices));
    if(window._pcChange24 && Object.keys(window._pcChange24).length > 0) localStorage.setItem('aurex_pc_change24_cache', JSON.stringify(window._pcChange24));
    if(window._IA_PRECIOS && Object.keys(window._IA_PRECIOS).length > 0) localStorage.setItem('aurex_ia_precios_cache', JSON.stringify(window._IA_PRECIOS));
    if(window._pcMarketState && Object.keys(window._pcMarketState).length > 0) localStorage.setItem('aurex_pc_mktstate_cache', JSON.stringify(window._pcMarketState));
  } catch(e){}
  // Cachear estado del header para restore inmediato en refresh
  try {
    var hoyEl = document.getElementById('port-hoy-pct');
    var emojiEl = document.getElementById('port-fila-emoji');
    localStorage.setItem('aurex_port_header_cache', JSON.stringify({
      total: el('port-total') ? el('port-total').textContent : '',
      pnlUsd: el('port-pnl-usd') ? el('port-pnl-usd').textContent : '',
      pnlPct: el('port-pnl-pct') ? el('port-pnl-pct').textContent : '',
      pnlUsdColor: el('port-pnl-usd') ? el('port-pnl-usd').style.color : '',
      pnlPctColor: el('port-pnl-pct') ? el('port-pnl-pct').style.color : '',
      cnt: items.length,
      hoyPct: hoyEl ? hoyEl.textContent : '',
      hoyColor: hoyEl ? hoyEl.style.color : '',
      emoji: emojiEl ? emojiEl.textContent : ''
    }));
  } catch(e){}
  // P&L: mostrar "..." hasta que haya precios reales, luego calcular según período
  var badge = document.getElementById('port-period-badge');
  var currentPeriod = '24h';
  if(badge) {
    var txt = badge.textContent.trim().toLowerCase();
    if(txt.indexOf('compra')>=0) currentPeriod = 'buy';
    else if(txt.indexOf('1a')>=0||txt.indexOf('1y')>=0) currentPeriod = '1y';
    else if(txt.indexOf('3m')>=0) currentPeriod = '3m';
    else if(txt.indexOf('1m')>=0) currentPeriod = '1m';
    else if(txt.indexOf('7d')>=0) currentPeriod = '7d';
  }
  if(typeof window._calcPortPeriod === 'function') {
    window._calcPortPeriod(currentPeriod);
  }
  _renderThermoRisk(items);
  _renderMarketBanner();
  _renderFearGreed();
  _renderFuturesBanner();
}

function _renderThermoRisk(items){
  var el = document.getElementById('port-thermo');
  if(!el) return;
  if(!items || items.length === 0){ el.innerHTML = ''; return; }
  var prcs = window._pcPrices || {};
  var sigs = window._iaSignals || [];
  var totVal = 0;
  var buckets = {
    ALCISTA: {val:0, syms:[]},
    BAJISTA: {val:0, syms:[]},
    HC:      {val:0, syms:[]},
    SIN:     {val:0, syms:[]}
  };
  items.forEach(function(item){
    var precio = prcs[item.simbolo] || item.precio_compra;
    var val = parseFloat(item.cantidad) * parseFloat(precio);
    totVal += val;
    var sig = null;
    for(var i=0;i<sigs.length;i++){ if(sigs[i].simbolo===item.simbolo){ sig=sigs[i]; break; } }
    var dir = '';
    if(sig){
      dir = (sig.direccion||'').toLowerCase();
    }
    // Sin fallback falso — si no hay senal del backend, queda como SIN SENAL
    if(dir==='alcista'){ buckets.ALCISTA.val+=val; buckets.ALCISTA.syms.push(item.simbolo); }
    else if(dir==='bajista'){ buckets.BAJISTA.val+=val; buckets.BAJISTA.syms.push(item.simbolo); }
    else { buckets.HC.val+=val; buckets.HC.syms.push(item.simbolo); }
  });
  if(totVal <= 0){ el.innerHTML = ''; return; }
  var pAlc = buckets.ALCISTA.val/totVal*100;
  var pBaj = buckets.BAJISTA.val/totVal*100;
  var pHC  = buckets.HC.val/totVal*100;
  var pSin = buckets.SIN.val/totVal*100;
  var segs = [];
  if(pAlc>0) segs.push({p:pAlc, c:'var(--green)', l:t('port_thermo_leg_alcista'),       syms:buckets.ALCISTA.syms});
  if(pBaj>0) segs.push({p:pBaj, c:'var(--red)', l:t('port_thermo_leg_bajista'),       syms:buckets.BAJISTA.syms});
  if(pHC>0)  segs.push({p:pHC,  c:'var(--gold)', l:t('port_thermo_leg_sindir'), syms:buckets.HC.syms});
  if(pSin>0) segs.push({p:pSin, c:'var(--textSec)', l:t('port_thermo_leg_sinsenal'),      syms:buckets.SIN.syms});
  var bar = segs.map(function(s){
    return '<div style="width:'+s.p.toFixed(0)+'%;background:'+s.c+';height:100%;border-radius:2px;"></div>';
  }).join('');
  var leg = segs.filter(function(s){ return s.p>0.5; }).map(function(s){
    var symList = s.syms.length > 0 ? ' <span style="color:var(--textSec);font-size:9px;">('+s.syms.join(', ')+')</span>' : '';
    return '<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px;">' +
      '<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:'+s.c+';flex-shrink:0;"></span>' +
      '<span style="color:'+s.c+';font-size:10px;font-weight:700;">'+s.l+' '+s.p.toFixed(0)+'%</span>' +
      symList +
    '</div>';
  }).join('');
  var bajSyms = buckets.BAJISTA.syms.join(', ');
  var alcSyms = buckets.ALCISTA.syms.join(', ');
  var hcSyms  = buckets.HC.syms.join(', ');
  var msg = '';
  if(pBaj >= 50){
    msg = t('port_thermo_msg_baj50')+'<span style="color:var(--red);"><b>'+bajSyms+'</b></span>'+t('port_thermo_msg_baj50_suf')+'<br><span style="color:var(--textSec);font-size:9px;">'+t('port_thermo_msg_baj50_tip')+'</span>';
  } else if(pBaj >= 20){
    msg = t('port_thermo_msg_baj20')+'<span style="color:var(--red);"><b>'+bajSyms+'</b></span>'+t('port_thermo_msg_baj20_suf')+'<br><span style="color:var(--textSec);font-size:9px;">'+t('port_thermo_msg_baj20_tip')+'</span>';
  } else if(pAlc >= 50){
    msg = t('port_thermo_msg_alc50')+'<span style="color:var(--green);"><b>'+alcSyms+'</b></span>'+t('port_thermo_msg_alc50_suf')+'<br><span style="color:var(--textSec);font-size:9px;">'+t('port_thermo_msg_alc50_tip')+'</span>';
  } else if(pHC >= 40){
    msg = t('port_thermo_msg_hc40')+'<span style="color:var(--gold);"><b>'+hcSyms+'</b></span>.<br><span style="color:var(--textSec);font-size:9px;">'+t('port_thermo_msg_hc40_tip')+'</span>';
  } else if(pSin >= 70){
    msg = t('port_thermo_msg_sin70')+'<br><span style="color:var(--textSec);font-size:9px;">'+t('port_thermo_msg_sin70_tip')+'</span>';
  } else {
    var dom = segs[0];
    msg = '<b>'+dom.p.toFixed(0)+'% '+dom.l+'</b>'+t('port_thermo_msg_mix')+'<br><span style="color:var(--textSec);font-size:9px;">'+t('port_thermo_msg_mix_tip')+'</span>';
  }
  el.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border2);border-radius:12px;padding:10px 12px;margin-bottom:4px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">' +
      '<div style="display:flex;align-items:center;gap:5px;">' +
        '<div style="font-size:10px;color:var(--text);font-weight:700;letter-spacing:.3px;">'+t('port_thermo_bar_title')+'</div>' +
        '<div onclick="showThermoHelp()" style="font-size:9px;color:var(--textSec);font-weight:700;cursor:pointer;border:1px solid var(--border2);border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">?</div>' +
      '</div>' +
      '<div style="font-size:8px;color:var(--textSec);letter-spacing:.5px;font-weight:500;">'+t('port_thermo_bar_subtitle')+'</div>' +
      '<div onclick="showThermoInfo()" style="font-size:9px;color:#E6B800;font-weight:700;cursor:pointer;border:1px solid #E6B800;border-radius:4px;padding:0 5px;letter-spacing:.5px;">VAR</div>' +
    '</div>' +
    '<div style="height:8px;border-radius:6px;overflow:hidden;display:flex;gap:1px;background:var(--border);margin-bottom:6px;">'+bar+'</div>' +
    '<div style="margin-bottom:4px;">'+leg+'</div>' +
    '<div style="font-size:10px;color:var(--textSec);line-height:1.4;">'+msg+'</div>' +
    '</div>';
}

function _renderMarketBanner(containerId){
  var elId = containerId || 'port-market-banner';
  var el = document.getElementById(elId);
  if(!el) return;
  var prefs = JSON.parse(localStorage.getItem('aurex_markets_pref') || '["EEUU","ASIA","ARG"]');
  var now = new Date();
  var utcH = now.getUTCHours(), utcM = now.getUTCMinutes(), utcDay = now.getUTCDay();
  var utcMin = utcH*60+utcM;
  var isWknd = utcDay===0||utcDay===6;
  var ALL_MKTS = [
    {id:'EEUU', flag:'🇺🇸', open:810,  close:1200},
    {id:'ARG',  flag:'🇦🇷', open:840,  close:1260},
    {id:'BRASIL',flag:'🇧🇷',open:780,  close:1175},
    {id:'LONDRES',flag:'🇬🇧',open:480, close:990},
    {id:'ESPANA', flag:'🇪🇸',open:480, close:990},
    {id:'ALEMANIA',flag:'🇩🇪',open:480,close:1020},
    {id:'FRANCIA', flag:'🇫🇷',open:480,close:1020},
    {id:'JAPON',  flag:'🇯🇵', open:0,   close:390},
    {id:'CHINA',  flag:'🇨🇳', open:90,  close:420},
    {id:'HONGKONG',flag:'🇭🇰',open:90,  close:480},
    {id:'ASIA',   flag:'🌏',              open:0,   close:360}
  ];
  function mktItem(mkt){
    if(!prefs.includes(mkt.id)) return '';
    var open = !isWknd && utcMin >= mkt.open && utcMin < mkt.close;
    var color = open ? 'var(--green)' : '#FF6B6B';
    var mins, lbl;
    if(open){
      mins = mkt.close - utcMin;
      lbl = Math.floor(mins/60)+'h'+(mins%60)+'m';
    } else {
      if(utcMin < mkt.open){ mins = mkt.open - utcMin; }
      else { mins=(24*60-utcMin)+mkt.open; }
      lbl = Math.floor(mins/60)+'h'+(mins%60)+'m';
    }
    var statusTxt = open ? t('mkt_status_abierto') : t('mkt_status_cerrado');
    return '<div style="display:inline-flex;flex-direction:column;align-items:center;padding:5px 8px;min-width:62px;">'
      + '<span style="font-size:10px;font-weight:700;color:var(--text);">' + mkt.flag + ' ' + mkt.id + '</span>'
      + '<span style="font-size:10px;font-weight:700;color:'+color+';line-height:1.4;">' + statusTxt + '</span>'
      + '<span style="font-size:9px;color:var(--textSec);">' + lbl + '</span>'
      + '</div>';
  }
  var items = ALL_MKTS.map(mktItem).filter(Boolean).join('');
  var editBtn = '<div onclick="editMarketBanner()" style="font-size:12px;color:#3B9EF5;cursor:pointer;padding:4px 8px;border-radius:4px;border:1px solid #3B9EF5;margin-left:auto;flex-shrink:0;">&#9998;</div>';
  el.innerHTML = '<div style="display:flex;align-items:center;gap:0;padding:8px 10px;background:var(--card);border:1px solid var(--border2);border-radius:10px;margin:4px 10px;overflow-x:auto;-webkit-overflow-scrolling:touch;">'+items+editBtn+'</div>';
}

window.editMarketBanner = function(){
  var existing = document.getElementById('aurex-mkt-edit-popup');
  if(existing){ existing.remove(); return; }
  var prefs = JSON.parse(localStorage.getItem('aurex_markets_pref') || '["EEUU","ASIA","ARG"]');
  var opts = ['EEUU','ARG','BRASIL','LONDRES','ESPANA','ALEMANIA','FRANCIA','JAPON','CHINA','HONGKONG','ASIA'];
  var rows = opts.map(function(m){
    var on = prefs.includes(m);
    var onBg = on ? '#22c55e' : '#ccc';
    var knobL = on ? '18px' : '2px';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eee;">' +
      '<span style="color:#222;font-size:13px;font-weight:500;">'+m+'</span>' +
      '<div onclick="toggleMktPref(\'' + m + '\')" id="mkt-tog-'+m+'" style="width:40px;height:22px;border-radius:11px;background:'+onBg+';cursor:pointer;position:relative;flex-shrink:0;margin-left:10px;transition:background 0.2s;">' +
      '<div style="position:absolute;top:2px;left:'+knobL+';width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:left 0.2s;"></div></div></div>';
  }).join('');
  var popup = document.createElement('div');
  popup.id = 'aurex-mkt-edit-popup';
  popup.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
  popup.innerHTML =
    '<div style="background:var(--card);border:3px solid var(--gold);border-radius:16px;padding:20px;width:calc(100% - 40px);max-width:340px;max-height:85vh;overflow-y:auto;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<span style="font-size:16px;font-weight:700;color:#111;">'+t('mkt_edit_banner_title')+'</span>' +
        '<span onclick="document.getElementById(&apos;aurex-mkt-edit-popup&apos;).remove()" style="font-size:20px;cursor:pointer;color:#999;padding:4px 8px;">&#x2715;</span>' +
      '</div>' +
      rows +
      '<button onclick="document.getElementById(&apos;aurex-mkt-edit-popup&apos;).remove();if(typeof _renderMarketBanner===&apos;function&apos;){var _tmp=document.createElement(&apos;div&apos;);_tmp.id=&apos;tmp-mkt-listo&apos;;_tmp.style.display=&apos;none&apos;;document.body.appendChild(_tmp);_renderMarketBanner(&apos;tmp-mkt-listo&apos;);var _sa=document.getElementById(&apos;combo-slide-a&apos;);if(_sa)_sa.innerHTML=_tmp.innerHTML;document.body.removeChild(_tmp);}" style="width:100%;background:#22c55e;border:none;border-radius:12px;padding:14px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;margin-top:16px;">'+t('mkt_listo')+'</button>' +
    '</div>';
  document.body.appendChild(popup);
};
window.toggleMktPref = function(m){
  var prefs = JSON.parse(localStorage.getItem('aurex_markets_pref') || '["EEUU","ASIA","ARG"]');
  var idx = prefs.indexOf(m);
  if(idx >= 0) prefs.splice(idx,1); else prefs.push(m);
  localStorage.setItem('aurex_markets_pref', JSON.stringify(prefs));
  var tog = document.getElementById('mkt-tog-'+m);
  if(tog){
    var on = prefs.includes(m);
    tog.style.background = on ? '#22c55e' : '#ccc';
    var knob = tog.querySelector('div');
    if(knob) knob.style.left = on ? '18px' : '2px';
  }
  _renderMarketBanner();
  (function(){
    var _tmp = document.createElement('div');
    _tmp.id = 'tmp-mkt-refresh';
    _tmp.style.display = 'none';
    document.body.appendChild(_tmp);
    _renderMarketBanner('tmp-mkt-refresh');
    var _sa = document.getElementById('combo-slide-a');
    if(_sa) _sa.innerHTML = _tmp.innerHTML;
    document.body.removeChild(_tmp);
  })();
  _renderFearGreed();
  _renderFuturesBanner();
};
window.showThermoInfo = function(){
  var body = document.getElementById('port-modal-body');
  var modal = document.getElementById('port-modal');
  if(!body||!modal) return;
  // Idéntico a nativa PortfolioScreen.js líneas 1143-1191
  body.innerHTML = '<div style="color:#111;font-size:15px;font-weight:700;margin-bottom:12px;">'+t('port_thermo_title')+'</div>' +
    '<div style="font-size:12px;color:var(--textSec);line-height:1.6;margin-bottom:14px;">'+t('port_thermo_desc')+'</div>' +
    '<div style="display:flex;flex-direction:column;gap:12px;margin-bottom:14px;">' +
    '<div style="display:flex;gap:10px;align-items:flex-start;">' +
      '<div style="width:4px;border-radius:2px;background:#16a34a;min-height:40px;flex-shrink:0;"></div>' +
      '<div style="flex:1;"><div style="color:#16a34a;font-size:13px;font-weight:700;">'+t('port_signal_alcista')+'</div><div style="color:var(--textSec);font-size:11px;line-height:1.5;margin-top:2px;">'+t('port_thermo_alcista_desc')+'</div></div>' +
    '</div>' +
    '<div style="display:flex;gap:10px;align-items:flex-start;">' +
      '<div style="width:4px;border-radius:2px;background:var(--gold);min-height:40px;flex-shrink:0;"></div>' +
      '<div style="flex:1;"><div style="color:var(--gold);font-size:13px;font-weight:700;">'+t('port_signal_alta_conv')+'</div><div style="color:var(--textSec);font-size:11px;line-height:1.5;margin-top:2px;">'+t('port_thermo_conv_desc')+'</div></div>' +
    '</div>' +
    '<div style="display:flex;gap:10px;align-items:flex-start;">' +
      '<div style="width:4px;border-radius:2px;background:#dc2626;min-height:40px;flex-shrink:0;"></div>' +
      '<div style="flex:1;"><div style="color:var(--red);font-size:13px;font-weight:700;">'+t('port_signal_bajista')+'</div><div style="color:var(--textSec);font-size:11px;line-height:1.5;margin-top:2px;">'+t('port_thermo_bajista_desc')+'</div></div>' +
    '</div>' +
    '<div style="display:flex;gap:10px;align-items:flex-start;">' +
      '<div style="width:4px;border-radius:2px;background:#999;min-height:40px;flex-shrink:0;"></div>' +
      '<div style="flex:1;"><div style="color:var(--textSec);font-size:13px;font-weight:700;">'+t('port_signal_sin_senal')+'</div><div style="color:var(--textSec);font-size:11px;line-height:1.5;margin-top:2px;">'+t('port_thermo_sin_senal_desc')+'</div></div>' +
    '</div>' +
    '</div>' +
    '<div onclick="closePortModal()" style="background:var(--gold);color:#111;border-radius:10px;padding:12px;text-align:center;font-size:14px;font-weight:700;cursor:pointer;">'+t('port_entendido')+'</div>';
  modal.style.display = 'flex';
};

window._closeThermoHelp = function(){
  var el = document.getElementById('thermo-help-popup');
  if(el) el.remove();
};
window.showThermoHelp = function(){
  window._closeThermoHelp();
  var overlay = document.createElement('div');
  overlay.id = 'thermo-help-popup';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.75);z-index:9998;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:rgba(0,0,0,0);';
  overlay.setAttribute('onclick','window._closeThermoHelp()');
  var box = document.createElement('div');
  box.style.cssText = 'background:var(--card);border:1px solid var(--border2);border-radius:14px;padding:20px 18px;max-width:300px;width:88%;box-shadow:0 8px 32px rgba(0,0,0,.8);';
  box.setAttribute('onclick','event.stopPropagation()');
  box.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
      '<div style="font-size:13px;font-weight:700;color:var(--text);">'+t('port_thermo_help_title')+'</div>' +
      '<div onclick="window._closeThermoHelp()" style="font-size:24px;color:var(--textSec);cursor:pointer;line-height:1;padding:4px 6px;-webkit-tap-highlight-color:rgba(0,0,0,0);">&#215;</div>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:10px;font-size:11px;line-height:1.5;">' +
      '<div><span style="color:var(--green);font-weight:700;">'+t('port_thermo_help_verde')+'</span><br><span style="color:var(--textSec);">'+t('port_thermo_help_verde_desc')+'</span></div>' +
      '<div><span style="color:var(--red);font-weight:700;">'+t('port_thermo_help_rojo')+'</span><br><span style="color:var(--textSec);">'+t('port_thermo_help_rojo_desc')+'</span></div>' +
      '<div><span style="color:var(--gold);font-weight:700;">'+t('port_thermo_help_dorado')+'</span><br><span style="color:var(--textSec);">'+t('port_thermo_help_dorado_desc')+'</span></div>' +
      '<div><span style="color:var(--textSec);font-weight:700;">'+t('port_thermo_help_gris')+'</span><br><span style="color:var(--textSec);">'+t('port_thermo_help_gris_desc')+'</span></div>' +
    '</div>' +
    '<div style="margin-top:14px;font-size:10px;color:var(--textSec);border-top:1px solid var(--border2);padding-top:10px;">'+t('port_thermo_help_footer')+'</div>' +
    '<div onclick="window._closeThermoHelp()" style="margin-top:12px;background:var(--gold);color:var(--chipTextActive);border-radius:8px;padding:10px;text-align:center;font-size:12px;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:manipulation;">'+t('port_entendido')+'</div>';
  overlay.appendChild(box);
  document.body.appendChild(overlay);
};
// ââ ABRIR / CERRAR modal Agregar activo ââ
var _ACTIVOS_MODAL = [
  {g:'Cripto',items:[{s:'BTC',n:'Bitcoin'},{s:'ETH',n:'Ethereum'},{s:'SOL',n:'Solana'},{s:'BNB',n:'BNB'},{s:'XRP',n:'XRP'},{s:'ADA',n:'Cardano'},{s:'AVAX',n:'Avalanche'},{s:'DOT',n:'Polkadot'},{s:'LINK',n:'Chainlink'},{s:'MATIC',n:'Polygon'}],tipo:'cripto'},
  {g:'Acciones USA',items:[{s:'AAPL',n:'Apple'},{s:'NVDA',n:'NVIDIA'},{s:'MSFT',n:'Microsoft'},{s:'TSLA',n:'Tesla'},{s:'META',n:'Meta'},{s:'GOOGL',n:'Alphabet'},{s:'AMZN',n:'Amazon'}],tipo:'accion'},
  {g:'Acciones ARG',items:[{s:'GGAL',n:'Galicia'},{s:'YPF',n:'YPF'},{s:'BMA',n:'Macro'}],tipo:'accion'},
  {g:'ETFs',items:[{s:'SPY',n:'S&P 500'},{s:'QQQ',n:'Nasdaq 100'},{s:'GLD',n:'Gold ETF'},{s:'TLT',n:'Bono 20Y US'},{s:'IEF',n:'Bono 7-10Y'},{s:'VTI',n:'Total Mkt'}],tipo:'etf'},
  {g:'Stablecoins',items:[{s:'USDT',n:'Tether'},{s:'USDC',n:'USD Coin'}],tipo:'stable'}
];

window.openAddActivo = function(){
  // Si no hay sesión, mostrar aviso de login
  if(!window._supabase){ navTo('perfil'); return; }
  window._supabase.auth.getSession().then(function(res){
    if(!res.data || !res.data.session){
      // Mostrar mini-aviso en el portfolio y redirigir a Perfil/Login
      var cnt = document.getElementById('port-cnt');
      if(cnt){
        var old = cnt.innerHTML;
        cnt.innerHTML = '<div style="background:#1A0D00;border:1px solid var(--gold40);border-radius:12px;margin:20px 14px;padding:20px;text-align:center;">' +
          '<div style="font-size:28px;margin-bottom:8px;">🔐</div>' +
          '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:6px;">'+t('port_need_account_title')+'</div>' +
          '<div style="font-size:12px;color:var(--textSec);margin-bottom:16px;">'+t('port_need_account_desc')+'</div>' +
          '<div onclick="navTo(\x27perfil\x27);authSwitchTab(\x27register\x27)" style="background:linear-gradient(135deg,var(--gold),#B8860B);color:var(--chipTextActive);font-weight:800;font-size:14px;padding:12px 24px;border-radius:10px;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);">'+t('port_need_account_btn')+'</div>' +
          '<div onclick="navTo(\x27perfil\x27)" style="margin-top:10px;font-size:12px;color:#58A6FF;cursor:pointer;">'+t('port_need_account_login')+'</div>' +
        '</div>' + old;
        setTimeout(function(){ cnt.innerHTML = old; }, 5000);
      }
      return;
    }
    _openAddActivoModal();
  });
};
function _openAddActivoModal(prefillTicker){
  var modal = document.getElementById('port-modal');
  var body = document.getElementById('port-modal-body');
  var title = document.getElementById('port-modal-title');
  if(!modal || !body) return;
  // Gating por plan: FREE topa en portfolioMax (5). La infra ya existe en index.html.
  if(window.checkPlanLimit){
    var _pc = (window._portItems || []).length;
    var _chk = window.checkPlanLimit('add_portfolio', _pc);
    if(_chk && !_chk.ok){ if(window.showPaywall) window.showPaywall(_chk); return; }
  }
  if(title) title.textContent = t('port_agregar_activo');
  body.innerHTML =
    '<div style="display:flex;flex-direction:column;gap:10px;">' +
    '<div><input id="pa-search" type="text" placeholder="'+t('port_search_placeholder')+'" autocomplete="off" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:10px 12px;color:#111;font-size:14px;outline:none;" oninput="filterPortSearch()" /></div>' +
    '<div id="pa-results" style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:0;"></div>' +
    '<div id="pa-selected" style="display:none;">' +
    '<div style="background:var(--card);border-radius:10px;padding:10px 12px;margin-bottom:8px;"><input id="pa-sel-input" type="text" readonly style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 10px;color:#111;font-size:14px;outline:none;margin-bottom:6px;" /><div id="pa-sel-name" style="font-size:12px;font-weight:600;color:#111;background:#eee;display:inline-block;padding:3px 10px;border-radius:12px;"></div></div>' +
    '<div style="background:var(--card);border-radius:10px;padding:10px 12px;margin-bottom:8px;"><div style="font-size:11px;color:var(--textSec);margin-bottom:4px;">'+t('port_cantidad_label')+'</div><input id="pa-qty" type="number" min="0" step="any" placeholder="'+t('port_cantidad_placeholder')+'" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 10px;color:#111;font-size:14px;outline:none;" /></div>' +
    '<div style="background:var(--card);border-radius:10px;padding:10px 12px;margin-bottom:8px;"><div style="font-size:11px;color:var(--textSec);margin-bottom:4px;">'+t('port_precio_compra_label')+'</div><input id="pa-price" type="number" min="0" step="any" placeholder="'+t('port_precio_placeholder')+'" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 10px;color:#111;font-size:14px;outline:none;" /></div>' +
    '<div id="pa-preview" style="background:#FEF3C7;border-radius:10px;padding:12px;margin-bottom:8px;"><div style="font-size:11px;font-weight:700;color:#111;margin-bottom:6px;">'+t('port_preview_title')+'</div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text);margin-bottom:3px;"><span>'+t('port_preview_precio_mercado')+'</span><span id="pa-preview-price" style="font-weight:700;">--</span></div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text);margin-bottom:3px;"><span>'+t('port_preview_valor_sumara')+'</span><span id="pa-preview-value" style="font-weight:700;">$0,00</span></div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text);"><span>'+t('port_preview_pnl_inicial')+'</span><span id="pa-preview-pnl" style="font-weight:700;">$0,00</span></div></div>' +
    '<div id="pa-err" style="color:var(--red);font-size:11px;margin-top:4px;display:none;"></div>' +
    '<div onclick="savePortActivo()" style="margin-top:4px;background:var(--gold);color:#111;border-radius:12px;padding:14px;text-align:center;font-size:15px;font-weight:700;cursor:pointer;">'+t('guardar')+'</div>' +
    '</div>' +
    '<input id="pa-sym" type="hidden" value="" />' +
    '</div>';
  modal.style.display = 'flex';
  setTimeout(function(){ var el = document.getElementById('pa-search'); if(el) el.focus(); }, 100);
  window._portSearchActs = [];
  window.filterPortSearch();
  // Prefill ticker (cuando se abre desde long press de Mercados)
  if (prefillTicker) {
    setTimeout(function(){
      var srch = document.getElementById('pa-search');
      if (srch) {
        srch.value = prefillTicker;
        if (typeof window.filterPortSearch === 'function') {
          window.filterPortSearch();
          // Auto-seleccionar primer resultado tras 600ms (espera el fetch)
          setTimeout(function(){
            var first = (window._portSearchActs || [])[0];
            if (first && first.s === prefillTicker.toUpperCase()) {
              window.selectPortActivo(first.s, first.n);
            }
          }, 700);
        }
      }
    }, 200);
  }
}

// Fetch precios para resultados de búsqueda sin precio en cache
window._fetchSearchPrices = function(results, idPrefix) {
  var toFetch = results.filter(function(a){ return !(window._pcPrices||{})[a.s]; });
  toFetch.forEach(function(a){
    var sym = a.ySymbol || a.s;
    fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol='+sym+'&interval=1d&range=1d')
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d.chart && d.chart.result && d.chart.result[0]){
          var p = d.chart.result[0].meta.regularMarketPrice || 0;
          if(p){
            if(!window._pcPrices) window._pcPrices = {};
            window._pcPrices[a.s] = p;
            var origIdx = results.indexOf(a);
            var el = document.getElementById(idPrefix + origIdx);
            if(el){
              var dec = p > 100 ? 2 : (p > 1 ? 2 : 4);
              el.style.fontSize='12px'; el.style.fontWeight='700'; el.style.color='#111';
              el.textContent = '$' + Number(p).toLocaleString(window._numLocale(),{minimumFractionDigits:dec,maximumFractionDigits:dec});
            }
          }
        }
      }).catch(function(){});
  });
};

window._buscarActivos = function(q, cb) {
  var local = window._IA_ACTIVOS || [];
  var ql = q.toLowerCase().trim();
  var localMatches = ql.length < 1
    ? local.slice(0, 20)
    : local.filter(function(a){ return a.s.toLowerCase().indexOf(ql)>=0 || a.n.toLowerCase().indexOf(ql)>=0; });
  if(ql.length < 2) { cb(localMatches); return; }
  var done = false;
  var timer = setTimeout(function(){ if(!done){ done=true; cb(localMatches); } }, 3500);
  var yahooUrl = 'https://aurex-app-production.up.railway.app/api/yahoo/search?q='+encodeURIComponent(q);
  fetch(yahooUrl, {signal: AbortSignal.timeout(4000)})
    .then(function(r){ return r.json(); })
    .then(function(data) {
      if(done) return;
      var quotes = (data.quotes||[]).filter(function(qt){
        return qt.isYahooFinance && qt.symbol && ['EQUITY','ETF','CRYPTOCURRENCY','MUTUALFUND','INDEX'].indexOf(qt.quoteType)>=0;
      });
      var yahooResults = quotes.map(function(qt){
        var tipo = qt.quoteType==='EQUITY'?'accion':qt.quoteType==='ETF'?'etf':qt.quoteType==='CRYPTOCURRENCY'?'cripto':'otro';
        return { s:qt.symbol, n:qt.shortname||qt.longname||qt.symbol, tipo:tipo, ySymbol:qt.symbol, logo:'', color:tipo==='cripto'?'#F7931A':tipo==='accion'?'#58A6FF':tipo==='etf'?'#F0883E':'var(--gold)', abbr:qt.symbol.replace(/-USD$/,'').substring(0,3).toUpperCase(), _fromYahoo:true };
      });
      var seen = {}; var merged = [];
      localMatches.forEach(function(a){ if(!seen[a.s]){ seen[a.s]=true; merged.push(a); } });
      yahooResults.forEach(function(a){ if(!seen[a.s]){ seen[a.s]=true; merged.push(a); } });
      done=true; clearTimeout(timer);
      cb(merged.slice(0,20));
    })
    .catch(function(){ if(!done){ done=true; clearTimeout(timer); cb(localMatches); } });
};

window._renderSearchResult = function(a, idx, onclickFnName) {
  var logoHtml = a.logo
    ? '<img src="' + a.logo + '" style="width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0;" onerror="this.style.display=\'none\';" />'
    : '<div style="width:26px;height:26px;border-radius:50%;background:' + (a.color||'#ddd') + ';display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0;">' + (a.abbr||a.s.substring(0,3).toUpperCase()) + '</div>';
  var tipoColor = a.tipo==='cripto'?'#A78BFA':a.tipo==='accion'?'#58A6FF':a.tipo==='etf'?'#F0883E':'var(--textSec)';
  var tipoLabel = a.tipo==='cripto'?t('mkt_tipo_cripto'):a.tipo==='accion'?t('mkt_tipo_accion'):a.tipo==='etf'?t('mkt_tipo_etf'):a.tipo==='bono'?t('mkt_ia_bonos'):a.tipo==='metal'?t('mkt_ia_metales'):a.tipo==='materia_prima'?t('mkt_ia_materias'):(a.tipo||t('mkt_tipo_activo'));
  var yahooTag = a._fromYahoo ? ' <span style="font-size:8px;background:#58A6FF20;color:#58A6FF;border-radius:3px;padding:1px 4px;">YAHOO</span>' : '';
  var cachedP = (window._pcPrices||{})[a.s];
  var priceHtml = cachedP ? '<span style="font-size:12px;font-weight:700;color:#111;flex-shrink:0;">$'+Number(cachedP).toLocaleString(window._numLocale(),{minimumFractionDigits:2,maximumFractionDigits:2})+'</span>' : '<span id="port-sr-p-'+idx+'" style="font-size:11px;color:#999;flex-shrink:0;">...</span>';
  return '<div onclick="' + onclickFnName + '(' + idx + ')" style="display:flex;align-items:center;gap:10px;padding:10px 10px;border-radius:8px;cursor:pointer;background:var(--card);margin-bottom:4px;-webkit-tap-highlight-color:rgba(0,0,0,0);">' +
    logoHtml +
    '<div style="flex:1;min-width:0;display:flex;align-items:center;gap:6px;"><span style="font-size:14px;font-weight:700;color:#111;">' + a.s + '</span><span style="font-size:13px;color:var(--textSec);">' + a.n + '</span>' + yahooTag + '</div>' +
    priceHtml +
    '</div>';
};

window.filterPortSearch = function(){
  var q = (document.getElementById('pa-search') ? document.getElementById('pa-search').value : '').trim();
  var res = document.getElementById('pa-results');
  if(!res) return;
  if(q.length === 0) {
    var local = (window._IA_ACTIVOS||[]).slice(0,20);
    window._portSearchActs = local;
    res.innerHTML = local.map(function(a,i){ return window._renderSearchResult(a, i, 'window._portPickIdx'); }).join('');
    window._fetchSearchPrices(local, 'port-sr-p-');
    return;
  }
  res.innerHTML = '<div style="font-size:11px;color:#999;padding:8px;text-align:center;">'+t('port_buscando')+'</div>';
  window._buscarActivos(q, function(results){
    window._portSearchActs = results;
    if(!results.length){
      res.innerHTML = '<div style="font-size:11px;color:#999;padding:8px;text-align:center;">'+t('port_sin_resultados') + q + '"</div>';
      return;
    }
    res.innerHTML = results.map(function(a,i){ return window._renderSearchResult(a, i, 'window._portPickIdx'); }).join('');
    window._fetchSearchPrices(results, 'port-sr-p-');
  });
};
window._portPickIdx = function(idx){
  var acts = window._portSearchActs || [];
  var a = acts[idx];
  if(!a) return;
  window.selectPortActivo(a.s, a.n);
};
window.selectPortActivo = function(sym, nombre){
  var sel = document.getElementById('pa-selected');
  var selName = document.getElementById('pa-sel-name');
  var symInput = document.getElementById('pa-sym');
  var acts = window._portSearchActs || [];
  var act = null;
  for(var i=0;i<acts.length;i++){ if(acts[i].s===sym){ act=acts[i]; break; } }
  if(!act) act = {s:sym, n:nombre, tipo:'accion'};
  if(sel) sel.style.display = 'block';
  var selInput = document.getElementById('pa-sel-input');
  if(selInput) selInput.value = sym + ' - ' + nombre;
  if(selName) selName.textContent = sym + '  ' + nombre;
  if(symInput) symInput.value = sym + '|' + nombre + '|' + (act ? act.tipo : 'accion');
  var res = document.getElementById('pa-results');
  if(res) res.style.display = 'none';
  // Vista previa: cargar precio actual (igual que nativa)
  var previewPrice = document.getElementById('pa-preview-price');
  var previewValue = document.getElementById('pa-preview-value');
  var prcs = window._pcPrices || {};
  window._paCurrentPrice = prcs[sym] || 0;
  function _renderPrice() {
    if(previewPrice) previewPrice.textContent = window._paCurrentPrice ? '$' + window._paCurrentPrice.toLocaleString(window._numLocale(),{minimumFractionDigits:2,maximumFractionDigits:2}) : t('port_cargando');
  }
  _renderPrice();
  // Si no hay precio en cache, fetch del backend (igual que nativa)
  if(!window._paCurrentPrice) {
    fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol=' + sym + '&interval=1d&range=1d')
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d.chart && d.chart.result && d.chart.result[0]) {
          window._paCurrentPrice = d.chart.result[0].meta.regularMarketPrice || 0;
          _renderPrice();
          _updatePreview();
        }
      }).catch(function(){ fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+sym+'?interval=1d&range=1d').then(function(r){return r.json();}).then(function(d){if(d.chart&&d.chart.result&&d.chart.result[0]){window._paCurrentPrice=d.chart.result[0].meta.regularMarketPrice||0;_renderPrice();_updatePreview();}}).catch(function(){if(previewPrice)previewPrice.textContent='Error de precio';}); });
  }
  function _updatePreview(){
    var q = parseFloat((document.getElementById('pa-qty')||{}).value) || 0;
    var p = parseFloat((document.getElementById('pa-price')||{}).value) || 0;
    var mktPrice = window._paCurrentPrice || 0;
    var val = q * mktPrice;
    var pnl = (q > 0 && p > 0) ? q * (mktPrice - p) : 0;
    if(previewValue) previewValue.textContent = '$' + val.toLocaleString(window._numLocale(),{minimumFractionDigits:2,maximumFractionDigits:2});
    var pnlEl = document.getElementById('pa-preview-pnl');
    if(pnlEl) {
      if(q > 0 && p > 0 && mktPrice > 0) {
        pnlEl.textContent = (pnl >= 0 ? '+' : '') + '$' + Math.abs(pnl).toLocaleString(window._numLocale(),{minimumFractionDigits:2,maximumFractionDigits:2});
        pnlEl.style.color = pnl >= 0 ? '#16a34a' : '#dc2626';
      } else {
        pnlEl.textContent = '$0,00';
        pnlEl.style.color = '#333';
      }
    }
  }
  var qtyEl = document.getElementById('pa-qty');
  var priceEl = document.getElementById('pa-price');
  if(qtyEl) { qtyEl.oninput = _updatePreview; }
  if(priceEl) { priceEl.oninput = _updatePreview; }
  _updatePreview();
}

window.savePortActivo = function(){
  var symInput = document.getElementById('pa-sym');
  var qtyInput = document.getElementById('pa-qty');
  var priceInput = document.getElementById('pa-price');
  var errEl = document.getElementById('pa-err');
  if(!symInput || !symInput.value){ if(errEl){errEl.textContent=t('port_err_select_activo');errEl.style.display='block';} return; }
  var parts = symInput.value.split('|');
  var sym = parts[0], nombre = parts[1] || parts[0], tipo = parts[2] || 'accion';
  var qty = parseFloat(qtyInput ? qtyInput.value : 0);
  var price = parseFloat(priceInput ? priceInput.value : 0);
  if(!qty || qty <= 0){ if(errEl){errEl.textContent=t('port_err_cantidad');errEl.style.display='block';} return; }
  if(!price || price <= 0){ if(errEl){errEl.textContent=t('port_err_precio');errEl.style.display='block';} return; }
  if(errEl) errEl.style.display='none';
  // Dedupe check — idéntico a nativa saveAsset línea 450
  var items = window._portItems || [];
  var existing = null;
  for(var i=0;i<items.length;i++){ if(items[i].simbolo===sym){ existing=items[i]; break; } }
  if(existing) {
    var sumQty = existing.cantidad + qty;
    var avgPrice = parseFloat(((existing.cantidad * existing.precio_compra) + (qty * price)) / sumQty).toFixed(4);
    window.closePortModal();
    window._showDupeModal(sym, existing, qty, price, sumQty, parseFloat(avgPrice));
    return;
  }
  window.addPortfolioItem(sym, nombre, qty, price, tipo);
  window.closePortModal();
};

// Modal de duplicados — idéntico a nativa dupeModal (líneas 981-1050)
window._showDupeModal = function(sym, existing, newQty, newPrice, sumQty, avgPrice) {
  var old = document.getElementById('dupe-modal-overlay');
  if(old) old.remove();
  var fmt = function(v){ return v ? v.toLocaleString(window._numLocale(),{minimumFractionDigits:2,maximumFractionDigits:2}) : '0,00'; };
  var ov = document.createElement('div');
  ov.id = 'dupe-modal-overlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:20px;';
  ov.onclick = function(e){ if(e.target===ov){ ov.remove(); } };
  ov.innerHTML =
    '<div style="background:var(--card);border:3px solid var(--gold);border-radius:20px;padding:20px;width:100%;max-width:380px;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">' +
        '<span style="font-size:28px;">⚠️</span>' +
        '<div style="flex:1;"><div style="font-size:15px;font-weight:800;color:#111;">'+sym+' '+t('port_dupe_title_suffix')+'</div><div style="font-size:11px;color:var(--textSec);margin-top:2px;">'+t('port_dupe_question')+'</div></div>' +
        '<span onclick="document.getElementById(\'dupe-modal-overlay\').remove()" style="font-size:20px;color:#999;cursor:pointer;padding:4px 8px;">✕</span>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin:14px 0;">' +
        '<div style="flex:1;padding:10px;border-radius:10px;background:var(--card);border:1px solid #ddd;">' +
          '<div style="font-size:9px;font-weight:700;color:var(--textSec);letter-spacing:0.5px;margin-bottom:6px;">'+t('port_dupe_actual')+'</div>' +
          '<div style="font-size:11px;color:var(--textSec);">'+t('port_cantidad_label')+'</div>' +
          '<div style="font-size:15px;font-weight:700;color:#111;margin-bottom:4px;">'+existing.cantidad+'</div>' +
          '<div style="font-size:11px;color:var(--textSec);">'+t('port_precio_compra_short')+'</div>' +
          '<div style="font-size:13px;font-weight:700;color:#111;">$'+fmt(existing.precio_compra)+'</div>' +
        '</div>' +
        '<div style="flex:1;padding:10px;border-radius:10px;background:var(--card);border:1px solid var(--gold);">' +
          '<div style="font-size:9px;font-weight:700;color:var(--gold);letter-spacing:0.5px;margin-bottom:6px;">'+t('port_dupe_nuevo')+'</div>' +
          '<div style="font-size:11px;color:var(--textSec);">'+t('port_cantidad_label')+'</div>' +
          '<div style="font-size:15px;font-weight:700;color:#111;margin-bottom:4px;">'+newQty+'</div>' +
          '<div style="font-size:11px;color:var(--textSec);">'+t('port_precio_compra_short')+'</div>' +
          '<div style="font-size:13px;font-weight:700;color:#111;">$'+fmt(newPrice)+'</div>' +
        '</div>' +
      '</div>' +
      '<div id="dupe-btn-sumar" style="background:#16a34a;border-radius:10px;padding:13px;margin-bottom:10px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:14px;font-weight:800;color:#fff;">'+t('port_dupe_sumar')+'</div>' +
        '<div style="font-size:10px;color:#fff;margin-top:3px;opacity:0.9;">'+t('port_dupe_total')+' '+sumQty+' '+sym+' · '+t('port_dupe_promedio')+' $'+fmt(avgPrice)+'</div>' +
      '</div>' +
      '<div id="dupe-btn-reemplazar" style="background:#dc2626;border-radius:10px;padding:13px;margin-bottom:10px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:14px;font-weight:800;color:#fff;">'+t('port_dupe_reemplazar')+'</div>' +
        '<div style="font-size:10px;color:#fff;margin-top:3px;opacity:0.9;">'+t('port_dupe_descarta')+' '+newQty+' '+sym+' @ $'+fmt(newPrice)+'</div>' +
      '</div>' +
      '<div id="dupe-btn-cancelar" style="background:transparent;border:1px solid #ddd;border-radius:10px;padding:13px;cursor:pointer;text-align:center;">' +
        '<div style="font-size:13px;font-weight:600;color:var(--textSec);">'+t('cancelar')+'</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(ov);
  document.getElementById('dupe-btn-sumar').addEventListener('click', function(){
    ov.remove();
    existing.cantidad = sumQty;
    existing.precio_compra = avgPrice;
    try { localStorage.setItem('aurex_port_items', JSON.stringify(window._portItems)); } catch(e){}
    if(typeof window._renderPortfolioItems === 'function') window._renderPortfolioItems(window._portItems);
    if(typeof window._updateTotals === 'function') window._updateTotals(window._portItems);
  });
  document.getElementById('dupe-btn-reemplazar').addEventListener('click', function(){
    ov.remove();
    existing.cantidad = newQty;
    existing.precio_compra = newPrice;
    try { localStorage.setItem('aurex_port_items', JSON.stringify(window._portItems)); } catch(e){}
    if(typeof window._renderPortfolioItems === 'function') window._renderPortfolioItems(window._portItems);
    if(typeof window._updateTotals === 'function') window._updateTotals(window._portItems);
  });
  document.getElementById('dupe-btn-cancelar').addEventListener('click', function(){ ov.remove(); });
};
window.openPortModal = function(prefillTicker){ _openAddActivoModal(prefillTicker); };
window.openAddActivo = function(prefillTicker){ _openAddActivoModal(prefillTicker); };
window.closePortModal = function(){ var m = document.getElementById('port-modal'); if(m) m.style.display='none'; var errEl=document.getElementById('pa-err'); if(errEl){errEl.style.display='none';errEl.textContent='';} var res=document.getElementById('pa-results'); if(res) res.style.display='flex'; };
Modal = function(){ var modal=document.getElementById('port-modal'); if(modal) modal.style.display='none'; };

// ═══════════════════════════════════════════════════════════════
// WATCHLIST — Spec TAB_WATCHLIST_SPEC.md completo
// Multiples listas, colores, lista principal, detalle activo
// ═══════════════════════════════════════════════════════════════

var WL_COLORS = ['#D4A017','#3B82F6','#EC4899','#8B5CF6','#EF4444','#10B981','#F59E0B','#6366F1']; // M4: idéntico a LIST_COLORS nativo
var _wlSelectedList = null;
var _wlNewColor = WL_COLORS[0];
var _wlNewPrimary = false;

// Storage helpers — Supabase (synced with native app)
// Cache local para no hacer fetch en cada render
var _wlListsCache = null;
var _wlItemsCache = {};

function _wlGetLists(){ return _wlListsCache || []; }
function _wlSaveLists(lists){ _wlListsCache = lists; }
function _wlGetItems(listId){ return _wlItemsCache[listId] || []; }
function _wlSaveItems(listId, items){ _wlItemsCache[listId] = items; }

// Sync with Supabase
function _wlSyncFromSupabase(cb){
  var sb = window._supabase;
  if(!sb || !window._currentUser) { if(cb) cb(); return; }
  var uid = window._currentUser.id;
  sb.from('watchlists').select('*').eq('user_id', uid).order('position').then(function(res){
    _wlListsCache = res.data || [];
    if(_wlListsCache.length === 0){ if(cb) cb(); return; }
    var done = 0;
    _wlListsCache.forEach(function(list){
      sb.from('watchlist_items').select('*').eq('watchlist_id', list.id).order('position').then(function(r2){
        _wlItemsCache[list.id] = r2.data || [];
        done++;
        if(done === _wlListsCache.length){
          try{localStorage.setItem('aurex_wl_pwa_cache',JSON.stringify({lists:_wlListsCache,items:_wlItemsCache}));}catch(e){}
          if(cb) cb();
        }
      });
    });
  }).catch(function(){
    try{var cached=localStorage.getItem('aurex_wl_pwa_cache');if(cached){var d=JSON.parse(cached);_wlListsCache=d.lists||[];_wlItemsCache=d.items||{};}}catch(e){}
    if(cb) cb();
  });
}

function _wlInsertList(list, cb){
  var sb = window._supabase;
  if(!sb || !window._currentUser) { if(cb) cb(); return; }
  sb.from('watchlists').insert({
    user_id: window._currentUser.id,
    name: list.name, color: list.color, is_primary: list.is_primary, position: list.position
  }).select().then(function(res){
    if(res.data && res.data[0]) {
      list.id = res.data[0].id;
      _wlListsCache = (_wlListsCache||[]).concat(res.data);
    }
    if(cb) cb();
  });
}

function _wlDeleteListDB(listId, cb){
  var sb = window._supabase;
  if(!sb) { if(cb) cb(); return; }
  sb.from('watchlist_items').delete().eq('watchlist_id', listId).then(function(){
    sb.from('watchlists').delete().eq('id', listId).then(function(){
      _wlListsCache = (_wlListsCache||[]).filter(function(l){ return l.id !== listId; });
      delete _wlItemsCache[listId];
      if(cb) cb();
    });
  });
}

function _wlInsertItem(listId, item, cb){
  var sb = window._supabase;
  if(!sb) { if(cb) cb(); return; }
  sb.from('watchlist_items').insert({
    watchlist_id: listId, ticker: item.s, asset_type: item.tipo, position: (_wlItemsCache[listId]||[]).length
  }).select().then(function(res){
    if(res.data && res.data[0]) {
      if(!_wlItemsCache[listId]) _wlItemsCache[listId] = [];
      _wlItemsCache[listId].push(res.data[0]);
    }
    if(cb) cb();
  });
}

function _wlDeleteItemDB(listId, ticker, cb){
  var sb = window._supabase;
  if(!sb) { if(cb) cb(); return; }
  var items = _wlItemsCache[listId]||[];
  var item = items.find(function(i){ return i.ticker === ticker; });
  if(!item) { if(cb) cb(); return; }
  sb.from('watchlist_items').delete().eq('id', item.id).then(function(){
    _wlItemsCache[listId] = items.filter(function(i){ return i.ticker !== ticker; });
    if(cb) cb();
  });
}

// ─── CREAR LISTA ───
window.wlCreateListModal = function(){
  var m = document.getElementById('wl-create-modal');
  if(!m) return;
  var colorsDiv = document.getElementById('wl-colors');
  if(colorsDiv){
    _wlNewColor = WL_COLORS[0];
    colorsDiv.innerHTML = WL_COLORS.map(function(c){
      return '<div onclick="wlPickColor(\''+c+'\')" id="wlc-'+c.replace('#','')+'" style="width:28px;height:28px;border-radius:50%;background:'+c+';cursor:pointer;border:2px solid '+(c===_wlNewColor?'#fff':'transparent')+'"></div>';
    }).join('');
  }
  _wlNewPrimary = false;
  var star = document.getElementById('wl-primary-star');
  if(star) star.textContent = '☆';
  var nameEl = document.getElementById('wl-new-name');
  if(nameEl) nameEl.value = '';
  m.style.cssText = 'display:flex;position:fixed;top:0;left:0;width:100%;height:100%;background:#000000CC;z-index:100;align-items:center;justify-content:center';
};
window.wlCloseCreateModal = function(){ var m=document.getElementById('wl-create-modal'); if(m) m.style.display='none'; };
window.wlPickColor = function(c){
  _wlNewColor = c;
  WL_COLORS.forEach(function(cc){
    var el = document.getElementById('wlc-'+cc.replace('#',''));
    if(el) el.style.border = '2px solid '+(cc===c?'#fff':'transparent');
  });
};
window.wlTogglePrimary = function(){
  _wlNewPrimary = !_wlNewPrimary;
  var star = document.getElementById('wl-primary-star');
  if(star) star.textContent = _wlNewPrimary ? '⭐' : '☆';
};
window.wlCreateList = function(){
  var nameEl = document.getElementById('wl-new-name');
  var name = nameEl ? nameEl.value.trim() : '';
  if(!name){ alert((window._i18n?window._i18n.t('pw_ingresa_nombre'):'Ingresa un nombre')); return; }
  var lists = _wlGetLists();
  // Gating por plan: FREE topa en watchlistMax (10).
  if(window.checkPlanLimit){
    var _chk = window.checkPlanLimit('add_watchlist', lists.length);
    if(_chk && !_chk.ok){ wlCloseCreateModal(); if(window.showPaywall) window.showPaywall(_chk); return; }
  }
  var newList = { name: name, color: _wlNewColor, is_primary: _wlNewPrimary || lists.length === 0, position: lists.length };
  wlCloseCreateModal();
  _wlInsertList(newList, function(){
    if(newList.id) _wlSelectedList = newList.id;
    renderWatchCnt();
  });
};

// ─── ELIMINAR LISTA — Modal visual (idéntico a nativa) ───
window.wlDeleteList = function(listId){
  var old = document.getElementById('wl-delete-overlay'); if(old) old.remove();
  var overlay = document.createElement('div');
  overlay.id = 'wl-delete-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px';
  overlay.onclick = function(e){ if(e.target===overlay) overlay.remove(); };
  var card = document.createElement('div');
  card.style.cssText = 'width:100%;max-width:300px;background:var(--card);border-radius:16px;padding:20px;box-shadow:0 10px 20px rgba(0,0,0,0.35)';
  card.onclick = function(e){ e.stopPropagation(); };
  var html = '';
  html += '<div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px">'+t('wl_eliminar_lista')+'</div>';
  html += '<div style="font-size:13px;color:var(--textSec);margin-bottom:20px">'+t('wl_delete_desc')+'</div>';
  html += '<div style="display:flex;gap:12px">';
  html += '<div onclick="document.getElementById(\'wl-delete-overlay\').remove()" style="flex:1;padding:12px;border-radius:10px;background:var(--border);text-align:center;cursor:pointer"><span style="font-size:14px;font-weight:600;color:var(--text)">'+t('cancelar')+'</span></div>';
  html += '<div onclick="document.getElementById(\'wl-delete-overlay\').remove();if(window._wlSelectedList===\''+listId+'\')window._wlSelectedList=null;window._wlDeleteListDB(\''+listId+'\',function(){renderWatchCnt();})" style="flex:1;padding:12px;border-radius:10px;background:#F8514920;border:1px solid #F8514960;text-align:center;cursor:pointer"><span style="font-size:14px;font-weight:700;color:var(--red)">'+t('wl_eliminar')+'</span></div>';
  html += '</div>';
  card.innerHTML = html;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
};

// ─── MARCAR PRINCIPAL ───
window.wlSetPrimary = function(listId){
  var sb = window._supabase;
  if(!sb || !window._currentUser) return;
  var uid = window._currentUser.id;
  sb.from('watchlists').update({is_primary: false}).eq('user_id', uid).then(function(){
    sb.from('watchlists').update({is_primary: true}).eq('id', listId).then(function(){
      _wlSyncFromSupabase(function(){ renderWatchCnt(); });
    });
  });
};

// ─── SELECCIONAR LISTA ───
window.wlSelectList = function(listId){
  _wlSelectedList = listId;
  renderWatchCnt();
};

// ─── AGREGAR ACTIVO ───
window.wlOpenAddModal = function(){
  var m = document.getElementById('wl-add-modal');
  if(!m) return;
  m.style.cssText = 'display:flex;position:fixed;top:0;left:0;width:100%;height:100dvh;background:#000000CC;z-index:100;align-items:flex-end;justify-content:center';
  var searchEl = document.getElementById('wl-add-search');
  if(searchEl){ searchEl.value = ''; }
  wlSearchAssets();
  setTimeout(function(){ if(searchEl) searchEl.focus(); }, 100);
};
window.wlCloseAddModal = function(){ var m=document.getElementById('wl-add-modal'); if(m) m.style.display='none'; };
window.wlSearchAssets = function(){
  var q = (document.getElementById('wl-add-search')?document.getElementById('wl-add-search').value:'').trim();
  var res = document.getElementById('wl-add-results');
  if(!res) return;
  var acts = window._IA_ACTIVOS || [];
  var filtered = q.length === 0 ? acts.slice(0,20) : acts.filter(function(a){ var u=q.toUpperCase(); return a.s.indexOf(u)>=0 || (a.n||'').toUpperCase().indexOf(u)>=0; }).slice(0,15);
  var sigs = window._iaSignals || [];
  res.innerHTML = filtered.map(function(a, idx){
    var sig = null;
    for(var i=0;i<sigs.length;i++){ if(sigs[i].simbolo===a.s){ sig=sigs[i]; break; } }
    var dir = sig ? sig.direccion : '';
    var dirColor = dir==='alcista'?'var(--green)':dir==='bajista'?'var(--red)':dir==='alta_conf'?'var(--gold)':'var(--textDim)';
    var dirLabel = dir==='alcista'?t('ia_w_alcista'):dir==='bajista'?t('ia_w_bajista'):dir==='alta_conf'?t('ia_w_altaconf'):'';
    var prob = sig ? (sig.confianza||'') : '';
    var logoHtml = a.logo ? '<img src="'+a.logo+'" style="width:26px;height:26px;border-radius:50%;object-fit:cover" onerror="this.style.display=\'none\'" />' : '<div style="width:26px;height:26px;border-radius:50%;background:'+(a.color||'var(--border)')+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--text)">'+a.s[0]+'</div>';
    return '<div onclick="wlAddAsset(\''+a.s+'\',\''+a.n.replace(/'/g,"\\'")+'\',\''+a.tipo+'\')" style="display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;background:var(--bg);border:0.5px solid var(--border);margin-bottom:4px;cursor:pointer">'+
      logoHtml+
      '<div style="flex:1"><div style="font-size:12px;font-weight:700;color:var(--text)">'+a.s+'</div><div style="font-size:10px;color:var(--textDim)">'+a.n+'</div></div>'+
      (dirLabel ? '<span style="font-size:8px;font-weight:700;color:'+dirColor+';background:'+dirColor+'20;padding:1px 5px;border-radius:4px;border:0.5px solid '+dirColor+'60">'+dirLabel+(prob?' '+prob+'%':'')+'</span>' : '')+
      '<span style="font-size:9px;color:var(--textDim);background:var(--border);padding:1px 5px;border-radius:4px">'+a.tipo+'</span>'+
    '</div>';
  }).join('');
};
window.wlAddAsset = function(sym, nombre, tipo){
  if(!_wlSelectedList) return;
  var items = _wlGetItems(_wlSelectedList);
  if(items.find(function(i){ return (i.s===sym || i.ticker===sym); })){ wlCloseAddModal(); return; }
  wlCloseAddModal();
  _wlInsertItem(_wlSelectedList, {s:sym, n:nombre, tipo:tipo}, function(){ renderWatchCnt(); });
};

// ─── ELIMINAR ACTIVO ───
window.wlRemoveAsset = function(sym, evt){
  if(evt) evt.stopPropagation();
  if(!_wlSelectedList) return;
  _wlDeleteItemDB(_wlSelectedList, sym, function(){ renderWatchCnt(); });
};

// ─── TOGGLE ALERTA WHATSAPP ───
window.wlToggleAlert = function(sym, evt){
  if(evt) evt.stopPropagation();
  if(!_wlSelectedList) return;
  var items = _wlGetItems(_wlSelectedList);
  var item = items.find(function(i){ return (i.s===sym || i.ticker===sym); });
  if(!item) return;
  var newVal = !item.alert_active;
  item.alert_active = newVal;
  var sb = window._supabase;
  if(sb && item.id) sb.from('watchlist_items').update({alert_active: newVal}).eq('id', item.id);
  renderWatchCnt();
};

// ─── WATCHLIST — Vista principal con multiples listas (spec 2.1-2.5) ────
window.renderWatchCnt = function(){
  var cnt = document.getElementById('watch-cnt');
  if(!cnt) return;
  var lists = _wlGetLists();

  // Sin listas: estado vacio
  if(lists.length === 0){
    cnt.innerHTML = '<div style="text-align:center;padding:60px 20px"><div style="font-size:40px;margin-bottom:12px">👀</div><div style="font-size:16px;font-weight:500;color:var(--text);margin-bottom:6px">'+t('wl_vacia_title')+'</div><div style="font-size:12px;color:var(--textDim);line-height:1.6;margin-bottom:16px">'+t('wl_vacia_desc')+'</div><span data-wl="createList" style="display:inline-block;padding:10px 20px;border-radius:10px;background:var(--goldBg);border:1px solid var(--gold);color:var(--gold);font-size:12px;font-weight:600;cursor:pointer">'+t('wl_crear_primera')+'</span></div>';
    return;
  }

  // Auto-seleccionar lista principal o primera
  if(!_wlSelectedList || !lists.find(function(l){return l.id===_wlSelectedList;})){
    var primary = lists.find(function(l){return l.is_primary;});
    _wlSelectedList = primary ? primary.id : lists[0].id;
  }
  var currentList = lists.find(function(l){return l.id===_wlSelectedList;});
  var currentItems = _wlGetItems(_wlSelectedList);
  var sigs = window._iaSignals || [];
  var prcs = window._pcPrices || {};
  var chg24 = window._pcChange24 || {};

  var html = '';

  // Cards de listas (scroll horizontal con fade)
  html += '<div style="position:relative"><div style="display:flex;gap:8px;padding:10px 11px;overflow-x:auto;flex-shrink:0;padding-right:40px">';
  lists.forEach(function(list){
    var isSel = list.id === _wlSelectedList;
    var itemCount = _wlGetItems(list.id).length;
    html += '<div onclick="wlSelectList(\''+list.id+'\')" style="min-width:130px;background:var(--card);border-radius:10px;padding:10px;border:1.5px solid '+(isSel?list.color:'var(--border)')+';cursor:pointer;flex-shrink:0">';
    html += '<div style="display:flex;align-items:center;gap:4px">'+(list.is_primary?'<span style="font-size:11px">⭐</span>':'')+'<span style="font-size:13px;font-weight:700;color:'+list.color+'">'+list.name+'</span></div>';
    html += '<div style="font-size:10px;color:var(--textDim);margin-top:3px">'+itemCount+t('wl_activos_count')+'</div>';
    html += '</div>';
  });
  html += '</div>';
  if(lists.length > 2) html += '<div style="position:absolute;right:14px;top:0;bottom:0;display:flex;align-items:center;pointer-events:none"><div style="background:rgba(212,160,23,0.19);border-radius:12px;width:24px;height:24px;display:flex;align-items:center;justify-content:center"><span style="font-size:16px;color:var(--gold);font-weight:800">›</span></div></div>';
  html += '</div>';

  // Header lista seleccionada — 2 filas como nativa
  if(currentList){
    html += '<div style="margin:0 11px 8px;padding:10px 13px;border-radius:10px;border:1px solid var(--border2);background:var(--card)">';
    // Fila 1: dot + nombre + PRINCIPAL
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">';
    html += '<div style="width:10px;height:10px;border-radius:5px;background:'+currentList.color+'"></div>';
    html += '<span style="font-size:13px;font-weight:800;color:var(--text);flex-shrink:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+currentList.name+'</span>';
    if(currentList.is_primary) {
      html += '<span style="font-size:8px;font-weight:800;color:var(--gold);background:var(--navBg,#0D1117);border:1px solid var(--gold);padding:2px 6px;border-radius:4px">'+t('wl_principal')+'</span>';
    } else {
      html += '<a href="javascript:void(0)" data-wl="setPrimary" data-wl-param="'+currentList.id+'" style="font-size:10px;font-weight:600;color:var(--text);background:var(--chipBg,var(--border));border:1px solid var(--border2);padding:4px 8px;border-radius:6px;cursor:pointer;text-decoration:none">☆ '+t('wl_marcar_principal')+'</a>';
    }
    html += '</div>';
    // Fila 2: Comparar + 📤 + Agregar + 🗑️ (en fila)
    html += '<div style="display:flex;align-items:center;gap:10px">';
    var _cmpLabel = t('wl_comparar');
    var _cmpStyle = 'font-size:12px;font-weight:800;color:#000;background:var(--gold);padding:8px 14px;border-radius:8px;text-decoration:none;cursor:pointer';
    if(window._wlCompareMode && window._wlCompareItems && window._wlCompareItems.length >= 2){
      _cmpLabel = t('wl_comparar') + ' ' + window._wlCompareItems.length;
      _cmpStyle = 'font-size:12px;font-weight:800;color:#000;background:var(--gold);padding:8px 14px;border-radius:8px;text-decoration:none;cursor:pointer';
    } else if(window._wlCompareMode){
      _cmpLabel = t('wl_cancelar_modo');
      _cmpStyle = 'font-size:12px;font-weight:700;color:var(--red);background:#F8514920;padding:8px 14px;border-radius:8px;border:1px solid #F8514940;text-decoration:none;cursor:pointer';
    }
    html += '<a href="javascript:void(0)" data-wl="compareMode" style="'+_cmpStyle+'">'+_cmpLabel+'</a>';
    html += '<a href="javascript:void(0)" data-wl="shareList" style="font-size:16px;cursor:pointer;padding:4px;text-decoration:none">📤</a>';
    html += '<a href="javascript:void(0)" ontouchstart="wlOpenAddModal()" data-wl="addAsset" style="padding:8px 14px;border-radius:8px;background:var(--gold);color:#000;font-size:12px;font-weight:800;cursor:pointer;text-decoration:none">'+t('wl_agregar')+'</a>';
    html += '<div onclick="wlDeleteList(\''+currentList.id+'\')" style="font-size:14px;cursor:pointer;padding:4px">🗑️</div>';
    html += '</div>';
    html += '</div>';
  }

  // Botón comparar (arriba de los activos, siempre visible)
  if(window._wlCompareMode){
    var _cc = window._wlCompareItems ? window._wlCompareItems.length : 0;
    html += '<div style="padding:6px 14px;text-align:center"><span style="font-size:10px;color:var(--textSec)">'+(_cc >= 2 ? '✓ '+_cc+t('wl_seleccionados') : t('wl_selecciona_2_5'))+'</span></div>';
  }

  // Lista de activos
  if(currentItems.length === 0){
    html += '<div style="text-align:center;padding:40px 20px"><div style="font-size:28px;margin-bottom:8px">📋</div><div style="font-size:13px;color:var(--textSec)">'+t('wl_lista_vacia')+'</div><a href="javascript:void(0)" ontouchstart="wlOpenAddModal()" data-wl="addAsset" style="display:inline-block;margin-top:12px;padding:8px 16px;border-radius:8px;background:var(--goldBg);border:1px solid var(--gold);color:var(--gold);font-size:11px;font-weight:600;cursor:pointer">'+t('wl_agregar_primer')+'</span></div>';
  } else {
    currentItems.forEach(function(item){
      // Compatibilidad Supabase (ticker) y localStorage (s)
      if(!item.s && item.ticker) { item.s = item.ticker; }
      if(!item.n) { var _a = (window._IA_ACTIVOS||[]).find(function(a){return a.s===item.s;}); item.n = _a ? _a.n : item.s; }
      if(!item.tipo && item.asset_type) { item.tipo = item.asset_type; }
      var sig = null;
      for(var i=0;i<sigs.length;i++){ if(sigs[i].simbolo===item.s){ sig=sigs[i]; break; } }
      var precio = prcs[item.s] || (sig ? sig.precio : null);
      var cambio = chg24[item.s] || (sig && sig.precio24h>0 && sig.precio ? ((sig.precio-sig.precio24h)/sig.precio24h*100) : null);
      var dir = sig ? sig.direccion : '';
      var dirColor = dir==='alcista'?'var(--green)':dir==='bajista'?'var(--red)':dir==='alta_conf'?'var(--gold)':'var(--textDim)';
      var dirLabel = dir==='alcista'?t('ia_w_alcista'):dir==='bajista'?t('ia_w_bajista'):dir==='alta_conf'?t('ia_w_altaconf'):'';
      var dirBg = dir==='alcista'?'#3FB95020':dir==='bajista'?'#F8514920':dir==='alta_conf'?'var(--goldBg)':'transparent';
      var prob = sig ? (sig.confianza||'') : '';
      var act = (window._IA_ACTIVOS||[]).find(function(a){ return a.s===item.s; });
      var logoBg = dir==='alcista'?'#1A3A2A':dir==='bajista'?'#3A1A1A':'#333';
      var logoHtml = act && act.logo
        ? '<div style="width:36px;height:36px;border-radius:50%;background:'+logoBg+';display:flex;align-items:center;justify-content:center"><img src="'+act.logo+'" style="width:28px;height:28px;border-radius:50%;object-fit:cover" onerror="this.outerHTML=\'<span style=color:var(--text);font-size:11px;font-weight:700>'+item.s[0]+'</span>\'" /></div>'
        : '<div style="width:36px;height:36px;border-radius:50%;background:'+logoBg+';display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--text)">'+item.s[0]+'</div>';
      var precioFmt = precio ? _fmt(precio) : '...';
      var cambioPct = cambio !== null ? _fmt(cambio, 'pct') : '...';
      var cambioColor = cambio !== null ? (cambio >= 0 ? 'var(--green)' : 'var(--red)') : 'var(--textDim)';
      var tipoLow = (item.tipo||'').toLowerCase();
      var isCrypto = tipoLow==='cripto'||tipoLow==='stable';
      var now = new Date(); var utcH=now.getUTCHours(); var utcD=now.getUTCDay();
      var mktOpen = utcD>0&&utcD<6&&utcH>=14&&utcH<21;
      var mktClosed = !isCrypto && !mktOpen;

      // Dots IA (10 variables como Portfolio)
      var dotsHtml = '';
      if(sig && sig.scores){
        var varKeys=['tendencia','rsi','volumen','volatilidad','correlacion','oro_petroleo','macro','earnings','macd','soporte_resist'];
        dotsHtml = '<div style="display:flex;flex-wrap:wrap;gap:2px;min-width:40px;max-width:56px">';
        varKeys.forEach(function(k){
          var v=sig.scores[k]||0;
          if(v>0.01) dotsHtml+='<div style="width:6px;height:6px;border-radius:3px;background:var(--green)"></div>';
          else if(v<-0.01) dotsHtml+='<div style="width:6px;height:6px;border-radius:3px;background:var(--red)"></div>';
        });
        dotsHtml += '</div>';
      }

      // Asset row (formato Portfolio)
      var itemIdx = currentItems.indexOf(item);
      var isCompareMode = window._wlCompareMode;
      var isSelected = window._wlCompareItems && window._wlCompareItems.indexOf(item.s) >= 0;
      var rowClick = isCompareMode ? 'wlToggleCompare(\''+item.s+'\')' : 'wlOpenDetail(\''+item.s+'\')';
      var lpAttr = isCompareMode ? '' : ' ontouchstart="this._lpT=setTimeout(function(){this._lp=1;wlShowActionMenu(\''+item.s+'\')}.bind(this),400)" ontouchend="clearTimeout(this._lpT);if(this._lp){this._lp=0;event.preventDefault();event.stopPropagation();return false;}" ontouchmove="clearTimeout(this._lpT)" oncontextmenu="event.preventDefault()"';
      html += '<div onclick="if(this._lp){this._lp=0;event.stopPropagation();return false;}'+rowClick+'"'+lpAttr+' style="padding:0;border-bottom:0.5px solid var(--border);cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0)">';
      html += '<div style="display:flex;align-items:center;gap:6px;padding:10px 12px">';
      if(isCompareMode) {
        html += '<div data-wl-compare="'+item.s+'" style="width:22px;height:22px;border-radius:11px;border:2px solid '+(isSelected?'var(--gold)':'var(--border)')+';background:'+(isSelected?'var(--gold)':'transparent')+';display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0">'+(isSelected?'<span style="color:var(--chipTextActive);font-size:12px;font-weight:800">✓</span>':'')+'</div>';
      } else {
        // Flechas reordenar
        html += '<div style="display:flex;flex-direction:column;gap:1px;margin-right:2px">';
        html += '<a href="javascript:void(0)" onclick="event.stopPropagation();wlMoveItem('+itemIdx+',-1)" style="font-size:11px;color:'+(itemIdx===0?'#333':'var(--textSec)')+';width:18px;text-align:center;cursor:pointer;text-decoration:none">▲</a>';
        html += '<a href="javascript:void(0)" onclick="event.stopPropagation();wlMoveItem('+itemIdx+',1)" style="font-size:11px;color:'+(itemIdx===currentItems.length-1?'#333':'var(--textSec)')+';width:18px;text-align:center;cursor:pointer;text-decoration:none">▼</a>';
        html += '</div>';
      }
      html += logoHtml;
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="display:flex;align-items:center;gap:6px"><span style="font-size:14px;font-weight:700;color:var(--text)">'+item.s+'</span><span style="font-size:10px;padding:1px 6px;border-radius:5px;background:var(--border);color:var(--textSec)">'+(window._tipoLabel?window._tipoLabel(tipoLow):(tipoLow||''))+'</span></div>';
      html += '<div style="font-size:11px;color:var(--textSec);margin-top:1px">'+item.n+'</div>';
      html += '<div style="display:flex;align-items:center;gap:4px;margin-top:3px"><span style="font-size:8px;font-weight:700;color:'+dirColor+'">'+(dir==='alcista'?'📈':dir==='bajista'?'📉':dir==='alta_conf'?'⚡':'')+ ' '+dirLabel+' '+(prob?prob+'%':'')+'</span></div>';
      html += '</div>';
      html += dotsHtml;
      // Columna derecha: precio + dots arriba, Ult.cierre/24-7 + % abajo (como nativa)
      var _rowPer = window._wlPeriods[item.s] || '24h';
      var _rowChg = cambio;
      var _rowChgCol = cambioColor;
      if(_rowPer !== '24h'){
        var _rhp = window._wlHistPrices[_rowPer] && window._wlHistPrices[_rowPer][item.s];
        var _rcp = precio || 0;
        if(_rhp && _rhp > 0 && _rcp > 0){
          _rowChg = ((_rcp - _rhp) / _rhp) * 100;
          _rowChgCol = _rowChg >= 0 ? 'var(--green)' : 'var(--red)';
        } else { _rowChg = null; _rowChgCol = 'var(--textDim)'; }
      }
      var _rowPct = _rowChg !== null ? _fmt(_rowChg, 'pct') : '...';
      html += '<div style="text-align:right;flex-shrink:0;margin-left:4px">';
      html += '<div style="display:flex;align-items:center;gap:4px;justify-content:flex-end"><span style="font-size:14px;font-weight:700;color:var(--text)">'+precioFmt+'</span></div>';
      html += '<div style="display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-top:0">';
      if(isCrypto) html += '<span style="font-size:8px;color:var(--green);font-weight:700;border:0.5px solid var(--green);border-radius:3px;padding:0.5px 3px">24/7</span>';
      if(mktClosed && !isCrypto) html += '<span style="font-size:9px;color:var(--gold);font-weight:700">'+(window.t?window.t('pw_ult_cierre'):'Ult. cierre')+'</span>';
      html += '<span style="font-size:11px;font-weight:600;color:'+_rowChgCol+'">'+_rowPct+'</span>';
      html += '</div></div>';
      // Botón eliminar
      html += '<div style="display:flex;align-items:center;gap:4px;margin-left:4px">';
      html += '<div onclick="wlRemoveAsset(\''+item.s+'\',event)" style="font-size:12px;color:var(--textDim);cursor:pointer">🗑️</div>';
      html += '</div></div>';
      // Bottom row: period buttons + cambio % (como nativa)
      var _curPer = window._wlPeriods[item.s] || '24h';
      var _perChange = cambio;
      var _perColor = cambioColor;
      if(_curPer !== '24h'){
        var _hp = window._wlHistPrices[_curPer] && window._wlHistPrices[_curPer][item.s];
        var _curP = precio || 0;
        if(_hp && _hp > 0 && _curP > 0){
          _perChange = ((_curP - _hp) / _hp) * 100;
          _perColor = _perChange >= 0 ? 'var(--green)' : 'var(--red)';
        } else {
          _perChange = null;
          _perColor = 'var(--textDim)';
        }
      }
      var _perPct = _perChange !== null ? _fmt(_perChange, 'pct') : '...';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:0 12px 3px 52px;gap:4px;border-bottom:0.5px solid var(--border2)">';
      html += '<div onclick="event.stopPropagation();if(window.openCreateAlert)openCreateAlert(\''+item.s+'\',\''+(item.tipo||'')+'\')" style="font-size:14px;color:var(--gold);cursor:pointer;flex-shrink:0" title="'+t('al_ca_crear')+'">🔔</div>';
      html += '<div style="display:flex;gap:2px">';
      ['24h','7d','1m','3m','1y'].forEach(function(p){
        var isAct = _curPer === p;
        html += '<span onclick="event.stopPropagation();wlSetPeriod(\''+item.s+'\',\''+p+'\')" style="font-size:9px;padding:1px 3px;border-radius:3px;background:'+(isAct?'var(--gold)':'var(--border)')+';color:'+(isAct?'var(--bg)':'var(--textSec)')+';cursor:pointer">'+p+'</span>';
      });
      html += '</div></div>';
      html += '</div>';
    });
  }

  var oldFb = document.getElementById('wl-compare-float'); if(oldFb) oldFb.remove();
  cnt.innerHTML = html;

  // Fetch prices for items without prices
  var cryptoList = ['BTC','ETH','SOL','BNB','XRP','ADA','AVAX','DOT','LINK','MATIC','DOGE','SHIB','LTC','ATOM','UNI','NEAR','APT','ARB','OP','TRX','TON','SUI','PEPE','WIF','FIL','INJ','RUNE'];
  currentItems.forEach(function(item){
    if(prcs[item.s]) return;
    if(cryptoList.indexOf(item.s)>=0){
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol='+item.s+'USDT').then(function(r){return r.json();}).then(function(d){
        if(d.lastPrice){prcs[item.s]=parseFloat(d.lastPrice);chg24[item.s]=parseFloat(d.priceChangePercent);renderWatchCnt();}
      }).catch(function(){ fetch('https://aurex-app-production.up.railway.app/api/crypto-prices').then(function(r){return r.json();}).then(function(d){if(d&&d.prices&&d.prices[item.s]){prcs[item.s]=d.prices[item.s].price;renderWatchCnt();}}).catch(function(){}); });
    } else {
      fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol='+item.s+'&interval=1d&range=1d').then(function(r){return r.json();}).then(function(d){
        try{var meta=d.chart.result[0].meta;if(meta.regularMarketPrice){prcs[item.s]=meta.regularMarketPrice;var prev=meta.previousClose||meta.chartPreviousClose;if(prev)chg24[item.s]=((meta.regularMarketPrice-prev)/prev*100);renderWatchCnt();}}catch(e){}
      }).catch(function(){ fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+item.s+'?interval=1d&range=1d').then(function(r){return r.json();}).then(function(d){try{var meta=d.chart.result[0].meta;if(meta.regularMarketPrice){prcs[item.s]=meta.regularMarketPrice;var prev=meta.previousClose||meta.chartPreviousClose;if(prev)chg24[item.s]=((meta.regularMarketPrice-prev)/prev*100);renderWatchCnt();}}catch(e){}}).catch(function(){}); });
    }
  });
}

// ─── DETALLE DE ACTIVO (spec 2.3) — modal identico a IA expandido ─────
window.wlOpenDetail = function(sym){
  var modal = document.getElementById('wl-detail-modal');
  var body = document.getElementById('wl-detail-body');
  if(!modal || !body) return;
  var sigs = window._iaSignals || [];
  var sig = null;
  for(var i=0;i<sigs.length;i++){ if(sigs[i].simbolo===sym){ sig=sigs[i]; break; } }
  var act = (window._IA_ACTIVOS||[]).find(function(a){ return a.s===sym; });
  var prcs = window._pcPrices || {};
  var chg24 = window._pcChange24 || {};
  var precio = prcs[sym] || (sig ? sig.precio : 0);
  var cambio = chg24[sym] || (sig && sig.precio24h>0 ? ((sig.precio-sig.precio24h)/sig.precio24h*100) : 0);
  var dir = sig ? sig.direccion : '';
  var dirColor = dir==='alcista'?'var(--green)':dir==='bajista'?'var(--red)':dir==='alta_conf'?'var(--gold)':'var(--textDim)';
  var dirLabel = dir==='alcista'?t('ia_w_alcista'):dir==='bajista'?t('ia_w_bajista'):dir==='alta_conf'?t('ia_w_altaconf'):'SIN SENAL';
  var dirBg = dir==='alcista'?'#3FB95015':dir==='bajista'?'#F8514915':dir==='alta_conf'?'var(--goldBg)':'#55555510';
  var prob = sig ? (sig.confianza||sig.prob_principal||'--') : '--';
  var logoHtml = act && act.logo
    ? '<img src="'+act.logo+'" style="width:40px;height:40px;border-radius:50%;object-fit:cover" onerror="this.style.display=\'none\'" />'
    : '<div style="width:40px;height:40px;border-radius:50%;background:'+(act?act.color:'var(--border)')+';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:var(--text)">'+sym[0]+'</div>';
  // Reutilizar _buildIADetail si existe
  var html = '';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div style="display:flex;align-items:center;gap:12px">'+logoHtml+'<div><div style="font-size:18px;font-weight:700;color:var(--text)">'+sym+'</div><div style="font-size:11px;color:var(--textSec)">'+(act?act.n:sym)+' · '+(act?window._tipoLabel(act.tipo):'')+'</div></div></div><div onclick="wlCloseDetail()" style="width:36px;height:36px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--text);cursor:pointer">✕</div></div>';
  html += '<div style="display:flex;gap:10px;margin-bottom:14px"><div style="flex:1;background:var(--border);border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:4px">'+t('sort_precio')+'</div><div style="font-size:16px;font-weight:700;color:var(--text)">'+_fmt(precio)+'</div></div><div style="flex:1;background:var(--border);border-radius:10px;padding:10px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:4px">24h</div><div style="font-size:16px;font-weight:700;color:'+(cambio>=0?'var(--green)':'var(--red)')+'">'+_fmt(cambio,'pct')+'</div></div></div>';
  html += '<div style="background:'+dirBg+';border:1px solid '+dirColor+'40;border-radius:10px;padding:10px 12px;margin-bottom:12px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;font-weight:700;color:'+dirColor+'">'+dirLabel+'</span><span style="background:'+dirColor+';color:var(--chipTextActive);font-size:11px;font-weight:800;border-radius:6px;padding:2px 8px">'+t('wl_prob_prefix')+' '+prob+'%</span></div>';
  if(sig && sig.motivos && sig.motivos.length>0){html += '<div style="font-size:11px;font-weight:600;color:var(--textSec);letter-spacing:0.5px;margin-bottom:6px">'+t('ia_justificacion')+'</div>';(window.buildAiMotivos?window.buildAiMotivos(sig):(sig.motivos||[])).slice(0,5).forEach(function(m){html += '<div style="display:flex;gap:6px;margin-bottom:5px"><span style="color:'+dirColor+';font-weight:700">-></span><span style="font-size:11px;color:var(--textSec);line-height:1.4">'+m+'</span></div>';});}
  html += '</div>';
  if(sig){var objC=dir==='bajista'?'var(--red)':'var(--green)';var stC=dir==='bajista'?'#FF9500':'var(--red)';var up=sig.upside||0;html += '<div style="display:flex;gap:8px;margin-bottom:12px"><div style="flex:1;background:var(--border);border-radius:8px;padding:8px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:2px">'+(window._i18n&&window._i18n.t?window._i18n.t('wl_cmp_objetivo'):'Objetivo')+'</div><div style="font-size:12px;font-weight:700;color:'+objC+'">'+_fmt(sig.objetivo)+'</div></div><div style="flex:1;background:var(--border);border-radius:8px;padding:8px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:2px">Stop</div><div style="font-size:12px;font-weight:700;color:'+stC+'">'+_fmt(sig.stop)+'</div></div><div style="flex:1;background:var(--border);border-radius:8px;padding:8px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:2px">'+(up<0?'Downside':'Upside')+'</div><div style="font-size:12px;font-weight:700;color:'+(up<0?'var(--red)':'var(--green)')+'">'+(up>=0?'+':'')+up.toFixed(1)+'%</div></div></div>';}
  // Variables del modelo — lista plana en orden, label + peso + ●/○ (paridad nativa WatchlistScreen L1060-1077, NO agrupado pos/neg)
  if(sig && sig.scores){var sc=sig.scores;
    var _pA=t('mkt_vars_peso_alta'), _pM=t('mkt_vars_peso_media');
    var vdefs=[{k:'tendencia',l:t('v_tendencia_name'),p:_pA},{k:'rsi',l:t('v_rsi_name'),p:_pA},{k:'volumen',l:t('v_volumen_name'),p:_pA},{k:'volatilidad',l:t('v_volat_name'),p:_pM},{k:'correlacion',l:t('v_corr_name'),p:_pM},{k:'oro_petroleo',l:t('v_oro_name'),p:_pM},{k:'macro',l:t('v_macro_name'),p:_pM},{k:'earnings',l:t('v_earnings_name'),p:_pM},{k:'macd',l:t('v_macd_name'),p:_pA},{k:'soporte_resist',l:t('v_sr_name'),p:_pA}];
    html+='<div style="margin-bottom:12px"><div style="font-size:9px;font-weight:700;color:var(--textDim);margin-bottom:6px">'+t('variables_modelo')+'</div>';
    vdefs.forEach(function(v){var s=sc[v.k]||0;var col=s>0.01?'var(--green)':s<-0.01?'var(--red)':'var(--textDim)';var dot=(s>0.01||s<-0.01)?'●':'○';html+='<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 8px;border-left:2px solid '+col+';border-radius:0 6px 6px 0;margin-bottom:3px;background:var(--border)"><span style="font-size:11px;color:var(--text)">'+v.l+'</span><span style="display:flex;align-items:center;gap:4px"><span style="font-size:9px;color:'+col+';font-weight:700">'+v.p+'</span><span style="font-size:10px;color:'+col+'">'+dot+'</span></span></div>';});
    html+='</div>';}
  if(sig){html+='<div style="font-size:10px;color:var(--textSec);margin-bottom:6px;font-weight:600">'+t('ia_otros_escenarios')+'</div><div style="display:flex;gap:6px;margin-bottom:12px">';if(dir!=='alcista')html+='<div style="flex:1;background:#3FB95015;border:1px solid #3FB95040;border-radius:8px;padding:6px;text-align:center"><div style="font-size:9px;color:var(--green)">'+t('port_signal_alcista')+'</div><div style="font-size:13px;font-weight:700;color:var(--green)">'+(sig.prob_alcista||'--')+'%</div></div>';if(dir!=='bajista')html+='<div style="flex:1;background:#F8514915;border:1px solid #F8514940;border-radius:8px;padding:6px;text-align:center"><div style="font-size:9px;color:var(--red)">'+t('port_signal_bajista')+'</div><div style="font-size:13px;font-weight:700;color:var(--red)">'+(sig.prob_bajista||'--')+'%</div></div>';if(dir!=='alta_conf')html+='<div style="flex:1;background:var(--goldBg);border:1px solid var(--gold40);border-radius:8px;padding:6px;text-align:center"><div style="font-size:9px;color:var(--gold)">'+t('port_signal_alta_conv')+'</div><div style="font-size:13px;font-weight:700;color:var(--gold)">'+(sig.prob_alta_conf||'--')+'%</div></div>';html+='</div>';}
  html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--card);border-radius:10px;border:1px solid #25D36630;margin-bottom:12px"><div><div style="font-size:12px;font-weight:600;color:#25D366">'+t('wl_alerta_whatsapp')+'</div><div style="font-size:9px;color:var(--textSec);margin-top:2px">'+t('wl_recibir_cambios')+' '+sym+'</div></div><label class="toggle-sw"><input type="checkbox"><span class="toggle-slider"></span></label></div>';
  html += '<div onclick="event.stopPropagation();if(typeof _compartirSenal===\'function\')_compartirSenal(\''+sym+'\')" style="width:100%;background:var(--border);border:1px solid var(--border2);border-radius:8px;padding:10px;text-align:center;color:var(--text);font-size:12px;font-weight:600;cursor:pointer">'+t('ia_compartir_senal')+'</div>';
  body.innerHTML = html;
  modal.style.cssText = 'display:flex;position:fixed;top:0;left:0;width:100%;height:100%;background:#000000CC;z-index:110;align-items:flex-end;justify-content:center';
  modal.onclick = function(e){ if(e.target===modal) wlCloseDetail(); };
};
window.wlCloseDetail = function(){ var m=document.getElementById('wl-detail-modal'); if(m){ m.style.display='none'; m.onclick=null; } };

// ─── COMPARTIR SEÑAL — Modal con WhatsApp/Telegram/Mail (como nativa) ───
window.wlShowShareSignal = function(ticker){
  var sigs = window._iaSignals || [];
  var sig = null;
  for(var i=0;i<sigs.length;i++){ if(sigs[i].simbolo===ticker){ sig=sigs[i]; break; } }
  var prcs = window._pcPrices || {};
  var precio = prcs[ticker] || (sig ? sig.precio : 0);
  var dir = sig ? sig.direccion : '';
  var dirL = dir==='alcista'?t('ia_w_alcista'):dir==='bajista'?t('ia_w_bajista'):dir==='alta_conf'?t('ia_w_altaconf'):'';
  var prob = sig ? (sig.confianza||'') : '';
  var msg = '📊 Cobrex — Señal IA\n━━━━━━━━━━━━━━━━\n';
  msg += (dir==='alcista'?'📈':dir==='bajista'?'📉':'⚡')+' '+ticker+' — '+dirL+(prob?' '+prob+'%':'')+'\n';
  msg += '💰 Precio: $'+(precio?_fmt(precio):'---')+'\n';
  if(sig && sig.motivos && sig.motivos.length>0){
    msg += '\n📋 Justificación:\n';
    (window.buildAiMotivos?window.buildAiMotivos(sig):(sig.motivos||[])).slice(0,3).forEach(function(m2){ msg += '→ '+m2+'\n'; });
  }
  msg += '━━━━━━━━━━━━━━━━\nCobrex IA | cobrex.io';
  window._wlShareSignalMsg = msg;

  var old = document.getElementById('wl-share-signal-overlay'); if(old) old.remove();
  var overlay = document.createElement('div');
  overlay.id = 'wl-share-signal-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  overlay.onclick = function(e){ if(e.target===overlay) overlay.remove(); };
  var card = document.createElement('div');
  card.style.cssText = 'background:var(--card);border-top-left-radius:16px;border-top-right-radius:16px;padding:20px 20px 30px;width:100%;border:1px solid var(--border2)';
  card.onclick = function(e){ e.stopPropagation(); };
  var html = '';
  html += '<div style="font-size:15px;font-weight:700;color:var(--text);text-align:center;margin-bottom:16px">'+t('ia_compartir_senal_de')+' '+ticker+'</div>';
  html += '<div style="display:flex;justify-content:center;gap:16px;margin-bottom:16px">';
  // WhatsApp
  html += '<div onclick="var m=window._wlShareSignalMsg;window.open(\'https://wa.me/?text=\'+encodeURIComponent(m),\'_blank\');document.getElementById(\'wl-share-signal-overlay\').remove()" style="width:90px;height:80px;border:1px solid #25D36680;border-radius:12px;background:#25D36618;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer"><span style="font-size:24px;margin-bottom:4px">💬</span><span style="font-size:11px;color:#1BA851;font-weight:700">WhatsApp</span></div>';
  // Telegram
  html += '<div onclick="var m=window._wlShareSignalMsg;window.open(\'https://t.me/share/url?url=cobrex.io&text=\'+encodeURIComponent(m),\'_blank\');document.getElementById(\'wl-share-signal-overlay\').remove()" style="width:90px;height:80px;border:1px solid #0088CC80;border-radius:12px;background:#0088CC18;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer"><span style="font-size:24px;margin-bottom:4px">✈️</span><span style="font-size:11px;color:#0070AA;font-weight:700">Telegram</span></div>';
  // Mail
  html += '<div onclick="var m=window._wlShareSignalMsg;window.open(\'mailto:?subject=Cobrex+-+Señal+'+ticker+'&body=\'+encodeURIComponent(m));document.getElementById(\'wl-share-signal-overlay\').remove()" style="width:90px;height:80px;border:1px solid var(--gold);border-radius:12px;background:var(--goldBg,rgba(212,160,23,0.2));display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer"><span style="font-size:24px;margin-bottom:4px">📧</span><span style="font-size:11px;color:var(--gold);font-weight:700">Mail</span></div>';
  html += '</div>';
  // Cancelar
  html += '<div onclick="document.getElementById(\'wl-share-signal-overlay\').remove()" style="background:var(--border);border-radius:10px;padding:14px;text-align:center;cursor:pointer"><span style="font-size:14px;color:var(--text);font-weight:600">'+t('cancelar')+'</span></div>';
  card.innerHTML = html;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
};

// ─── MODAL ACCIONES ACTIVO (long press — idéntico a nativa) ───
window.wlShowActionMenu = function(ticker){
  var act = (window._IA_ACTIVOS||[]).find(function(a){return a.s===ticker;});
  var nombre = act ? act.n : ticker;
  var old = document.getElementById('wl-action-overlay'); if(old) old.remove();
  var overlay = document.createElement('div');
  overlay.id = 'wl-action-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px';
  overlay.onclick = function(e){ if(e.target===overlay){ overlay.remove(); } };
  var card = document.createElement('div');
  card.style.cssText = 'width:100%;max-width:320px;background:var(--card);border-radius:20px;padding:16px;border:1px solid var(--border2);box-shadow:0 10px 20px rgba(0,0,0,0.35);-webkit-user-select:none;user-select:none';
  card.onclick = function(e){ e.stopPropagation(); };
  var html = '';
  // Header
  html += '<div style="text-align:center;padding:6px 0 10px;border-bottom:0.5px solid var(--border);margin-bottom:8px">';
  html += '<div style="font-size:14px;font-weight:800;color:var(--text)">'+ticker+'</div>';
  if(nombre && nombre !== ticker) html += '<div style="font-size:10px;color:var(--textSec);margin-top:1px">'+nombre+'</div>';
  html += '</div>';
  // Análisis IA completo (destacado)
  html += '<div onclick="document.getElementById(\'wl-action-overlay\').remove();wlOpenDetail(\''+ticker+'\')" style="display:flex;align-items:center;padding:10px 12px;border-radius:10px;background:var(--gold15,rgba(212,160,23,0.15));border:1px solid var(--gold);margin-bottom:6px;cursor:pointer">';
  html += '<span style="font-size:16px;margin-right:8px">📊</span>';
  html += '<span style="flex:1;font-size:13px;font-weight:700;color:var(--gold)">'+t('port_lp_analisis')+'</span>';
  html += '</div>';
  // Compartir señal — abre modal con WhatsApp/Telegram/Mail (como nativa)
  // Crear alerta de precio (paridad nativa: campana en el activo)
  html += '<div onclick="document.getElementById(\'wl-action-overlay\').remove();openCreateAlert(\''+ticker+'\',\''+(act?act.tab:'')+'\')" style="display:flex;align-items:center;padding:10px 12px;border-radius:10px;background:var(--bg);margin-bottom:6px;cursor:pointer">';
  html += '<span style="font-size:15px;margin-right:8px">🔔</span>';
  html += '<span style="flex:1;font-size:13px;font-weight:600;color:var(--text)">'+t('al_crear_alerta_menu')+'</span>';
  html += '</div>';
  html += '<div onclick="document.getElementById(\'wl-action-overlay\').remove();wlShowShareSignal(\''+ticker+'\')" style="display:flex;align-items:center;padding:10px 12px;border-radius:10px;background:var(--bg);margin-bottom:6px;cursor:pointer">';
  html += '<span style="font-size:15px;margin-right:8px">📤</span>';
  html += '<span style="flex:1;font-size:13px;font-weight:600;color:var(--text)">'+t('wl_compartir_senal')+'</span>';
  html += '</div>';
  // Quitar de esta lista
  html += '<div onclick="document.getElementById(\'wl-action-overlay\').remove();wlRemoveAsset(\''+ticker+'\')" style="display:flex;align-items:center;padding:10px 12px;border-radius:10px;background:#F8514912;border:1px solid #F8514960;margin-bottom:8px;cursor:pointer">';
  html += '<span style="font-size:15px;margin-right:8px">🗑️</span>';
  html += '<span style="flex:1;font-size:13px;font-weight:700;color:var(--red)">'+t('wl_quitar_de_lista')+'</span>';
  html += '</div>';
  // Cancelar
  html += '<div onclick="document.getElementById(\'wl-action-overlay\').remove()" style="padding:9px;border-radius:10px;border:1px solid var(--border2);text-align:center;cursor:pointer;-webkit-user-select:none;user-select:none">';
  html += '<span style="font-size:12px;font-weight:600;color:var(--textSec)">'+t('cancelar')+'</span>';
  html += '</div>';
  card.innerHTML = html;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
};

// ─── COMPARADOR ───
// Period per asset (like nativa wlPeriod state)
window._wlPeriods = {};
window._wlHistPrices = {}; // { '7d': { 'BTC': 70000, ... }, '1m': {...}, ... }

window.wlSetPeriod = function(ticker, period){
  window._wlPeriods[ticker] = period;
  // Si no es 24h, necesitamos precio histórico
  if(period !== '24h' && (!window._wlHistPrices[period] || !window._wlHistPrices[period][ticker])){
    var acts = window._IA_ACTIVOS || [];
    var act = acts.find(function(a){return a.s===ticker;});
    var isCrypto = act && ((act.tipo||'').toLowerCase()==='cripto'||(act.t||'').toLowerCase()==='cripto');
    var rangeMap = {'7d':'5d','1m':'1mo','3m':'3mo','1y':'1y'};
    var range = rangeMap[period];
    if(!window._wlHistPrices[period]) window._wlHistPrices[period] = {};
    if(isCrypto){
      var limit = period==='7d'?7:period==='1m'?30:period==='3m'?90:365;
      fetch('https://api.binance.com/api/v3/klines?symbol='+ticker+'USDT&interval=1d&limit='+limit)
        .then(function(r){return r.json();})
        .then(function(data){
          if(Array.isArray(data)&&data.length>0){ window._wlHistPrices[period][ticker]=parseFloat(data[0][1]); renderWatchCnt(); }
        }).catch(function(){ fetch('https://aurex-app-production.up.railway.app/api/crypto-prices').then(function(r){return r.json();}).then(function(d){if(d&&d.prices&&d.prices[ticker]){window._wlHistPrices[period][ticker]=d.prices[ticker].price;renderWatchCnt();}}).catch(function(){}); });
    } else if(range) {
      fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol='+ticker+'&interval=1d&range='+range)
        .then(function(r){return r.json();})
        .then(function(data){
          try{var closes=data.chart.result[0].indicators.quote[0].close;var valid=closes.filter(function(c){return c!=null;});if(valid.length>0){window._wlHistPrices[period][ticker]=valid[0];renderWatchCnt();}}catch(e){}
        }).catch(function(){ fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+ticker+'?interval=1d&range='+range).then(function(r){return r.json();}).then(function(data){try{var closes=data.chart.result[0].indicators.quote[0].close;var valid=closes.filter(function(c){return c!=null;});if(valid.length>0){window._wlHistPrices[period][ticker]=valid[0];renderWatchCnt();}}catch(e){}}).catch(function(){}); });
    }
  }
  renderWatchCnt();
};

window._wlCompareMode = false;
window._wlCompareItems = [];

window.wlStartCompare = function(){
  // Si ya estamos en modo comparar y hay 2+ seleccionados → abrir popup
  if(window._wlCompareMode && window._wlCompareItems && window._wlCompareItems.length >= 2){
    window.wlShowCompare();
    return;
  }
  // Si estamos en modo comparar sin suficientes → salir del modo
  if(window._wlCompareMode){
    window._wlCompareMode = false;
    window._wlCompareItems = [];
    renderWatchCnt();
    return;
  }
  // Entrar en modo comparar
  window._wlCompareMode = true;
  window._wlCompareItems = [];
  renderWatchCnt();
};

window.wlToggleCompare = function(sym){
  var idx = window._wlCompareItems.indexOf(sym);
  if(idx >= 0) { window._wlCompareItems.splice(idx, 1); }
  else if(window._wlCompareItems.length < 5) { window._wlCompareItems.push(sym); }
  else { alert(t('wl_maximo_5')); return; }
  // Update solo el checkbox visual sin re-renderizar todo (evita flash/titila)
  var isNowSelected = window._wlCompareItems.indexOf(sym) >= 0;
  var circle = document.querySelector('[data-wl-compare="'+sym+'"]');
  if(circle){
    circle.style.borderColor = isNowSelected ? 'var(--gold)' : 'var(--border)';
    circle.style.background = isNowSelected ? 'var(--gold)' : 'transparent';
    circle.innerHTML = isNowSelected ? '<span style="color:var(--chipTextActive);font-size:12px;font-weight:800">✓</span>' : '';
  }
  // Update counter text
  var _cc = window._wlCompareItems.length;
  var counterEl = document.querySelector('#watch-cnt [style*="text-align:center"] span');
  if(counterEl) counterEl.textContent = _cc >= 2 ? '✓ '+_cc+t('wl_seleccionados') : t('wl_selecciona_2_5');
  // Update compare button label
  var cmpBtn = document.querySelector('[data-wl="compareMode"]');
  if(cmpBtn && _cc >= 2) cmpBtn.textContent = t('wl_comparar') + ' ' + _cc;
};

window._wlCompareHist = {}; // { ticker: { '24h': change, '7d': change, ... } }

window.wlCompareSetPeriod = function(p){
  window._wlComparePeriod = p;
  // Actualizar botones activos
  ['24h','7d','1m','3m','1y'].forEach(function(k){
    var btn = document.getElementById('wl-cmp-per-'+k);
    if(btn){
      btn.style.background = k===p ? 'var(--gold)' : 'var(--border)';
      btn.style.color = k===p ? '#000' : 'var(--textSec)';
    }
  });
  // Actualizar label y valores de cambio
  var labelEl = document.getElementById('wl-cmp-chg-label');
  if(labelEl) labelEl.textContent = t('wl_cambio')+' '+p;
  var items = window._wlCompareItems || [];
  var hist = window._wlCompareHist || {};
  items.forEach(function(t, i){
    var el = document.getElementById('wl-cmp-chg-'+i);
    if(el){
      var c = (hist[t] && hist[t][p] !== undefined) ? hist[t][p] : 0;
      el.textContent = _fmt(c, 'pct');
      el.style.color = c >= 0 ? 'var(--green)' : 'var(--red)';
    }
  });
  // Actualizar mejor performance
  var bestSym = null, bestChg = -Infinity;
  items.forEach(function(t){
    var c = (hist[t] && hist[t][p] !== undefined) ? hist[t][p] : 0;
    if(c > bestChg){ bestChg = c; bestSym = t; }
  });
  items.forEach(function(t){
    var badge = document.getElementById('wl-cmp-best-'+t);
    if(badge) badge.style.display = (t === bestSym) ? 'inline-block' : 'none';
    var frame = document.getElementById('wl-cmp-frame-'+t);
    if(frame){
      frame.style.borderColor = (t === bestSym) ? 'var(--gold)' : 'transparent';
      frame.style.borderWidth = (t === bestSym) ? '2px' : '0px';
    }
  });
};

// Cargar datos históricos para comparador — re-renderiza al completar
window._wlCmpRefreshTimer = null;
function _wlCmpRefresh(){
  clearTimeout(window._wlCmpRefreshTimer);
  window._wlCmpRefreshTimer = setTimeout(function(){
    if(document.getElementById('wl-compare-overlay')) wlShowCompare();
  }, 300);
}
window.wlLoadCompareHist = function(){
  var items = window._wlCompareItems || [];
  var chg24 = window._pcChange24 || {};
  var acts = window._IA_ACTIVOS || [];
  var rangeMap = {'7d':'5d','1m':'1mo','3m':'3mo','1y':'1y'};

  items.forEach(function(t){
    if(!window._wlCompareHist[t]) window._wlCompareHist[t] = {};
    window._wlCompareHist[t]['24h'] = chg24[t] || 0;

    var act = acts.find(function(a){return a.s===t;});
    var isCrypto = act && (act.tipo==='cripto'||act.t==='Cripto');

    Object.keys(rangeMap).forEach(function(per){
      var range = rangeMap[per];
      if(isCrypto){
        var limit = per==='7d'?7:per==='1m'?30:per==='3m'?90:365;
        fetch('https://api.binance.com/api/v3/klines?symbol='+t+'USDT&interval=1d&limit='+limit)
          .then(function(r){return r.json();})
          .then(function(data){
            if(Array.isArray(data)&&data.length>1){
              var first=parseFloat(data[0][1]);var last=parseFloat(data[data.length-1][4]);
              window._wlCompareHist[t][per]=first>0?((last-first)/first*100):0;
              _wlCmpRefresh();
            }
          }).catch(function(){ fetch('https://aurex-app-production.up.railway.app/api/crypto-prices').then(function(r){return r.json();}).then(function(d){if(d&&d.prices&&d.prices[t]){window._wlCompareHist[t][per]=0;_wlCmpRefresh();}}).catch(function(){}); });
      } else {
        fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol='+t+'&interval=1d&range='+range)
          .then(function(r){return r.json();})
          .then(function(data){
            if(data&&data.chart&&data.chart.result&&data.chart.result[0]){
              var closes=data.chart.result[0].indicators&&data.chart.result[0].indicators.quote&&data.chart.result[0].indicators.quote[0]?data.chart.result[0].indicators.quote[0].close:[];
              var valid=closes.filter(function(c){return c!=null;});
              if(valid.length>1){
                var first=valid[0];var last=valid[valid.length-1];
                window._wlCompareHist[t][per]=first>0?((last-first)/first*100):0;
                _wlCmpRefresh();
              }
            }
          }).catch(function(){ fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+t+'?interval=1d&range='+range).then(function(r){return r.json();}).then(function(data){if(data&&data.chart&&data.chart.result&&data.chart.result[0]){var closes=data.chart.result[0].indicators&&data.chart.result[0].indicators.quote&&data.chart.result[0].indicators.quote[0]?data.chart.result[0].indicators.quote[0].close:[];var valid=closes.filter(function(c){return c!=null;});if(valid.length>1){var first=valid[0];var last=valid[valid.length-1];window._wlCompareHist[t][per]=first>0?((last-first)/first*100):0;_wlCmpRefresh();}}}).catch(function(){}); });
      }
    });
  });
};

window.wlShowCompare = function(){
  try {
  var items = window._wlCompareItems;
  if(!items || items.length < 2) return;
  var sigs = window._iaSignals || [];
  var prcs = window._pcPrices || {};
  var chg = window._pcChange24 || {};
  var acts = window._IA_ACTIVOS || [];
  var hist = window._wlCompareHist || {};
  var _curPer = window._wlComparePeriod || '24h';

  var getSig = function(sym){ for(var i=0;i<sigs.length;i++){if(sigs[i].simbolo===sym)return sigs[i];} return null; };
  var getDir = function(sym){ var s=getSig(sym); return s?(s.direccion==='alcista'?'ALCISTA':s.direccion==='bajista'?'BAJISTA':'ALTA CONV'):'---'; };
  var getProb = function(sym){ var s=getSig(sym); return s?(s.confianza||50):0; };
  var getChange = function(sym){
    if(_curPer === '24h'){
      if(chg[sym] !== undefined && chg[sym] !== null) return chg[sym];           // live ticker de seguidos
      var s = getSig(sym); if(s && s.precio24h > 0 && s.precio) return (s.precio - s.precio24h) / s.precio24h * 100; // respaldo señal IA (todos los activos)
      return 0;
    }
    return (hist[sym] && hist[sym][_curPer] !== undefined) ? hist[sym][_curPer] : 0;
  };
  // Precio real para CUALQUIER activo (503 actuales y futuros): _pcPrices (live ticker de seguidos) → sig.precio (backend IA, tiene a todos)
  var getPrice = function(sym){ var p = prcs[sym]; if(!p){ var s = getSig(sym); p = s && s.precio; } return p || 0; };
  var dirColor = function(d){return d==='ALCISTA'?'var(--green)':d==='BAJISTA'?'var(--red)':'var(--gold)';};
  var dirIcon = function(d){return d==='ALCISTA'?'📈':d==='BAJISTA'?'📉':'⚡';};

  // Find best performer por período seleccionado (como nativa)
  var bestSym = items[0]; var bestChg = getChange(items[0]);
  items.forEach(function(t){ var c=getChange(t); if(c>bestChg){bestChg=c;bestSym=t;} });

  var html = '<div style="padding:14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between"><span style="font-size:15px;font-weight:700;color:var(--gold)">'+t('wl_comparador_title')+'</span><a href="javascript:void(0)" onclick="document.getElementById(\'wl-compare-overlay\').remove();window._wlCompareMode=false;window._wlCompareItems=[];renderWatchCnt();" style="width:32px;height:32px;border-radius:16px;background:var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--text);text-decoration:none">✕</a></div>';

  // Period buttons — al tocar re-renderizan TODO el comparador (como nativa setState)
  html += '<div style="display:flex;justify-content:center;gap:6px;padding:10px;border-bottom:0.5px solid var(--border)">';
  ['24h','7d','1m','3m','1y'].forEach(function(p){
    var isActive = p === _curPer;
    html += '<a href="javascript:void(0)" onclick="window._wlComparePeriod=\''+p+'\';wlShowCompare();" style="padding:6px 12px;border-radius:6px;background:'+(isActive?'var(--gold)':'var(--border)')+';color:'+(isActive?'#000':'var(--textSec)')+';font-size:11px;font-weight:700;text-decoration:none;-webkit-tap-highlight-color:rgba(0,0,0,0)">'+p+'</a>';
  });
  html += '</div>';

  html += '<div style="padding:12px;overflow-x:auto">';

  // Header with logos
  html += '<div style="display:flex;border-bottom:1px solid var(--border);padding-bottom:10px;margin-bottom:8px"><div style="width:100px"></div>';
  items.forEach(function(t){
    var act = acts.find(function(a){return a.s===t;});
    var isBest = t===bestSym;
    var logoUrl = act&&act.logo?act.logo:'';
    var logoBg = getDir(t)==='ALCISTA'?'#1A3A2A':getDir(t)==='BAJISTA'?'#3A1A1A':'#333';
    html += '<div style="width:120px;text-align:center">';
    if(isBest) html += '<div style="border:2px solid var(--gold);border-radius:22px;padding:2px;display:inline-block">';
    html += '<div style="width:36px;height:36px;border-radius:18px;background:'+logoBg+';display:inline-flex;align-items:center;justify-content:center">';
    if(logoUrl) html += '<img src="'+logoUrl+'" style="width:28px;height:28px;border-radius:14px" onerror="this.outerHTML=\'<span style=color:var(--text);font-size:12px;font-weight:700>'+t[0]+'</span>\'" />';
    else html += '<span style="color:var(--text);font-size:12px;font-weight:700">'+t.slice(0,2)+'</span>';
    html += '</div>';
    if(isBest) html += '</div>';
    html += '<div style="font-size:14px;font-weight:800;color:var(--text);margin-top:4px">'+t+'</div>';
    html += '<div style="font-size:9px;color:var(--textSec)">'+(act?act.n:'')+'</div>';
    if(isBest) html += '<div style="background:rgba(212,160,23,0.19);border:1px solid var(--gold);border-radius:6px;padding:2px 6px;margin-top:4px;display:inline-block"><span style="font-size:7px;font-weight:800;color:var(--gold)">'+(window._i18n&&window._i18n.t?window._i18n.t('wl_mejor_performance'):'⭐ MEJOR PERFORMANCE')+'</span></div>';
    html += '</div>';
  });
  html += '</div>';

  // Data rows
  var rows = [
    {label:t('wl_cmp_senal_ia'), fn:function(t){var d=getDir(t);return '<span style="color:'+dirColor(d)+';font-weight:700">'+d+'</span>';}},
    {label:t('wl_cmp_probabilidad'), fn:function(t){var d=getDir(t);return '<span style="color:'+dirColor(d)+';font-weight:700">'+getProb(t)+'%</span>';}},
    {label:t('wl_cmp_precio'), fn:function(t){var p=getPrice(t);return '<span style="color:var(--text);font-weight:700">'+(p?_fmt(p):'---')+'</span>';}},
    {label:t('wl_cmp_cambio')+' '+_curPer, fn:function(t){var c=getChange(t);return '<span style="color:'+(c>=0?'var(--green)':'var(--red)')+';font-weight:700">'+_fmt(c,'pct')+'</span>';}},
    {label:t('wl_cmp_objetivo'), fn:function(t){var p=getPrice(t);var d=getDir(t);return '<span style="color:var(--green);font-weight:700">'+(p?_fmt(p*(d==='BAJISTA'?0.95:1.08)):'---')+'</span>';}},
    {label:t('wl_cmp_stop'), fn:function(t){var p=getPrice(t);var d=getDir(t);return '<span style="color:var(--red);font-weight:700">'+(p?_fmt(p*(d==='BAJISTA'?1.03:0.96)):'---')+'</span>';}},
  ];
  rows.forEach(function(row){
    html += '<div style="display:flex;align-items:center;padding:8px 0;border-bottom:0.5px solid var(--border)"><div style="width:100px;font-size:10px;font-weight:600;color:var(--textSec)">'+row.label+'</div>';
    items.forEach(function(t){
      var isBest = t===bestSym;
      html += '<div style="width:120px;text-align:center;font-size:13px;font-weight:'+(isBest?'800':'700')+'">'+row.fn(t)+'</div>';
    });
    html += '</div>';
  });

  // Variables IA
  html += '<div style="font-size:11px;font-weight:700;color:var(--textSec);margin-top:14px;margin-bottom:8px">VARIABLES IA (10)</div>';
  // Nombres CORTOS de la nativa (ComparadorModal varDefsT) — sin el prefijo "N." de los labels de PULSE (que se cortaban en la columna de 100px). #8 auditoría.
  var varDefs = [{k:'tendencia',l:t('v_tendencia_name')},{k:'rsi',l:t('v_rsi_name')},{k:'volumen',l:t('v_volumen_name')},{k:'volatilidad',l:t('v_volat_name')},{k:'correlacion',l:t('v_corr_name')},{k:'oro_petroleo',l:t('v_oro_name')},{k:'macro',l:t('v_macro_name')},{k:'earnings',l:t('v_earnings_name')},{k:'macd',l:t('v_macd_name')},{k:'soporte_resist',l:t('v_sr_name')}];
  varDefs.forEach(function(v){
    html += '<div style="display:flex;align-items:center;padding:4px 0;border-bottom:0.5px solid #21262D80"><div style="width:100px;font-size:9px;color:var(--textSec)">'+v.l+'</div>';
    items.forEach(function(t){
      var sig=getSig(t); var sc=sig&&sig.scores?sig.scores[v.k]||0:0;
      var col=sc>0.01?'var(--green)':sc<-0.01?'var(--red)':'var(--textDim)';
      var icon=sc>0.01?'→':sc<-0.01?'↓':'—';
      html += '<div style="width:120px;text-align:center;font-size:12px;font-weight:700;color:'+col+'">'+icon+'</div>';
    });
    html += '</div>';
  });

  // Resumen
  html += '<div style="display:flex;align-items:center;padding:10px 0;margin-top:4px"><div style="width:100px;font-size:10px;font-weight:700;color:var(--textSec)">'+t('wl_resumen')+'</div>';
  items.forEach(function(t){
    var sig=getSig(t);var alc=0,baj=0;
    if(sig&&sig.scores){varDefs.forEach(function(v){var s=sig.scores[v.k]||0;if(s>0.01)alc++;if(s<-0.01)baj++;});}
    html += '<div style="width:120px;text-align:center;font-size:11px"><span style="color:var(--green);font-weight:700">→'+alc+'</span> · <span style="color:var(--red);font-weight:700">↓'+baj+'</span></div>';
  });
  html += '</div>';

  // Share button
  html += '<a href="javascript:void(0)" onclick="var m=\'⚖️ Cobrex Comparador ('+_curPer+')\\n━━━━━━━━━━━━━━━━\\n\';';
  items.forEach(function(t,i){
    html += 'm+=\''+(t===bestSym?'⭐ ':'')+dirIcon(getDir(t))+' '+t+' — '+getDir(t)+' '+getProb(t)+'%\\n\';';
  });
  html += 'm+=\'━━━━━━━━━━━━━━━━\\n⭐ Mejor: '+bestSym+'\\nCobrex IA | cobrex.io\';if(navigator.share){navigator.share({title:\'Cobrex Comparador\',text:m});}else if(navigator.clipboard){navigator.clipboard.writeText(m);alert(\'Copiado\');}" style="display:block;background:var(--border);border-radius:10px;padding:12px;text-align:center;color:var(--text);font-size:12px;font-weight:600;text-decoration:none;margin-top:16px">'+t('wl_compartir_comparacion')+'</a>';

  html += '</div>';

  // Reusar el overlay si ya existe → preservar scrollTop (evita el salto al re-render por datos async,
  // que impedía llegar al botón Compartir). Paridad nativa: setState re-renderiza in-place sin resetear scroll.
  var overlay = document.getElementById('wl-compare-overlay');
  var _savedScroll = overlay ? overlay.scrollTop : 0;
  var _isNew = !overlay;
  if(_isNew){
    overlay = document.createElement('div');
    overlay.id = 'wl-compare-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:var(--bg);z-index:9999;overflow-y:auto';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = html;
  overlay.scrollTop = _savedScroll;
  // Cargar datos históricos en background SOLO en la apertura inicial (evita el loop de re-fetch en cada refresh)
  if(_isNew) window.wlLoadCompareHist();
  } catch(err) { alert('Error comparador: ' + err.message); }
};

// ─── REORDENAR ACTIVOS ───
window.wlMoveItem = function(idx, direction){
  if(!_wlSelectedList) return;
  var arr = _wlGetItems(_wlSelectedList);
  var newIdx = idx + direction;
  if(newIdx < 0 || newIdx >= arr.length) return;
  var temp = arr[idx];
  arr[idx] = arr[newIdx];
  arr[newIdx] = temp;
  _wlSaveItems(_wlSelectedList, arr);
  // Update positions in Supabase
  var sb = window._supabase;
  if(sb){
    arr.forEach(function(item, i){
      if(item.id) sb.from('watchlist_items').update({position: i}).eq('id', item.id);
    });
  }
  renderWatchCnt();
};

// ─── COMPARTIR LISTA — Modal visual (idéntico a nativa) ───
window._wlBuildShareMsg = function(){
  var lists = _wlGetLists();
  var cl = lists.find(function(l){return l.id===_wlSelectedList;});
  if(!cl) return '';
  var items = _wlGetItems(_wlSelectedList);
  var sigs = window._iaSignals || [];
  var prcs = window._pcPrices || {};
  var msg = 'Cobrex — Lista "'+cl.name+'"\n━━━━━━━━━━━━━━━━\n';
  items.forEach(function(item){
    var sym = item.s||item.ticker;
    var sig=null; for(var i=0;i<sigs.length;i++){if(sigs[i].simbolo===sym){sig=sigs[i];break;}}
    var dir=sig?sig.direccion:'';
    var icon=dir==='alcista'?'📈':dir==='bajista'?'📉':dir==='alta_conf'?'⚡':'';
    var dirL=dir==='alcista'?t('ia_w_alcista'):dir==='bajista'?t('ia_w_bajista'):dir==='alta_conf'?t('ia_w_altaconf'):'';
    var prob=sig?(sig.confianza||''):'';
    var p=prcs[sym]||(sig?sig.precio:0);
    msg+=icon+' '+sym+' — '+dirL+(prob?' '+prob+'%':'')+' — $'+(p?_fmt(p):'---')+'\n';
  });
  msg+='━━━━━━━━━━━━━━━━\n'+items.length+' activos | Cobrex IA\nhttps://cobrex.io';
  return msg;
};

window.wlShareList = function(){
  var lists = _wlGetLists();
  var cl = lists.find(function(l){return l.id===_wlSelectedList;});
  if(!cl) return;
  var items = _wlGetItems(_wlSelectedList);
  var old = document.getElementById('wl-share-list-overlay'); if(old) old.remove();
  var overlay = document.createElement('div');
  overlay.id = 'wl-share-list-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  overlay.onclick = function(e){ if(e.target===overlay) overlay.remove(); };
  var card = document.createElement('div');
  card.style.cssText = 'background:var(--card);border-top-left-radius:16px;border-top-right-radius:16px;padding:20px 20px 30px;width:100%;border:1px solid var(--border2)';
  card.onclick = function(e){ e.stopPropagation(); };
  var html = '';
  html += '<div style="font-size:15px;font-weight:700;color:var(--text);text-align:center;margin-bottom:16px">'+t('wl_compartir_lista')+' "'+cl.name+'"</div>';
  html += '<div style="font-size:11px;color:var(--textSec);text-align:center;margin-bottom:16px">'+items.length+t('wl_activos_con_senales')+'</div>';
  html += '<div style="display:flex;justify-content:center;gap:16px;margin-bottom:16px">';
  // WhatsApp
  html += '<div onclick="var m=window._wlBuildShareMsg();var url=\'https://wa.me/?text=\'+encodeURIComponent(m);window.open(url,\'_blank\');document.getElementById(\'wl-share-list-overlay\').remove()" style="width:90px;height:80px;border:1px solid #25D36680;border-radius:12px;background:#25D36618;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer"><span style="font-size:24px;margin-bottom:4px">💬</span><span style="font-size:11px;color:#1BA851;font-weight:700">WhatsApp</span></div>';
  // Telegram
  html += '<div onclick="var m=window._wlBuildShareMsg();var url=\'https://t.me/share/url?url=cobrex.io&text=\'+encodeURIComponent(m);window.open(url,\'_blank\');document.getElementById(\'wl-share-list-overlay\').remove()" style="width:90px;height:80px;border:1px solid #0088CC80;border-radius:12px;background:#0088CC18;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer"><span style="font-size:24px;margin-bottom:4px">✈️</span><span style="font-size:11px;color:#0070AA;font-weight:700">Telegram</span></div>';
  // Mail
  html += '<div onclick="var m=window._wlBuildShareMsg();var url=\'mailto:?subject=Cobrex+-+Lista&body=\'+encodeURIComponent(m);window.open(url);document.getElementById(\'wl-share-list-overlay\').remove()" style="width:90px;height:80px;border:1px solid var(--gold);border-radius:12px;background:var(--goldBg,rgba(212,160,23,0.2));display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer"><span style="font-size:24px;margin-bottom:4px">📧</span><span style="font-size:11px;color:var(--gold);font-weight:700">Mail</span></div>';
  html += '</div>';
  // Cancelar
  html += '<div onclick="document.getElementById(\'wl-share-list-overlay\').remove()" style="background:var(--border);border-radius:10px;padding:14px;text-align:center;cursor:pointer"><span style="font-size:14px;color:var(--text);font-weight:600">'+t('cancelar')+'</span></div>';
  card.innerHTML = html;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
};

// Render al cargar — sync from Supabase first
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    _wlSyncFromSupabase(function(){ if(window.renderWatchCnt) window.renderWatchCnt(); });
  }, 2000);
});

// iOS Safari fix: event delegation global para TODOS los clicks de watchlist
document.addEventListener('click', function(e){
  // L (web-1.4): NO togglear el comparar desde el delegador — la fila ya llama wlToggleCompare en su onclick.
  // Antes esto disparaba wlToggleCompare una 2da vez al tocar el círculo → doble toggle (neto cero, no marcaba).
  // Boton "+ Nueva lista" en header
  var btn = e.target.closest('#wl-btn-nueva');
  if(btn){ e.preventDefault(); window.wlCreateListModal(); return; }
  // Botones dentro de watch-cnt
  var el = e.target.closest('[data-wl]');
  if(!el) return;
  var act = el.getAttribute('data-wl');
  var param = el.getAttribute('data-wl-param') || '';
  if(act==='createList') window.wlCreateListModal();
  else if(act==='addAsset') window.wlOpenAddModal();
  else if(act==='selectList') window.wlSelectList(param);
  else if(act==='deleteList') window.wlDeleteList(param);
  else if(act==='setPrimary'){ e.stopPropagation(); window.wlSetPrimary(param); }
  else if(act==='shareList'){ e.stopPropagation(); window.wlShareList(); }
  else if(act==='compareMode'){ e.stopPropagation(); window.wlStartCompare(); }
  else if(act==='compareSelect'){ e.stopPropagation(); window.wlToggleCompare(param); }
  else if(act==='compareGo'){ e.stopPropagation(); window.wlShowCompare(); }
  else if(act==='openDetail') window.wlOpenDetail(param);
  else if(act==='removeAsset'){ e.stopPropagation(); window.wlRemoveAsset(param, e); }
  else if(act==='toggleAlert'){ e.stopPropagation(); window.wlToggleAlert(param, e); }
});


function showPortErr(msg){
  var errEl = document.getElementById('pa-err');
  if(errEl){ errEl.textContent = msg; errEl.style.display = 'block'; }
}


window.openPortItemDetail = function(itemId){
  var items = window._portItems || [];
  var item = null;
  for(var i=0;i<items.length;i++){ if(items[i].id===itemId){ item=items[i]; break; } }
  if(!item) return;
  var modal = document.getElementById('port-detail-modal');
  var body = document.getElementById('port-detail-body');
  if(!modal || !body) return;
  var prcs = window._pcPrices || {};
  var precio = prcs[item.simbolo] || item.precio_compra || 0;
  var pnlPct = item.precio_compra > 0 ? ((precio - item.precio_compra)/item.precio_compra*100) : 0;
  var pnlUsd = item.cantidad > 0 ? (item.cantidad * (precio - item.precio_compra)) : 0;
  var pnlColor = pnlPct >= 0 ? 'var(--green)' : 'var(--red)';
  var pnlSign = pnlPct >= 0 ? '+' : '';
  var acts = window._IA_ACTIVOS || [];
  var act = null;
  for(var i=0;i<acts.length;i++){ if(acts[i].s===item.simbolo){ act=acts[i]; break; } }
  var logoHtml = (act && act.logo) ? '<img src="'+act.logo+'" style="width:32px;height:32px;border-radius:50%;object-fit:cover;margin-right:10px;" onerror="this.style.display=\'none\'"/>' : '<div style="width:32px;height:32px;border-radius:50%;background:'+(act&&act.color||'var(--border)')+';display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--text);margin-right:10px;">'+(item.simbolo[0]||'?')+'</div>';
  var fechaStr = item.created_at ? new Date(item.created_at).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'}) : '--';
  var fmtP = function(n,d){ var loc=(navigator.language||'en-US'); return n ? n.toLocaleString(loc,{minimumFractionDigits:d||2,maximumFractionDigits:d||2}) : '--'; };
  // 52-week range
  var low52 = window._pc52Low && window._pc52Low[item.simbolo];
  var high52 = window._pc52High && window._pc52High[item.simbolo];
  var rangeBar = '';
  if(low52 && high52 && high52 > low52 && precio > 0){
    var pct52 = Math.max(0, Math.min(100, ((precio - low52)/(high52 - low52)*100)));
    var zone52, zoneColor52, zoneIcon52;
    if(pct52 <= 30){ zone52 = t('port_52w_zone_low'); zoneColor52 = 'var(--green)'; zoneIcon52 = '🟢'; }
    else if(pct52 <= 70){ zone52 = t('port_52w_zone_mid'); zoneColor52 = 'var(--gold)'; zoneIcon52 = '🟡'; }
    else { zone52 = t('port_52w_zone_high'); zoneColor52 = 'var(--red)'; zoneIcon52 = '🔴'; }
    rangeBar = '<div style="margin:10px 0 4px;">' +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:var(--textDim);margin-bottom:3px;">' +
        '<span>'+t('port_52w_min')+' $'+fmtP(low52)+'</span>' +
        '<span style="font-size:9px;color:var(--textSec);">'+t('port_52w_label')+'</span>' +
        '<span>'+t('port_52w_max')+' $'+fmtP(high52)+'</span>' +
      '</div>' +
      '<div style="background:var(--border);border-radius:4px;height:6px;position:relative;">' +
        '<div style="background:linear-gradient(90deg,var(--green),var(--gold),var(--red));border-radius:4px;height:6px;width:'+pct52.toFixed(0)+'%;"></div>' +
        '<div style="position:absolute;top:-3px;left:calc('+pct52.toFixed(0)+'% - 5px);width:10px;height:10px;border-radius:50%;background:var(--text);border:2px solid var(--bg);box-shadow:0 0 4px rgba(255,255,255,.3);"></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:5px;margin-top:6px;padding:6px 8px;background:var(--bg);border-radius:6px;border-left:3px solid '+zoneColor52+';">' +
        '<span style="font-size:12px;">'+zoneIcon52+'</span>' +
        '<div>' +
          '<div style="font-size:10px;font-weight:600;color:'+zoneColor52+';">'+pct52.toFixed(0)+t('port_52w_pct_range')+'</div>' +
          '<div style="font-size:9px;color:var(--textSec);margin-top:1px;">'+zone52+'</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  // Find signal for this asset
  var sigs = window._iaSignals || [];
  var sig = null;
  for(var i=0;i<sigs.length;i++){ if(sigs[i].simbolo===item.simbolo){ sig=sigs[i]; break; } }
  var sigHtml = '';
  if(sig){
    var dirColor = sig.direccion === 'ALCISTA' ? 'var(--green)' : (sig.direccion === 'BAJISTA' ? 'var(--red)' : 'var(--gold)');
    var probPrincipal = sig.prob_principal || sig.confianza || 0;
    var motivosHtml = (window.buildAiMotivos?window.buildAiMotivos(sig):(sig.motivos||[])).slice(0,5).map(function(m,i){ return '<div style="display:flex;gap:6px;margin-bottom:4px;"><span style="color:'+dirColor+';font-weight:700;flex-shrink:0;">'+(i+1)+'.</span><span style="color:var(--textSec);font-size:11px;">'+m+'</span></div>'; }).join('');
    sigHtml = '<div style="background:var(--card);border-radius:9px;padding:12px;border-left:3px solid '+dirColor+';margin-top:10px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
      '<div style="font-size:10px;font-weight:700;color:'+dirColor+';letter-spacing:.5px;">'+sig.direccion+'</div>' +
      '<div style="font-size:20px;font-weight:700;color:'+dirColor+';">'+probPrincipal.toFixed(0)+'<span style="font-size:11px;">%</span></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:8px;">' +
      '<div style="flex:1;background:var(--bg);border-radius:7px;padding:7px;text-align:center;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_detail_objetivo')+'</div><div style="font-size:12px;color:var(--green);font-weight:600;">$'+fmtP(sig.objetivo)+'</div></div>' +
      '<div style="flex:1;background:var(--bg);border-radius:7px;padding:7px;text-align:center;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_detail_stop_loss')+'</div><div style="font-size:12px;color:var(--red);font-weight:600;">$'+fmtP(sig.stop)+'</div></div>' +
      '<div style="flex:1;background:var(--bg);border-radius:7px;padding:7px;text-align:center;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+(sig.direccion==='ALCISTA'?t('port_detail_upside'):t('port_detail_downside'))+'</div><div style="font-size:12px;color:'+dirColor+';font-weight:600;">'+(sig.direccion==='ALCISTA'?'+':'-')+Math.abs(sig.upside||0).toFixed(1)+'%</div></div>' +
      '</div>' +
      motivosHtml +
      '</div>';
  } else {
    sigHtml = '<div style="background:var(--card);border-radius:9px;padding:12px;margin-top:10px;text-align:center;color:var(--textDim);font-size:12px;">'+t('port_sin_senal_hoy')+'</div>';
  }
  body.innerHTML =
    '<div style="display:flex;align-items:center;margin-bottom:12px;">' + logoHtml +
    '<div><div style="font-size:16px;font-weight:700;color:var(--text);">'+item.simbolo+'</div>' +
    '<div style="font-size:11px;color:var(--textSec);">'+item.nombre+'</div></div>' +
    '<div style="margin-left:auto;text-align:right;">' +
    '<div style="font-size:18px;font-weight:700;color:var(--text);">$'+fmtP(precio)+'</div>' +
    '<div style="font-size:11px;color:'+pnlColor+';">'+pnlSign+pnlPct.toFixed(2)+'% P&L</div>' +
    '</div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;">' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_precio_compra_short')+'</div><div style="font-size:13px;color:var(--text);font-weight:600;">$'+fmtP(item.precio_compra)+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_cantidad_label')+'</div><div style="font-size:13px;color:var(--text);font-weight:600;">'+item.cantidad+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_pnl_usd')+'</div><div style="font-size:13px;color:'+pnlColor+';font-weight:600;">'+pnlSign+'$'+fmtP(Math.abs(pnlUsd))+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_entrada')+'</div><div style="font-size:11px;color:var(--textSec);">'+fechaStr+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_min_52sem')+'</div><div style="font-size:12px;color:var(--red);font-weight:600;">'+(low52 ? '$'+fmtP(low52) : '--')+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_max_52sem')+'</div><div style="font-size:12px;color:var(--green);font-weight:600;">'+(high52 ? '$'+fmtP(high52) : '--')+'</div></div>' +
    '</div>' +
    rangeBar +
    '<div id="port-det-pct" style="margin:6px 0;"><span id="pd-24h-val" style="font-size:13px;font-weight:600;color:var(--textSec);">--</span><span style="display:flex;gap:4px;margin-top:4px;">' +
    ['24h','7d','1m','3m','1y'].map(function(p){ return '<span onclick="portDetPeriod(\''+item.simbolo+'\',\''+item.tipo+'\',\''+p+'\')" id="pd-tab-'+p+'" style="font-size:9px;padding:2px 6px;border-radius:4px;cursor:pointer;background:'+(p==='24h'?'var(--gold)':'var(--border)')+';color:'+(p==='24h'?'var(--bg)':'var(--textSec)')+';">'+p+'</span>'; }).join('') +
    '</span></div>' +
    sigHtml +
    '<div style="margin-top:10px;background:var(--card);border-radius:9px;padding:12px;border:1px solid var(--border);">' +
    '<div style="font-size:10px;color:var(--textDim);font-weight:600;letter-spacing:.3px;margin-bottom:8px;">'+t('port_sim_title')+'</div>' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">' +
    '<span style="font-size:11px;color:var(--textSec);">'+t('port_sim_label')+'</span>' +
    '<input id="pd-sim-pct" type="range" min="-50" max="50" value="0" step="1" style="flex:1;accent-color:var(--gold);" oninput="portSimUpdate(\'' + item.id + '\',\'' + item.simbolo + '\',this.value)" />' +
    '<span id="pd-sim-label" style="font-size:12px;font-weight:700;color:var(--gold);min-width:38px;text-align:right;">0%</span>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
    '<div style="background:var(--bg);border-radius:7px;padding:7px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_sim_nuevo_precio')+'</div><div id="pd-sim-newprice" style="font-size:12px;color:var(--text);font-weight:600;">$' + fmtP(precio) + '</div></div>' +
    '<div style="background:var(--bg);border-radius:7px;padding:7px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_sim_pnl_activo')+'</div><div id="pd-sim-pnl" style="font-size:12px;color:var(--text);font-weight:600;">' + pnlSign + '$' + fmtP(Math.abs(pnlUsd)) + '</div></div>' +
    '<div style="background:var(--bg);border-radius:7px;padding:7px;grid-column:span 2;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+t('port_sim_impacto_total')+'</div><div id="pd-sim-portimpact" style="font-size:12px;color:var(--text);font-weight:600;">--</div></div>' +
    '' +
    '<div style="border-top:1px solid var(--border);margin-top:12px;padding-top:12px;">' +
    '<div onclick="event.stopPropagation();openCreateAlert(\''+item.simbolo+'\',\''+(item.tipo||'')+'\')" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:11px;border-radius:10px;background:var(--bg);border:1px solid var(--gold);margin-bottom:12px;cursor:pointer"><span style="font-size:15px">&#128276;</span><span style="font-size:12px;font-weight:700;color:var(--gold)">'+t('al_crear_alerta_menu')+'</span></div>' +
    '<div style="font-size:10px;color:var(--textSec);margin-bottom:8px;text-align:center;">'+t('port_compartir')+'</div>' +
    (function(){
  var _txt2 = item.simbolo + ' - ' + item.nombre + '\n' +
    'Precio: $' + precio.toFixed(2) + '\n' +
    'P&L: ' + pnlSign + pnlPct.toFixed(2) + '%\n' +
    'cobrex.io';
  var _waUrl = 'https://wa.me/?text=' + encodeURIComponent(_txt2);
  var _tgUrl = 'https://t.me/share/url?url=https://cobrex.io&text=' + encodeURIComponent(_txt2);
  var _mlUrl = 'mailto:?subject=Cobrex+-+' + encodeURIComponent(item.simbolo) + '&body=' + encodeURIComponent(_txt2);
  return '<div style="display:flex;justify-content:space-between;align-items:center;padding:0 12px;">'
    + '<a href="' + _mlUrl + '" onclick="event.stopPropagation()" style="display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:var(--textSec);font-size:10px;font-weight:600;"><div style="font-size:26px;">&#x1F4E7;</div>Mail</a>'
    + '<a href="' + _waUrl + '" target="_blank" onclick="event.stopPropagation()" style="display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:#25D366;font-size:10px;font-weight:600;"><div style="font-size:26px;">&#x1F4AC;</div>WhatsApp</a>'
    + '<a href="' + _tgUrl + '" target="_blank" onclick="event.stopPropagation()" style="display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:#229ED9;font-size:10px;font-weight:600;"><div style="width:28px;height:28px;border-radius:50%;background:#229ED9;display:flex;align-items:center;justify-content:center;"><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 8.5l9-5-3 9-2-3-4 2z" fill="#fff"/></svg></div>Telegram</a>'
    + '</div>';
})()
    + '</div></div>';
  window._portSimBase = {precio: precio, cantidad: item.cantidad, precioCompra: item.precio_compra};
  modal.style.display = 'flex';
  portDetPeriod(item.simbolo, item.tipo, '24h');
};
window.closePortItemDetail = function(){
  var m = document.getElementById('port-detail-modal');
  if(m) m.style.display = 'none';
};
window.portDetPeriod = function(simbolo, tipo, period){
  ['24h','7d','1m','3m','1y'].forEach(function(p){
    var t = document.getElementById('pd-tab-'+p);
    if(!t) return;
    t.style.background = p === period ? 'var(--gold)' : 'var(--border)';
    t.style.color = p === period ? 'var(--bg)' : 'var(--textSec)';
  });
  var valEl = document.getElementById('pd-24h-val');
  if(!valEl) return;
  if(period === '24h'){
    var cv = window._pcChange24 && window._pcChange24[simbolo];
    if(cv !== undefined && cv !== null){
      valEl.style.color = cv >= 0 ? 'var(--green)' : 'var(--red)';
      valEl.textContent = _fmt(cv,'pct')+' (24h)';
    } else { valEl.textContent = '--'; valEl.style.color = 'var(--textSec)'; }
    return;
  }
  var days = period==='7d'?7:period==='1m'?30:period==='3m'?90:365;
  var CRIPTO = ['BTC','ETH','SOL','BNB','XRP','ADA','AVAX','DOT','LINK','MATIC','DOGE','SHIB','LTC','ATOM','UNI','FIL','NEAR','APT','ARB','OP'];
  if(CRIPTO.indexOf(simbolo) >= 0){
    var intv = days<=7?'4h':'1d'; var lim = days<=7?42:days;
    fetch('https://api.binance.com/api/v3/klines?symbol='+simbolo+'USDT&interval='+intv+'&limit='+lim)
    .then(function(r){ return r.json(); }).then(function(d){
      if(!d||!d.length) return;
      var oldest = parseFloat(d[0][1]);
      var newest = parseFloat(d[d.length-1][4]);
      var pct = oldest > 0 ? ((newest-oldest)/oldest*100) : 0;
      if(valEl){ valEl.style.color = pct>=0?'var(--green)':'var(--red)'; valEl.textContent = _fmt(pct,'pct')+' ('+period+')'; }
    }).catch(function(){ if(valEl) valEl.textContent = '--'; });
  } else {
    var yurl = 'https://aurex-app-production.up.railway.app/api/yahoo?symbol='+simbolo+'&interval=1d&range='+days+'d';
    fetch(yurl).then(function(r){ return r.json(); }).then(function(d){
      try{
        var closes = d.chart.result[0].indicators.quote[0].close;
        var oldest2 = closes.find(function(x){ return x !== null && x !== undefined; });
        var newest2 = closes[closes.length-1];
        var pct2 = oldest2 > 0 ? ((newest2-oldest2)/oldest2*100) : 0;
        if(valEl){ valEl.style.color = pct2>=0?'var(--green)':'var(--red)'; valEl.textContent = (pct2>=0?'+':'')+pct2.toFixed(2)+'% ('+period+')'; }
      }catch(e){ if(valEl) valEl.textContent='--'; }
    }).catch(function(){ if(valEl) valEl.textContent='--'; });
  }
}
window.portSimUpdate = function(itemId, simbolo, pctStr){
  var pct = parseFloat(pctStr) || 0;
  var base = window._portSimBase || {};
  var lbl = document.getElementById('pd-sim-label');
  var npEl = document.getElementById('pd-sim-newprice');
  var pnlEl = document.getElementById('pd-sim-pnl');
  var piEl = document.getElementById('pd-sim-portimpact');
  if(!base.precio) return;
  var newPrice = base.precio * (1 + pct/100);
  var newPnlUsd = base.cantidad * (newPrice - base.precioCompra);
  var newPnlPct = base.precioCompra > 0 ? ((newPrice - base.precioCompra)/base.precioCompra*100) : 0;
  var portImpact = base.precio > 0 ? (base.cantidad * (newPrice - base.precio)) : 0;
  var pnlColor = newPnlUsd >= 0 ? 'var(--green)' : 'var(--red)';
  var piColor = portImpact >= 0 ? 'var(--green)' : 'var(--red)';
  var fmt = function(n){ var loc=(navigator.language||'en-US'); return n.toLocaleString(loc,{minimumFractionDigits:2,maximumFractionDigits:2}); };
  if(lbl) { lbl.textContent = (pct>=0?'+':'')+pct+'%'; lbl.style.color = pct===0?'var(--gold)':(pct>0?'var(--green)':'var(--red)'); }
  if(npEl) npEl.textContent = '$'+fmt(newPrice);
  if(pnlEl){ pnlEl.textContent = (newPnlUsd>=0?'+':'-')+'$'+fmt(Math.abs(newPnlUsd))+' ('+( newPnlPct>=0?'+':'')+newPnlPct.toFixed(1)+'%)'; pnlEl.style.color = pnlColor; }
  if(piEl){ piEl.textContent = (portImpact>=0?'+':'-')+'$'+fmt(Math.abs(portImpact)); piEl.style.color = piColor; }
};;


// ââ AGREGAR activo al portfolio en Supabase ââ
window.addPortfolioItem = function(simbolo, nombre, cantidad, precioCompra, tipo){
  if(!window._supabase){ console.warn('Supabase no disponible'); return; }
  window._supabase.auth.getSession().then(function(res){
    if(!res.data || !res.data.session){ console.warn('Sin sesion activa'); return; }
    var token = res.data.session.access_token;
    var userId = res.data.session.user.id;
    fetch(SUPA_URL + '/rest/v1/portfolio', {
      method: 'POST',
      headers: Object.assign({}, supaHeaders(token), {'Prefer': 'return=minimal'}),
      body: JSON.stringify({
        user_id: userId,
        simbolo: simbolo.toUpperCase(),
        nombre: nombre || simbolo,
        cantidad: parseFloat(cantidad),
        precio_compra: parseFloat(precioCompra),
        tipo: tipo || 'cripto'
      })
    })
    .then(function(r){
      if(r.ok){ loadPortfolioSupa(); }
      else { return r.text().then(function(t){ console.error('Error POST portfolio:', t); }); }
    })
    .catch(function(e){ console.error('Error agregando activo:', e); });
  });
};

// ââ ELIMINAR activo del portfolio ââ
window.deletePortfolioItem = function(id){
  if(!window._supabase) return;
  if(!confirm(t('port_confirm_eliminar'))) return;
  window._supabase.auth.getSession().then(function(res){
    if(!res.data || !res.data.session) return;
    var token = res.data.session.access_token;
    fetch(SUPA_URL + '/rest/v1/portfolio?id=eq.' + id, {
      method: 'DELETE',
      headers: supaHeaders(token)
    })
    .then(function(r){ if(r.ok) loadPortfolioSupa(); })
    .catch(function(e){ console.error('Error eliminando:', e); });
  });
};

// Inicializar portfolio cuando hay sesión
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    if(window._supabase){
      window._supabase.auth.onAuthStateChange(function(event, session){
        if(event === 'SIGNED_IN') loadPortfolioSupa();
        if(event === 'SIGNED_OUT') _renderPortfolioEmpty();
      });
      window._supabase.auth.getSession().then(function(res){
        if(res.data && res.data.session){
          loadPortfolioSupa();
        } else {
          window._supabase.auth.signInAnonymously().then(function(r){
            if(!r.error){ loadPortfolioSupa(); }
            else { _renderPortfolioEmpty(); }
          }).catch(function(){ _renderPortfolioEmpty(); });
        }
      });
    } else {
      _renderPortfolioEmpty();
    }
  }, 1200);
});


// Picker pais custom
window.togglePaisPicker=function(){var dd=document.getElementById("reg-pais-dropdown");if(!dd)return;dd.style.display=dd.style.display==="block"?"none":"block";};
window.selectPais=function(iso,code){var fe=document.getElementById("reg-pais-flag");var ce=document.getElementById("reg-pais-code");var hd=document.getElementById("reg-celular");var dd=document.getElementById("reg-pais-dropdown");if(fe)fe.innerHTML='<img src="https://flagcdn.com/24x18/'+iso+'.png" width="24" height="18" style="border-radius:2px;vertical-align:middle;display:inline-block;" alt="'+iso+'">';if(ce)ce.textContent=code;if(hd)hd.value=code;if(dd)dd.style.display="none";window.syncPhoneField();};
window.syncPhoneField=function(){var num=document.getElementById("reg-celular-num");var hd=document.getElementById("reg-celular");if(!num||!hd)return;var prefix=hd.value.indexOf(" ")>-1?hd.value.split(" ")[0]:hd.value;hd.value=prefix+" "+num.value.trim();};
window.updatePhonePrefix=function(){};
document.addEventListener("click",function(e){var dd=document.getElementById("reg-pais-dropdown");var btn=document.getElementById("reg-pais-btn");if(!dd||!btn)return;if(!btn.contains(e.target)&&!dd.contains(e.target))dd.style.display="none";});


// ============================================================


// ============================================================
// MOTOR DE SENALES IA Cobrex - Grupo A (29/03/2026)
// Variables: RSI + Tendencia + Volumen + Volatilidad +
//            Correlacion + Oro/Petroleo + Macro + Earnings
// ============================================================

var _iaCategoria = 'alcista';
var _iaSignals = [];
var _IA_PRECIOS = window._IA_PRECIOS || {};
var _IA_PRECIOS_PREV = {};
var _MACRO_EVENTOS = [];



function _iaSeed(sym) {
  var d = new Date(); var day = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
  var h = 0;
  for (var i = 0; i < sym.length; i++) h = (h * 31 + sym.charCodeAt(i)) & 0xFFFFFF;
  return ((h ^ day) % 1000) / 1000;
}


// ============================================================
// SENALES IA - MOTOR COMPLETO v6 (74 activos, carga progresiva)
// ============================================================

window._IA_FILTRO_ACTUAL = 'todo';
window._IA_BANNER_IDX = 0;
window._IA_BANNER_TIMER = null;
window._IA_PRECIOS_EXTRA = {};

// 74 ACTIVOS COMPLETOS con logos garantizados
window._IA_ACTIVOS = [
  {s:'BTC', n:'Bitcoin', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', color:'#F7931A', ySymbol:'BTC-USD'},
  {s:'ETH', n:'Ethereum', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/279/small/ethereum.png', color:'#627EEA', ySymbol:'ETH-USD'},
  {s:'SOL', n:'Solana', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/4128/small/solana.png', color:'#9945FF', ySymbol:'SOL-USD'},
  {s:'BNB', n:'BNB', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', color:'#F3BA2F', ySymbol:'BNB-USD'},
  {s:'XRP', n:'XRP', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', color:'#00AAE4', ySymbol:'XRP-USD'},
  {s:'ADA', n:'Cardano', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/975/small/cardano.png', color:'#0033AD', ySymbol:'ADA-USD'},
  {s:'AVAX', n:'Avalanche', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png', color:'#E84142', ySymbol:'AVAX-USD'},
  {s:'DOT', n:'Polkadot', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12171/small/polkadot.png', color:'#E6007A', ySymbol:'DOT-USD'},
  {s:'LINK', n:'Chainlink', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', color:'#2A5ADA', ySymbol:'LINK-USD'},
  {s:'MATIC', n:'Polygon', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png', color:'#8247E5', ySymbol:'MATIC-USD'},
  {s:'DOGE', n:'Dogecoin', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/5/small/dogecoin.png', color:'#C2A633', ySymbol:'DOGE-USD'},
  {s:'SHIB', n:'Shiba Inu', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/11939/small/shiba.png', color:'#E3003A', ySymbol:'SHIB-USD'},
  {s:'LTC', n:'Litecoin', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/2/small/litecoin.png', color:'#BFBBBB', ySymbol:'LTC-USD'},
  {s:'ATOM', n:'Cosmos', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png', color:'#6F7390', ySymbol:'ATOM-USD'},
  {s:'UNI', n:'Uniswap', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12504/small/uni.jpg', color:'#FF007A', ySymbol:'UNI-USD'},
  {s:'FIL', n:'Filecoin', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12817/small/filecoin.png', color:'#42C1CA', ySymbol:'FIL-USD'},
  {s:'NEAR', n:'NEAR Protocol', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/10365/small/near.jpg', color:'#00C08B', ySymbol:'NEAR-USD'},
  {s:'APT', n:'Aptos', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png', color:'#00D395', ySymbol:'APT-USD'},
  {s:'ARB', n:'Arbitrum', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg', color:'#12AAFF', ySymbol:'ARB-USD'},
  {s:'OP', n:'Optimism', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/25244/small/Optimism.png', color:'#FF0420', ySymbol:'OP-USD'},
  {s:'TON', n:'Toncoin', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png', color:'#0088CC', ySymbol:'TON-USD'},
  {s:'SUI', n:'Sui', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg', color:'#6FBCF0', ySymbol:'SUI-USD'},
  {s:'TRX', n:'TRON', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png', color:'#FF0013', ySymbol:'TRX-USD'},
  {s:'INJ', n:'Injective', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png', color:'#00B2FF', ySymbol:'INJ-USD'},
  {s:'SEI', n:'Sei', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Transparent.png', color:'#9C3A7A', ySymbol:'SEI-USD'},
  {s:'PEPE', n:'Pepe', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg', color:'#00B140', ySymbol:'PEPE-USD'},
  {s:'WIF', n:'Dogwifhat', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg', color:'#C29B67', ySymbol:'WIF-USD'},
  {s:'JUP', n:'Jupiter', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/34285/large/jup.png', color:'#C8853A', ySymbol:'JUP-USD'},
  {s:'ENA', n:'Ethena', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/36530/small/ethena.png', color:'#9B59B6', ySymbol:'ENA-USD'},
  {s:'BONK', n:'Bonk', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg', color:'#F4A418', ySymbol:'BONK-USD'},
  {s:'FTM', n:'Fantom', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png', color:'#1969FF', ySymbol:'FTM-USD'},
  {s:'AAVE', n:'Aave', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12645/small/AAVE.png', color:'#B6509E', ySymbol:'AAVE-USD'},
  {s:'MKR', n:'Maker', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png', color:'#1AAB9B', ySymbol:'MKR-USD'},
  {s:'CRV', n:'Curve', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12124/small/Curve.png', color:'#D9002E', ySymbol:'CRV-USD'},
  {s:'SNX', n:'Synthetix', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/3406/small/SNX.png', color:'#1E1A31', ySymbol:'SNX-USD'},
  {s:'SAND', n:'The Sandbox', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg', color:'#00ADEF', ySymbol:'SAND-USD'},
  {s:'MANA', n:'Decentraland', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png', color:'#FF2D55', ySymbol:'MANA-USD'},
  {s:'AXS', n:'Axie Infinity', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/13029/small/axie_infinity_logo.png', color:'#0055D5', ySymbol:'AXS-USD'},
  {s:'GRT', n:'The Graph', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png', color:'#6747ED', ySymbol:'GRT-USD'},
  {s:'LDO', n:'Lido DAO', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png', color:'#F27B4D', ySymbol:'LDO-USD'},
  {s:'IMX', n:'Immutable X', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png', color:'#00C3F9', ySymbol:'IMX-USD'},
  {s:'RUNE', n:'THORChain', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/6595/small/Rune200x200.png', color:'#33FF99', ySymbol:'RUNE-USD'},
  {s:'CFX', n:'Conflux', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/13079/small/3vuYMbjN.png', color:'#1FCFCF', ySymbol:'CFX-USD'},
  {s:'HBAR', n:'Hedera', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/3688/small/hbar.png', color:'#222222', ySymbol:'HBAR-USD'},
  {s:'XLM', n:'Stellar', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png', color:'#000000', ySymbol:'XLM-USD'},
  {s:'VET', n:'VeChain', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/1167/small/VET_Token_Icon.png', color:'#15BDFF', ySymbol:'VET-USD'},
  {s:'ETC', n:'Ethereum Classic', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png', color:'#328332', ySymbol:'ETC-USD'},
  {s:'ALGO', n:'Algorand', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/4380/small/download.png', color:'#000000', ySymbol:'ALGO-USD'},
  {s:'EGLD', n:'MultiversX', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12335/small/egld-token-logo.png', color:'#1B46C2', ySymbol:'EGLD-USD'},
  {s:'THETA', n:'Theta Network', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/2538/small/theta-token-logo.png', color:'#2AB8E6', ySymbol:'THETA-USD'},
  {s:'AAPL', n:'Apple', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AAPL.png', icon:'A', color:'var(--textDim)', ySymbol:'AAPL'},
  {s:'NVDA', n:'NVIDIA', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NVDA.png', icon:'N', color:'#76B900', ySymbol:'NVDA'},
  {s:'MSFT', n:'Microsoft', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MSFT.png', icon:'M', color:'#00A4EF', ySymbol:'MSFT'},
  {s:'GOOGL', n:'Alphabet A', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GOOGL.png', icon:'G', color:'#4285F4', ySymbol:'GOOGL'},
  {s:'GOOG', n:'Alphabet C', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GOOG.png', icon:'G', color:'#34A853', ySymbol:'GOOG'},
  {s:'AMZN', n:'Amazon', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AMZN.png', icon:'A', color:'#FF9900', ySymbol:'AMZN'},
  {s:'META', n:'Meta', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/META.png', icon:'M', color:'#1877F2', ySymbol:'META'},
  {s:'TSLA', n:'Tesla', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/TSLA.png', icon:'T', color:'#CC0000', ySymbol:'TSLA'},
  {s:'AVGO', n:'Broadcom', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AVGO.png', icon:'A', color:'#CC0000', ySymbol:'AVGO'},
  {s:'ORCL', n:'Oracle', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ORCL.png', icon:'O', color:'#C74634', ySymbol:'ORCL'},
  {s:'JPM', n:'JPMorgan', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/JPM.png', icon:'J', color:'#003087', ySymbol:'JPM'},
  {s:'V', n:'Visa', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/V.png', icon:'V', color:'#1A1F71', ySymbol:'V'},
  {s:'MA', n:'Mastercard', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MA.png', icon:'M', color:'#EB001B', ySymbol:'MA'},
  {s:'BAC', n:'Bank of America', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BAC.png', icon:'B', color:'#E31837', ySymbol:'BAC'},
  {s:'WFC', n:'Wells Fargo', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/WFC.png', icon:'W', color:'#CC0000', ySymbol:'WFC'},
  {s:'GS', n:'Goldman Sachs', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GS.png', icon:'G', color:'#003087', ySymbol:'GS'},
  {s:'MS', n:'Morgan Stanley', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MS.png', icon:'M', color:'#003087', ySymbol:'MS'},
  {s:'AXP', n:'AmEx', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AXP.png', icon:'A', color:'#016FD0', ySymbol:'AXP'},
  {s:'BLK', n:'BlackRock', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BLK.png', icon:'B', color:'#003087', ySymbol:'BLK'},
  {s:'SCHW', n:'Charles Schwab', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SCHW.png', icon:'S', color:'#003087', ySymbol:'SCHW'},
  {s:'LLY', n:'Eli Lilly', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LLY.png', icon:'L', color:'#CC0000', ySymbol:'LLY'},
  {s:'UNH', n:'UnitedHealth', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/UNH.png', icon:'U', color:'#003087', ySymbol:'UNH'},
  {s:'JNJ', n:'J&J', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/JNJ.png', icon:'J', color:'#CC0000', ySymbol:'JNJ'},
  {s:'MRK', n:'Merck', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MRK.png', icon:'M', color:'#009999', ySymbol:'MRK'},
  {s:'ABBV', n:'AbbVie', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ABBV.png', icon:'A', color:'#003087', ySymbol:'ABBV'},
  {s:'PFE', n:'Pfizer', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PFE.png', icon:'P', color:'#0044CC', ySymbol:'PFE'},
  {s:'TMO', n:'Thermo Fisher', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/TMO.png', icon:'T', color:'#003087', ySymbol:'TMO'},
  {s:'ABT', n:'Abbott Labs', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ABT.png', icon:'A', color:'#003087', ySymbol:'ABT'},
  {s:'DHR', n:'Danaher', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/DHR.png', icon:'D', color:'#003087', ySymbol:'DHR'},
  {s:'BMY', n:'Bristol Myers', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BMY.png', icon:'B', color:'#003087', ySymbol:'BMY'},
  {s:'COST', n:'Costco', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/COST.png', icon:'C', color:'#005DAA', ySymbol:'COST'},
  {s:'WMT', n:'Walmart', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/WMT.png', icon:'W', color:'#0071CE', ySymbol:'WMT'},
  {s:'HD', n:'Home Depot', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/HD.png', icon:'H', color:'#F96302', ySymbol:'HD'},
  {s:'PG', n:'Procter Gamble', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PG.png', icon:'P', color:'#003087', ySymbol:'PG'},
  {s:'KO', n:'Coca-Cola', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/KO.png', icon:'K', color:'#F40009', ySymbol:'KO'},
  {s:'PEP', n:'PepsiCo', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PEP.png', icon:'P', color:'#004B93', ySymbol:'PEP'},
  {s:'MCD', n:'McDonalds', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MCD.png', icon:'M', color:'#FFC72C', ySymbol:'MCD'},
  {s:'SBUX', n:'Starbucks', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SBUX.png', icon:'S', color:'#00704A', ySymbol:'SBUX'},
  {s:'NKE', n:'Nike', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NKE.png', icon:'N', color:'#000000', ySymbol:'NKE'},
  {s:'TGT', n:'Target', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/TGT.png', icon:'T', color:'#CC0000', ySymbol:'TGT'},
  {s:'AMD', n:'AMD', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AMD.png', icon:'A', color:'#ED1C24', ySymbol:'AMD'},
  {s:'INTC', n:'Intel', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/INTC.png', icon:'I', color:'#0071C5', ySymbol:'INTC'},
  {s:'QCOM', n:'Qualcomm', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/QCOM.png', icon:'Q', color:'#3253DC', ySymbol:'QCOM'},
  {s:'TXN', n:'Texas Instruments', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/TXN.png', icon:'T', color:'#CC0000', ySymbol:'TXN'},
  {s:'AMAT', n:'Applied Materials', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AMAT.png', icon:'A', color:'#003087', ySymbol:'AMAT'},
  {s:'MU', n:'Micron', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MU.png', icon:'M', color:'#003087', ySymbol:'MU'},
  {s:'LRCX', n:'Lam Research', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LRCX.png', icon:'L', color:'#003087', ySymbol:'LRCX'},
  {s:'NOW', n:'ServiceNow', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NOW.png', icon:'N', color:'#81B5A1', ySymbol:'NOW'},
  {s:'CRM', n:'Salesforce', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/CRM.png', icon:'C', color:'#00A1E0', ySymbol:'CRM'},
  {s:'ADBE', n:'Adobe', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ADBE.png', icon:'A', color:'#FF0000', ySymbol:'ADBE'},
  {s:'NFLX', n:'Netflix', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NFLX.png', icon:'N', color:'#E50914', ySymbol:'NFLX'},
  {s:'DIS', n:'Disney', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/DIS.png', icon:'D', color:'#113CCF', ySymbol:'DIS'},
  {s:'CMCSA', n:'Comcast', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/CMCSA.png', icon:'C', color:'#CC0000', ySymbol:'CMCSA'},
  {s:'SPOT', n:'Spotify', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SPOT.png', icon:'S', color:'#1DB954', ySymbol:'SPOT'},
  {s:'RBLX', n:'Roblox', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/RBLX.png', icon:'R', color:'#CC0000', ySymbol:'RBLX'},
  {s:'COIN', n:'Coinbase', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/COIN.png', icon:'C', color:'#0052FF', ySymbol:'COIN'},
  {s:'HOOD', n:'Robinhood', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/HOOD.png', icon:'H', color:'#00C805', ySymbol:'HOOD'},
  {s:'PYPL', n:'PayPal', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PYPL.png', icon:'P', color:'#003087', ySymbol:'PYPL'},
  {s:'SQ', n:'Block (Square)', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SQ.png', icon:'S', color:'#000000', ySymbol:'SQ'},
  {s:'MSTR', n:'MicroStrategy', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MSTR.png', icon:'M', color:'#CC0000', ySymbol:'MSTR'},
  {s:'MARA', n:'Marathon Digital', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MARA.png', icon:'M', color:'#F7931A', ySymbol:'MARA'},
  {s:'RIOT', n:'Riot Platforms', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/RIOT.png', icon:'R', color:'#CC0000', ySymbol:'RIOT'},
  {s:'XOM', n:'ExxonMobil', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/XOM.png', icon:'X', color:'#003087', ySymbol:'XOM'},
  {s:'CVX', n:'Chevron', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/CVX.png', icon:'C', color:'#009DD9', ySymbol:'CVX'},
  {s:'COP', n:'ConocoPhillips', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/COP.png', icon:'C', color:'#CC0000', ySymbol:'COP'},
  {s:'SLB', n:'Schlumberger', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SLB.png', icon:'S', color:'#003087', ySymbol:'SLB'},
  {s:'EOG', n:'EOG Resources', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/EOG.png', icon:'E', color:'#003087', ySymbol:'EOG'},
  {s:'F', n:'Ford', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/F.png', icon:'F', color:'#003087', ySymbol:'F'},
  {s:'GM', n:'General Motors', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GM.png', icon:'G', color:'#003087', ySymbol:'GM'},
  {s:'RIVN', n:'Rivian', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/RIVN.png', icon:'R', color:'#52D48E', ySymbol:'RIVN'},
  {s:'LCID', n:'Lucid Motors', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LCID.png', icon:'L', color:'#CC0000', ySymbol:'LCID'},
  {s:'PLTR', n:'Palantir', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PLTR.png', icon:'P', color:'#000000', ySymbol:'PLTR'},
  {s:'ARM', n:'ARM Holdings', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ARM.png', icon:'A', color:'#0091BD', ySymbol:'ARM'},
  {s:'SMCI', n:'Super Micro', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SMCI.png', icon:'S', color:'#003087', ySymbol:'SMCI'},
  {s:'AI', n:'C3.ai', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AI.png', icon:'A', color:'#003087', ySymbol:'AI'},
  {s:'SOUN', n:'SoundHound AI', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SOUN.png', icon:'S', color:'#CC0000', ySymbol:'SOUN'},
  {s:'UBER', n:'Uber', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/UBER.png', icon:'U', color:'#000000', ySymbol:'UBER'},
  {s:'LYFT', n:'Lyft', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LYFT.png', icon:'L', color:'#FF00BF', ySymbol:'LYFT'},
  {s:'ABNB', n:'Airbnb', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ABNB.png', icon:'A', color:'#FF5A5F', ySymbol:'ABNB'},
  {s:'DASH', n:'DoorDash', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/DASH.png', icon:'D', color:'#FF3008', ySymbol:'DASH'},
  {s:'T', n:'AT&T', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/T.png', icon:'T', color:'#00A8E0', ySymbol:'T'},
  {s:'VZ', n:'Verizon', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/VZ.png', icon:'V', color:'#CD040B', ySymbol:'VZ'},
  {s:'TMUS', n:'T-Mobile', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/TMUS.png', icon:'T', color:'#E20074', ySymbol:'TMUS'},
  {s:'BA', n:'Boeing', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BA.png', icon:'B', color:'#003087', ySymbol:'BA'},
  {s:'CAT', n:'Caterpillar', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/CAT.png', icon:'C', color:'#FFCD11', ySymbol:'CAT'},
  {s:'DE', n:'John Deere', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/DE.png', icon:'D', color:'#367C2B', ySymbol:'DE'},
  {s:'GE', n:'GE Aerospace', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GE.png', icon:'G', color:'#003087', ySymbol:'GE'},
  {s:'RTX', n:'RTX Corp', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/RTX.png', icon:'R', color:'#003087', ySymbol:'RTX'},
  {s:'LMT', n:'Lockheed Martin', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LMT.png', icon:'L', color:'#003087', ySymbol:'LMT'},
  {s:'AMT', n:'American Tower', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AMT.png', icon:'A', color:'#003087', ySymbol:'AMT'},
  {s:'PLD', n:'Prologis', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PLD.png', icon:'P', color:'#003087', ySymbol:'PLD'},
  {s:'BRK-B', n:'Berkshire B', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BRK-B.png', icon:'B', color:'#4A4A4A', ySymbol:'BRK-B'},
  {s:'BABA', n:'Alibaba ADR', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BABA.png', icon:'A', color:'#FF6A00', ySymbol:'BABA'},
  {s:'SPGI', n:'S&P Global', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SPGI.png', icon:'S', color:'#003087', ySymbol:'SPGI'},
  {s:'BX', n:'Blackstone', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BX.png', icon:'B', color:'#003087', ySymbol:'BX'},
  {s:'NDAQ', n:'Nasdaq Inc', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NDAQ.png', icon:'N', color:'#003087', ySymbol:'NDAQ'},
  {s:'YPF', n:'YPF Argentina', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/YPF.png', icon:'Y', color:'#005FAD', ySymbol:'YPF'},
  {s:'PBR', n:'Petrobras', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PBR.png', icon:'P', color:'#009B3A', ySymbol:'PBR'},
  {s:'VALE', n:'Vale', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/VALE.png', icon:'V', color:'#009B3A', ySymbol:'VALE'},
  {s:'MELI', n:'MercadoLibre', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MELI.png', icon:'M', color:'#FFE600', ySymbol:'MELI'},
  {s:'GLOB', n:'Globant', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GLOB.png', icon:'G', color:'#00A651', ySymbol:'GLOB'},
  {s:'NU', n:'Nubank', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NU.png', icon:'N', color:'#8A05BE', ySymbol:'NU'},
  {s:'ITUB', n:'Itau Unibanco', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ITUB.png', icon:'I', color:'#F48024', ySymbol:'ITUB'},
  {s:'BBD', n:'Bradesco', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BBD.png', icon:'B', color:'#CC0000', ySymbol:'BBD'},
  {s:'SQM', n:'SQM Chile', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SQM.png', icon:'S', color:'#003087', ySymbol:'SQM'},
  {s:'ABEV', n:'Ambev', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ABEV.png', icon:'A', color:'#F4A700', ySymbol:'ABEV'},
  {s:'CIB', n:'Bancolombia', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/CIB.png', icon:'C', color:'#FFCC00', ySymbol:'CIB'},
  {s:'TV', n:'Televisa', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/TV.png', icon:'T', color:'#003087', ySymbol:'TV'},
  {s:'ERJ', n:'Embraer', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ERJ.png', icon:'E', color:'#003087', ySymbol:'ERJ'},
  {s:'DESP', n:'Despegar', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/DESP.png', icon:'D', color:'#003087', ySymbol:'DESP'},
  {s:'LREN3', n:'Lojas Renner', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LREN3.png', icon:'L', color:'#CC0000', ySymbol:'LRENY'},
  {s:'VIVA', n:'Viva Aerobus', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/VIVA.png', icon:'V', color:'#CC0000', ySymbol:'VIVA'},
  {s:'GGAL', n:'Galicia Arg', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GGAL.png', icon:'G', color:'#003087', ySymbol:'GGAL'},
  {s:'BMA', n:'Banco Macro', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BMA.png', icon:'B', color:'#003087', ySymbol:'BMA'},
  {s:'CEPU', n:'Central Puerto', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/CEPU.png', icon:'C', color:'#003087', ySymbol:'CEPU'},
  {s:'PAMP', n:'Pampa Energia', tipo:'accion', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNDMDM5MkInLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+UEE8L3RleHQ+PC9zdmc+', icon:'P', color:'#003087', ySymbol:'PAM'},
  {s:'LOMA', n:'Loma Negra', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LOMA.png', icon:'L', color:'#CC0000', ySymbol:'LOMA'},
  {s:'ARCO', n:'Arcos Dorados', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ARCO.png', icon:'A', color:'#FFC72C', ySymbol:'ARCO'},
  {s:'XPEV', n:'XPeng (China)', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/XPEV.png', icon:'X', color:'#CC0000', ySymbol:'XPEV'},
  {s:'VTEX', n:'VTEX', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/VTEX.png', icon:'V', color:'#CC0000', ySymbol:'VTEX'},
  {s:'BRFS', n:'BRF Foods', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BRFS.png', icon:'B', color:'#003087', ySymbol:'BRFS'},
  {s:'ASML', n:'ASML', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ASML.png', icon:'A', color:'#003087', ySymbol:'ASML'},
  {s:'SAP', n:'SAP', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SAP.png', icon:'S', color:'#1872B4', ySymbol:'SAP'},
  {s:'NVS', n:'Novartis', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NVS.png', icon:'N', color:'#CC0000', ySymbol:'NVS'},
  {s:'NSRGY', n:'Nestle', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NSRGY.png', icon:'N', color:'#003087', ySymbol:'NSRGY'},
  {s:'RHHBY', n:'Roche', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/RHHBY.png', icon:'R', color:'#CC0000', ySymbol:'RHHBY'},
  {s:'VWAGY', n:'Volkswagen', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/VWAGY.png', icon:'V', color:'#003087', ySymbol:'VWAGY'},
  {s:'SIEGY', n:'Siemens', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SIEGY.png', icon:'S', color:'#009999', ySymbol:'SIEGY'},
  {s:'SHEL', n:'Shell', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SHEL.png', icon:'S', color:'#DD1D21', ySymbol:'SHEL'},
  {s:'BP', n:'BP', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BP.png', icon:'B', color:'#009900', ySymbol:'BP'},
  {s:'GSK', n:'GSK', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GSK.png', icon:'G', color:'#F36200', ySymbol:'GSK'},
  {s:'UL', n:'Unilever', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/UL.png', icon:'U', color:'#003087', ySymbol:'UL'},
  {s:'RIO', n:'Rio Tinto', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/RIO.png', icon:'R', color:'#CC0000', ySymbol:'RIO'},
  {s:'BHP', n:'BHP Group', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BHP.png', icon:'B', color:'#CC0000', ySymbol:'BHP'},
  {s:'AZN', n:'AstraZeneca', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AZN.png', icon:'A', color:'#CC0000', ySymbol:'AZN'},
  {s:'HSBC', n:'HSBC', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/HSBC.png', icon:'H', color:'#CC0000', ySymbol:'HSBC'},
  {s:'STM', n:'STMicroelectronics', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/STM.png', icon:'S', color:'#003087', ySymbol:'STM'},
  {s:'EADSF', n:'Airbus', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/EADSF.png', icon:'A', color:'#003087', ySymbol:'EADSF'},
  {s:'IDEXY', n:'Inditex/Zara', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/IDEXY.png', icon:'I', color:'#003087', ySymbol:'IDEXY'},
  {s:'LVMUY', n:'LVMH', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LVMUY.png', icon:'L', color:'#8B7355', ySymbol:'LVMUY'},
  {s:'HNNMY', n:'Hennes & Mauritz', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/HNNMY.png', icon:'H', color:'#CC0000', ySymbol:'HNNMY'},
  {s:'ALIZF', n:'Allianz', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ALIZF.png', icon:'A', color:'#003087', ySymbol:'ALIZF'},
  {s:'BAYZF', n:'Bayer', tipo:'accion', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMxREE0NjInLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Qlk8L3RleHQ+PC9zdmc+', icon:'B', color:'#10384F', ySymbol:'BAYRY'},
  {s:'SAN', n:'Santander', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SAN.png', icon:'S', color:'#CC0000', ySymbol:'SAN'},
  {s:'BBVA', n:'BBVA', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BBVA.png', icon:'B', color:'#004481', ySymbol:'BBVA'},
  {s:'INGA', n:'ING Group', tipo:'accion', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMyN0FFNjAnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+SU48L3RleHQ+PC9zdmc+', icon:'I', color:'#FF6200', ySymbol:'ING'},
  {s:'TSM', n:'TSMC', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/TSM.png', icon:'T', color:'#003087', ySymbol:'TSM'},
  {s:'TM', n:'Toyota', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/TM.png', icon:'T', color:'#CC0000', ySymbol:'TM'},
  {s:'SONY', n:'Sony', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SONY.png', icon:'S', color:'#003087', ySymbol:'SONY'},
  {s:'HMC', n:'Honda', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/HMC.png', icon:'H', color:'#CC0000', ySymbol:'HMC'},
  {s:'NTDOY', n:'Nintendo', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NTDOY.png', icon:'N', color:'#CC0000', ySymbol:'NTDOY'},
  {s:'BIDU', n:'Baidu', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BIDU.png', icon:'B', color:'#2932E1', ySymbol:'BIDU'},
  {s:'JD', n:'JD.com', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/JD.png', icon:'J', color:'#CC0000', ySymbol:'JD'},
  {s:'PDD', n:'PDD Holdings', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PDD.png', icon:'P', color:'#CC0000', ySymbol:'PDD'},
  {s:'NTES', n:'NetEase', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NTES.png', icon:'N', color:'#CC0000', ySymbol:'NTES'},
  {s:'SFTBY', n:'SoftBank', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SFTBY.png', icon:'S', color:'#CC0000', ySymbol:'SFTBY'},
  {s:'INFY', n:'Infosys', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/INFY.png', icon:'I', color:'#003087', ySymbol:'INFY'},
  {s:'HDB', n:'HDFC Bank', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/HDB.png', icon:'H', color:'#004A97', ySymbol:'HDB'},
  {s:'IBN', n:'ICICI Bank', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/IBN.png', icon:'I', color:'#CC0000', ySymbol:'IBN'},
  {s:'WIT', n:'Wipro', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/WIT.png', icon:'W', color:'#003087', ySymbol:'WIT'},
  {s:'RELX', n:'Reliance Industries', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/RELX.png', icon:'R', color:'#003087', ySymbol:'RELIANCE.NS'},
  {s:'SE', n:'Sea Limited', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SE.png', icon:'S', color:'#000000', ySymbol:'SE'},
  {s:'GRAB', n:'Grab', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GRAB.png', icon:'G', color:'#00B14F', ySymbol:'GRAB'},
  {s:'GOTO', n:'GoTo Indonesia', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GOTO.png', icon:'G', color:'#CC0000', ySymbol:'GOTO-USD'},
  {s:'KPELY', n:'Korea Electric', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/KPELY.png', icon:'K', color:'#003087', ySymbol:'KEP'},
  {s:'LG', n:'LG Electronics', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LG.png', icon:'L', color:'#CC0000', ySymbol:'LGEIY'},
  {s:'SPY', n:'S&P 500 ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/SPY.png', icon:'S', color:'#003087', ySymbol:'SPY'},
  {s:'QQQ', n:'Nasdaq 100 ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/QQQ.png', icon:'Q', color:'#003087', ySymbol:'QQQ'},
  {s:'DIA', n:'Dow Jones ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/DIA.png', icon:'D', color:'#003087', ySymbol:'DIA'},
  {s:'IWM', n:'Russell 2000', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/IWM.png', icon:'I', color:'#003087', ySymbol:'IWM'},
  {s:'VTI', n:'Total Market', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/VTI.png', icon:'V', color:'#003087', ySymbol:'VTI'},
  {s:'VOO', n:'Vanguard S&P 500', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/VOO.png', icon:'V', color:'#003087', ySymbol:'VOO'},
  {s:'ARKK', n:'ARK Innovation', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/ARKK.png', icon:'A', color:'#00B0D7', ySymbol:'ARKK'},
  {s:'ARKG', n:'ARK Genomics', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/ARKG.png', icon:'A', color:'#00B0D7', ySymbol:'ARKG'},
  {s:'XLF', n:'Financials ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/XLF.png', icon:'X', color:'#003087', ySymbol:'XLF'},
  {s:'XLE', n:'Energy ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/XLE.png', icon:'X', color:'var(--border)', ySymbol:'XLE'},
  {s:'XLK', n:'Tech ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/XLK.png', icon:'X', color:'#003087', ySymbol:'XLK'},
  {s:'XLV', n:'Health ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/XLV.png', icon:'X', color:'#CC0000', ySymbol:'XLV'},
  {s:'XLI', n:'Industrial ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/XLI.png', icon:'X', color:'#003087', ySymbol:'XLI'},
  {s:'XLU', n:'Utilities ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/XLU.png', icon:'X', color:'#003087', ySymbol:'XLU'},
  {s:'XLB', n:'Materials ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/XLB.png', icon:'X', color:'#003087', ySymbol:'XLB'},
  {s:'XLP', n:'Consumer Stap ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/XLP.png', icon:'X', color:'#003087', ySymbol:'XLP'},
  {s:'GDX', n:'Gold Miners ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/GDX.png', icon:'G', color:'var(--gold)', ySymbol:'GDX'},
  {s:'GDXJ', n:'Jr Gold Miners', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/GDXJ.png', icon:'G', color:'var(--gold)', ySymbol:'GDXJ'},
  {s:'IBIT', n:'iShares Bitcoin', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/IBIT.png', icon:'I', color:'#F7931A', ySymbol:'IBIT'},
  {s:'FBTC', n:'Fidelity Bitcoin', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/FBTC.png', icon:'F', color:'#F7931A', ySymbol:'FBTC'},
  {s:'GBTC', n:'Grayscale BTC', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/GBTC.png', icon:'G', color:'#F7931A', ySymbol:'GBTC'},
  {s:'GLD', n:'SPDR Gold', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/GLD.png', icon:'G', color:'var(--gold)', ySymbol:'GLD'},
  {s:'SLV', n:'iShares Silver', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/SLV.png', icon:'S', color:'#C0C0C0', ySymbol:'SLV'},
  {s:'IAU', n:'iShares Gold', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/IAU.png', icon:'I', color:'var(--gold)', ySymbol:'IAU'},
  {s:'EWZ', n:'Brazil ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/EWZ.png', icon:'E', color:'#009B3A', ySymbol:'EWZ'},
  {s:'EWJ', n:'Japan ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/EWJ.png', icon:'E', color:'#CC0000', ySymbol:'EWJ'},
  {s:'FXI', n:'China ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/FXI.png', icon:'F', color:'#CC0000', ySymbol:'FXI'},
  {s:'EEM', n:'Emerging Markets', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/EEM.png', icon:'E', color:'#003087', ySymbol:'EEM'},
  {s:'EWW', n:'Mexico ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/EWW.png', icon:'E', color:'#006847', ySymbol:'EWW'},
  {s:'EWY', n:'Korea ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/EWY.png', icon:'E', color:'#003087', ySymbol:'EWY'},
  {s:'EWG', n:'Germany ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/EWG.png', icon:'E', color:'#003087', ySymbol:'EWG'},
  {s:'EWU', n:'UK ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/EWU.png', icon:'E', color:'#CC0000', ySymbol:'EWU'},
  {s:'EWQ', n:'France ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/EWQ.png', icon:'E', color:'#003087', ySymbol:'EWQ'},
  {s:'SOXX', n:'Semiconductors', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/SOXX.png', icon:'S', color:'#003087', ySymbol:'SOXX'},
  {s:'XBI', n:'Biotech ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/XBI.png', icon:'X', color:'#003087', ySymbol:'XBI'},
  {s:'KWEB', n:'China Internet', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/KWEB.png', icon:'K', color:'#CC0000', ySymbol:'KWEB'},
  {s:'VNQ', n:'Real Estate ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/VNQ.png', icon:'V', color:'#003087', ySymbol:'VNQ'},
  {s:'TAN', n:'Solar ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/TAN.png', icon:'T', color:'#FF9900', ySymbol:'TAN'},
  {s:'ICLN', n:'Clean Energy ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/ICLN.png', icon:'I', color:'#00A651', ySymbol:'ICLN'},
  {s:'BOTZ', n:'Robotics AI ETF', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/BOTZ.png', icon:'B', color:'#003087', ySymbol:'BOTZ'},
  {s:'ES=F', n:'S&P 500 Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMxQTZCM0MnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+RVM8L3RleHQ+PC9zdmc+', icon:'E', color:'#003087', ySymbol:'ES=F'},
  {s:'NQ=F', n:'Nasdaq Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwQTY2QzInLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+TlE8L3RleHQ+PC9zdmc+', icon:'N', color:'#003087', ySymbol:'NQ=F'},
  {s:'YM=F', n:'Dow Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwMDI4NjgnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+RFc8L3RleHQ+PC9zdmc+', icon:'Y', color:'#003087', ySymbol:'YM=F'},
  {s:'RTY=F', n:'Russell Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNDQzAwMDAnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+UlQ8L3RleHQ+PC9zdmc+', icon:'R', color:'#003087', ySymbol:'RTY=F'},
  {s:'GC=F', n:'Oro Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNENEFGMzcnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QXU8L3RleHQ+PC9zdmc+', icon:'O', color:'var(--gold)', ySymbol:'GC=F'},
  {s:'SI=F', n:'Plata Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNBOEE5QUQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QWc8L3RleHQ+PC9zdmc+', icon:'P', color:'#C0C0C0', ySymbol:'SI=F'},
  {s:'CL=F', n:'Petroleo WTI', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMxQzFDMUMnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+V1RJPC90ZXh0Pjwvc3ZnPg==', icon:'P', color:'var(--border)', ySymbol:'CL=F'},
  {s:'BZ=F', n:'Petroleo Brent', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMyQzJDNTQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Qlo8L3RleHQ+PC9zdmc+', icon:'B', color:'var(--border2)', ySymbol:'BZ=F'},
  {s:'NG=F', n:'Gas Natural', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwMDY2Q0MnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Tkc8L3RleHQ+PC9zdmc+', icon:'G', color:'#FF6600', ySymbol:'NG=F'},
  {s:'HG=F', n:'Cobre Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNCODczMzMnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Q3U8L3RleHQ+PC9zdmc+', icon:'C', color:'#B87333', ySymbol:'HG=F'},
  {s:'ZB=F', n:'US Bond 30Y', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwMDMwODcnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+WkI8L3RleHQ+PC9zdmc+', icon:'Z', color:'#003087', ySymbol:'ZB=F'},
  {s:'ZN=F', n:'US Note 10Y', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMxRjQ3ODgnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Wk48L3RleHQ+PC9zdmc+', icon:'Z', color:'#003087', ySymbol:'ZN=F'},
  {s:'6E=F', n:'Euro Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwMDMzOTknLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+RVVSPC90ZXh0Pjwvc3ZnPg==', icon:'E', color:'#003087', ySymbol:'6E=F'},
  {s:'6J=F', n:'Yen Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNCQzAwMkQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+SlBZPC90ZXh0Pjwvc3ZnPg==', icon:'J', color:'#CC0000', ySymbol:'6J=F'},
  {s:'6B=F', n:'GBP Futuro', tipo:'futuro', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwMDMzOTknLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+R0JQPC90ZXh0Pjwvc3ZnPg==', icon:'G', color:'#CC0000', ySymbol:'6B=F'},
  {s:'USO', n:'US Oil ETF', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/USO.png', icon:'U', color:'var(--border)', ySymbol:'USO'},
  {s:'BNO', n:'Brent Oil ETF', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/BNO.png', icon:'B', color:'var(--border2)', ySymbol:'BNO'},
  {s:'UNG', n:'Natural Gas ETF', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/UNG.png', icon:'G', color:'#FF6600', ySymbol:'UNG'},
  {s:'WEAT', n:'Wheat ETF', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/WEAT.png', icon:'W', color:'#C8A951', ySymbol:'WEAT'},
  {s:'CORN', n:'Corn ETF', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/CORN.png', icon:'C', color:'#F5C800', ySymbol:'CORN'},
  {s:'SOYB', n:'Soybean ETF', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/SOYB.png', icon:'S', color:'#7BAE36', ySymbol:'SOYB'},
  {s:'JO', n:'Cafe OJ ETF', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/JO.png', icon:'J', color:'#FF8C00', ySymbol:'JO'},
  {s:'SGG', n:'Sugar ETF', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/SGG.png', icon:'S', color:'#EEE', ySymbol:'SGG'},
  {s:'KC=F', n:'Cafe Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMzRTFGMDAnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+S0M8L3RleHQ+PC9zdmc+', icon:'C', color:'#6F4E37', ySymbol:'KC=F'},
  {s:'SB=F', n:'Azucar Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNBQUFBQUEnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+U0I8L3RleHQ+PC9zdmc+', icon:'A', color:'#EEE', ySymbol:'SB=F'},
  {s:'CC=F', n:'Cacao Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyM2QjNBMkEnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Q0M8L3RleHQ+PC9zdmc+', icon:'C', color:'#7B3F00', ySymbol:'CC=F'},
  {s:'ZW=F', n:'Trigo Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNDOEE5NTEnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Wlc8L3RleHQ+PC9zdmc+', icon:'T', color:'#C8A951', ySymbol:'ZW=F'},
  {s:'ZC=F', n:'Maiz Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNGNUM1MTgnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+WkM8L3RleHQ+PC9zdmc+', icon:'M', color:'#F5C800', ySymbol:'ZC=F'},
  {s:'ZS=F', n:'Soja Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyM4QjczNTUnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+WlM8L3RleHQ+PC9zdmc+', icon:'S', color:'#7BAE36', ySymbol:'ZS=F'},
  {s:'CT=F', n:'Algodon Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNDQ0NDQ0MnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Q1Q8L3RleHQ+PC9zdmc+', icon:'A', color:'#EEE', ySymbol:'CT=F'},
  {s:'OJ=F', n:'OJ Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNGRjhDMDAnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+T0o8L3RleHQ+PC9zdmc+', icon:'O', color:'#FF8C00', ySymbol:'OJ=F'},
  {s:'LB=F', n:'Madera Futuro', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/LB=F.png', icon:'M', color:'#8B4513', ySymbol:'LBS=F'},
  {s:'LE=F', n:'Ganado Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyM4QjQ1MTMnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+TEU8L3RleHQ+PC9zdmc+', icon:'G', color:'#8B4513', ySymbol:'LE=F'},
  {s:'HE=F', n:'Cerdo Futuro', tipo:'materia_prima', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNGRjZCNkInLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+SEU8L3RleHQ+PC9zdmc+', icon:'C', color:'#FF69B4', ySymbol:'HE=F'},
  {s:'PDBC', n:'Diversified Comm', tipo:'materia_prima', logo:'https://financialmodelingprep.com/image-stock/PDBC.png', icon:'P', color:'var(--border)', ySymbol:'PDBC'},
  {s:'CPER', n:'Cobre ETF', tipo:'metal', logo:'https://financialmodelingprep.com/image-stock/CPER.png', icon:'C', color:'#B87333', ySymbol:'CPER'},
  {s:'PPLT', n:'Platino ETF', tipo:'metal', logo:'https://financialmodelingprep.com/image-stock/PPLT.png', icon:'P', color:'#E5E4E2', ySymbol:'PPLT'},
  {s:'PALL', n:'Paladio ETF', tipo:'metal', logo:'https://financialmodelingprep.com/image-stock/PALL.png', icon:'P', color:'#CED0CF', ySymbol:'PALL'},
  {s:'ALUM', n:'Aluminio ETF', tipo:'metal', logo:'https://financialmodelingprep.com/image-stock/ALUM.png', icon:'A', color:'#848484', ySymbol:'ALUM'},
  {s:'ZINC', n:'Zinc ETF', tipo:'metal', logo:'https://financialmodelingprep.com/image-stock/ZINC.png', icon:'Z', color:'#4A4A4A', ySymbol:'JJZ'},
  {s:'IRON', n:'Hierro/Steel ETF', tipo:'metal', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyM3RjhDOEQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+SVI8L3RleHQ+PC9zdmc+', icon:'I', color:'#8B4513', ySymbol:'SLX'},
  {s:'ORO', n:'Oro', tipo:'metal', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNENEFGMzcnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QXU8L3RleHQ+PC9zdmc+', icon:'O', color:'var(--gold)', ySymbol:'GLD'},
  {s:'PLATA', n:'Plata', tipo:'metal', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNBOEE5QUQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QWc8L3RleHQ+PC9zdmc+', icon:'P', color:'#C0C0C0', ySymbol:'SLV'},
  {s:'COBRE', n:'Cobre', tipo:'metal', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNCODczMzMnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Q3U8L3RleHQ+PC9zdmc+', icon:'C', color:'#B87333', ySymbol:'CPER'},
  {s:'DBB', n:'Base Metals ETF', tipo:'metal', logo:'https://financialmodelingprep.com/image-stock/DBB.png', icon:'D', color:'#848484', ySymbol:'DBB'},
  {s:'TLT', n:'US 20Y Bond', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/TLT.png', icon:'T', color:'#003087', ySymbol:'TLT'},
  {s:'AGG', n:'US Bond Agg', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/AGG.png', icon:'A', color:'#003087', ySymbol:'AGG'},
  {s:'IEF', n:'US 7-10Y Bond', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/IEF.png', icon:'I', color:'#003087', ySymbol:'IEF'},
  {s:'SHY', n:'US 1-3Y Bond', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/SHY.png', icon:'S', color:'#003087', ySymbol:'SHY'},
  {s:'HYG', n:'High Yield Bond', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/HYG.png', icon:'H', color:'#CC0000', ySymbol:'HYG'},
  {s:'LQD', n:'Inv Grade Corp', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/LQD.png', icon:'L', color:'#003087', ySymbol:'LQD'},
  {s:'EMB', n:'Emerging Bonds', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/EMB.png', icon:'E', color:'#003087', ySymbol:'EMB'},
  {s:'BND', n:'Total Bond ETF', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/BND.png', icon:'B', color:'#003087', ySymbol:'BND'},
  {s:'TIP', n:'TIPS Inflation', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/TIP.png', icon:'T', color:'#003087', ySymbol:'TIP'},
  {s:'JNK', n:'Junk Bonds', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/JNK.png', icon:'J', color:'#CC0000', ySymbol:'JNK'},
  {s:'MUB', n:'Muni Bond ETF', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/MUB.png', icon:'M', color:'#003087', ySymbol:'MUB'},
  {s:'BNDX', n:'Intl Bond ETF', tipo:'bono', logo:'https://financialmodelingprep.com/image-stock/BNDX.png', icon:'B', color:'#003087', ySymbol:'BNDX'}
];

// EVENTOS MACRO SEMANALES
// A4: eventos IA con i18n (definición canónica — esta carga después de aurex-v3.js)
window._IA_EVENTOS_DEF = [
  {lk:'ia_ev1_l', tk:'ia_ev1_t', tiempo:'5h 54m', impacto:'ALTO', hora:'14:00 EST', color:'var(--gold)', bg:'var(--card)', border:'var(--gold40)'},
  {lk:'ia_ev2_l', tk:'ia_ev2_t', tiempo:'3h 00m', impacto:'MEDIO', hora:'08:30 EST', color:'var(--green)', bg:'#0A1A00', border:'#3FB95060'},
  {lk:'ia_ev3_l', tk:'ia_ev3_t', tiempo:'12h 00m', impacto:'ALTO', hora:'Pre-market', color:'var(--red)', bg:'var(--card)', border:'#FF444460'}
];
window._buildIAEventos = function(){
  var T = window._i18n;
  window._IA_EVENTOS = window._IA_EVENTOS_DEF.map(function(e){
    return Object.assign({}, e, { label: (T?T.t(e.lk):e.lk), text: (T?T.t(e.tk):e.tk) });
  });
  return window._IA_EVENTOS;
};
window._buildIAEventos();
if (window._i18n && window._i18n.onLangChange) window._i18n.onLangChange(window._buildIAEventos);

function _iniciarBanner() {
  var evts = window._IA_EVENTOS;
  if (!evts || !evts.length) return;
  _mostrarBannerEvento(window._IA_BANNER_IDX);
  if (window._IA_BANNER_TIMER) clearInterval(window._IA_BANNER_TIMER);
  window._IA_BANNER_TIMER = setInterval(function() {
    window._IA_BANNER_IDX = (window._IA_BANNER_IDX + 1) % evts.length;
    _mostrarBannerEvento(window._IA_BANNER_IDX);
  }, 10000);
}

function _mostrarBannerEvento(idx) {
  var ev = (window._IA_EVENTOS || [])[idx];
  if (!ev) return;
  var banner = document.getElementById('ia-banner');
  var lbl = document.getElementById('ia-banner-label');
  var tim = document.getElementById('ia-banner-time');
  var ticker = document.getElementById('ia-banner-ticker');
  if (!banner) return;
  banner.style.display = 'block';
  banner.style.background = ev.bg;
  banner.style.borderBottom = '1px solid ' + ev.border;
  if (lbl) { lbl.textContent = ev.label; lbl.style.color = ev.color; }
  var t1 = document.getElementById('ia-banner-text1');
  var t2 = document.getElementById('ia-banner-text2');
  if (t1) { t1.textContent = ev.text; t1.style.color = '#FFFFFF'; }
  if (t2) { t2.textContent = ev.text; t2.style.color = '#FFFFFF'; }
  if (tim) { tim.textContent = ev.tiempo; tim.style.color = ev.color; tim.style.borderColor = ev.color; tim.style.background = ev.color + '30'; }
  if (ticker) { ticker.style.animation = 'none'; ticker.offsetHeight; ticker.style.animation = 'tkScroll 9s linear infinite'; }
}

function cerrarBanner() {
  var b = document.getElementById('ia-banner');
  if (b) b.style.display = 'none';
  if (window._IA_BANNER_TIMER) { clearInterval(window._IA_BANNER_TIMER); window._IA_BANNER_TIMER = null; }
}

function abrirEventosPanel() {
  var modal = document.getElementById('ia-eventos-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  var lista = document.getElementById('ia-eventos-lista');
  if (!lista) return;
  lista.innerHTML = (window._IA_EVENTOS || []).map(function(ev) {
    var impColor = ev.impacto === 'ALTO' ? 'var(--red)' : ev.impacto === 'MEDIO' ? 'var(--gold)' : 'var(--green)';
    return '<div style="background:'+ev.bg+';border:1.5px solid '+ev.border+';border-radius:12px;padding:14px;margin-bottom:12px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<span style="font-size:10px;font-weight:700;color:'+ev.color+';letter-spacing:1px">'+ev.label+'</span>' +
        '<span style="background:'+ev.color+'30;border:1px solid '+ev.color+';border-radius:6px;padding:2px 8px;font-size:11px;font-weight:700;color:'+ev.color+'">'+ev.tiempo+'</span>' +
      '</div>' +
      '<div style="font-size:13px;color:var(--text);font-weight:600;margin-bottom:6px">'+ev.text.split('-')[0].trim()+'</div>' +
      '<div style="font-size:11px;color:var(--textSec);line-height:1.5">'+ev.text+'</div>' +
      '<div style="margin-top:8px;display:flex;gap:6px">' +
        '<span style="background:'+impColor+'20;border:1px solid '+impColor+'60;border-radius:4px;padding:2px 8px;font-size:10px;color:'+impColor+';font-weight:700">IMPACTO '+ev.impacto+'</span>' +
        '<span style="background:var(--border);border-radius:4px;padding:2px 8px;font-size:10px;color:var(--textSec)">'+ev.hora+'</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

function cerrarEventosPanel() {
  var modal = document.getElementById('ia-eventos-modal');
  if (modal) modal.style.display = 'none';
}


// === RSI REAL desde datos históricos ===
window._rsiCache = {};  // sym → rsi value (0-100)

function _calcRSI14(closes) {
  if(!closes || closes.length < 15) return 50; // not enough data
  var gains = 0, losses = 0;
  for(var i = closes.length - 14; i < closes.length; i++) {
    var diff = closes[i] - closes[i-1];
    if(diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  if(losses === 0) return 100;
  var rs = (gains/14) / (losses/14);
  return Math.min(100, Math.max(0, 100 - (100/(1+rs))));
}

function _fetchRSIBatch(activos) {
  // Fetch RSI for each activo in parallel (14+1 = 15 closes needed)
  var promises = activos.map(function(activo) {
    if(activo.tipo === 'cripto') {
      // Binance daily klines, limit=16
      return fetch('https://api.binance.com/api/v3/klines?symbol='+activo.s+'USDT&interval=1d&limit=16')
        .then(function(r){ return r.json(); })
        .then(function(data) {
          if(!Array.isArray(data) || data.length < 15) return;
          var closes = data.map(function(k){ return parseFloat(k[4]); });
          window._rsiCache[activo.s] = _calcRSI14(closes);
        })
        .catch(function(){});
    } else {
      // Yahoo Finance, range=30d for enough closes
      var sym = activo.ySymbol || activo.s;
      return fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol='+sym+'&interval=1d&range=30d')
        .then(function(r){ return r.json(); })
        .then(function(data) {
          if(!data.chart || !data.chart.result || !data.chart.result[0]) return;
          var closes = (data.chart.result[0].indicators.quote[0].close||[]).filter(function(x){return x!=null;});
          if(closes.length < 15) return;
          window._rsiCache[activo.s] = _calcRSI14(closes);
        })
        .catch(function(){});
    }
  });
  return Promise.all(promises);
}


function _calcIAScore(activo, datos) {
  var sym = activo.s;
  var precio = datos.precio || 0;
  var precio24h = datos.precio24h || precio;
  var volumen24h = datos.volumen24h || 0;
  var volumenProm = datos.volumenProm || volumen24h;
  var high24h = datos.high24h || precio * 1.02;
  var low24h = datos.low24h || precio * 0.98;
  var btcCambio = datos.btcCambio || 0;
  var spyCambio = datos.spyCambio || 0;
  var precioOro = datos.precioOro || 2050;
  var precioPetroleo = datos.precioPetroleo || 80;
  var hayMacro = datos.hayMacro || false;
  var hayEarnings = datos.hayEarnings || false;
  var motivos = [];
  var scores = {};
  var tendencia = precio24h > 0 ? (precio - precio24h) / precio24h : 0;
  scores.tendencia = tendencia * 8;
  if (Math.abs(tendencia) > 0.001) {
    if (tendencia > 0) motivos.push('Precio subio +' + (tendencia*100).toFixed(2) + '% en 24hs - momentum alcista activo con presion compradora sostenida');
    else motivos.push('Precio bajo ' + (tendencia*100).toFixed(2) + '% en 24hs - momentum bajista con presion vendedora dominante');
  } else { motivos.push('Precio lateral en 24hs - consolidacion en rango sin direccion definida'); }
  // Use real RSI from cache if available, otherwise estimate from tendencia
  var rsi = (window._rsiCache && window._rsiCache[sym] !== undefined) ? window._rsiCache[sym] : Math.min(90, Math.max(10, 50 + tendencia * 500));
  var rsiSource = (window._rsiCache && window._rsiCache[sym] !== undefined) ? 'RSI14' : 'est.';
  var rsiScore = 0;
  if (rsi > 70) { rsiScore = -0.06; motivos.push('RSI'+rsiSource+' en ' + rsi.toFixed(0) + ' - zona de sobrecompra tecnica, probabilidad de correccion elevada'); }
  else if (rsi > 60) { rsiScore = 0.04; motivos.push('RSI'+rsiSource+' en ' + rsi.toFixed(0) + ' - momentum alcista saludable sin sobrecompra extrema'); }
  else if (rsi < 30) { rsiScore = 0.06; motivos.push('RSI'+rsiSource+' en ' + rsi.toFixed(0) + ' - sobreventa tecnica extrema, rebote probable a corto plazo'); }
  else if (rsi < 40) { rsiScore = -0.03; motivos.push('RSI'+rsiSource+' en ' + rsi.toFixed(0) + ' - momentum bajista moderado, presion vendedora activa'); }
  else { rsiScore = 0.01; motivos.push('RSI'+rsiSource+' en ' + rsi.toFixed(0) + ' - zona neutral, sin senales extremas de momentum tecnico'); }
  scores.rsi = rsiScore;
  var volRel = volumenProm > 0 ? volumen24h / volumenProm : 1;
  var volScore = 0;
  if (volRel > 1.8 && tendencia > 0) { volScore = 0.06; motivos.push('Volumen ' + volRel.toFixed(1) + 'x promedio con precio al alza - fuerte conviccion compradora confirmada'); }
  else if (volRel > 1.8 && tendencia < 0) { volScore = -0.06; motivos.push('Volumen ' + volRel.toFixed(1) + 'x promedio con baja de precio - distribucion activa, vendedores en control'); }
  else if (volRel > 1.3) { volScore = tendencia > 0 ? 0.03 : -0.03; motivos.push('Volumen ' + volRel.toFixed(1) + 'x promedio - participacion activa con sesgo ' + (tendencia > 0 ? 'alcista' : 'bajista')); }
  else if (volRel < 0.6) { volScore = -0.02; motivos.push('Volumen bajo (' + volRel.toFixed(1) + 'x) - movimiento sin conviccion institucional, cautela recomendada'); }
  else { volScore = 0.01; motivos.push('Volumen en linea con el promedio - actividad normal sin anomalias detectadas'); }
  scores.volumen = volScore;
  var volatilidad = precio > 0 ? (high24h - low24h) / precio : 0.02;
  var volaScore = 0;
  if (volatilidad > 0.06) { volaScore = -0.03; motivos.push('Alta volatilidad (' + (volatilidad*100).toFixed(1) + '% rango diario) - riesgo elevado, movimiento brusco probable'); }
  else if (volatilidad > 0.03) { volaScore = tendencia > 0 ? 0.02 : -0.02; motivos.push('Volatilidad moderada (' + (volatilidad*100).toFixed(1) + '%) - rango amplio con sesgo ' + (tendencia > 0 ? 'alcista' : 'bajista')); }
  else { volaScore = 0.01; motivos.push('Baja volatilidad (' + (volatilidad*100).toFixed(1) + '%) - movimiento controlado, sin oscilaciones extremas'); }
  scores.volatilidad = volaScore;
  var corrScore = 0;
  if (activo.tipo === 'cripto') {
    if (sym === 'BTC') {
      corrScore = btcCambio > 0.01 ? 0.03 : btcCambio < -0.01 ? -0.03 : 0;
      motivos.push(btcCambio > 0.01 ? 'BTC lider con momentum positivo - fortaleza sistemica en cripto' : btcCambio < -0.01 ? 'BTC en debilidad - presion bajista correlacionada en sector cripto' : 'BTC en consolidacion - mercado cripto sin direccion dominante');
    } else {
      corrScore = btcCambio > 0.02 ? 0.04 : btcCambio > 0 ? 0.02 : btcCambio < -0.02 ? -0.04 : -0.02;
      motivos.push(btcCambio > 0.01 ? 'BTC subiendo ' + (btcCambio*100).toFixed(2) + '% - arrastre positivo esperado en altcoins' : btcCambio < -0.01 ? 'BTC bajando ' + (btcCambio*100).toFixed(2) + '% - correlacion arrastra altcoins a la baja' : 'Correlacion con BTC neutral - activo operando con dinamica propia');
    }
  } else {
    corrScore = spyCambio > 0.01 ? 0.03 : spyCambio < -0.01 ? -0.03 : 0;
    motivos.push(spyCambio > 0.01 ? 'S&P500 en alza ' + (spyCambio*100).toFixed(2) + '% - contexto favorable para renta variable' : spyCambio < -0.01 ? 'S&P500 en baja ' + (spyCambio*100).toFixed(2) + '% - presion bajista en acciones y ETFs' : 'S&P500 estable - mercado sin impulso direccional fuerte');
  }
  scores.correlacion = corrScore;
  var oroScore = 0;
  if (precioOro > 3000) {
    oroScore = activo.tipo === 'metal' ? 0.04 : activo.tipo === 'cripto' ? -0.02 : activo.tipo === 'bono' ? 0.02 : -0.02;
    if (motivos.length < 5) motivos.push(activo.tipo === 'metal' ? 'Oro en $' + Math.round(precioOro) + ' - maximos historicos, demanda de refugio favorece metales' : 'Oro en maximos $' + Math.round(precioOro) + ' - aversion al riesgo impacta activos especulativos');
  } else if (precioOro > 2200) {
    oroScore = activo.tipo === 'metal' ? 0.03 : -0.01;
    if (motivos.length < 5) motivos.push('Oro en $' + Math.round(precioOro) + ' - nivel elevado, senal de cautela moderada en mercados');
  } else {
    if (motivos.length < 5) motivos.push('Oro en $' + Math.round(precioOro) + ' - nivel neutral, sin senal de aversion extrema al riesgo');
  }
  if (precioPetroleo > 90) {
    oroScore += activo.tipo === 'materia_prima' ? 0.03 : -0.02;
    if (motivos.length < 5) motivos.push('Petroleo WTI en $' + Math.round(precioPetroleo) + ' - presion inflacionaria elevada, impacto en costos corporativos');
  }
  scores.oro_petroleo = oroScore;
  var macroScore = hayMacro ? -0.03 : 0;
  if (hayMacro && motivos.length < 5) motivos.push('Evento macro de alto impacto programado - incertidumbre eleva volatilidad esperada intraday');
  scores.macro = macroScore;
  var earningsScore = hayEarnings ? 0.02 : 0;
  if (hayEarnings && motivos.length < 5) motivos.push('Reporte de resultados proximo - volatilidad historicamente elevada en torno a earnings');
  scores.earnings = earningsScore;

  // VARIABLE 9: MACD (12/26 EMA desde closes30d si disponibles)
  var macdScore = 0;
  if (datos.closes30d && datos.closes30d.length >= 26) {
    var cls30 = datos.closes30d;
    function _ema(arr, period) {
      var k = 2/(period+1), e = arr[0];
      for(var _ei=1;_ei<arr.length;_ei++) e = arr[_ei]*k + e*(1-k);
      return e;
    }
    var ema12 = _ema(cls30.slice(-12), 12);
    var ema26 = _ema(cls30.slice(-26), 26);
    var macdLine = ema12 - ema26;
    var macdPct = ema26 > 0 ? macdLine / ema26 : 0;
    if (macdPct > 0.005) { macdScore = 0.05; motivos.push('MACD positivo +' + (macdPct*100).toFixed(2) + '% — cruce alcista de medias, momentum confirmado'); }
    else if (macdPct < -0.005) { macdScore = -0.05; motivos.push('MACD negativo ' + (macdPct*100).toFixed(2) + '% — cruce bajista, presión vendedora en aumento'); }
    else { macdScore = 0.01; motivos.push('MACD neutral — sin divergencia clara entre medias de corto y largo plazo'); }
  }
  scores.macd = macdScore;

  // VARIABLE 10: Distancia a Soporte/Resistencia (rango 30d)
  var srScore = 0;
  if (datos.high30d && datos.low30d && precio > 0) {
    var h30 = datos.high30d, l30 = datos.low30d;
    var rangePos30 = (h30 > l30) ? (precio - l30) / (h30 - l30) : 0.5;
    if (rangePos30 > 0.85) { srScore = -0.04; motivos.push('Precio cerca de resistencia 30d ($' + (precio>100?Math.round(h30):h30.toFixed(4)) + ') — zona de oferta técnica, posible rechazo'); }
    else if (rangePos30 < 0.15) { srScore = 0.04; motivos.push('Precio cerca de soporte 30d ($' + (precio>100?Math.round(l30):l30.toFixed(4)) + ') — zona de demanda técnica, posible rebote'); }
    else if (rangePos30 > 0.60) { srScore = 0.02; motivos.push('Precio en mitad alta del rango 30d — momentum positivo con margen antes de resistencia'); }
    else { srScore = -0.01; motivos.push('Precio en mitad baja del rango 30d — sobre soporte pero sin momentum fuerte'); }
  }
  scores.soporte_resist = srScore;

  var fillers = ['Analisis tecnico confirma zona clave de decision en precio actual','Flujo institucional alineado con la tendencia identificada','Patron de precio en grafico diario confirma el momentum actual','Indicadores de amplitud alinean con la senal del modelo de 8 variables','Condiciones de liquidez global consistentes con la senal detectada'];
  var fi = 0;
  while (motivos.length < 5 && fi < fillers.length) { motivos.push(fillers[fi++]); }
  var total = Object.values(scores).reduce(function(a,b){return a+b;},0);
  // ALTA CONV-IA: requiere score >= 0.55 Y al menos un catalizador activo
  // Catalizadores: RSI extremo (>70 o <30) + earnings proximos + dato macro + volumen alto
  var tieneCatalizador = (rsi > 70 || rsi < 30) || hayMacro || hayEarnings || scores.volumen > 0.12;
  var umbralConfIA = tieneCatalizador ? 0.45 : 0.65;
  var umbralNormal_unused = 0; // deprecated, kept for reference
  var umbralNormal = hayMacro ? 0.015 : 0.02;
  var scoreAbs = Math.abs(total);
  var direccion, probPrincipal;
  if (scoreAbs > umbralConfIA) {
    direccion = 'alta_conf';
    probPrincipal = Math.min(88, Math.round(55 + scoreAbs * 110));
  } else if (total > umbralNormal) {
    direccion = 'alcista';
    probPrincipal = Math.min(82, Math.round(52 + total * 220));
  } else if (total < -umbralNormal) {
    direccion = 'bajista';
    probPrincipal = Math.min(82, Math.round(52 + scoreAbs * 220));
  } else {
    direccion = total >= 0 ? 'alcista' : 'bajista';
    probPrincipal = Math.min(58, Math.round(50 + scoreAbs * 150));
  }
  // PROBABILIDADES QUE SUMAN EXACTAMENTE 100%
  var confLabel = total >= 0 ? 'ALCISTA' : 'BAJISTA';
  var prob_alcista, prob_bajista, prob_alta_conf;
  if (direccion === 'alta_conf') {
    prob_alcista = total > 0 ? probPrincipal : Math.round(probPrincipal * 0.15);
    prob_bajista = total < 0 ? probPrincipal : Math.round(probPrincipal * 0.15);
    prob_alta_conf = 100 - prob_alcista - prob_bajista;
  } else if (direccion === 'alcista') {
    prob_alcista = probPrincipal;
    prob_alta_conf = Math.round((100 - probPrincipal) * 0.20);
    prob_bajista = 100 - prob_alcista - prob_alta_conf;
  } else {
    prob_bajista = probPrincipal;
    prob_alta_conf = Math.round((100 - probPrincipal) * 0.20);
    prob_alcista = 100 - prob_bajista - prob_alta_conf;
  }
  // Garantizar positivos y suma EXACTA 100 - sin exception
  prob_alcista = Math.max(1, Math.round(prob_alcista));
  prob_bajista = Math.max(1, Math.round(prob_bajista));
  // prob_alta_conf siempre se calcula como residuo para garantizar suma 100
  prob_alta_conf = 100 - prob_alcista - prob_bajista;
  if (prob_alta_conf < 1) { prob_alta_conf = 1; prob_bajista = 100 - prob_alcista - 1; }
  if (prob_bajista < 1) { prob_bajista = 1; prob_alta_conf = 100 - prob_alcista - 1; }
  var escenario_principal = direccion === 'alta_conf' ? ('ALTA CONV-IA ' + confLabel) : (direccion === 'alcista' ? 'ALCISTA' : 'BAJISTA');
  var estrellas = scoreAbs > umbralConfIA ? 5 : scoreAbs > 0.10 ? 4 : scoreAbs > 0.06 ? 3 : scoreAbs > 0.03 ? 2 : 1;
  var cambio24h = precio24h > 0 ? ((precio - precio24h) / precio24h * 100) : 0;
  var _movLimits = activo.tipo === 'cripto' ? {min:0.02, max:0.08} :
                   activo.tipo === 'accion' ? {min:0.01, max:0.04} :
                   activo.tipo === 'bono' ? {min:0.002, max:0.015} :
                   {min:0.005, max:0.03};
  var _normScore = Math.min(scoreAbs, 0.45) / 0.45;
  var movPct = _movLimits.min + _normScore * (_movLimits.max - _movLimits.min);
  var _esAlcista = total > 0;
  var _dec = precio > 100 ? 2 : 4;
  var objetivo = precio > 0 ? (_esAlcista ? precio*(1+movPct) : precio*(1-movPct)).toFixed(_dec) : '0';
  var stop = precio > 0 ? (_esAlcista ? precio*(1-movPct*0.4) : precio*(1+movPct*0.4)).toFixed(_dec) : '0';
  var upside = (_esAlcista ? 1 : -1) * (movPct * 100);
  return {
    simbolo: sym, nombre: activo.n, tipo: activo.tipo, logo: activo.logo || '', icon: activo.icon || sym[0], color: activo.color || 'var(--gold)',
    direccion: direccion, confianza: probPrincipal, score: total, scores: scores,
    precio7d: datos.precio7d||0, precio30d: datos.precio30d||0,
    prob_alcista: prob_alcista, prob_bajista: prob_bajista, prob_alta_conf: prob_alta_conf,
    escenario_principal: escenario_principal, prob_principal: probPrincipal,
    motivos: motivos.slice(0,5), precio: precio, precio24h: precio24h,
    rsi: parseFloat(rsi.toFixed(0)), volRel: parseFloat(volRel.toFixed(1)),
    estrellas: estrellas, objetivo: objetivo, stop: stop, upside: upside
  };
}

function generarSenalesIA() {
  // FUENTE UNICA: backend Railway — mismos datos que la app nativa iOS
  console.log('[Cobrex IA] Cargando senales del backend centralizado...');
  fetch('https://aurex-app-production.up.railway.app/api/ia-signals', { cache: 'no-store' })
    .then(function(r){
      console.log('[Cobrex IA] Backend respondio status:', r.status);
      return r.json();
    })
    .then(function(data){
      console.log('[Cobrex IA] Backend devolvio', (data.signals||[]).length, 'senales');
      if (data.signals && data.signals.length > 0) {
        // Usar senales del backend — IDENTICAS a las que ve la app nativa
        // Normalizar direccion: backend usa MAYUSCULAS, PWA usa minusculas
        var sigs = data.signals.map(function(s){
          var activo = (window._IA_ACTIVOS||[]).find(function(a){ return a.s === s.simbolo; });
          var dirUpper = (s.direccion||'').toUpperCase();
          if (dirUpper === 'ALCISTA') s.direccion = 'alcista';
          else if (dirUpper === 'BAJISTA') s.direccion = 'bajista';
          else if (dirUpper === 'ALTA CONV-IA' || dirUpper === 'ALTA_CONF') s.direccion = 'alta_conf';
          s.nombre = s.nombre || (activo ? activo.n : s.simbolo);
          s.tipo = s.tipo || (activo ? activo.tipo : '');
          s.logo = activo ? activo.logo : '';
          s.color = activo ? activo.color : '';
          s.confianza = s.confianza || s.probPrincipal || s.prob_principal || 50;
          s.prob_principal = s.confianza;
          s.prob_alcista = s.prob_alcista || (s.direccion==='alcista' ? s.confianza : 100-s.confianza);
          s.prob_bajista = s.prob_bajista || (100 - (s.prob_alcista||50));
          s.estrellas = s.estrellas || 1;
          return s;
        });
        sigs.sort(function(a,b){ return (b.confianza||0) - (a.confianza||0); });
        window._iaSignals = sigs; window._iaSignalsFromBackend = true;
        window._IA_PRECIOS = window._IA_PRECIOS || {};
        sigs.forEach(function(s){ if(s.precio) window._IA_PRECIOS[s.simbolo] = { precio: s.precio, precio24h: s.precio24h }; });
        _actualizarContadores(sigs);
        _renderIALista(sigs, false);
        _iniciarBanner();
        if (window._portItems) { _renderPortfolioItems(window._portItems); _renderThermoRisk(window._portItems); }
        // Re-renderizar termometro despues de 2s por si el portfolio cargo tarde
        setTimeout(function(){ if(window._portItems) _renderThermoRisk(window._portItems); }, 2000);
        setTimeout(function(){ if(window._portItems) _renderThermoRisk(window._portItems); }, 5000);
        var upd=document.getElementById('ia-updated');
        if(upd){
          var ts = data.updatedAt ? new Date(data.updatedAt) : new Date();
          upd.textContent=(window.t?window.t('act_corto'):'Act.')+' '+ts.getHours()+':'+(ts.getMinutes()<10?'0':'')+ts.getMinutes()+' (backend)';
        }
        // LIVE refresh timer
        window._iaLiveTs = Date.now();
        if(!window._iaLiveInterval){
          window._iaLiveInterval = setInterval(function(){
            var el=document.getElementById('ia-live-time');
            if(!el || !window._iaLiveTs) return;
            var diff = Math.floor((Date.now()-window._iaLiveTs)/1000);
            if(diff<5) el.textContent='· ahora';
            else if(diff<60) el.textContent='· hace '+diff+'s';
            else el.textContent='· hace '+Math.floor(diff/60)+' min';
          }, 5000);
        }
        try{localStorage.setItem('aurex_ia_pwa_cache',JSON.stringify({signals:sigs,ts:Date.now()}));}catch(e){}
        console.log('[Cobrex IA] OK — mostrando', sigs.length, 'senales del backend');
        return;
      }
      console.log('[Cobrex IA] Backend vacio');
      window._iaRetries = (window._iaRetries||0) + 1;
      if(window._iaRetries < 3) setTimeout(function(){ generarSenalesIA(); }, 5000);
      else _iaLoadFromCache();
    })
    .catch(function(err){
      console.error('[Cobrex IA] Error backend:', err);
      window._iaRetries = (window._iaRetries||0) + 1;
      if(window._iaRetries < 3) setTimeout(function(){ generarSenalesIA(); }, 5000);
      else _iaLoadFromCache();
    });
}

function _iaLoadFromCache(){
  try{
    var cached=localStorage.getItem('aurex_ia_pwa_cache');
    if(!cached) return;
    var d=JSON.parse(cached);
    if(!d||!d.signals||!d.signals.length) return;
    var age=Math.round((Date.now()-d.ts)/60000);
    window._iaSignals=d.signals;
    _actualizarContadores(d.signals);
    _renderIALista(d.signals,false);
    var upd=document.getElementById('ia-updated');
    if(upd) upd.textContent='Cache · '+age+' min';
    console.log('[Cobrex IA] Cargado desde cache localStorage, edad:',age,'min');
  }catch(e){console.error('[Cobrex IA] Error leyendo cache:',e);}
}

function _generarSenalesIALocal() {
  var allData = {};
  var phase1Syms = ['BTC','ETH','SOL','BNB','XRP','AAPL','NVDA','TSLA','MSFT','META','GOOGL','AMZN','SPY','QQQ','GLD','SLV','USO','BNO','TLT','AGG'];
  var phase1Activos = window._IA_ACTIVOS.filter(function(a){ return phase1Syms.indexOf(a.s) >= 0; });
  var phase2Activos = window._IA_ACTIVOS.filter(function(a){ return phase1Syms.indexOf(a.s) < 0; });
  var btcCambio = 0, spyCambio = 0, precioOro = 2050, precioPetroleo = 80;
  var hayMacro = true;
  var earningsSyms = ['NVDA','AAPL','MSFT','META','AMZN'];
  function buildSignals(activos) {
    var sigs = [];
    activos.forEach(function(activo){
      var d = allData[activo.s] || {};
      if (!d.precio || d.precio <= 0) return;
      sigs.push(_calcIAScore(activo, {
        precio: d.precio, precio24h: d.precio24h||d.precio,
        volumen24h: d.volumen24h||0, volumenProm: d.volumenProm||0,
        high24h: d.high24h||d.precio*1.02, low24h: d.low24h||d.precio*0.98,
        closes30d: d.closes30d||null, high30d: d.high30d||null, low30d: d.low30d||null,
        precio7d: d.precio7d||0, precio30d: d.precio30d||0,
        btcCambio: btcCambio, spyCambio: spyCambio,
        precioOro: precioOro, precioPetroleo: precioPetroleo,
        hayMacro: hayMacro, hayEarnings: earningsSyms.indexOf(activo.s) >= 0
      }));
    });
    return sigs;
  }
  function fetchBinanceBatch(activos) {
    var cryptoActivos = activos.filter(function(a){ return a.tipo === 'cripto'; });
    if (!cryptoActivos.length) return Promise.resolve();
    var syms = cryptoActivos.map(function(x){ return '"'+x.s+'USDT"'; }).join(',');
    return fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=['+syms+']')
      .then(function(r){ return r.json(); })
      .then(function(list){
        list.forEach(function(t){
          var sym = t.symbol.replace('USDT','');
          allData[sym] = { precio: parseFloat(t.lastPrice), precio24h: parseFloat(t.openPrice), volumen24h: parseFloat(t.quoteVolume), volumenProm: parseFloat(t.quoteVolume)*0.85, high24h: parseFloat(t.highPrice), low24h: parseFloat(t.lowPrice) };
        });
        // Fetch klines 30d for MACD + S/R (in background, non-blocking)
        cryptoActivos.forEach(function(act) {
          fetch('https://api.binance.com/api/v3/klines?symbol='+act.s+'USDT&interval=1d&limit=30')
            .then(function(r2){return r2.json();})
            .then(function(kl){
              if(!Array.isArray(kl)||kl.length<2) return;
              var cls = kl.map(function(k){return parseFloat(k[4]);});
              var highs = kl.map(function(k){return parseFloat(k[2]);});
              var lows = kl.map(function(k){return parseFloat(k[3]);});
              if(allData[act.s]) {
                allData[act.s].closes30d = cls;
                allData[act.s].high30d = Math.max.apply(null, highs);
                allData[act.s].low30d = Math.min.apply(null, lows);
                if(cls.length >= 7) allData[act.s].precio7d = cls[cls.length-7];
                if(cls.length >= 30) allData[act.s].precio30d = cls[0];
              }
            }).catch(function(){});
        });
      }).catch(function(){});
  }
  function fetchYahooBatch(activos) {
    var yActivos = activos.filter(function(a){ return a.tipo !== 'cripto'; });
    if (!yActivos.length) return Promise.resolve();
    var ySyms = [];
    yActivos.forEach(function(a){ if(ySyms.indexOf(a.ySymbol)<0) ySyms.push(a.ySymbol); });
    return Promise.all(ySyms.map(function(sym){
      return fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol='+sym+'&interval=1d&range=5d')
        .then(function(r){ return r.json(); })
        .then(function(d){
          try {
            var q=d.chart.result[0]; var meta=q.meta;
            var closes=q.indicators.quote[0].close; var volumes=q.indicators.quote[0].volume;
            var vc=closes.filter(function(x){return x!=null;}); var vv=volumes.filter(function(x){return x!=null;});
            var lc=vc[vc.length-1]||meta.regularMarketPrice; var pc=vc[vc.length-2]||lc;
            var av=vv.length>1?vv.slice(0,-1).reduce(function(a,b){return a+b;},0)/(vv.length-1):(vv[0]||1);
            var lv=vv[vv.length-1]||av;
            var hi=meta.regularMarketDayHigh||lc*1.02; var lo=meta.regularMarketDayLow||lc*0.98;
            window._IA_ACTIVOS.forEach(function(act){
              if(act.ySymbol===sym) allData[act.s]={precio:lc,precio24h:pc,volumen24h:lv,volumenProm:av,high24h:hi,low24h:lo};
            });
            if(sym==='GC=F') { allData['_ORO']=lc; precioOro=lc; }
            if(sym==='CL=F'||sym==='BZ=F') { allData['_PETROLEO']=lc; precioPetroleo=lc; }
          } catch(e){}
        }).catch(function(){});
    }));
  }
  // FASE 1: cargar los 20 principales y mostrar inmediatamente
  Promise.all([fetchBinanceBatch(phase1Activos), fetchYahooBatch(phase1Activos), _fetchRSIBatch(phase1Activos)]).then(function(){
    var pBTC=(allData['BTC']||{}).precio||0; var p24BTC=(allData['BTC']||{}).precio24h||pBTC;
    btcCambio = p24BTC>0?(pBTC-p24BTC)/p24BTC:0;
    var pSPY=(allData['SPY']||{}).precio||0; var p24SPY=(allData['SPY']||{}).precio24h||pSPY;
    spyCambio = p24SPY>0?(pSPY-p24SPY)/p24SPY:0;
    precioOro = allData['_ORO']||(allData['GLD']||{}).precio||precioOro;
    precioPetroleo = allData['_PETROLEO']||(allData['USO']||{}).precio||precioPetroleo;
    var signals1 = buildSignals(phase1Activos);
    signals1.sort(function(a,b){ return b.confianza - a.confianza; });
    if (!window._iaSignalsFromBackend) window._iaSignals = signals1;
    window._IA_PRECIOS = allData;
    _actualizarContadores(signals1);
    _renderIALista(signals1, true);
    _iniciarBanner();
    var upd=document.getElementById('ia-updated');
    if(upd){var now=new Date();upd.textContent=(window.t?window.t('act_corto'):'Act.')+' '+now.getHours()+':'+(now.getMinutes()<10?'0':'')+now.getMinutes();}
    // FASE 2: cargar el resto en background
    setTimeout(function(){
      _cargarFase2(phase2Activos, signals1, buildSignals, fetchBinanceBatch, fetchYahooBatch);
    }, 300);
  });
}

function _cargarFase2(phase2Activos, signals1, buildSignals, fetchBinanceBatch, fetchYahooBatch) {
  // Fetch RSI for phase2 in background (non-blocking)
  if(typeof _fetchRSIBatch === 'function') _fetchRSIBatch(phase2Activos).catch(function(){});
  var listEl = document.getElementById('ia-list');
  var loadingBar = document.getElementById('ia-loading-bar');
  if (!loadingBar && listEl) {
    var lb = document.createElement('div');
    lb.id = 'ia-loading-bar';
    lb.style.cssText = 'padding:10px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);';
    lb.innerHTML = '<div style="width:14px;height:14px;border:2px solid var(--gold);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0"></div><span style="font-size:11px;color:var(--textSec)">'+t('ia_cargando_mas')+' <span id="ia-load-count">0</span>/' + phase2Activos.length + '</span>';
    listEl.appendChild(lb);
  }
  var allData = window._IA_PRECIOS || {};
  var loaded = 0;
  var allSignals = signals1.slice();
  // Load phase2 in small batches of 5 to avoid overwhelming
  var batches = [];
  for (var i = 0; i < phase2Activos.length; i += 5) {
    batches.push(phase2Activos.slice(i, i + 5));
  }
  function processBatch(batchIdx) {
    if (batchIdx >= batches.length) {
      var lb2 = document.getElementById('ia-loading-bar');
      if (lb2) lb2.remove();
      allSignals.sort(function(a,b){ return b.confianza - a.confianza; });
      if (!window._iaSignalsFromBackend) window._iaSignals = allSignals;
      _actualizarContadores(allSignals);
      _renderIALista(allSignals, false);
      if (window._portItems) { _renderPortfolioItems(window._portItems); _renderThermoRisk(window._portItems); setTimeout(function(){ if(window._initPortDropdowns) window._initPortDropdowns(); }, 100); }
      // Guardar senales en Railway para que la app nativa las lea
      try {
        var cacheData = allSignals.map(function(s){ return { simbolo:s.simbolo, direccion:s.direccion, scores:s.scores, confianza:s.confianza, estrellas:s.estrellas, prob_principal:s.prob_principal, upside:s.upside, objetivo:s.objetivo, stop:s.stop, score:s.score }; });
        fetch('https://aurex-app-production.up.railway.app/api/ia-signals', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(cacheData) }).catch(function(){});
      } catch(e){}
      return;
    }
    var batch = batches[batchIdx];
    Promise.all([fetchBinanceBatch(batch), fetchYahooBatch(batch)]).then(function(){
      var newSigs = buildSignals(batch);
      newSigs.forEach(function(s){ allSignals.push(s); });
      loaded += batch.length;
      var cntEl = document.getElementById('ia-load-count');
      if (cntEl) cntEl.textContent = loaded;
      allSignals.sort(function(a,b){ return b.confianza - a.confianza; });
      if (!window._iaSignalsFromBackend) window._iaSignals = allSignals;
      window._IA_PRECIOS = allData;
      _actualizarContadores(allSignals);
      _renderIALista(allSignals, true);
      if (window._portItems) { _renderThermoRisk(window._portItems); }
      setTimeout(function(){ processBatch(batchIdx + 1); }, 200);
    });
  }
  processBatch(0);
}

function _actualizarContadores(signals) {
  var al=signals.filter(function(s){return s.direccion==='alcista';}).length;
  var ba=signals.filter(function(s){return s.direccion==='bajista';}).length;
  var ac=signals.filter(function(s){return s.direccion==='alta_conf';}).length;
  var ea=document.getElementById('ia-num-alcista'); if(ea) ea.textContent=al;
  var eb=document.getElementById('ia-num-bajista'); if(eb) eb.textContent=ba;
  var ec=document.getElementById('ia-num-altaconf'); if(ec) ec.textContent=ac;
  var sub=document.getElementById('ia-subtitulo');
  if(sub) sub.textContent=signals.length+' '+t('ia_subtitulo');
}

window._closeIAVarsPopup = function() {
  var el = document.getElementById('ia-vars-overlay');
  if(el) el.remove();
};
window.showIAVariablesPopup = function() {
  try {
  var existing = document.getElementById('ia-vars-overlay');
  if(existing) { existing.remove(); return; }
  // Calcular estado promedio de cada variable sobre las señales actuales
  var signals = window._iaSignals || [];
  var varKeys = ['tendencia','rsi','volumen','volatilidad','correlacion','oro_petroleo','macro','earnings','macd','soporte_resist'];
  var varScoreAvg = {};
  varKeys.forEach(function(k) {
    var sum = 0, cnt = 0;
    signals.forEach(function(s) { if(s.scores && typeof s.scores[k] !== 'undefined') { sum += s.scores[k]; cnt++; } });
    varScoreAvg[k] = cnt > 0 ? sum / cnt : 0;
  });
  var varDefs = [
    {k:'tendencia',      n:t('mkt_var1_label'),  d:t('mkt_var1_desc'),p:'Alta'},
    {k:'rsi',            n:t('mkt_var2_label'),  d:t('mkt_var2_desc'),p:'Alta'},
    {k:'volumen',        n:t('mkt_var3_label'),  d:t('mkt_var3_desc'),p:'Alta'},
    {k:'volatilidad',    n:t('mkt_var4_label'),  d:t('mkt_var4_desc'),p:'Media'},
    {k:'correlacion',    n:t('mkt_var5_label'),  d:t('mkt_var5_desc'),p:'Media'},
    {k:'oro_petroleo',   n:t('mkt_var6_label'),  d:t('mkt_var6_desc'),p:'Media'},
    {k:'macro',          n:t('mkt_var7_label'),  d:t('mkt_var7_desc'),p:'Media'},
    {k:'earnings',       n:t('mkt_var8_label'),  d:t('mkt_var8_desc'),p:'Media'},
    {k:'macd',           n:t('mkt_var9_label'),  d:t('mkt_var9_desc'),p:'Alta'},
    {k:'soporte_resist', n:t('mkt_var10_label'), d:t('mkt_var10_desc'),p:'Alta'}
  ];
  var posCount = varDefs.filter(function(v){ return varScoreAvg[v.k] > 0.01; }).length;
  var negCount = varDefs.filter(function(v){ return varScoreAvg[v.k] < -0.01; }).length;
  var summaryHtml = signals.length > 0
    ? '<div style="display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--border2);border-radius:8px;padding:8px 12px;margin-bottom:12px">' +
        '<span style="font-size:11px;color:var(--textSec)">'+t('mkt_vars_mercado_ahora')+'</span>' +
        '<span style="font-size:13px;font-weight:800;color:var(--green)">→ ' + posCount + t('mkt_vars_al_alza')+'</span>' +
        '<span style="color:var(--textDim);font-size:11px">·</span>' +
        '<span style="font-size:13px;font-weight:800;color:var(--red)">↓ ' + negCount + t('mkt_vars_a_la_baja')+'</span>' +
      '</div>'
    : '';
  var varsHtml = varDefs.map(function(v) {
    var avg = varScoreAvg[v.k];
    var isPos = avg > 0.01;
    var isNeg = avg < -0.01;
    var color = isPos ? 'var(--green)' : isNeg ? 'var(--red)' : 'var(--text)';
    var bg = isPos ? '#3FB95010' : isNeg ? '#F8514910' : 'var(--bg)';
    var blColor = isPos ? 'var(--green)' : isNeg ? 'var(--red)' : 'var(--border)';
    var arrow = isPos ? '→ ' : isNeg ? '↓ ' : '— ';
    return '<div style="border-left:3px solid '+blColor+';border-radius:8px;padding:10px;margin-bottom:8px;background:'+bg+'">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">' +
        '<span style="font-size:13px;font-weight:700;color:'+color+'">'+arrow+v.n+'</span>' +
        '<span style="font-size:10px;color:var(--textSec)">'+t('mkt_vars_peso')+' '+(v.p==='Alta'?t('mkt_vars_peso_alta'):t('mkt_vars_peso_media'))+'</span>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--textSec);line-height:14px">'+v.d+'</div>' +
    '</div>';
  }).join('');
  var overlay = document.createElement('div');
  overlay.id = 'ia-vars-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:#000000CC;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';
  var alcCount = signals.filter(function(s){return s.direccion==='alcista';}).length;
  var bajCount = signals.filter(function(s){return s.direccion==='bajista';}).length;
  var summaryMkt = '<div style="background:var(--bg);border-radius:8px;padding:10px;margin-bottom:10px;border:0.5px solid var(--border)"><span style="font-size:11px;color:var(--textSec)">'+t('mkt_vars_mercado_ahora')+'  <span style="color:var(--green);font-weight:700">→ '+alcCount+t('mkt_vars_al_alza')+'</span>  ·  <span style="color:var(--red);font-weight:700">↓ '+bajCount+t('mkt_vars_a_la_baja')+'</span></span></div>';
  overlay.innerHTML = '<div style="background:var(--card);border:2px solid var(--gold);border-radius:20px;padding:20px;width:92%;max-width:420px;max-height:85vh;overflow-y:auto">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">' +
      '<span style="font-size:16px;font-weight:700;color:var(--text)">'+t('mkt_vars_title')+'</span>' +
      '<div onclick="window._closeIAVarsPopup()" style="width:32px;height:32px;border-radius:6px;background:var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--textSec);cursor:pointer">✕</div>' +
    '</div>' +
    '<div style="font-size:11px;color:var(--textSec);margin-bottom:10px">'+t('mkt_vars_subtitle')+'</div>' +
    summaryMkt +
    '<div style="font-size:10px;color:var(--textSec);line-height:15px;margin-bottom:12px">'+t('mkt_vars_desc')+'</div>' +
    varsHtml +
  '</div>';
  overlay.onclick = function(e) { if(e.target === overlay) window._closeIAVarsPopup(); };
  document.body.appendChild(overlay);
  } catch(err) { alert('Error Variables: '+err.message); }
};

// ─── Mi Portfolio toggle (como nativa onlyPortfolio) ───
window._iaOnlyPortfolio = false;
window._iaTogglePortfolio = function(){
  window._iaOnlyPortfolio = !window._iaOnlyPortfolio;
  var btn = document.getElementById('ia-btn-portfolio');
  if(btn){
    btn.style.background = window._iaOnlyPortfolio ? 'var(--gold)' : 'rgba(212,160,23,0.09)';
    var sp = btn.querySelector('span');
    if(sp) sp.style.color = window._iaOnlyPortfolio ? '#000' : 'var(--gold)';
  }
  _renderIALista(window._iaSignals || [], false);
};

function setIAFiltro(filtro, el) {
  window._IA_FILTRO_ACTUAL = filtro;
  var pillColors = {todo:'#556070',alcista:'#3FB950',bajista:'#F85149',alta_conf:'#D4A017',cripto:'#A78BFA',accion:'#58A6FF',etf:'#F0883E',metal:'#FFD700',materia_prima:'#C8A96E',bono:'#79C0FF'};
  document.querySelectorAll('.ia-pill').forEach(function(p) {
    var f = p.getAttribute('data-filtro');
    var isActive = f === filtro;
    var c = pillColors[f] || '#556070';
    p.style.background = isActive ? c : 'transparent';
    p.style.color = isActive ? (f==='todo'?'#fff':'#000') : c;
    p.style.borderColor = isActive ? c : c+'60';
    p.style.fontWeight = '700';
  });
  _renderIALista(window._iaSignals || [], false);
}

function _renderIALista(signals, keepLoadingBar) {
  var listEl = document.getElementById('ia-list');
  if (!listEl) return;
  var filtro = window._IA_FILTRO_ACTUAL || 'todo';
  var portSyms = (window._portItems||[]).map(function(p){return p.simbolo;});
  var filtered = signals.filter(function(s) {
    // Mi Portfolio filter
    if(window._iaOnlyPortfolio && portSyms.indexOf(s.simbolo) < 0) return false;
    if(filtro==='todo') return true;
    if(filtro==='alcista') return s.direccion==='alcista';
    if(filtro==='bajista') return s.direccion==='bajista';
    if(filtro==='alta_conf') return s.direccion==='alta_conf';
    // tipo: backend devuelve capitalizado/ES ("Cripto","Accion","Commodity"...) — normalizar como la nativa
    var _t = (s.tipo||'').toLowerCase();
    if(filtro==='cripto') return _t==='cripto' || _t==='stable';
    if(filtro==='accion') return _t==='accion';
    if(filtro==='etf') return _t==='etf';
    if(filtro==='metal') return _t==='metal';
    if(filtro==='materia_prima') return _t==='commodity' || _t==='materia_prima';
    if(filtro==='bono') return _t==='bono';
    return _t === filtro;
  });
  if (!filtered.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--textSec);font-size:13px">'+t('ia_sin_senales')+'</div>';
    return;
  }
  var lb = document.getElementById('ia-loading-bar');
  listEl.innerHTML = filtered.map(function(s, i) {
    var dirColor = s.direccion==='alcista'?'var(--green)':s.direccion==='bajista'?'var(--red)':'var(--gold)';
    var dirBg = s.direccion==='alcista'?'#3FB95020':s.direccion==='bajista'?'#FF444420':'var(--goldBg)';
    var dirLabel = s.direccion==='alcista'?t('ia_w_alcista'):s.direccion==='bajista'?t('ia_w_bajista'):t('ia_w_altaconf');
    var tipoColor = s.tipo==='cripto'?'#A78BFA':s.tipo==='accion'?'#58A6FF':s.tipo==='etf'?'#F0883E':s.tipo==='metal'?'#FFD700':s.tipo==='materia_prima'?'#C8A96E':s.tipo==='bono'?'#79C0FF':'var(--gold)';
    var tipoLabel = s.tipo==='cripto'?'Cripto':s.tipo==='accion'?'Acciones':s.tipo==='etf'?'ETF':s.tipo==='metal'?'Metal':s.tipo==='materia_prima'?'Mat. Prima':s.tipo==='bono'?'Bono':'Otro';
    var estrellas = '';
    for(var e=0;e<5;e++) estrellas += e<s.estrellas?'<span style="color:var(--gold)">&#9733;</span>':'<span style="color:var(--border2)">&#9733;</span>';
    var precioFmt = _fmt(s.precio,'precio');
    var cambio24h = s.precio24h>0?((s.precio-s.precio24h)/s.precio24h*100):0;
    var pctColor = cambio24h>=0?'var(--green)':'var(--red)';
    var pctStr = _fmt(cambio24h,'pct');
    var abbr = s.abbr || s.simbolo.substring(0,3);
    var actColor = s.color || 'var(--textDim)';
    var logoHtml = s.logo ?
      '<img src="'+s.logo+'" style="width:22px;height:22px;border-radius:50%;object-fit:cover;background:#161B22" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'+
      '<span style="display:none;width:22px;height:22px;border-radius:50%;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:'+actColor+'">'+abbr+'</span>' :
      '<span style="display:flex;width:22px;height:22px;border-radius:50%;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:'+actColor+'">'+abbr+'</span>';
    // Dots IA (5x5 como nativa, posición derecha debajo del %)
    var dotsHtml = (function(){var sc=s.scores||{};var keys=['tendencia','rsi','volumen','volatilidad','correlacion','oro_petroleo','macro','earnings','macd','soporte_resist'];var dots='';keys.forEach(function(k){var v=sc[k]||0;if(v>0.01)dots+='<span style="display:inline-block;width:5px;height:5px;border-radius:2.5px;background:var(--green);margin:0 1px"></span>';else if(v<-0.01)dots+='<span style="display:inline-block;width:5px;height:5px;border-radius:2.5px;background:var(--red);margin:0 1px"></span>';});return dots?'<span style="display:inline-flex;flex-wrap:wrap;gap:2px;justify-content:flex-end;margin-top:3px">'+dots+'</span>':'';})();
    // Upside al objetivo (como nativa — compacto en misma línea)
    var upsideHtml = '';
    if(s.upside != null){
      var uSign = s.upside >= 0 ? '↑+' : '↓';
      upsideHtml = '<span style="font-size:10px;color:var(--textDim)"> · </span><span style="font-size:10px;color:'+dirColor+';font-weight:700">'+uSign+Math.abs(s.upside).toFixed(1)+'% '+(window.t?window.t('ia_al_precio_obj'):'al precio objetivo')+'</span>';
    }
    return '<div class="ia-row" id="ia-row-'+i+'" onclick="toggleIARow('+i+')" style="border-bottom:0.5px solid #13171D;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:manipulation">' +
      '<div style="display:flex;align-items:center;gap:9px;padding:12px 13px">' +
        // Logo (borderRadius 9, fondo actColor como nativa)
        '<div style="width:34px;height:34px;border-radius:9px;background:'+actColor+'15;border:1.5px solid '+actColor+'40;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">'+logoHtml+'</div>' +
        // Centro — 3 líneas compactas
        '<div style="flex:1;min-width:0">' +
          '<div style="display:flex;align-items:center;gap:5px">' +
            '<span style="font-size:13px;font-weight:600;color:var(--text)">'+s.simbolo+'</span>' +
            '<span style="font-size:8px;font-weight:700;background:'+dirBg+';color:'+dirColor+';border:0.5px solid '+dirColor+'60;border-radius:6px;padding:1px 6px;white-space:nowrap">'+dirLabel+'</span>' +
          '</div>' +
          '<div style="font-size:10px;color:var(--textDim);margin-top:1px">'+(s.nombre||s.simbolo)+'</div>' +
          '<div style="display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap"><span style="font-size:10px;color:var(--textSec)">PROB. IA <span style="color:'+dirColor+';font-weight:700">'+s.confianza+'%</span></span>'+upsideHtml+'</div>' +
        '</div>' +
        // Derecha — precio, %, dots (como nativa sigRight: minWidth 80)
        '<div style="align-items:flex-end;text-align:right;flex-shrink:0;min-width:80px">' +
          '<div style="font-size:13px;font-weight:700;color:var(--text)">'+precioFmt+'</div>' +
          '<div style="font-size:11px;font-weight:500;color:'+pctColor+';margin-top:2px">'+pctStr+'</div>' +
          dotsHtml +
        '</div>' +
      '</div>' +
      // Barra probabilidad (como nativa: marginH 13, marginTop -4, marginBottom 4)
      '<div style="margin:0 13px;margin-top:-4px;margin-bottom:4px;height:3px;background:#21262D;border-radius:2px"><div style="height:100%;width:'+Math.min(s.confianza,100)+'%;background:'+dirColor+';border-radius:2px;transition:width 0.5s"></div></div>' +
      // Detalle expandido
      '<div id="ia-detail-'+i+'" style="display:none;padding:0 14px 14px;background:var(--card);border-bottom:1px solid var(--border);position:relative;">' + '<div onclick="event.stopPropagation();toggleIARow('+i+')" style="position:absolute;top:6px;right:8px;width:32px;height:32px;border-radius:16px;background:var(--border);border:1.5px solid var(--textDim);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:var(--text);z-index:2;-webkit-tap-highlight-color:rgba(0,0,0,0)">&#x2715;</div>' + _buildIADetail(s)+'</div>' +
    '</div>';
  }).join('');
  if (keepLoadingBar && lb) listEl.appendChild(lb);
}

function _buildIADetail(s) {
  var dirColor = s.direccion==='alcista'?'var(--green)':s.direccion==='bajista'?'var(--red)':'var(--gold)';
  var dirLabel = s.direccion==='alcista'?t('ia_w_alcista'):s.direccion==='bajista'?t('ia_w_bajista'):t('ia_w_altaconf');
  var signo = s.direccion==='alcista'?'+':s.direccion==='bajista'?'-':'&#9889;';
  // Gating por plan (paridad nativa IAScreen.js: justificación solo PRO/ELITE, variables modelo solo ELITE)
  var _plan = (window.aurexPlan && window.aurexPlan.plan) || (typeof localStorage!=='undefined' && localStorage.getItem('aurex_plan')) || 'FREE';
  var _isPro = _plan==='PRO' || _plan==='ELITE';
  var _isElite = _plan==='ELITE';
  var _iaLock = function(titKey){ return '<div onclick="event.stopPropagation();if(window.abrirModalPlanes)abrirModalPlanes(\'ia\')" style="margin-bottom:10px;padding:10px;border-radius:8px;background:var(--goldBg);border:1px solid var(--gold40);display:flex;align-items:center;gap:8px;cursor:pointer"><span style="font-size:14px">&#128274;</span><div style="flex:1"><div style="font-size:11px;font-weight:700;color:var(--gold)">'+t(titKey)+'</div><div style="font-size:10px;color:var(--textSec);margin-top:2px">'+t('disponible_elite')+'</div></div></div>'; };
  var html = '<div style="padding-top:12px">';
  html += '<div style="background:'+dirColor+'15;border:1px solid '+dirColor+'40;border-radius:10px;padding:10px 12px;margin-bottom:10px">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
  html += '<span style="font-size:13px;font-weight:700;color:'+dirColor+'">'+signo+' '+dirLabel+'</span>';
  html += '<span style="background:'+dirColor+';color:var(--chipTextActive);font-size:11px;font-weight:800;border-radius:6px;padding:2px 8px">'+t('iad_principal')+' '+s.prob_principal+'%</span>';
  html += '</div>';
  if(_isPro){
    html += '<div style="font-size:11px;font-weight:600;color:var(--textSec);letter-spacing:0.5px;margin-bottom:6px">'+t('ia_justificacion')+'</div>';
    (window.buildAiMotivos?window.buildAiMotivos(s):(s.motivos||[])).slice(0,5).forEach(function(m) {
      html += '<div style="display:flex;gap:6px;margin-bottom:5px"><span style="color:'+dirColor+';flex-shrink:0;font-weight:700">-></span><span style="font-size:11px;color:var(--textSec);line-height:1.4">'+m+'</span></div>';
    });
  } else {
    html += _iaLock('ia_razonamiento_lock');
  }
  html += '</div>';
  html += '<div style="display:flex;gap:8px;margin-bottom:10px">';
  var _cObj=s.direccion==='bajista'?'var(--red)':'var(--green)';
  html += '<div style="flex:1;background:var(--border);border-radius:8px;padding:8px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:2px">'+(window._i18n&&window._i18n.t?window._i18n.t('wl_cmp_objetivo'):'Objetivo')+'</div><div style="font-size:12px;font-weight:700;color:'+_cObj+'">$'+s.objetivo+'</div></div>';
  var _cStop=s.direccion==='bajista'?'#FF9500':'var(--red)';
  html += '<div style="flex:1;background:var(--border);border-radius:8px;padding:8px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:2px">Stop</div><div style="font-size:12px;font-weight:700;color:'+_cStop+'">$'+s.stop+'</div></div>';
  var _uLabel=s.upside<0?'Downside':'Upside';
  var _uColor=s.upside<0?'var(--red)':'var(--green)';
  var _uSign=s.upside>=0?'+':'';
  html += '<div style="flex:1;background:var(--border);border-radius:8px;padding:8px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:2px">'+_uLabel+'</div><div style="font-size:12px;font-weight:700;color:'+_uColor+'">'+_uSign+s.upside.toFixed(1)+'%</div></div>';
  html += '</div>';

  // VARIABLES DEL MODELO — solo ELITE (paridad nativa: análisis técnico avanzado RSI/MACD)
  if(s.scores && _isElite) {
    var sc = s.scores;
    var T=function(k){ return window._i18n&&window._i18n.t?window._i18n.t(k):k; };
    var varDefs = [
      {k:'tendencia',      label:T('iad_lbl_tendencia'),   fmt:function(v){ return (v>0?'+':'')+(v*12.5).toFixed(1)+'%'; }},
      {k:'rsi',            label:T('iad_lbl_rsi'),          fmt:function(v){ var rsi=s.rsi||50; return 'RSI '+rsi; }},
      {k:'volumen',        label:T('iad_lbl_volumen'),      fmt:function(v){ return (s.volRel||1).toFixed(1)+'x'; }},
      {k:'volatilidad',    label:T('iad_lbl_volatilidad'),  fmt:function(v){ return v>0.01?T('iad_v_baja'):('v>-0.01'?T('iad_v_normal'):T('iad_v_alta')); }},
      {k:'correlacion',    label:T('iad_lbl_correlacion'),  fmt:function(v){ return v>0.01?T('iad_v_positiva'):v<-0.01?T('iad_v_negativa'):T('iad_v_neutral'); }},
      {k:'oro_petroleo',   label:T('iad_lbl_oro'),          fmt:function(v){ return v>0.01?T('iad_v_favorable'):v<-0.01?T('iad_v_adverso'):T('iad_v_neutral'); }},
      {k:'macro',          label:T('iad_lbl_macro'),        fmt:function(v){ return v<-0.01?T('iad_v_evento'):T('iad_v_sineventos'); }},
      {k:'earnings',       label:T('iad_lbl_earnings'),     fmt:function(v){ return v>0.01?T('iad_v_proximos'):T('iad_v_sinreporte'); }},
      {k:'macd',           label:T('iad_lbl_macd'),         fmt:function(v){ return v>0.01?T('iad_v_alcista'):v<-0.01?T('iad_v_bajista'):T('iad_v_neutral'); }},
      {k:'soporte_resist', label:T('iad_lbl_soporte'),      fmt:function(v){ return v>0.01?T('iad_v_csoporte'):v<-0.01?T('iad_v_cresist'):T('iad_v_zmedia'); }}
    ];
    var posVars = varDefs.filter(function(d){ return (sc[d.k]||0)>0.01; });
    var negVars = varDefs.filter(function(d){ return (sc[d.k]||0)<-0.01; });
    var neuVars = varDefs.filter(function(d){ return Math.abs(sc[d.k]||0)<=0.01; });
    html += '<div style="margin-bottom:10px">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px">';
    html += '<span style="font-size:10px;color:var(--textSec);font-weight:600;letter-spacing:.3px">'+t('ia_variables_modelo')+'</span>';
    html += '<span style="font-size:10px"><span style="color:var(--green);font-weight:700">→ '+posVars.length+' '+t('ia_vars_alcistas')+'</span><span style="color:var(--textSec);margin:0 5px">·</span><span style="color:var(--red);font-weight:700">↓ '+negVars.length+' '+t('ia_vars_bajistas')+'</span></span>';
    html += '</div>';
    // Positivas primero
    posVars.forEach(function(d) {
      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:#3FB95010;border-left:2px solid var(--green);border-radius:0 6px 6px 0;margin-bottom:3px">';
      html += '<span style="font-size:10px;color:var(--green);font-weight:600">→ '+d.label+'</span>';
      html += '<span style="font-size:10px;color:var(--green)">'+d.fmt(sc[d.k])+'</span>';
      html += '</div>';
    });
    // Negativas
    negVars.forEach(function(d) {
      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:#FF444410;border-left:2px solid var(--red);border-radius:0 6px 6px 0;margin-bottom:3px">';
      html += '<span style="font-size:10px;color:var(--red);font-weight:600">↓ '+d.label+'</span>';
      html += '<span style="font-size:10px;color:var(--red)">'+d.fmt(sc[d.k])+'</span>';
      html += '</div>';
    });
    // Neutrales (gris, compacto)
    if(neuVars.length > 0) {
      html += '<div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:2px">';
      neuVars.forEach(function(d) {
        html += '<span style="font-size:9px;color:var(--textDim);background:var(--border);border-radius:4px;padding:2px 6px">— '+d.label+'</span>';
      });
      html += '</div>';
    }
    html += '</div>';
  } else if(s.scores) {
    html += _iaLock('analisis_tecnico_avanzado');
  }

  // TIMEFRAME CONTEXT — solo PRO/ELITE (paridad nativa IAScreen L604: contexto tendencia gateado a isPro)
  if(_isPro){
  html += '<div style="margin-bottom:10px">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
  html += '<span style="font-size:10px;color:var(--textSec);font-weight:600">'+t('iad_ctx_tendencia')+'</span>';
  html += '<div style="display:flex;gap:4px">';
  ['24h','7d','30d'].forEach(function(tf) {
    var isDefault = tf==='24h';
    var cambioTF;
    if(tf==='24h') cambioTF = s.precio24h>0?((s.precio-s.precio24h)/s.precio24h*100):0;
    else if(tf==='7d') cambioTF = s.precio7d>0?((s.precio-s.precio7d)/s.precio7d*100):null;
    else cambioTF = s.precio30d>0?((s.precio-s.precio30d)/s.precio30d*100):null;
    var col = cambioTF===null?'var(--textDim)':cambioTF>=0?'var(--green)':'var(--red)';
    var label = cambioTF===null?'—':(cambioTF>=0?'+':'')+cambioTF.toFixed(1)+'%';
    html += '<div style="background:var(--border);border:1px solid '+(isDefault?'var(--gold40)':'var(--border2)')+';border-radius:6px;padding:3px 7px;text-align:center">';
    html += '<div style="font-size:8px;color:'+(isDefault?'var(--gold)':'var(--textDim)')+'">'+tf+'</div>';
    html += '<div style="font-size:10px;font-weight:700;color:'+col+'">'+label+'</div>';
    html += '</div>';
  });
  html += '</div></div></div>';
  }

  html += '<div style="font-size:10px;color:var(--textSec);margin-bottom:6px;font-weight:600">'+t('ia_otros_escenarios')+'</div>';
  html += '<div style="display:flex;gap:6px">';
  if(s.direccion!=='alcista') html += '<div style="flex:1;background:#3FB95015;border:1px solid #3FB95040;border-radius:8px;padding:6px;text-align:center"><div style="font-size:9px;color:var(--green)">'+t('port_signal_alcista')+'</div><div style="font-size:13px;font-weight:700;color:var(--green)">'+s.prob_alcista+'%</div></div>';
  if(s.direccion!=='bajista') html += '<div style="flex:1;background:#FF444415;border:1px solid #FF444440;border-radius:8px;padding:6px;text-align:center"><div style="font-size:9px;color:var(--red)">'+t('port_signal_bajista')+'</div><div style="font-size:13px;font-weight:700;color:var(--red)">'+s.prob_bajista+'%</div></div>';
  if(s.direccion!=='alta_conf') html += '<div style="flex:1;background:var(--goldBg);border:1px solid var(--gold40);border-radius:8px;padding:6px;text-align:center"><div style="font-size:9px;color:var(--gold)">'+t('port_signal_alta_conv')+'</div><div style="font-size:13px;font-weight:700;color:var(--gold)">'+s.prob_alta_conf+'%</div></div>';
  html += '</div>';
  // BOTÓN COMPARTIR
  html += '<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">';
  html += '<button onclick="event.stopPropagation();_compartirSenal(\'' + s.simbolo + '\');return false;" ';
  html += 'style="width:100%;background:var(--border);border:1px solid var(--border2);border-radius:8px;padding:8px 12px;color:var(--text);font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;-webkit-tap-highlight-color:rgba(0,0,0,0)">';
  html += t('ia_compartir_senal')+'</button>';
  html += '</div>';
  html += '</div>';
  return html;
}

window._compartirSenal = function(info) {
  // Accept either a symbol string or an object with .simbolo
  var symBuscar = (typeof info === 'string') ? info : (info && info.simbolo ? info.simbolo : null);
  if(!symBuscar) return;
  var sig = null;
  var sigs = window._iaSignals || [];
  for(var i=0;i<sigs.length;i++) { if(sigs[i].simbolo===symBuscar) { sig=sigs[i]; break; } }
  if(!sig) return;
  var dirEmoji = sig.direccion==='alcista'?'📈':sig.direccion==='bajista'?'📉':'⚡';
  var dirLabel = sig.direccion==='alcista'?t('ia_w_alcista'):sig.direccion==='bajista'?t('ia_w_bajista'):t('ia_w_altaconf');
  var precioFmt = sig.precio>=1000?'$'+Math.round(sig.precio).toLocaleString(window._numLocale()):sig.precio>=1?'$'+sig.precio.toFixed(2):'$'+sig.precio.toFixed(4);
  var cambio = sig.precio24h>0?((sig.precio-sig.precio24h)/sig.precio24h*100):0;
  var texto = '🤖 Cobrex IA — SEÑAL '+dirEmoji+'\n';
  texto += sig.simbolo+' ('+sig.nombre+')\n';
  texto += '----------------\n';
  texto += dirEmoji+' '+dirLabel+' — PROB. '+sig.confianza+'%\n';
  texto += '💰 Precio: '+precioFmt+' ('+(cambio>=0?'+':'')+cambio.toFixed(2)+'%)\n';
  texto += '🎯 Objetivo: $'+sig.objetivo+' | Stop: $'+sig.stop+'\n';
  texto += '----------------\n';
  texto += '📊 ANÁLISIS (10 variables):\n';
  (window.buildAiMotivos?window.buildAiMotivos(sig):(sig.motivos||[])).slice(0,3).forEach(function(m,i){ texto += (i+1)+'. '+m+'\n'; });
  texto += '----------------\n';
  texto += 'Señal generada por Cobrex IA⚡\n';
  texto += 'aurex-app.github.io';
  var _showShareOverlay = function() {
    var wa = 'https://wa.me/?text='+encodeURIComponent(texto);
    var tg = 'https://t.me/share/url?url=https://fmoscon-creator.github.io/aurex-app/&text='+encodeURIComponent(texto);
    var ml = 'mailto:?subject=Cobrex+IA+-+'+encodeURIComponent(sig.simbolo+' '+dirLabel)+'&body='+encodeURIComponent(texto);
    var existing2 = document.getElementById('ia-share-overlay');
    if(existing2) existing2.remove();
    var overlay = document.createElement('div');
    overlay.id = 'ia-share-overlay';
    overlay.style.cssText='position:fixed;inset:0;background:#000000CC;z-index:9999;display:flex;align-items:flex-end;justify-content:center';
    overlay.innerHTML='<div style="background:var(--card);border-radius:16px 16px 0 0;padding:20px;width:100%;max-width:420px">' +
      '<div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:16px;text-align:center">'+t('ia_compartir_senal_de')+' '+sig.simbolo+'</div>' +
      '<div style="display:flex;gap:12px;justify-content:center;margin-bottom:16px">' +
        '<a href="'+wa+'" target="_blank" style="flex:1;background:#25D36620;border:1px solid #25D36660;border-radius:10px;padding:12px 8px;text-align:center;text-decoration:none"><div style="font-size:22px">💬</div><div style="font-size:10px;color:#25D366;margin-top:4px">WhatsApp</div></a>' +
        '<a href="'+tg+'" target="_blank" style="flex:1;background:#229ED920;border:1px solid #229ED960;border-radius:10px;padding:12px 8px;text-align:center;text-decoration:none"><div style="width:28px;height:28px;border-radius:50%;background:#229ED9;display:inline-flex;align-items:center;justify-content:center;margin-bottom:2px"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8.5l9-5-3 9-2-3-4 2z" fill="#fff"/></svg></div><div style="font-size:10px;color:#229ED9;margin-top:4px">Telegram</div></a>' +
        '<a href="'+ml+'" style="flex:1;background:var(--goldBg);border:1px solid var(--gold40);border-radius:10px;padding:12px 8px;text-align:center;text-decoration:none"><div style="font-size:22px">📧</div><div style="font-size:10px;color:var(--gold);margin-top:4px">Mail</div></a>' +
      '</div>' +
      '<button onclick="var o=document.getElementById(&apos;ia-share-overlay&apos;);if(o)o.remove();" style="width:100%;background:var(--border);border:1px solid var(--border2);border-radius:8px;padding:10px;color:var(--textSec);font-size:12px;cursor:pointer">'+t('cancelar')+'</button>' +
    '</div>';
    overlay.onclick=function(e){if(e.target===overlay){var o=document.getElementById('ia-share-overlay');if(o)o.remove();}};
    document.body.appendChild(overlay);
  };
  _showShareOverlay();
};


// === Cobrex PULSEâ¢ — FEAR & GREED 14X (12 variables Commit A) ===
window._pulseCache = {};
window._pulseTs   = {};
window._pulseActiveFilter = 'GLOBAL';


// === MACRO FED (FRED API) + GEOPOLITICA (GDELT) ===
function _fetchMacroGeo(raw) {
  return new Promise(function(resolve) {
    var FRED_BASE = 'https://corsproxy.io/?' + encodeURIComponent('https://fred.stlouisfed.org/graph/fredgraph.csv?id=FEDFUNDS&limit=3&sort_order=desc');
    var macroScore = 50;
    var geoScore = 70;
    var done1 = false, done2 = false;
    function tryFinish() {
      if(done1 && done2) {
        raw.macro = { score: Math.round(macroScore) };
        raw.geo   = { score: Math.round(geoScore) };
        resolve(raw);
      }
    }
    // FRED: Federal Funds Rate
    fetch(FRED_BASE)
      .then(function(r){ return r.ok ? r.text() : Promise.reject('FRED fail'); })
      .then(function(txt) {
        var lines = txt.trim().split('\n').filter(function(l){return l && l.indexOf('DATE')<0;});
        if(lines.length >= 2) {
          var r1 = parseFloat(lines[0].split(',')[1]) || 0;
          var r2 = parseFloat(lines[1].split(',')[1]) || 0;
          var delta = r1 - r2;
          // Rising rate = tightening = fear score. Falling = easing = greed.
          macroScore = Math.min(100, Math.max(0, 50 - delta * 20));
        } else if(lines.length === 1) {
          var rate = parseFloat(lines[0].split(',')[1]) || 5;
          // Absolute rate: >5% = restrictive = fear, <2% = easy = greed
          macroScore = Math.min(100, Math.max(0, 100 - (rate - 1) * 12));
        }
        done1 = true; tryFinish();
      })
      .catch(function() {
        // Fallback: use VIX-based macro proxy
        if(raw.vix && raw.vix.price) {
          macroScore = Math.min(100, Math.max(0, 100 - (raw.vix.price - 10) * 2.5));
        }
        done1 = true; tryFinish();
      });
    // GDELT: geopolitical tone
    var gdeltUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://api.gdeltproject.org/api/v2/summary/summary?d=aylook&t=summary&TIMESPAN=60&SRCLANG=english&OUTPUTTYPE=3');
    fetch(gdeltUrl)
      .then(function(r){ return r.ok ? r.json() : Promise.reject('GDELT fail'); })
      .then(function(data) {
        var tone = data && data.articles && data.articles[0] ? (parseFloat(data.articles[0].avgtone)||0) : 0;
        // tone -10 to +5 → score 0 to 100
        geoScore = Math.min(100, Math.max(0, 50 + tone * 5));
        done2 = true; tryFinish();
      })
      .catch(function() {
        // Fallback: VIX-based geopolitics proxy
        if(raw.vix && raw.vix.price) {
          geoScore = raw.vix.price > 30 ? Math.max(10, 70-(raw.vix.price-30)*3) : 70;
        }
        done2 = true; tryFinish();
      });
    // Safety timeout: resolve after 8s regardless
    setTimeout(function() {
      if(!done1 || !done2) {
        raw.macro = raw.macro || { score: macroScore };
        raw.geo   = raw.geo   || { score: geoScore };
        resolve(raw);
      }
    }, 8000);
  });
}

async function _fetchPulseRaw() {
  var raw = {};
  try {
    var bArr = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT').then(function(r){return r.json();}),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT').then(function(r){return r.json();})
    ]);
    raw.btcPct = parseFloat(bArr[0].priceChangePercent) || 0;
    raw.ethPct = parseFloat(bArr[1].priceChangePercent) || 0;
    // BTC 90-day range position (for CRIPTO PULSE calibration)
    try {
      var klines = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=90').then(function(r){return r.json();});
      var cls = klines.map(function(k){return parseFloat(k[4]);});
      var hi90 = Math.max.apply(null,cls), lo90 = Math.min.apply(null,cls), cur = cls[cls.length-1];
      raw.btc90dPos = hi90>lo90 ? ((cur-lo90)/(hi90-lo90))*100 : 50;
      raw.btcMom30 = cls.length>=30 ? ((cur-cls[cls.length-30])/cls[cls.length-30])*100 : raw.btcPct;
    } catch(e2) { raw.btc90dPos = null; raw.btcMom30 = null; }
  } catch(e) { raw.btcPct = 0; raw.ethPct = 0; }
  var yahooSyms = ['^VIX','^GSPC','ES=F','NQ=F','YM=F','RTY=F','GC=F','SI=F','CL=F','HG=F'];
  var yahooKeys = ['vix','sp500','esf','nqf','ymf','rtyf','gcf','sif','clf','hgf'];
  var yPromises = yahooSyms.map(async function(sym, idx) {
    try {
      var url = 'https://aurex-app-production.up.railway.app/api/yahoo?symbol=' + sym + '&interval=1d&range=2d';
      var res = await fetch(url);
      var data = await res.json();
      if(data.chart && data.chart.result && data.chart.result[0]) {
        var meta = data.chart.result[0].meta;
        var price = meta.regularMarketPrice || 0;
        var prev = meta.previousClose || meta.chartPreviousClose || price;
        raw[yahooKeys[idx]] = { price: price, pct: prev > 0 ? ((price-prev)/prev*100) : 0 };
      }
    } catch(e) { raw[yahooKeys[idx]] = { price: 0, pct: 0 }; }
  });
  await Promise.all(yPromises);
  window._pulseRaw = raw;
  window._pulseRawTs = Date.now();
  // Add macro FED + geopolitics (with fallbacks)
  try { await _fetchMacroGeo(raw); } catch(e) {}
  return raw;
}

function _pctToScore(pct, scale) { return Math.min(100, Math.max(0, 50 + (pct/scale)*50)); }
function _vixToScore(vix) { return Math.min(100, Math.max(0, 100 - (vix-10)*3.0)); }
function _goldToScore(pct) { return Math.min(100, Math.max(0, 50 - pct*25)); }
function _oilToScore(pct) { return Math.min(100, Math.max(0, 50 - Math.abs(pct)*15)); }

function _calcPulseScore(raw, cat) {
  if(!raw) return { value:50, label:t('mkt_gauge_neutral'), color:'var(--gold)', emoji:'😐', vars:{} };
  var scores = {}, weighted = 0, totalW = 0;
  function add(key, score, weight) {
    scores[key] = Math.round(score);
    weighted += score * weight;
    totalW += weight;
  }
  if(cat==='CRIPTO'||cat==='GLOBAL') {
    if(cat==='CRIPTO') {
      // CRIPTO-specific: uses structural sentiment (90d position, RSI14, 30d momentum, VIX)
      // Much closer to Alternative.me methodology vs noisy 24h price pct
      if(raw.btc90dPos !== null && raw.btc90dPos !== undefined) {
        add('BTC_Pos90d', raw.btc90dPos, 35); // position in 90d range: 0=at 90d low, 100=at 90d high
      }
      var btcRsi14 = (window._rsiCache && window._rsiCache['BTCUSDT']) ? window._rsiCache['BTCUSDT'] : null;
      if(btcRsi14 !== null) {
        var rsiSc = btcRsi14<30?5 : btcRsi14<40?18 : btcRsi14<50?35 : btcRsi14<60?55 : btcRsi14<70?72 : 90;
        add('BTC_RSI14', rsiSc, 25);
      }
      if(raw.btcMom30 !== null && raw.btcMom30 !== undefined) {
        add('BTC_Mom30d', Math.min(100,Math.max(0,50+(raw.btcMom30/30)*50)), 15);
      } else {
        add('BTC_Mom1d', _pctToScore(raw.btcPct,6), 15);
      }
      if(raw.vix) add('VIX', _vixToScore(raw.vix.price), 20);
      if(raw.esf) add('SP500_Fut', _pctToScore(raw.esf.pct,1.5), 5);
    } else {
      add('BTC', _pctToScore(raw.btcPct,8), 12);
      add('ETH', _pctToScore(raw.ethPct,8), 8);
      if(raw.vix) add('VIX', _vixToScore(raw.vix.price), 14);
      if(raw.esf) add('SP500_Fut', _pctToScore(raw.esf.pct,1.5), 8);
    }
  }
  if(cat==='ACCIONES'||cat==='GLOBAL') {
    if(raw.vix)  add('VIX',    _vixToScore(raw.vix.price),   cat==='ACCIONES'?35:14);
    if(raw.sp500)add('SP500',  _pctToScore(raw.sp500.pct,1.5),cat==='ACCIONES'?25:8);
    if(raw.esf)  add('ES_Fut', _pctToScore(raw.esf.pct,1.5), cat==='ACCIONES'?20:8);
    if(raw.nqf)  add('NQ_Fut', _pctToScore(raw.nqf.pct,2),   cat==='ACCIONES'?12:6);
    if(raw.ymf)  add('YM_Fut', _pctToScore(raw.ymf.pct,1.5), cat==='ACCIONES'?8:4);
  }
  if(cat==='FUTUROS'||cat==='GLOBAL') {
    if(raw.esf)  add('ES_Fut',  _pctToScore(raw.esf.pct,1.5),  cat==='FUTUROS'?30:8);
    if(raw.nqf)  add('NQ_Fut',  _pctToScore(raw.nqf.pct,2),    cat==='FUTUROS'?25:6);
    if(raw.ymf)  add('YM_Fut',  _pctToScore(raw.ymf.pct,1.5),  cat==='FUTUROS'?20:4);
    if(raw.rtyf) add('RTY_Fut', _pctToScore(raw.rtyf.pct,2),   cat==='FUTUROS'?25:3);
  }
  if(cat==='COMOD'||cat==='GLOBAL') {
    if(raw.gcf) add('Oro',      _goldToScore(raw.gcf.pct), cat==='COMOD'?35:8);
    if(raw.sif) add('Plata',    _goldToScore(raw.sif.pct), cat==='COMOD'?20:4);
    if(raw.clf) add('Petroleo', _oilToScore(raw.clf.pct),  cat==='COMOD'?25:5);
    if(raw.hgf) add('Cobre',    _pctToScore(raw.hgf.pct,2),cat==='COMOD'?20:4);
  }
  // Macro FED + Geopolitics: aplican en TODAS las categorias incluyendo CRIPTO
  // (alineado con Definicion Estrategica Cobrex 2-may-2026). BTC tiene correlacion
  // >0.6 con NASDAQ desde 2022 y reacciona fuerte a decisiones FED y geopolitica.
  if(raw.macro) add('Macro_FED', raw.macro.score, 12);
  if(raw.geo)   add('Geopolitica', raw.geo.score, 4);
  if(totalW===0) return { value:50, label:t('mkt_gauge_neutral'), color:'var(--gold)', emoji:'😐', vars:scores };
  var v = Math.min(100, Math.max(0, Math.round(weighted/totalW)));
  var label, color, emoji;
  if(v<=20)      { label=t('mkt_gauge_miedo_ext');  color='#C62828'; emoji='😱'; }
  else if(v<=40) { label=t('mkt_gauge_miedo');           color='#FF6B6B'; emoji='😰'; }
  else if(v<=60) { label=t('mkt_gauge_neutral');         color='var(--gold)'; emoji='😐'; }
  else if(v<=80) { label=t('mkt_gauge_codicia');         color='var(--green)'; emoji='😏'; }
  else           { label=t('mkt_gauge_codicia_ext'); color='#00E676'; emoji='🤑'; }
  return { value:v, label:label, color:color, emoji:emoji, vars:scores };
}

async function _fetchPulseForCategory(cat) {
  // PRIMERO: leer del backend centralizado (fuente UNICA para PWA y nativa)
  try {
    var backendRes = await fetch('https://aurex-app-production.up.railway.app/api/pulse', { cache: 'no-store' });
    var backendData = await backendRes.json();
    if (backendData && backendData.scores) {
      var catKey = cat || 'GLOBAL';
      var catData = backendData.scores[catKey];
      if (catData && catData.value != null) {
        window._pulseCache[catKey] = catData;
        window._pulseTs[catKey] = Date.now();
        // Guardar raw del backend para variables modal
        if (backendData.raw) {
          window._pulseRaw = backendData.raw;
          window._pulseRawTs = Date.now();
          if (backendData.raw.btcSentiment != null) window._btcSentiment = backendData.raw.btcSentiment;
          if (backendData.raw.altFnG != null) window._altFnG = backendData.raw.altFnG;
        }
        return catData;
      }
    }
  } catch(e) {}
  // FALLBACK: calcular localmente (misma lógica)
  var raw = window._pulseRaw;
  if(!raw || (Date.now()-(window._pulseRawTs||0))>300000) {
    raw = await _fetchPulseRaw();
  }
  var result = _calcPulseScore(raw, cat);
  window._pulseCache[cat] = result;
  window._pulseTs[cat] = Date.now();
  return result;
}

function _renderFearGreedGauge(value, color, compact, value2, value3) {
  var R=compact?40:52, cx=compact?50:65, cy=compact?52:68, sw=compact?9:12;
  var ang=(value/100)*Math.PI;
  var nx=cx+R*Math.cos(Math.PI-ang), ny=cy-R*Math.sin(ang);
  function arcSeg(s,e,col){
    var a1=Math.PI-(s/100)*Math.PI, a2=Math.PI-(e/100)*Math.PI;
    var x1=cx+R*Math.cos(a1), y1=cy+R*Math.sin(a1-Math.PI);
    var x2=cx+R*Math.cos(a2), y2=cy+R*Math.sin(a2-Math.PI);
    return '<path d="M '+x1.toFixed(1)+' '+y1.toFixed(1)+' A '+R+' '+R+' 0 '+((e-s)>50?1:0)+' 1 '+x2.toFixed(1)+' '+y2.toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="'+sw+'" stroke-linecap="round"/>';
  }
  // BTC Sentiment marker (value2) - azul punteado
  var needle2 = '';
  if(value2 !== undefined && value2 !== null) {
    var ang2=(value2/100)*Math.PI;
    var nx2=cx+R*Math.cos(Math.PI-ang2), ny2=cy-R*Math.sin(ang2);
    var mx2=(cx+nx2)/2, my2=(cy+ny2)/2;
    needle2 = '<line x1="'+cx+'" y1="'+cy+'" x2="'+nx2.toFixed(1)+'" y2="'+ny2.toFixed(1)+'" stroke="#00BFFF" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 2" opacity="0.9"/>' +
              '<circle cx="'+nx2.toFixed(1)+'" cy="'+ny2.toFixed(1)+'" r="3.5" fill="#00BFFF" opacity="0.95"/>';
  }
  // Crypto F&G marker (value3) - rojo punteado
  var needle3 = '';
  if(value3 !== undefined && value3 !== null) {
    var ang3=(value3/100)*Math.PI;
    var nx3=cx+R*Math.cos(Math.PI-ang3), ny3=cy-R*Math.sin(ang3);
    needle3 = '<line x1="'+cx+'" y1="'+cy+'" x2="'+nx3.toFixed(1)+'" y2="'+ny3.toFixed(1)+'" stroke="#FF6B6B" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 2" opacity="0.9"/>' +
              '<circle cx="'+nx3.toFixed(1)+'" cy="'+ny3.toFixed(1)+'" r="3.5" fill="#FF6B6B" opacity="0.95"/>';
  }
  return '<svg viewBox="0 0 '+(compact?'100 58':'130 75')+'" style="width:'+(compact?'88px':'120px')+';height:'+(compact?'52px':'70px')+';flex-shrink:0;">' +
    arcSeg(0,20,'#C62828')+arcSeg(22,40,'#FF6B6B')+arcSeg(42,60,'var(--gold)')+arcSeg(62,80,'var(--green)')+arcSeg(82,100,'#00E676') +
    needle3 +
    needle2 +
    '<line x1="'+cx+'" y1="'+cy+'" x2="'+nx.toFixed(1)+'" y2="'+ny.toFixed(1)+'" stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round"/>' +
    '<circle cx="'+cx+'" cy="'+cy+'" r="4" fill="var(--gold)"/>' +
    '</svg>';
}

function _renderFearGreed(containerId) {
  var elId = containerId || 'port-fear-greed';
  var el = document.getElementById(elId);
  if(!el) return;
  var cat = window._pulseActiveFilter || 'GLOBAL';
  var cached = window._pulseCache[cat];
  if(!cached) {
    el.innerHTML = '<div style="padding:6px 14px;font-size:10px;color:var(--textDim);">'+t('mkt_pulse_loading')+'</div>';
    _fetchPulseForCategory(cat).then(function(){ _renderFearGreed(containerId); });
    return;
  }
  if(Date.now()-(window._pulseTs[cat]||0)>300000) {
    _fetchPulseForCategory(cat).then(function(){ _renderFearGreed(containerId); });
  }
  var d = cached;
  var compact = elId.indexOf('port') >= 0;
  var btcSentIdx = (cat === 'CRIPTO') ? (window._btcSentiment || null) : null;
  var altFngIdx  = (cat === 'CRIPTO') ? (window._altFnG || null) : null;
  var gauge = _renderFearGreedGauge(d.value, d.color, compact, btcSentIdx, altFngIdx);
  // Fetch BTC Sentiment (calculado en tiempo real desde Binance) - cache 5 min
  if(cat === 'CRIPTO' && (Date.now()-(window._btcSentTs||0)) > 300000) {
    window._btcSentTs = Date.now();
    Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT').then(function(r){return r.json();}),
      fetch('https://api.coingecko.com/api/v3/global').then(function(r){return r.json();})
    ]).then(function(res){
      var btc = res[0], glob = res[1];
      var priceChg = parseFloat(btc.priceChangePercent);
      var volB = parseFloat(btc.quoteVolume)/1e9;
      var dom = glob && glob.data ? glob.data.market_cap_percentage.btc : 50;
      var avgRatio = parseFloat(btc.weightedAvgPrice)/parseFloat(btc.lastPrice);
      // Formula: precio+vol+dominancia+momentum
      var score = 50;
      score += priceChg * 2.5;
      score += (volB > 2 ? 5 : volB > 1 ? 2 : -3);
      score += (dom > 60 ? -5 : dom > 50 ? 0 : 5);
      score += (avgRatio < 0.99 ? 8 : avgRatio > 1.01 ? -5 : 0);
      score = Math.max(0, Math.min(100, Math.round(score)));
      window._btcSentiment = score;
      setTimeout(function(){ _renderFearGreed(containerId); }, 100);
    }).catch(function(){});
  }
  // Fetch Crypto F&G Alternative.me - cache 60 min (se actualiza 1x día)
  if(cat === 'CRIPTO' && (Date.now()-(window._altFnGTs||0)) > 3600000) {
    window._altFnGTs = Date.now();
    fetch('https://api.alternative.me/fng/?limit=1')
      .then(function(r){return r.json();})
      .then(function(d2){
        var val2 = d2 && d2.data && d2.data[0] ? parseInt(d2.data[0].value) : null;
        if(val2 !== null) {
          window._altFnG = val2;
          setTimeout(function(){ _renderFearGreed(containerId); }, 100);
        }
      }).catch(function(){});
  }
  var edu;
  if(d.value<=20)      edu=t('mkt_pulse_edu_panico');
  else if(d.value<=40) edu=t('mkt_pulse_edu_temor');
  else if(d.value<=60) edu=t('mkt_pulse_edu_equilibrado');
  else if(d.value<=80) edu=t('mkt_pulse_edu_optimismo');
  else                 edu=t('mkt_pulse_edu_euforia');
  var raw = window._pulseRaw || {};
  var bits = [];
  if(raw.vix)              bits.push('VIX: <b style="color:var(--text)">'+_fmt(raw.vix.price,'precio')+'</b>');
  if(raw.btcPct!==undefined)bits.push('BTC: <b style="color:'+(raw.btcPct>=0?'var(--green)':'var(--red)')+'">'+_fmt(raw.btcPct,'pct')+'</b>');
  if(raw.sp500)            bits.push('S&P: <b style="color:'+(raw.sp500.pct>=0?'var(--green)':'var(--red)')+'">'+_fmt(raw.sp500.pct,'pct')+'</b>');
  if(raw.gcf)              bits.push('Oro: <b style="color:'+(raw.gcf.pct>=0?'var(--green)':'var(--red)')+'">'+_fmt(raw.gcf.pct,'pct')+'</b>');
  var dataLine = '<div style="display:flex;flex-wrap:wrap;gap:5px;font-size:9px;color:var(--textSec);margin-top:3px;">'+bits.join('')+'</div>';
  var cats = ['GLOBAL','CRIPTO','ACCIONES','COMOD','FUTUROS'];
  var catLabels = {GLOBAL:'🟩 '+t('mkt_pulse_cat_global'),CRIPTO:'🪙 '+t('mkt_pulse_cat_cripto'),ACCIONES:'📈 '+t('mkt_pulse_cat_acciones'),COMOD:'🟤 '+t('mkt_pulse_cat_comod'),FUTUROS:'⚡ '+t('mkt_pulse_cat_futuros')};
  var filterBtns = '';
  // #1 auditoría: el chip activo usa el color del SCORE (pulseColor), no siempre verde. Paridad nativa MercadosScreen L41/L1096.
  var _pulseColor = function(s){ return s<=20?'#C62828':s<=40?'#FF6B6B':s<=60?'var(--gold)':s<=80?'var(--green)':'#00E676'; };
  cats.forEach(function(c) {
    var active = c===cat;
    var bg = active ? _pulseColor(d.value) : '#e0e0e0';
    var col = active ? '#111' : '#222';
    var fw = active ? '700' : '600';
    var bdr = 'none';
    filterBtns += '<div data-pulse-cat="'+c+'" data-pulse-el="'+elId+'" style="font-size:9px;font-weight:'+fw+';color:'+col+';background:'+bg+';border-radius:10px;padding:4px 8px;cursor:pointer;white-space:nowrap;flex-shrink:0;border:'+bdr+';">'+catLabels[c]+'</div>';
  });
  var nvars = Object.keys(d.vars).length;
  el.innerHTML =
    '<div style="margin:8px 14px 6px;border-radius:14px;padding:'+(compact?'8px 10px':'12px 14px 10px')+';background:var(--card);border:1px solid var(--border);">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
        '<span style="font-size:'+(compact?'10':'11')+'px;font-weight:700;color:var(--gold);letter-spacing:0.5px;">&#x26A1; Cobrex PULSE&#x2122;</span>' +
        '<div id="pulse-info-btn-'+elId+'" style="font-size:9px;color:#58A6FF;cursor:pointer;padding:3px 10px;border-radius:10px;border:1px solid #58A6FF;white-space:nowrap;font-weight:600;">'+t('mkt_pulse_ver_variables')+'</div>' +
      '</div>' +
      '<div id="pulse-filters-'+elId+'" style="display:flex;gap:5px;flex-wrap:nowrap;overflow-x:auto;margin-bottom:8px;-webkit-overflow-scrolling:touch;">'+filterBtns+'</div>' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
        gauge +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:16px;font-weight:700;color:'+(d.color||'var(--gold)')+';">'+( d.emoji||'')+' '+d.value+' &#x2014; '+((window._i18n&&window._i18n.t)?(d.value<=20?window._i18n.t('pulse_z_miedo_ext'):d.value<=40?window._i18n.t('pulse_z_miedo'):d.value<=60?window._i18n.t('pulse_z_neutral'):d.value<=80?window._i18n.t('pulse_z_codicia'):window._i18n.t('pulse_z_codicia_ext')):d.label)+'</div>' +
          '<div style="font-size:10px;color:var(--gold);font-weight:700;margin-top:2px;">&#x25B6; Cobrex PULSE&#x2122; '+d.value+'</div>' +
          (cat==='CRIPTO' && (btcSentIdx !== null || altFngIdx !== null) ?
            '<div style="display:flex;gap:6px;align-items:center;margin-top:2px;flex-wrap:wrap;">' +
              (btcSentIdx !== null ? '<span style="font-size:9px;color:#00BFFF;font-weight:700;">&#x25B6; BTC Sent. <b style="font-size:11px;">'+btcSentIdx+'</b></span>' : '') +
              (altFngIdx !== null ? '<span style="font-size:9px;color:#FF6B6B;font-weight:700;">&#x25B6; Crypto F&G <b style="font-size:11px;">'+altFngIdx+'</b></span>' : '') +
            '</div>' : '') +
          dataLine +
          '<div style="font-size:9px;color:var(--textSec);margin-top:'+(compact?'2':'4')+'px;line-height:1.3;display:'+(compact?'none':'block')+';">'+edu+'</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  // Attach event listeners after render (avoids inline onclick single-quote issue)
  var filterEl = document.getElementById('pulse-filters-'+elId);
  if(filterEl) {
    filterEl.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-pulse-cat]');
      if(!btn) return;
      window._pulseActiveFilter = btn.getAttribute('data-pulse-cat');
      var targetEl = btn.getAttribute('data-pulse-el');
      _renderFearGreed(targetEl);
    });
  }
  var infoBtn = document.getElementById('pulse-info-btn-'+elId);
  if(infoBtn) {
    infoBtn.addEventListener('click', function() { showFearGreedInfo(); });
  }
}

window.showFearGreedInfo = function() {
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:16px;box-sizing:border-box;overflow-y:auto;';
  var raw = window._pulseRaw || {};
  function fmtPct(val) { return val!==undefined ? _fmt(val,'pct') : '--'; }
  function fmtPrice(obj) { return obj ? obj.price.toFixed(obj.price>10?0:2) : '--'; }
  var rows = [
    ['&#x1FA99;','BTC momentum','Binance','12%', fmtPct(raw.btcPct),'#58A6FF'],
    ['&#x1FA99;','ETH momentum','Binance','8%',  fmtPct(raw.ethPct),'#58A6FF'],
    ['&#x1F4C9;',t('mkt_pulse_var_vix'),'Yahoo','14%',fmtPrice(raw.vix),'#FF6B6B'],
    ['&#x1F4C8;','S&P500 momentum','Yahoo','8%', fmtPct(raw.sp500&&raw.sp500.pct),'var(--green)'],
    ['&#x26A1;','ES=F S&P Futuro','Yahoo','8%',  fmtPct(raw.esf&&raw.esf.pct),'var(--green)'],
    ['&#x26A1;','NQ=F Nasdaq Fut','Yahoo','6%',  fmtPct(raw.nqf&&raw.nqf.pct),'var(--green)'],
    ['&#x26A1;','YM=F Dow Futuro','Yahoo','4%',  fmtPct(raw.ymf&&raw.ymf.pct),'var(--green)'],
    ['&#x26A1;','RTY=F Russell Fut','Yahoo','3%',fmtPct(raw.rtyf&&raw.rtyf.pct),'var(--green)'],
    ['&#x1F947;',t('mkt_pulse_var_oro'),'Yahoo','8%',         fmtPct(raw.gcf&&raw.gcf.pct),'var(--gold)'],
    ['&#x26AA;',t('mkt_pulse_var_plata'),'Yahoo','4%',         fmtPct(raw.sif&&raw.sif.pct),'var(--gold)'],
    ['&#x1F6E2;',t('mkt_pulse_var_petroleo'),'Yahoo','5%',fmtPct(raw.clf&&raw.clf.pct),'var(--gold)'],
    ['&#x1FA9C;',t('mkt_pulse_var_cobre'),'Yahoo','4%',        fmtPct(raw.hgf&&raw.hgf.pct),'var(--gold)'],
    ['&#x1F3E6;','Macro FED','FRED API','12%', raw.macro ? raw.macro.score+' pts' : 'Calc...', raw.macro ? 'var(--text)' : 'var(--textDim)'],
    ['&#x1F30D;',t('mkt_pulse_var_geopolitica'),'GDELT','4%', raw.geo ? raw.geo.score+' pts' : 'Calc...', raw.geo ? 'var(--text)' : 'var(--textDim)']
  ];
  var tableRows = rows.map(function(r) {
    var valStr = r[4] || '--';
    var valColor = '#222';
    if (typeof valStr === 'string') {
      if (valStr.indexOf('+') === 0) valColor = '#16a34a';
      else if (valStr.indexOf('-') === 0) valColor = '#dc2626';
    }
    return '<tr style="border-bottom:1px solid #eee;"><td style="padding:6px 4px;color:'+r[5]+';font-weight:600;font-size:11px;">'+r[0]+' '+r[1]+'</td><td style="color:var(--textSec);font-size:10px;padding:6px 4px;">'+r[2]+'</td><td style="color:#555;font-size:11px;padding:6px 4px;">'+r[3]+'</td><td style="color:'+valColor+';font-weight:700;font-size:11px;padding:6px 4px;">'+valStr+'</td></tr>';
  }).join('');
  // #13 auditoría: caja ELITE — Análisis profundo (paridad nativa MercadosScreen L1211-1227, solo ELITE)
  var _pulsePlan = (window.aurexPlan && window.aurexPlan.plan) || (typeof localStorage!=='undefined' && localStorage.getItem('aurex_plan')) || 'FREE';
  var _eliteBox = (_pulsePlan==='ELITE') ?
    '<div style="margin-top:14px;padding:12px;background:rgba(212,160,23,0.10);border:1px solid rgba(212,160,23,0.40);border-radius:10px;">' +
      '<div style="font-size:11px;font-weight:800;color:#8A6D0F;margin-bottom:6px;letter-spacing:0.3px;">'+t('pulse_elite_titulo')+'</div>' +
      '<div style="font-size:10px;color:#222;line-height:1.5;margin-bottom:8px;">'+t('pulse_elite_p1')+'</div>' +
      '<div style="font-size:10px;color:#222;line-height:1.5;margin-bottom:8px;">'+t('pulse_elite_p2')+'</div>' +
      '<div style="margin-top:6px;padding:8px;background:var(--card);border-radius:6px;">' +
        '<div style="font-size:9px;color:var(--textSec);font-weight:600;">&#128202; '+t('grafico_hist_pulse')+'</div>' +
        '<div style="font-size:9px;color:#999;margin-top:2px;">'+t('disp_prox_bloque')+'</div>' +
      '</div>' +
    '</div>' : '';
  ov.innerHTML =
    '<div style="background:var(--card);border:3px solid var(--gold);border-radius:18px;padding:22px;width:calc(100% - 32px);max-width:420px;margin:auto;">' +
      '<div style="font-size:15px;font-weight:700;color:#111;margin-bottom:4px;">'+t('mkt_pulse_info_title')+'</div>' +
      '<div style="font-size:11px;color:var(--textSec);margin-bottom:12px;">'+t('mkt_pulse_info_subtitle')+'</div>' +
      '<div style="font-size:11px;color:#555;line-height:1.7;margin-bottom:10px;">' +
        '<b style="color:#111;">'+t('mkt_pulse_zonas_title')+'</b><br>' +
        t('mkt_pulse_zona_miedo_ext')+' &nbsp; '+t('mkt_pulse_zona_miedo')+' &nbsp; '+t('mkt_pulse_zona_neutral')+'<br>' +
        t('mkt_pulse_zona_codicia')+' &nbsp; '+t('mkt_pulse_zona_codicia_ext') +
      '</div>' +
      '<div style="font-size:11px;font-weight:700;color:#111;margin-bottom:8px;">'+t('mkt_pulse_vars_title')+'</div>' +
      '<table style="width:100%;font-size:11px;border-collapse:collapse;">' +
        '<tr style="color:#999;font-size:9px;border-bottom:1px solid #ddd;"><td style="padding:4px 4px;">'+t('mkt_pulse_th_variable')+'</td><td style="padding:4px 4px;">'+t('mkt_pulse_th_fuente')+'</td><td style="padding:4px 4px;">'+t('mkt_pulse_th_peso')+'</td><td style="padding:4px 4px;">'+t('mkt_pulse_th_valor')+'</td></tr>' +
        tableRows +
      '</table>' +
      '<div style="font-size:8px;color:#999;margin-top:10px;line-height:1.4;font-style:italic;">'+t('mkt_pulse_disclaimer')+'</div>' +
      _eliteBox +
      '<div id="pulse-info-close" style="margin-top:18px;text-align:center;padding:16px;background:var(--gold);border-radius:14px;color:#111;font-weight:700;cursor:pointer;font-size:16px;">'+t('port_entendido')+'</div>' +
    '</div>';
  document.body.appendChild(ov);
  document.getElementById('pulse-info-close').addEventListener('click', function(){ ov.remove(); });
};


// === BANNER FUTUROS / INDICES / BONOS / COMMODITIES ===
window._futuresCache = null;
window._futuresTs = 0;

var FUTURES_ITEMS = [
  {s:'ES=F',    rawS:'ES=F',     n:'S&P500',  cat:'FUTUROS', dec:0},
  {s:'NQ=F',    rawS:'NQ=F',     n:'Nasdaq',  cat:'FUTUROS', dec:0},
  {s:'YM=F',    rawS:'YM=F',     n:'Dow',     cat:'FUTUROS', dec:0},
  {s:'RTY=F',   rawS:'RTY=F',    n:'Russell', cat:'FUTUROS', dec:0},
  {s:'^VIX',    rawS:'^VIX',     n:'VIX',     cat:'SENTIM',  dec:2},
  {s:'BZ=F',    rawS:'BZ=F',     n:'Brent',   cat:'COMOD',   dec:2},
  {s:'GC=F',    rawS:'GC=F',     n:'Oro',     cat:'COMOD',   dec:0},
  {s:'CL=F',    rawS:'CL=F',     n:'WTI',     cat:'COMOD',   dec:2},
  {s:'SI=F',    rawS:'SI=F',     n:'Plata',   cat:'COMOD',   dec:2},
  {s:'^TNX',    rawS:'^TNX',     n:'US 10Y',  cat:'BONOS',   dec:2},
  {s:'^IRX',    rawS:'^IRX',     n:'US 2Y',   cat:'BONOS',   dec:2},
  {s:'DX-Y.NYB',rawS:'DX-Y.NYB', n:'DXY',    cat:'MACRO',   dec:2},
  {s:'EURUSD=X',rawS:'EURUSD=X', n:'EUR/USD', cat:'MACRO',   dec:4},
  {s:'^MERV',   rawS:'^MERV',    n:'Merval',  cat:'LATAM',   dec:0},
  {s:'^BVSP',   rawS:'^BVSP',    n:'Bovespa', cat:'LATAM',   dec:0},
  {s:'^IBEX',   rawS:'^IBEX',    n:'IBEX',    cat:'EUR',     dec:0}
];

async function _fetchFuturesData() {
  var rawSyms = FUTURES_ITEMS.map(function(x){ return x.rawS; });
  if(!window._futuresCache) window._futuresCache = {};
  var results = window._futuresCache;
  // Fetch via backend Railway (mismo que acciones) — confiable y rápido
  await Promise.all(rawSyms.map(function(sym) {
    return fetch('https://aurex-app-production.up.railway.app/api/yahoo?symbol=' + sym + '&interval=1d&range=2d')
      .then(function(res){ return res.json(); })
      .then(function(data){
        if(data.chart && data.chart.result && data.chart.result[0]) {
          var meta = data.chart.result[0].meta;
          var price = meta.regularMarketPrice || 0;
          var prev = meta.previousClose || meta.chartPreviousClose || price;
          var pct = prev > 0 ? ((price - prev) / prev * 100) : 0;
          var open = (meta.marketState === 'REGULAR' || meta.marketState === 'PRE' || meta.marketState === 'POST');
          results[sym] = { price: price, pct: pct, open: open, state: meta.marketState || 'CLOSED' };
        }
      }).catch(function(){});
  }));
  window._futuresCache = results;
  window._futuresTs = Date.now();
  if(typeof _renderFuturesBanner === 'function'){
    _renderFuturesBanner();
    _renderFuturesBanner('port-futures-banner');
    var _tmpFut = document.createElement('div');
    _tmpFut.id = 'tmp-fut-prog'; _tmpFut.style.display = 'none';
    document.body.appendChild(_tmpFut);
    _renderFuturesBanner('tmp-fut-prog');
    var _sb = document.getElementById('combo-slide-b');
    if(_sb) _sb.innerHTML = _tmpFut.innerHTML;
    document.body.removeChild(_tmpFut);
  }
  window._futuresCache = results;
  window._futuresTs = Date.now();
  return results;
}

function _renderFuturesBanner(containerId) {
  var elId = containerId || 'port-futures-banner';
  var el = document.getElementById(elId);
  if(!el) return;
  var cached = window._futuresCache;
  if(!cached || Object.keys(cached).length === 0) {
    el.innerHTML = '<div style="padding:6px 14px;font-size:10px;color:var(--textDim);">'+t('port_cargando')+'</div>';
    _fetchFuturesData().then(function(){ _renderFuturesBanner(containerId); });
    return;
  }
  var now = Date.now();
  if(now - window._futuresTs > 60000) {
    _fetchFuturesData().then(function(){ _renderFuturesBanner(containerId); });
  }
  // Active slots from localStorage — default 6
  var defaultSlots = ['ES=F','NQ=F','YM=F','^VIX','BZ=F','GC=F'];
  var activeSlots;
  try { activeSlots = JSON.parse(localStorage.getItem('aurex_banner_slots') || 'null') || defaultSlots; }
  catch(e) { activeSlots = defaultSlots; }
  var catColors = {FUTUROS:'#58A6FF', COMOD:'var(--gold)', BONOS:'var(--textSec)', MACRO:'#A78BFA', SENTIM:'#FF6B6B', LATAM:'var(--green)', EUR:'#58A6FF'};
  var isPortfolio = elId.indexOf('port') >= 0;
  var chips = activeSlots.map(function(rawS) {
    var item = FUTURES_ITEMS.find(function(x){ return x.rawS === rawS; });
    if(!item) return '';
    var d = cached[item.rawS];
    if(!d || !d.price) return '';
    var pct = d.pct || 0;
    var pctStr = _fmt(pct,'pct');
    var pctColor = pct >= 0 ? 'var(--green)' : 'var(--red)';
    var priceStr = item.dec === 0 ? _fmt(d.price,'qty') : _fmt(d.price,'precio');
    var fullName = item.n + t('mkt_fut_suffix');
    return '<div style="display:flex;flex-direction:column;align-items:center;min-width:70px;padding:4px 8px;flex-shrink:0;">' +
      '<div style="font-size:10px;font-weight:700;color:var(--text);white-space:nowrap;">'+fullName+'</div>' +
      '<div style="font-size:10px;color:var(--text);white-space:nowrap;">$'+priceStr+'</div>' +
      '<div style="font-size:9px;font-weight:700;color:'+pctColor+';">'+pctStr+'</div>' +
    '</div>';
  }).filter(Boolean).join('');
  var editBtn = '<div onclick="editFuturesBanner()" style="font-size:12px;color:#3B9EF5;cursor:pointer;padding:4px 8px;border-radius:4px;border:1px solid #3B9EF5;flex-shrink:0;margin-right:10px;">&#9998;</div>';
  el.innerHTML = '<div style="display:flex;align-items:center;background:var(--card);border:1px solid var(--border2);border-radius:10px;margin:4px 10px;">' + '<div style="flex:1;display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;padding:8px 4px 8px 10px;">' + chips + '</div>' + editBtn + '</div>';
}

window.editFuturesBanner = function(){
  var existing = document.getElementById('aurex-fut-edit-popup');
  if(existing){ existing.remove(); return; }
  var defaultSlots = ['ES=F','NQ=F','YM=F','^VIX','BZ=F','GC=F'];
  var activeSlots;
  try { activeSlots = JSON.parse(localStorage.getItem('aurex_banner_slots') || 'null') || defaultSlots; }
  catch(e) { activeSlots = defaultSlots; }
  var allItems = FUTURES_ITEMS;
  var rows = allItems.map(function(item){
    var on = activeSlots.indexOf(item.rawS) >= 0;
    var onBg = on ? '#22c55e' : '#ccc';
    var knobL = on ? '18px' : '2px';
    var lbl = item.rawS + ' — ' + item.n + ' Fut';
    var togId = 'fut-tog-' + item.rawS.replace(/[^a-zA-Z0-9]/g,'_');
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eee;">' +
      '<span style="color:#222;font-size:13px;font-weight:500;">' + lbl + '</span>' +
      '<div onclick="toggleFutPref(\'' + item.rawS + '\')" id="' + togId + '" style="width:40px;height:22px;border-radius:11px;background:' + onBg + ';cursor:pointer;position:relative;flex-shrink:0;margin-left:10px;transition:background 0.2s;">' +
      '<div style="position:absolute;top:2px;left:' + knobL + ';width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:left 0.2s;"></div></div></div>';
  }).join('');
  var popup = document.createElement('div');
  popup.id = 'aurex-fut-edit-popup';
  popup.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
  popup.innerHTML =
    '<div style="background:var(--card);border:3px solid var(--gold);border-radius:16px;padding:20px;width:calc(100% - 40px);max-width:340px;max-height:85vh;overflow-y:auto;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<span style="font-size:16px;font-weight:700;color:#111;">'+t('mkt_fut_edit_title')+'</span>' +
        '<span onclick="document.getElementById(&apos;aurex-fut-edit-popup&apos;).remove()" style="font-size:20px;cursor:pointer;color:#999;padding:4px 8px;">&#x2715;</span>' +
      '</div>' +
      rows +
      '<button onclick="document.getElementById(&apos;aurex-fut-edit-popup&apos;).remove();if(typeof _fetchFuturesData===&apos;function&apos;)_fetchFuturesData().then(function(){if(typeof _renderFuturesBanner===&apos;function&apos;){_renderFuturesBanner(&apos;port-futures-banner&apos;);_renderFuturesBanner(&apos;mkt-futures-banner&apos;);var _tmp=document.createElement(&apos;div&apos;);_tmp.id=&apos;tmp-fut-listo&apos;;_tmp.style.display=&apos;none&apos;;document.body.appendChild(_tmp);_renderFuturesBanner(&apos;tmp-fut-listo&apos;);var _sb=document.getElementById(&apos;combo-slide-b&apos;);if(_sb)_sb.innerHTML=_tmp.innerHTML;document.body.removeChild(_tmp);}});" style="width:100%;background:#22c55e;border:none;border-radius:12px;padding:14px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;margin-top:16px;">'+t('mkt_listo')+'</button>' +
    '</div>';
  document.body.appendChild(popup);
};

window.toggleFutPref = function(rawS){
  var defaultSlots = ['ES=F','NQ=F','YM=F','^VIX','BZ=F','GC=F'];
  var activeSlots;
  try { activeSlots = JSON.parse(localStorage.getItem('aurex_banner_slots') || 'null') || defaultSlots; }
  catch(e) { activeSlots = defaultSlots; }
  var idx = activeSlots.indexOf(rawS);
  if(idx >= 0) { activeSlots.splice(idx, 1); } else { activeSlots.push(rawS); }
  localStorage.setItem('aurex_banner_slots', JSON.stringify(activeSlots));
  var togId = 'fut-tog-' + rawS.replace(/[^a-zA-Z0-9]/g,'_');
  var togEl = document.getElementById(togId);
  if(togEl){
    var on = activeSlots.indexOf(rawS) >= 0;
    togEl.style.background = on ? '#22c55e' : '#ccc';
    var knob = togEl.querySelector('div');
    if(knob) knob.style.left = on ? '18px' : '2px';
  }
};

// === MERCADOS: BANNER DE NOTICIAS DEL DIA ===
function _renderMktNewsBanner(containerId) {
  var elId = containerId || 'mkt-news-banner';
  var el = document.getElementById(elId);
  if(!el) return;
  var eventos = window._IA_EVENTOS || [];
  if(!eventos.length) {
    el.style.display = 'none';
    return;
  }
  // Show only high-impact events
  var high = eventos.filter(function(e){ return e.impacto === 'ALTO' || e.impacto === 'MEDIO'; });
  if(!high.length) { el.style.display = 'none'; return; }
  var ev = high[0];
  var ticker = high.map(function(e){ return e.label + ': ' + e.text; }).join('     |     ');
  el.style.display = 'block';
  el.innerHTML =
    '<div style="background:#000;padding:6px 14px;overflow:hidden;">' +
      '<div style="overflow:hidden;">' +
        '<div id="mkt-news-ticker" style="display:flex;animation:tkScroll 6s linear infinite;">' +
          '<span style="white-space:nowrap;color:#fff;font-size:11px;padding-right:60px;">' + ticker + '</span>' +
          '<span style="white-space:nowrap;color:#fff;font-size:11px;padding-right:60px;">' + ticker + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
}


function toggleIARow(idx) {
  var detail = document.getElementById('ia-detail-'+idx);
  if (!detail) return;
  var isOpen = detail.style.display !== 'none';
  document.querySelectorAll('[id^="ia-detail-"]').forEach(function(d){ d.style.display='none'; });
  if (!isOpen) detail.style.display = 'block';
}


// === Cobrex: Logo unificado en todas las tabs ===
function _initHeaderLogos() {
  var hlEl = document.querySelector('.hl');
  if (!hlEl) return;
  var svgEl = hlEl.querySelector('svg');
  if (!svgEl) return;
  var svgBase = svgEl.outerHTML;

  function _makeSVG(suffix) {
    return svgBase
      .replace(/id="gAhd"/g, "id=\"gAhd"+suffix+"\"")
      .replace(/url\(#gAhd\)/g, "url(#gAhd"+suffix+")")
      .replace(/id="gChd"/g, "id=\"gChd"+suffix+"\"")
      .replace(/url\(#gChd\)/g, "url(#gChd"+suffix+")")
      .replace(/id="gShd"/g, "id=\"gShd"+suffix+"\"")
      .replace(/url\(#gShd\)/g, "url(#gShd"+suffix+")")
      .replace(/id="gHhd"/g, "id=\"gHhd"+suffix+"\"")
      .replace(/url\(#gHhd\)/g, "url(#gHhd"+suffix+")")
      .replace(/id="gBhd"/g, "id=\"gBhd"+suffix+"\"")
      .replace(/url\(#gBhd\)/g, "url(#gBhd"+suffix+")")
      .replace(/id="clip/g, "id=\"clip"+suffix)
      .replace(/url\(#clip/g, "url(#clip"+suffix);
  }

  function _insertLogo(spanEl, suffix) {
    if (!spanEl || spanEl.dataset.logoAdded) return;
    var parent = spanEl.parentElement;
    if (!parent) return;
    var svgNode = document.createElement('div');
    svgNode.innerHTML = _makeSVG(suffix);
    var svgChild = svgNode.firstChild;
    if (svgChild) svgChild.classList.add('aurex-logo');
    parent.insertBefore(svgChild, spanEl);
    spanEl.dataset.logoAdded = '1';
  }

  var portScreen = document.getElementById('screen-portfolio');
  if (portScreen) {
    var spans = portScreen.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++) {
      if (spans[i].textContent.trim() === 'Cobrex' && !spans[i].closest('.tab-btn') && !spans[i].closest('.hdr')) {
        _insertLogo(spans[i], '_pt');
        break;
      }
    }
  }

  var wlScreen = document.getElementById('screen-watchlist');
  if (wlScreen) {
    var spans = wlScreen.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++) {
      if (spans[i].textContent.trim() === 'Cobrex' && !spans[i].closest('.tab-btn')) {
        _insertLogo(spans[i], '_wl');
        break;
      }
    }
  }

  var iaScreen = document.getElementById('screen-ia');
  if (iaScreen) {
    var spans = iaScreen.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++) {
      if (spans[i].textContent.trim().indexOf('Cobrex') === 0 && !spans[i].closest('.tab-btn')) {
        _insertLogo(spans[i], '_ia');
        break;
      }
    }
  }

  var alertasScreen = document.getElementById('screen-alertas');
  if (alertasScreen && !alertasScreen.querySelector('.aurex-hdr-added')) {
    var hdrDiv = document.createElement('div');
    hdrDiv.className = 'aurex-hdr-added';
    hdrDiv.style.cssText = 'display:flex;align-items:center;gap:6px;padding:10px 16px 6px;';
    hdrDiv.innerHTML = '<span class="aurex-logo-wrap">' + _makeSVG('_al').replace('<svg ', '<svg class="aurex-logo" ') + '</span><span style="font-weight:500;color:var(--gold);font-size:16px;letter-spacing:1px;">Cobrex</span><span style="color:var(--textSec);font-size:13px;" data-i18n="tab_alertas"> Alertas</span>';
    alertasScreen.insertBefore(hdrDiv, alertasScreen.firstChild);
  }

  var perfilScreen = document.getElementById('screen-perfil');
  if (perfilScreen && !perfilScreen.querySelector('.aurex-hdr-added')) {
    var hdrDiv = document.createElement('div');
    hdrDiv.className = 'aurex-hdr-added';
    hdrDiv.style.cssText = 'display:flex;align-items:center;gap:6px;padding:10px 16px 8px;border-bottom:1px solid #21262D;';
    hdrDiv.innerHTML = '<span class="aurex-logo-wrap">' + _makeSVG('_pf').replace('<svg ', '<svg class="aurex-logo" ') + '</span><span style="font-weight:500;color:var(--gold);font-size:16px;letter-spacing:1px;">Cobrex</span><span style="color:var(--textSec);font-size:13px;" data-i18n="tab_perfil"> Perfil</span>';
    perfilScreen.insertBefore(hdrDiv, perfilScreen.firstChild);
  }

  // --- Chip ⚖️ Aviso Legal en headers (Fase 4 F1-bis) ---

  // MERCADOS: insertBefore .live, dentro de .hdr
  var mktHdr = document.querySelector('#screen-mercados .hdr');
  if (mktHdr) {
    var mktLive = mktHdr.querySelector('.live');
    window._addLegalChip(mktHdr, mktLive, false);
  }

  // IA: insertBefore LIVE, dentro de la primera fila del header contadores
  var iaScreenEl = document.getElementById('screen-ia');
  if (iaScreenEl && iaScreenEl.children[2] && iaScreenEl.children[2].children[0]) {
    var iaHdrRow = iaScreenEl.children[2].children[0];
    var iaLive = Array.from(iaHdrRow.children).find(function(c){
      return c.textContent.trim() === 'LIVE';
    });
    window._addLegalChip(iaHdrRow, iaLive, false);
  }

  // WATCHLIST: la nativa oculta la balanza ⚖️ del header (HIDE_HEADER_LEGAL=true).
  // web-1.7: NO se inyecta el chip ⚖️ (Aviso Legal). Se deja "+ Nueva lista" tal cual.

  // ALERTAS: ⚖️ + LIVE (en ese orden, como nativa)
  var alHdr = document.querySelector('#screen-alertas .aurex-hdr-added');
  window._addLegalChip(alHdr, null, true);
  if(alHdr && !alHdr.querySelector('#alertas-live-wrap')){
    var liveSpan = document.createElement('span');
    liveSpan.id = 'alertas-live-wrap';
    liveSpan.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:9px;color:var(--green);font-weight:700;margin-left:8px';
    liveSpan.innerHTML = '<span style="width:5px;height:5px;border-radius:50%;background:var(--green);animation:lp 1.5s infinite"></span>LIVE<span id="alertas-live-time" style="color:var(--textSec);font-weight:500">· ahora</span>';
    alHdr.appendChild(liveSpan);
  }

  // PERFIL: ⚖️ + LIVE (como Alertas)
  var pfHdr = document.querySelector('#screen-perfil .aurex-hdr-added');
  window._addLegalChip(pfHdr, null, true);
  if(false && pfHdr && !pfHdr.querySelector('#perfil-live-wrap')){ // P2 (paridad 1.3.45): Perfil NO lleva LIVE
    var pfLive = document.createElement('span');
    pfLive.id = 'perfil-live-wrap';
    pfLive.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:9px;color:var(--green);font-weight:700;margin-left:8px';
    pfLive.innerHTML = '<span style="width:5px;height:5px;border-radius:50%;background:var(--green);animation:lp 1.5s infinite"></span>LIVE<span id="perfil-live-time" style="color:var(--textSec);font-weight:500">· ahora</span>';
    pfHdr.appendChild(pfLive);
  }

  // PORTFOLIO: appendChild con margin-left:auto (padre sin space-between)
  var portScreens = document.querySelectorAll('.screen');
  if (portScreens[0] && portScreens[0].children[0] && portScreens[0].children[0].children[0]) {
    var portHlRow = portScreens[0].children[0].children[0];
    // Botón Idioma 🇪🇸 con borde dorado + ▾ (delante de ⚖️)
    if (!portHlRow.querySelector('.lang-chip')) {
      var langChip = document.createElement('div');
      langChip.className = 'lang-chip';
      langChip.onclick = function(){ window._openIdiomaModal(); };
      var curLang = localStorage.getItem('aurex_lang') || 'es';
      var flags = {es:'🇪🇸',en:'🇺🇸',pt:'🇧🇷',zh:'🇨🇳',fr:'🇫🇷',it:'🇮🇹',hi:'🇮🇳',ar:'🇸🇦'};
      langChip.innerHTML = '<span id="lang-flag">' + (flags[curLang]||'🇪🇸') + '</span> <span style="font-size:8px;">&#9660;</span>';
      langChip.style.cssText = 'display:flex;align-items:center;gap:2px;padding:3px 7px;border:1.5px solid var(--gold);border-radius:6px;cursor:pointer;font-size:14px;margin-left:auto;-webkit-tap-highlight-color:rgba(0,0,0,0);';
      portHlRow.appendChild(langChip);
    }
    window._addLegalChip(portHlRow, null, true);
  }
}

// --- Aviso Legal (Fase 4 F1-bis) ---
window._openAvisoLegal = function() {
  var m = document.getElementById('modal-aviso-legal');
  if (!m) return;
  m.style.display = 'flex';
  if (!m._listenerAdded) {
    m.addEventListener('click', function(e) {
      if (e.target === m) m.style.display = 'none';
    });
    m._listenerAdded = true;
  }
};

window._addLegalChip = function(headerEl, insertBeforeEl, useMarginAuto) {
  return; // A1 (web-1.4): la nativa oculta la ⚖️ en headers (HIDE_HEADER_LEGAL=true). No inyectar el chip.
  if (!headerEl || headerEl.querySelector('.legal-chip')) return;
  var chip = document.createElement('div');
  chip.className = 'legal-chip';
  chip.onclick = window._openAvisoLegal;
  chip.style.cssText = 'display:inline-flex;align-items:center;gap:3px;cursor:pointer;' +
    'background:transparent;border:1px solid var(--gold);border-radius:6px;' +
    'padding:3px 8px;font-size:13px;color:var(--gold);font-weight:600;flex-shrink:0;' +
    'user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);' +
    (useMarginAuto ? 'margin-left:auto;' : '');
  chip.innerHTML = '⚖️ <span style="font-size:10px">▼</span>';
  if (insertBeforeEl) {
    headerEl.insertBefore(chip, insertBeforeEl);
  } else {
    headerEl.appendChild(chip);
  }
};

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    _initHeaderLogos();
    if (typeof window._initHoyIndicator === 'function') window._initHoyIndicator();
    if (typeof window._initSortMenus === 'function') window._initSortMenus();
    if (typeof window._initLongPressActions === 'function') window._initLongPressActions();
    generarSenalesIA();
    setInterval(generarSenalesIA, 5*60*1000);
    _fetchPulseForCategory('GLOBAL').then(function(){
      _renderFearGreed();
      _renderFearGreed('mkt-fear-greed');
    });
    _fetchFuturesData().then(function(){
      _renderFuturesBanner();
      _renderFuturesBanner('mkt-futures-banner');
    });
    setInterval(function(){ _fetchPulseForCategory(window._pulseActiveFilter||'GLOBAL').then(function(){ _renderFearGreed(); _renderFearGreed('mkt-fear-greed'); }); }, 300000);
    setInterval(function(){ _fetchFuturesData().then(function(){ _renderFuturesBanner(); _renderFuturesBanner('mkt-futures-banner'); }); }, 60000);
  }, 1500);
});


// ============================================================
// Cobrex — Port Dropdowns: moneda y periodo (implementado via JS)
// NO modifica index.html — todo via DOM manipulation
// ============================================================

window._initPortDropdowns = function() {

  // --- 1. Eliminar texto fijo "desde compra" ---
  var pnlRow = document.getElementById('port-pnl-row');
  if(pnlRow) {
    pnlRow.querySelectorAll('span').forEach(function(sp) {
      var _spt=sp.textContent.trim(); if(_spt === 'desde compra' || _spt === t('port_period_buy')) sp.remove();
    });
  }

  // --- 2. Eliminar fila extra de botones port-period-row ---
  var periodRow = document.getElementById('port-period-row');
  if(periodRow) periodRow.remove();

  // --- 3. Agregar selector 24h a la derecha del % en port-pnl-row ---
  if(pnlRow && !document.getElementById('port-period-badge')) {
    pnlRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-top:3px;';

    var pnlUSD = document.getElementById('port-pnl-usd');
    var pnlPct = document.getElementById('port-pnl-pct');
    var usdClone = pnlUSD ? pnlUSD.cloneNode(true) : null;
    var pctClone = pnlPct ? pnlPct.cloneNode(true) : null;

    pnlRow.innerHTML = '';

    var leftWrap = document.createElement('div');
    leftWrap.style.cssText = 'display:flex;align-items:center;gap:6px;';
    if(usdClone) { usdClone.id = 'port-pnl-usd'; leftWrap.appendChild(usdClone); }
    if(pctClone) { pctClone.id = 'port-pnl-pct'; leftWrap.appendChild(pctClone); }
    pnlRow.appendChild(leftWrap);

    var rightWrap = document.createElement('div');
    rightWrap.style.cssText = 'position:relative;';

    var badge = document.createElement('div');
    badge.id = 'port-period-badge';
    badge.style.cssText = 'font-size:10px;color:#F59E0B;border:1px solid var(--border2);padding:2px 8px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:3px;font-weight:600;background:var(--card);user-select:none;';
    badge.innerHTML = '24h <span style="font-size:8px;color:var(--textDim);">▾</span>';
    badge._tLast=0;['touchstart','click'].forEach(function(evn){badge.addEventListener(evn,function(e){var now=Date.now();if(evn==='click'&&now-badge._tLast<600)return;if(evn==='touchstart'){badge._tLast=now;e.preventDefault();}e.stopPropagation();window._togglePortPeriodDD();},{passive:false});});

    var dd = document.createElement('div');
    dd.id = 'port-period-dropdown';
    dd.style.cssText = 'display:none;position:absolute;right:0;top:calc(100% + 4px);background:#1e1e30;border:1px solid var(--border2);border-radius:10px;overflow:hidden;min-width:120px;box-shadow:0 4px 16px rgba(0,0,0,0.6);z-index:9999;';

    var opts = [
      {key:'24h',label:t('port_period_24h')},
      {key:'7d',label:t('port_period_7d')},
      {key:'1m',label:t('port_period_1m')},
      {key:'3m',label:t('port_period_3m')},
      {key:'1y',label:t('port_period_1y')},
      {key:'buy',label:t('port_period_buy'),border:true}
    ];
    opts.forEach(function(o, i) {
      var item = document.createElement('div');
      item.dataset.key = o.key;
      item.style.cssText = 'padding:9px 14px;font-size:12px;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:rgba(0,0,0,0);' +
        (i===0 ? 'color:#F59E0B;font-weight:700;background:var(--card);' : 'color:var(--textDim);') +
        (o.border ? 'border-top:1px solid var(--border);' : '');
      item.textContent = o.label + (i===0 ? ' ✓' : '');
      (function(k){item._tLast=0;['touchstart','click'].forEach(function(evn){item.addEventListener(evn,function(e){var now=Date.now();if(evn==='click'&&now-item._tLast<600)return;if(evn==='touchstart'){item._tLast=now;e.preventDefault();}e.stopPropagation();window._selectPortPeriod(k);},{passive:false});});})(o.key);
      dd.appendChild(item);
    });

    rightWrap.appendChild(badge);
    rightWrap.appendChild(dd);
    pnlRow.appendChild(rightWrap);
  }

  // --- 4. Convertir badge USD en desplegable ---
  var currBadge = document.getElementById('port-curr-badge');
  if(currBadge && !document.getElementById('port-curr-dropdown')) {
    currBadge.style.cssText = 'font-size:11px;color:var(--chipTextActive);background:var(--gold);border:0.5px solid var(--gold);padding:2px 7px;border-radius:4px;cursor:pointer;font-weight:700;user-select:none;';
    currBadge.innerHTML = '$ ▾';
    currBadge._tLast=0;['touchstart','click'].forEach(function(evn){currBadge.addEventListener(evn,function(e){var now=Date.now();if(evn==='click'&&now-currBadge._tLast<600)return;if(evn==='touchstart'){currBadge._tLast=now;e.preventDefault();}e.stopPropagation();window._togglePortCurrDD();},{passive:false});});

    var parent = currBadge.parentNode;
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;display:inline-block;';
    parent.insertBefore(wrap, currBadge);
    wrap.appendChild(currBadge);

    var ddCurr = document.createElement('div');
    ddCurr.id = 'port-curr-dropdown';
    ddCurr.style.cssText = 'display:none;position:absolute;left:0;top:calc(100% + 4px);background:#1e1e30;border:1px solid var(--border2);border-radius:8px;overflow:hidden;min-width:80px;box-shadow:0 4px 16px rgba(0,0,0,0.6);z-index:9999;';
    ['USD','BTC','USDT'].forEach(function(c, i) {
      var item = document.createElement('div');
      item.dataset.curr = c;
      item.style.cssText = 'padding:8px 12px;font-size:11px;cursor:pointer;' +
        (i===0 ? 'color:#FFD700;font-weight:700;background:var(--card);' : 'color:var(--textDim);');
      item.textContent = c + (i===0 ? ' ✓' : '');
      (function(cur){item._tLast=0;['touchstart','click'].forEach(function(evn){item.addEventListener(evn,function(e){var now=Date.now();if(evn==='click'&&now-item._tLast<600)return;if(evn==='touchstart'){item._tLast=now;e.preventDefault();}e.stopPropagation();window._selectPortCurr(cur);},{passive:false});});})(c);
      ddCurr.appendChild(item);
    });
    wrap.appendChild(ddCurr);
  }

  // --- Cerrar dropdowns al tocar fuera ---
  if(!window._portDropdownListenerAdded) {
    document.addEventListener('click', function(ev) {
      var dd1 = document.getElementById('port-period-dropdown');
      var dd2 = document.getElementById('port-curr-dropdown');
      if(dd1 && !dd1.contains(ev.target)) dd1.style.display = 'none';
      if(dd2 && !dd2.contains(ev.target)) dd2.style.display = 'none';
    });
    window._portDropdownListenerAdded = true;
  }
};

window._togglePortPeriodDD = function() {
  var dd = document.getElementById('port-period-dropdown');
  var dd2 = document.getElementById('port-curr-dropdown');
  if(!dd) return;
  if(dd2) dd2.style.display = 'none';
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
};

window._togglePortCurrDD = function() {
  var dd = document.getElementById('port-curr-dropdown');
  var dd2 = document.getElementById('port-period-dropdown');
  if(!dd) return;
  if(dd2) dd2.style.display = 'none';
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
};

window._selectPortCurr = function(cur) {
  window._portCurrency = cur;
  var badge = document.getElementById('port-curr-badge');
  if(badge) { var dispCur = (cur === 'USD') ? '$' : cur; badge.textContent = dispCur + ' ▾'; badge.style.color='#000'; badge.style.background='var(--gold)'; badge.style.borderColor='var(--gold)'; }
  var dd = document.getElementById('port-curr-dropdown');
  if(dd) {
    dd.querySelectorAll('div').forEach(function(it) {
      var c = it.dataset.curr;
      it.style.color = c===cur ? '#FFD700' : 'var(--textDim)';
      it.style.fontWeight = c===cur ? '700' : '400';
      it.style.background = c===cur ? 'var(--card)' : '';
      it.textContent = c + (c===cur ? ' ✓' : '');
    });
    dd.style.display = 'none';
  }
  window._updatePortTotalDisplay();
};

window._selectPortPeriod = function(key) {
  var labels = {'24h':'24h','7d':'7d','1m':'1m','3m':'3m','1y':'1a','buy':'Compra'};
  var full = {'24h':'24 horas','7d':'7 días','1m':'1 mes','3m':'3 meses','1y':'1 año','buy':'Desde compra'};
  var badge = document.getElementById('port-period-badge');
  if(badge) badge.innerHTML = (labels[key]||key) + ' <span style="font-size:8px;color:var(--textDim);">▾</span>';
  var dd = document.getElementById('port-period-dropdown');
  if(dd) {
    dd.querySelectorAll('div').forEach(function(it) {
      var k = it.dataset.key;
      it.style.color = k===key ? '#F59E0B' : 'var(--textDim)';
      it.style.fontWeight = k===key ? '700' : '400';
      it.style.background = k===key ? 'var(--card)' : '';
      it.textContent = (full[k]||k) + (k===key ? ' ✓' : '');
    });
    dd.style.display = 'none';
  }
  window._calcPortPeriod(key);
};

window._calcPortPeriod = function(period) {
  var items = window._portItems;
  var prices = window._IA_PRECIOS || {};
  var pcPrices = window._pcPrices || {};
  var pcChange = window._pcChange24 || {};
  if(!items) return;
  var totalNow = 0, totalBefore = 0;
  items.forEach(function(item) {
    var p = prices[item.simbolo];
    var qty = parseFloat(item.cantidad)||0;
    var pNow = (p && p.precio) ? parseFloat(p.precio) : (pcPrices[item.simbolo] || parseFloat(item.precio_compra) || 0);
    totalNow += qty*pNow;
    var pBefore;
    if(period==='buy') {
      pBefore = parseFloat(item.precio_compra)||pNow;
    } else if(period==='24h') {
      if(p && p.precio24h) { pBefore = parseFloat(p.precio24h); }
      else if(pcChange[item.simbolo] !== undefined && pNow > 0) { pBefore = pNow / (1 + pcChange[item.simbolo]/100); }
      else { pBefore = pNow; }
    } else if(period==='7d') {
      pBefore = (p&&p.precio7d)?parseFloat(p.precio7d):(p&&p.precio24h)?parseFloat(p.precio24h):pNow;
    } else if(period==='1m') {
      pBefore = (p&&p.precio30d)?parseFloat(p.precio30d):(p&&p.closes30d&&p.closes30d.length)?parseFloat(p.closes30d[0]):(p&&p.precio24h)?parseFloat(p.precio24h):pNow;
    } else if(period==='3m') {
      var c=p?p.closes30d:null; var p3=c&&c.length>=30?parseFloat(c[0]):0;
      pBefore = p3||(p&&p.precio30d?parseFloat(p.precio30d):0)||(p&&p.precio24h?parseFloat(p.precio24h):0)||pNow;
    } else if(period==='1y') {
      pBefore = (p&&p.low52w)?parseFloat(p.low52w):(p&&p.precio30d)?parseFloat(p.precio30d):(p&&p.precio24h)?parseFloat(p.precio24h):pNow;
    } else {
      pBefore = (p&&p.precio24h)?parseFloat(p.precio24h):pNow;
    }
    totalBefore += qty*pBefore;
  });
  var diff = totalNow-totalBefore;
  var pct = totalBefore>0 ? (diff/totalBefore*100) : 0;
  var isPos = diff>=0;
  var color = isPos?'#3fb950':'#f85149';
  var bg = isPos?'#1A3A2A':'#3A1A1A';
  var el1 = document.getElementById('port-pnl-usd');
  var el2 = document.getElementById('port-pnl-pct');
  if(el1){el1.textContent=(isPos?'+':'-')+'$'+Math.abs(diff).toLocaleString(navigator.language||'en-US',{minimumFractionDigits:2,maximumFractionDigits:2});el1.style.color=color;}
  if(el2){el2.textContent=_fmt(pct,'pct');el2.style.color=color;el2.style.background='transparent';}
  // F2: sincronizar indicador Hoy
  if (typeof window._refreshHoyPct === 'function') window._refreshHoyPct();
};

window.portTotalPeriod = window._calcPortPeriod;


function _renderComboBanner(containerId){
  var elId = containerId || 'mkt-combo-banner';
  var el = document.getElementById(elId);
  if(!el) return;

  var tmpMarket = document.createElement('div');
  tmpMarket.id = 'mkt-market-banner';
  tmpMarket.style.display = 'none';
  document.body.appendChild(tmpMarket);

  var tmpFutures = document.createElement('div');
  tmpFutures.id = 'mkt-futures-banner';
  tmpFutures.style.display = 'none';
  document.body.appendChild(tmpFutures);

  if(typeof _renderMarketBanner==='function') _renderMarketBanner('mkt-market-banner');
  if(typeof _renderFuturesBanner==='function') _renderFuturesBanner('mkt-futures-banner');

  var slideA = tmpMarket.innerHTML;
  var slideB = tmpFutures.innerHTML;

  document.body.removeChild(tmpMarket);
  document.body.removeChild(tmpFutures);

  var sOn  = 'display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;cursor:pointer;background:var(--gold);color:#111;';
  var sOff = 'display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;cursor:pointer;background:#2a2a2a;color:var(--textDim);';

  var html = '<div style="display:flex;gap:5px;padding:2px 10px 2px;justify-content:flex-end;">'
    + '<div id="combo-tab-a" style="' + sOn  + '" onclick="if(window._comboActive!==0&&window._comboBannerFlip)window._comboBannerFlip()">'+t('tab_mercados')+'</div>'
    + '<div id="combo-tab-b" style="' + sOff + '" onclick="if(window._comboActive!==1&&window._comboBannerFlip)window._comboBannerFlip()">'+t('mkt_combo_futuros')+'</div>'
    + '</div>'
    + '<div id="combo-slide-a">' + slideA + '</div>'
    + '<div id="combo-slide-b" style="display:none;">' + slideB + '</div>';

  el.innerHTML = html;

  window._comboActive = 0;
  window._comboSOn  = 'display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;cursor:pointer;background:var(--gold);color:#111;';
  window._comboSOff = 'display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;cursor:pointer;background:#2a2a2a;color:var(--textDim);';

  function _comboFlip(){
    window._comboActive = 1 - window._comboActive;
    var sa = document.getElementById('combo-slide-a');
    var sb = document.getElementById('combo-slide-b');
    var ta = document.getElementById('combo-tab-a');
    var tb = document.getElementById('combo-tab-b');
    if(!sa||!sb) return;
    if(window._comboActive===0){
      sa.style.display=''; sb.style.display='none';
      if(ta) ta.setAttribute('style',window._comboSOn);
      if(tb) tb.setAttribute('style',window._comboSOff);
    } else {
      sa.style.display='none'; sb.style.display='';
      if(tb) tb.setAttribute('style',window._comboSOn);
      if(ta) ta.setAttribute('style',window._comboSOff);
    }
  }
  window._comboBannerFlip = _comboFlip;
  if(window._comboBannerTimer) clearInterval(window._comboBannerTimer);
  // Sin auto-toggle — el usuario cambia con tabs Mercados/Futuros (como nativa)
}

// --- Fase 4 F2: Indicador "Hoy" animado ---

(function _addHoyKeyframes() {
  if (document.getElementById('hoy-keyframes')) return;
  var st = document.createElement('style');
  st.id = 'hoy-keyframes';
  st.textContent =
    '@keyframes hoy-bounce {' +
    '  0%, 100% { transform: translateY(0) rotate(0deg); }' +
    '  25%       { transform: translateY(-3px) rotate(-10deg); }' +
    '  75%       { transform: translateY(-1px) rotate(10deg); }' +
    '}';
  document.head.appendChild(st);
})();

window._initHoyIndicator = function() {
  var cntBadge = document.getElementById('port-cnt-badge');
  if (!cntBadge) return;

  // CLEANUP: deshacer intentos previos (wrapper interno + emoji dentro del badge)
  var oldEmojiInBadge = document.getElementById('port-cnt-emoji');
  if (oldEmojiInBadge) oldEmojiInBadge.remove();
  var directParent = cntBadge.parentElement;
  if (directParent && directParent.classList.contains('badge-emoji-row')) {
    var chipReal = directParent.parentElement;
    chipReal.replaceChild(cntBadge, directParent);
  }
  if (cntBadge.style.display) {
    cntBadge.style.display = '';
    cntBadge.style.alignItems = '';
    cntBadge.style.justifyContent = '';
    cntBadge.style.gap = '';
  }

  // Identificar fila bottom y chip Activos
  var cntChip = cntBadge.parentElement;
  var filaBottom = cntChip ? cntChip.parentElement : null;
  if (!filaBottom) return;

  // Insertar emoji 🎉 AFUERA del chip Activos. margin-left:auto empuja
  // el emoji + indicador Hoy hacia la derecha (acercándolos al botón Agregar)
  if (!document.getElementById('port-fila-emoji')) {
    var emoji = document.createElement('span');
    emoji.id = 'port-fila-emoji';
    emoji.textContent = '🎉';
    emoji.style.cssText = 'font-size:18px;display:none;align-items:center;line-height:1;flex-shrink:0;margin-left:auto;';
    filaBottom.insertBefore(emoji, cntChip.nextSibling);
  }

  // Reemplazar bloque "Mejor 24h" con indicador Hoy
  if (document.getElementById('port-hoy-indicator')) return;
  var mejorDiv = null;
  for (var i = 0; i < filaBottom.children.length; i++) {
    var child = filaBottom.children[i];
    if (child.querySelector && child.querySelector('#port-best-badge')) {
      mejorDiv = child;
      break;
    }
  }
  if (!mejorDiv) return;

  var pctEl = document.getElementById('port-pnl-pct');
  var pct = pctEl ? pctEl.textContent.trim() : '';
  var isPos = !pct.startsWith('-');

  var hoyDiv = document.createElement('div');
  hoyDiv.id = 'port-hoy-indicator';
  hoyDiv.style.cssText = 'flex:0 0 auto;padding:0 4px;display:none;align-items:center;gap:3px;';

  var hoyPct = document.createElement('span');
  hoyPct.id = 'port-hoy-pct';
  hoyPct.textContent = pct;
  hoyPct.style.cssText = 'font-size:12px;font-weight:800;color:' + (isPos ? 'var(--green)' : 'var(--red)') + ';';

  var hoyLabel = document.createElement('span');
  hoyLabel.id = 'port-hoy-label';
  hoyLabel.textContent = ' ' + ((window._i18n&&window._i18n.t)?window._i18n.t('hoy'):'Hoy');
  hoyLabel.style.cssText = 'font-size:10px;font-weight:600;color:var(--textSec);white-space:nowrap;';

  hoyDiv.appendChild(hoyPct);
  hoyDiv.appendChild(hoyLabel);
  filaBottom.replaceChild(hoyDiv, mejorDiv);
};

window._refreshHoyPct = function() {
  var hoyPct = document.getElementById('port-hoy-pct');
  var hoyDiv = document.getElementById('port-hoy-indicator');
  var pctEl = document.getElementById('port-pnl-pct');
  if (!hoyPct || !pctEl) return;
  var pct = pctEl.textContent.trim();
  if (!pct || pct === '' || pct === '--') {
    // Usar cache si hay
    if (window._cachedHoy) {
      var ch = window._cachedHoy;
      if(hoyPct && ch.hoyPct) { hoyPct.textContent = ch.hoyPct; hoyPct.style.color = ch.hoyColor || ''; }
      if(hoyDiv) hoyDiv.style.display = 'flex';
      var emojiEl = document.getElementById('port-fila-emoji');
      if(emojiEl && ch.emoji) { emojiEl.textContent = ch.emoji; emojiEl.style.display = 'inline-flex'; }
      window._cachedHoy = null;
    }
    return;
  }
  var isPos = !pct.startsWith('-');
  hoyPct.textContent = pct;
  hoyPct.style.color = isPos ? 'var(--green)' : 'var(--red)';
  // Mostrar indicador solo cuando hay datos reales (como nativa: calc24h retorna 0 si no hay precios)
  if (hoyDiv) hoyDiv.style.display = 'flex';
  // Emoji dinámico: 🎉 si positivo, 😟 si negativo (nativa línea 653)
  var emojiEl = document.getElementById('port-fila-emoji');
  if (emojiEl) {
    emojiEl.textContent = isPos ? '🎉' : '😟';
    emojiEl.style.display = 'inline-flex';
  }
};

// --- Fase 4 F3: Sort menus (modal central — réplica nativa) ---

(function _addSortStyles() {
  if (document.getElementById('sort-menu-styles')) return;
  var st = document.createElement('style');
  st.id = 'sort-menu-styles';
  st.textContent =
    /* Botón sort en cada tab */
    '.sort-wrap{position:relative;display:inline-block;}' +
    '.sort-btn{background:var(--card);border:1px solid var(--border2);border-radius:7px;' +
    'padding:5px 10px;font-size:10px;font-weight:600;color:var(--textSec);cursor:pointer;' +
    'display:inline-flex;align-items:center;gap:4px;white-space:nowrap;' +
    'user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:rgba(0,0,0,0);}' +
    '.sort-btn .sort-value{font-size:11px;font-weight:700;color:var(--text);}' +
    '.sort-btn .sort-arrow{color:var(--gold);font-size:10px;font-weight:800;}' +
    /* Modal central */
    '#sort-overlay{position:fixed;inset:0;z-index:2050;background:rgba(0,0,0,0.55);' +
    'display:flex;align-items:center;justify-content:center;padding:24px;}' +
    '#sort-modal{background:var(--card);border:3px solid var(--gold);border-radius:20px;width:100%;max-width:340px;' +
    'max-height:80vh;overflow-y:auto;padding:16px;animation:lp-fadein 0.18s ease-out;' +
    'display:flex;flex-direction:column;gap:4px;-webkit-user-select:none;user-select:none;' +
    '-webkit-touch-callout:none;border:1px solid var(--gold);' +
    'box-shadow:0 10px 20px rgba(0,0,0,0.35);}' +
    '.sort-header{display:flex;align-items:center;justify-content:center;gap:8px;' +
    'padding:8px 0 12px;border-bottom:1px solid rgba(247,208,96,0.25);margin-bottom:10px;}' +
    '.sort-header-icon{font-size:18px;color:var(--gold);}' +
    '.sort-header-title{font-size:15px;font-weight:800;color:var(--text);letter-spacing:0.3px;}' +
    '.sort-item{display:flex;align-items:center;gap:10px;padding:11px 12px;cursor:pointer;' +
    'border-radius:10px;background:transparent;margin-bottom:4px;border-left:3px solid transparent;' +
    '-webkit-tap-highlight-color:rgba(0,0,0,0);}' +
    '.sort-item.active{background:rgba(247,208,96,0.12);border-left:3px solid var(--gold);}' +
    '.sort-item-icon{font-size:16px;flex-shrink:0;}' +
    '.sort-item-text{flex:1;min-width:0;}' +
    '.sort-item-label{font-size:13px;font-weight:600;color:var(--text);}' +
    '.sort-item.active .sort-item-label{font-weight:800;}' +
    '.sort-item-desc{font-size:10px;color:var(--textSec);margin-top:1px;}' +
    '.sort-item-check{color:var(--gold);font-size:16px;font-weight:800;}' +
    '.sort-cancel{margin-top:10px;background:transparent;border:1px solid var(--gold);' +
    'border-radius:10px;padding:10px;text-align:center;font-size:13px;font-weight:700;' +
    'color:#111;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);}' +
    '.sort-cancel:active{background:var(--border);}';
  document.head.appendChild(st);
})();

// Definición de opciones por tab — cada una con icono, label, descripción y color de fondo
window._sortCfgs = {
  portfolio: { key:'aurex_sort_portfolio', def:'valor', opts:[
    {k:'valor',     lk:'sort_valor',     dk:'sort_valor_d',     ic:'📊', bg:'#22c55e20'},
    {k:'pct_hoy',   lk:'sort_pct_hoy',   dk:'sort_pct_hoy_d',   ic:'📈', bg:'#ef444420'},
    {k:'pnl_usd',   lk:'sort_pnl_usd',   dk:'sort_pnl_usd_d',   ic:'💰', bg:'#22c55e20'},
    {k:'pnl_pct',   lk:'sort_pnl_pct',   dk:'sort_pnl_pct_d',   ic:'💰', bg:'#22c55e20'},
    {k:'senal_ia',  lk:'sort_senal_ia',  dk:'sort_senal_ia_d',  ic:'🔼', bg:'#3B82F620'},
    {k:'prob',      lk:'sort_prob',      dk:'sort_prob_d',      ic:'🎯', bg:'#ef444420'},
    {k:'ticker',    lk:'sort_ticker',    dk:'sort_ticker_d',    ic:'🔤', bg:'#3B82F620'},
    {k:'fecha',     lk:'sort_fecha',     dk:'sort_fecha_d',     ic:'🕐', bg:'#9CA3AF20'}
  ]},
  mercados: { key:'aurex_sort_mercados', def:'default', opts:[
    {k:'default',   lk:'sort_default',   dk:'sort_default_d',   ic:'⏰', bg:'#9CA3AF20'},
    {k:'pct_hoy',   lk:'sort_pct_hoy',   dk:'sort_pct_hoy_d',   ic:'📈', bg:'#ef444420'},
    {k:'precio',    lk:'sort_precio',    dk:'sort_precio_d',    ic:'💲', bg:'#22c55e20'},
    {k:'ticker',    lk:'sort_ticker',    dk:'sort_ticker_d',    ic:'🔤', bg:'#3B82F620'},
    {k:'senal_ia',  lk:'sort_senal_ia',  dk:'sort_senal_ia_d',  ic:'🔼', bg:'#3B82F620'},
    {k:'prob',      lk:'sort_prob',      dk:'sort_prob_d',      ic:'🎯', bg:'#ef444420'}
  ]},
  watchlist: { key:'aurex_sort_watchlist', def:'default', opts:[
    {k:'default',   lk:'sort_default',   dk:'sort_default_d',   ic:'⏰', bg:'#9CA3AF20'},
    {k:'pct_hoy',   lk:'sort_pct_hoy',   dk:'sort_pct_hoy_d',   ic:'📈', bg:'#ef444420'},
    {k:'pct_7d',    lk:'sort_pct_7d',    dk:'sort_pct_7d_d',    ic:'📈', bg:'#ef444420'},
    {k:'pct_30d',   lk:'sort_pct_30d',   dk:'sort_pct_30d_d',   ic:'📈', bg:'#ef444420'},
    {k:'prob',      lk:'sort_prob',      dk:'sort_prob_d',      ic:'🎯', bg:'#ef444420'},
    {k:'senal_ia',  lk:'sort_senal_ia',  dk:'sort_senal_ia_d',  ic:'🔼', bg:'#3B82F620'},
    {k:'ticker',    lk:'sort_ticker',    dk:'sort_ticker_d',    ic:'🔤', bg:'#3B82F620'}
  ]},
  ia: { key:'aurex_sort_ia', def:'default', opts:[
    {k:'default',   lk:'sort_default',   dk:'sort_default_ia_d', ic:'🎯', bg:'#ef444420'},
    {k:'pct_hoy',   lk:'sort_pct_hoy',   dk:'sort_pct_hoy_d',   ic:'📈', bg:'#ef444420'},
    {k:'pct_7d',    lk:'sort_pct_7d',    dk:'sort_pct_7d_d',    ic:'📈', bg:'#ef444420'},
    {k:'pct_30d',   lk:'sort_pct_30d',   dk:'sort_pct_30d_d',   ic:'📈', bg:'#ef444420'},
    {k:'prob',      lk:'sort_prob',      dk:'sort_prob_d',      ic:'🎯', bg:'#ef444420'},
    {k:'upside',    lk:'sort_upside',    dk:'sort_upside_d',    ic:'🚀', bg:'#22c55e20'},
    {k:'ticker',    lk:'sort_ticker',    dk:'sort_ticker_d',    ic:'🔤', bg:'#3B82F620'}
  ]}
};
window._currSort = {};

function _getSort(tab) {
  if (window._currSort[tab]) return window._currSort[tab];
  var c = window._sortCfgs[tab];
  window._currSort[tab] = localStorage.getItem(c.key) || c.def;
  return window._currSort[tab];
}
function _setSort(tab, k) {
  window._currSort[tab] = k;
  localStorage.setItem(window._sortCfgs[tab].key, k);
}
function _closeSortModal() {
  var ov = document.getElementById('sort-overlay');
  if (ov) ov.remove();
}

function _openSortModal(tab, onApply) {
  _closeSortModal();
  var cfg = window._sortCfgs[tab];
  var cur = _getSort(tab);
  var ov = document.createElement('div');
  ov.id = 'sort-overlay';
  var modal = document.createElement('div');
  modal.id = 'sort-modal';
  // Header
  var hdr = document.createElement('div');
  hdr.className = 'sort-header';
  hdr.innerHTML = '<span class="sort-header-icon">↕</span>' +
    '<span class="sort-header-title">'+t('port_sort_title')+'</span>';
  modal.appendChild(hdr);
  // Items
  cfg.opts.forEach(function(o) {
    var it = document.createElement('div');
    it.className = 'sort-item' + (o.k === cur ? ' active' : '');
    it.innerHTML =
      '<div class="sort-item-icon">' + o.ic + '</div>' +
      '<div class="sort-item-text">' +
        '<div class="sort-item-label">' + t(o.lk) + '</div>' +
        '<div class="sort-item-desc">' + t(o.dk) + '</div>' +
      '</div>' +
      (o.k === cur ? '<div class="sort-item-check">✓</div>' : '');
    it.addEventListener('click', function() {
      _setSort(tab, o.k);
      _closeSortModal();
      // Actualizar label del botón visible
      var btn = document.getElementById(tab + '-sort-btn');
      if (btn) btn.innerHTML = t('port_sort_btn_prefix')+' <span class="sort-value">' + t(o.lk) + '</span> <span class="sort-arrow">↓</span>';
      if (onApply) onApply(o.k);
    });
    modal.appendChild(it);
  });
  // Cancelar
  var cancel = document.createElement('div');
  cancel.className = 'sort-cancel';
  cancel.textContent = t('cancelar');
  cancel.addEventListener('click', _closeSortModal);
  modal.appendChild(cancel);
  ov.appendChild(modal);
  ov.addEventListener('click', function(e){ if (e.target === ov) _closeSortModal(); });
  document.body.appendChild(ov);
}

function _buildSortBtn(tab, onApply) {
  var cfg = window._sortCfgs[tab];
  var cur = _getSort(tab);
  var curOpt = cfg.opts.find(function(o){return o.k===cur;}) || cfg.opts[0];
  var wrap = document.createElement('div');
  wrap.className = 'sort-wrap';
  wrap.id = tab+'-sort-wrap';
  var btn = document.createElement('div');
  btn.className = 'sort-btn';
  btn.id = tab+'-sort-btn';
  btn.innerHTML = t('port_sort_btn_prefix')+' <span class="sort-value">'+t(curOpt.lk)+'</span> <span class="sort-arrow">↓</span>';
  btn.onclick = function(e) {
    e.stopPropagation();
    _openSortModal(tab, onApply);
  };
  wrap.appendChild(btn);
  return wrap;
}

// Sort genérico DOM-based: extrae texto del item, sortea, re-appendea
function _sortDOMItems(container, itemsSelector, extractFn, descending) {
  if (!container) return;
  var items = Array.from(container.querySelectorAll(itemsSelector));
  if (items.length < 2) return;
  items.sort(function(a,b){
    var va = extractFn(a), vb = extractFn(b);
    if (typeof va === 'string') return descending ? vb.localeCompare(va) : va.localeCompare(vb);
    return descending ? (vb-va) : (va-vb);
  });
  items.forEach(function(it){ container.appendChild(it); });
}

// === Aplicar sort por tab — datos reales desde objetos globales ===

function _signalDirOrder(dir) {
  // ALCISTA → ALTA CONV → BAJISTA → sin señal
  if (dir === 'alcista') return 0;
  if (dir === 'alta_conf' || dir === 'ALTA CONV-IA') return 1;
  if (dir === 'bajista') return 2;
  return 3;
}

function _getSignalForSym(sym) {
  var sigs = window._iaSignals || [];
  for (var i=0; i<sigs.length; i++) if (sigs[i].simbolo === sym) return sigs[i];
  return null;
}

window._applyPortfolioSort = function(key) {
  var items = window._portItems || [];
  if (!items.length) return;
  var prcs = window._pcPrices || {};
  var chg24 = window._pcChange24 || {};
  var sorted = items.slice();
  sorted.sort(function(a, b) {
    var pa = prcs[a.simbolo] || a.precio_compra || 0;
    var pb = prcs[b.simbolo] || b.precio_compra || 0;
    if (key === 'valor') return (pb * b.cantidad) - (pa * a.cantidad);
    if (key === 'pct_hoy') return (chg24[b.simbolo]||0) - (chg24[a.simbolo]||0);
    if (key === 'pnl_usd') return ((pb - b.precio_compra) * b.cantidad) - ((pa - a.precio_compra) * a.cantidad);
    if (key === 'pnl_pct') {
      var pnlA = a.precio_compra > 0 ? ((pa - a.precio_compra)/a.precio_compra*100) : 0;
      var pnlB = b.precio_compra > 0 ? ((pb - b.precio_compra)/b.precio_compra*100) : 0;
      return pnlB - pnlA;
    }
    if (key === 'senal_ia') {
      var sA = _getSignalForSym(a.simbolo), sB = _getSignalForSym(b.simbolo);
      return _signalDirOrder(sA && sA.direccion) - _signalDirOrder(sB && sB.direccion);
    }
    if (key === 'prob') {
      var sA = _getSignalForSym(a.simbolo), sB = _getSignalForSym(b.simbolo);
      var pA = sA ? (sA.confianza || sA.prob_principal || 0) : 0;
      var pB = sB ? (sB.confianza || sB.prob_principal || 0) : 0;
      return pB - pA;
    }
    if (key === 'ticker') return (a.simbolo||'').localeCompare(b.simbolo||'');
    if (key === 'fecha') return new Date(a.created_at||0) - new Date(b.created_at||0);
    return 0;
  });
  // Persistir orden y re-renderizar
  try { localStorage.setItem('aurex_port_order', JSON.stringify(sorted.map(function(i){return i.id;}))); } catch(_){}
  window._portItems = sorted;
  if (typeof window._renderPortfolioItems === 'function') window._renderPortfolioItems(sorted);
};

function _sortDOMRowsBySymbol(container, selector, getKey, descending) {
  var items = Array.from(container.querySelectorAll(selector));
  if (items.length < 2) return;
  items.sort(function(a, b) {
    var ka = getKey(a), kb = getKey(b);
    if (typeof ka === 'string') return descending ? kb.localeCompare(ka) : ka.localeCompare(kb);
    return descending ? (kb - ka) : (ka - kb);
  });
  items.forEach(function(it){ container.appendChild(it); });
}

window._applyMercadosSort = function(key) {
  var cnt = document.getElementById('cnt');
  if (!cnt) return;
  var prcs = window._pcPrices || {};
  var chg24 = window._pcChange24 || {};
  var getSym = function(el){ return (el.id || '').replace('row-', ''); };
  if (key === 'default') {
    // Restaurar orden original — re-renderizar tab actual si hay función
    if (typeof window.renderTab === 'function') {
      try { window.renderTab(window._activeTab||'cripto', window._activePais); } catch(_){}
    }
    return;
  }
  if (key === 'pct_hoy') {
    _sortDOMRowsBySymbol(cnt, '.item-row', function(el){ return chg24[getSym(el)] || 0; }, true);
  } else if (key === 'precio') {
    _sortDOMRowsBySymbol(cnt, '.item-row', function(el){ return prcs[getSym(el)] || 0; }, true);
  } else if (key === 'ticker') {
    _sortDOMRowsBySymbol(cnt, '.item-row', function(el){ return getSym(el); }, false);
  } else if (key === 'senal_ia') {
    _sortDOMRowsBySymbol(cnt, '.item-row', function(el){
      var s = _getSignalForSym(getSym(el));
      return _signalDirOrder(s && s.direccion);
    }, false); // ascending: alcista primero
  } else if (key === 'prob') {
    _sortDOMRowsBySymbol(cnt, '.item-row', function(el){
      var s = _getSignalForSym(getSym(el));
      return s ? (s.confianza || s.prob_principal || 0) : 0;
    }, true);
  }
};

window._applyWatchlistSort = function(key) {
  var wc = document.getElementById('watch-cnt');
  if (!wc) return;
  // Detectar items de activos (los que tienen onclick=wlOpenDetail)
  var activos = Array.from(wc.querySelectorAll('div[onclick^="wlOpenDetail"]'));
  if (key === 'default' || activos.length < 2) {
    if (key === 'default' && typeof window.renderWatchCnt === 'function') {
      try { window.renderWatchCnt(); } catch(_){}
    }
    return;
  }
  var prcs = window._pcPrices || {};
  var chg24 = window._pcChange24 || {};
  var hist = window._wlCompareHist || {};
  var getSym = function(el){
    var m = (el.getAttribute('onclick')||'').match(/wlOpenDetail\('([^']+)'\)/);
    return m ? m[1] : '';
  };
  activos.sort(function(a, b) {
    var sa = getSym(a), sb = getSym(b);
    if (key === 'pct_hoy') return (chg24[sb]||0) - (chg24[sa]||0);
    if (key === 'pct_7d') return ((hist[sb]&&hist[sb]['7d'])||0) - ((hist[sa]&&hist[sa]['7d'])||0);
    if (key === 'pct_30d') return ((hist[sb]&&hist[sb]['1m'])||0) - ((hist[sa]&&hist[sa]['1m'])||0);
    if (key === 'prob') {
      var sigA = _getSignalForSym(sa), sigB = _getSignalForSym(sb);
      return ((sigB&&(sigB.confianza||sigB.prob_principal))||0) - ((sigA&&(sigA.confianza||sigA.prob_principal))||0);
    }
    if (key === 'senal_ia') {
      var sigA = _getSignalForSym(sa), sigB = _getSignalForSym(sb);
      return _signalDirOrder(sigA&&sigA.direccion) - _signalDirOrder(sigB&&sigB.direccion);
    }
    if (key === 'ticker') return sa.localeCompare(sb);
    return 0;
  });
  activos.forEach(function(it){ wc.appendChild(it); });
};

// Sort IA — opera sobre el array de datos y re-renderiza (como nativa sortedSignals)
window._iaSortKey = 'default';
window._applyIASort = function(key) {
  window._iaSortKey = key;
  var sigs = window._iaSignals || [];
  if(key === 'default'){
    // Default = ordenar por confianza desc (como nativa línea 104)
    sigs.sort(function(a,b){ return (b.confianza||0) - (a.confianza||0); });
  } else {
    var getStats = function(s){
      return {
        prob: s.confianza || s.probabilidad || 0,
        chg24: s.precio24h > 0 && s.precio ? ((s.precio - s.precio24h) / s.precio24h * 100) : 0,
        chg7d: s.precio7d > 0 && s.precio ? ((s.precio - s.precio7d) / s.precio7d * 100) : 0,
        chg30d: s.precio30d > 0 && s.precio ? ((s.precio - s.precio30d) / s.precio30d * 100) : 0,
        upside: s.upside || 0,
        ticker: s.simbolo || ''
      };
    };
    sigs.sort(function(a,b){
      var A = getStats(a), B = getStats(b);
      if(key==='pct_hoy') return B.chg24 - A.chg24;
      if(key==='pct_7d') return B.chg7d - A.chg7d;
      if(key==='pct_30d') return B.chg30d - A.chg30d;
      if(key==='prob') return B.prob - A.prob;
      if(key==='upside') return B.upside - A.upside;
      if(key==='ticker') return A.ticker.localeCompare(B.ticker);
      return 0;
    });
  }
  _renderIALista(sigs, false);
};

// --- Fase 4 F4: Long press action sheet (formato modal central — réplica nativa) ---

(function _addLPStyles() {
  if (document.getElementById('lp-styles')) return;
  var st = document.createElement('style');
  st.id = 'lp-styles';
  st.textContent =
    '@keyframes lp-fadein { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }' +
    '#longpress-overlay{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,0.7);' +
    'display:flex;align-items:center;justify-content:center;padding:20px;}' +
    '#longpress-modal{background:var(--card);border:1px solid var(--border2);border-radius:20px;width:100%;max-width:320px;' +
    'padding:18px 14px;animation:lp-fadein 0.18s ease-out;display:flex;flex-direction:column;gap:8px;' +
    'box-shadow:0 8px 32px rgba(0,0,0,0.25);}' +
    '.lp-header{text-align:center;padding:4px 0 12px;}' +
    '.lp-header .lp-ticker{font-size:18px;font-weight:700;color:#111;display:block;}' +
    '.lp-header .lp-name{font-size:12px;color:var(--textSec);display:block;margin-top:2px;}' +
    '.lp-option{display:flex;align-items:center;gap:12px;padding:13px 14px;cursor:pointer;' +
    'font-size:14px;font-weight:600;color:var(--text);border-radius:11px;background:var(--card);' +
    '-webkit-tap-highlight-color:rgba(0,0,0,0);user-select:none;}' +
    '.lp-option .lp-icon{font-size:18px;flex-shrink:0;width:22px;text-align:center;}' +
    '.lp-option:active{opacity:0.7;}' +
    '.lp-option.lp-primary{background:transparent;border:1.5px solid #333;color:var(--text);}' +
    '.lp-option.lp-destructive{background:var(--redBg);color:var(--red);border:1px solid #dc2626;}' +
    '.lp-cancel{margin-top:8px;background:transparent;' +
    'border-radius:11px;padding:13px;text-align:center;font-size:14px;font-weight:600;' +
    'color:var(--textSec);cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);}' +
    '.lp-cancel:active{background:var(--card);}' +
    /* Header enriquecido Mercados */
    '.lp-header-rich{display:flex;align-items:center;gap:10px;padding:6px 0 10px;position:relative;}' +
    '.lp-header-rich .lp-logo{width:38px;height:38px;border-radius:50%;object-fit:cover;flex-shrink:0;}' +
    '.lp-header-rich .lp-info{flex:1;text-align:left;}' +
    '.lp-header-rich .lp-close{position:absolute;top:2px;right:0;font-size:20px;cursor:pointer;' +
    'color:#999;line-height:1;padding:4px;-webkit-tap-highlight-color:rgba(0,0,0,0);}' +
    '.lp-chips{display:flex;gap:6px;margin-bottom:8px;}' +
    '.lp-chip{flex:1;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:8px 4px;text-align:center;}' +
    '.lp-chip-label{font-size:9px;color:var(--textSec);margin-bottom:3px;}' +
    '.lp-chip-val{font-size:14px;font-weight:700;color:#222;}' +
    '.lp-signal{text-align:center;padding:8px 12px;font-size:12px;color:var(--textSec);background:var(--card);border-radius:10px;margin-bottom:4px;}' +
    '.lp-signal strong{display:block;font-size:15px;margin-top:3px;}' +
    '.lp-signal strong{font-weight:700;}' +
    '.lp-fav-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 14px;cursor:pointer;' +
    'font-size:14px;font-weight:700;border-radius:11px;background:#FEF3C7;color:#111;' +
    'border:1.5px solid #D4A017;-webkit-tap-highlight-color:rgba(0,0,0,0);user-select:none;}' +
    '.lp-fav-btn:active{opacity:0.7;}' +
    /* Evitar selección de texto y menú nativo iOS al hacer long press */
    '[id^="port-row-"], #cnt .item-row, #watch-cnt > div, ' +
    '#longpress-modal, #longpress-modal *, .lp-option, .lp-cancel {' +
    '-webkit-user-select:none;-moz-user-select:none;user-select:none;' +
    '-webkit-touch-callout:none;}';
  document.head.appendChild(st);
})();

function _attachLongPress(el, onLongPress) {
  if (el._lpAttached) return;
  el._lpAttached = true;
  var timer = null;
  var moved = false;
  el.addEventListener('touchstart', function(e) {
    moved = false;
    timer = setTimeout(function() {
      if (!moved) {
        try { if (window.navigator && navigator.vibrate) navigator.vibrate(15); } catch(_){}
        onLongPress(e, el);
      }
    }, 500);
  }, { passive: true });
  el.addEventListener('touchmove', function() { moved = true; clearTimeout(timer); }, { passive: true });
  el.addEventListener('touchend', function() { clearTimeout(timer); }, { passive: true });
  el.addEventListener('touchcancel', function() { clearTimeout(timer); }, { passive: true });
}

window._closeLPSheet = function() {
  var ov = document.getElementById('longpress-overlay');
  if (ov) ov.remove();
};

function _lpOption(icon, label, variant, onClick) {
  var div = document.createElement('div');
  div.className = 'lp-option' + (variant === 'primary' ? ' lp-primary' : variant === 'destructive' ? ' lp-destructive' : '');
  div.innerHTML = '<span class="lp-icon">' + icon + '</span><span>' + label + '</span>';
  div.addEventListener('click', function() {
    window._closeLPSheet();
    setTimeout(onClick, 50);
  });
  return div;
}

// options: [{ icon, label, variant?: 'primary'|'destructive', action }]
window._showLPSheet = function(ticker, name, options) {
  window._closeLPSheet();
  var overlay = document.createElement('div');
  overlay.id = 'longpress-overlay';
  var modal = document.createElement('div');
  modal.id = 'longpress-modal';
  var header = document.createElement('div');
  header.className = 'lp-header';
  header.innerHTML = '<span class="lp-ticker">' + ticker + '</span>' +
    (name ? '<span class="lp-name">' + name + '</span>' : '');
  modal.appendChild(header);
  options.forEach(function(opt) {
    modal.appendChild(_lpOption(opt.icon, opt.label, opt.variant, opt.action));
  });
  var cancel = document.createElement('div');
  cancel.className = 'lp-cancel';
  cancel.textContent = t('cancelar');
  cancel.addEventListener('click', window._closeLPSheet);
  modal.appendChild(cancel);
  overlay.appendChild(modal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) window._closeLPSheet();
  });
  document.body.appendChild(overlay);
};

// Helpers de acciones específicas

function _lpGetActivoMeta(sym) {
  var acts = window._IA_ACTIVOS || [];
  for (var i=0; i<acts.length; i++) if (acts[i].s === sym) return acts[i];
  return null;
}

window._lpAgregarFavorito = function(ticker) {
  try {
    var pins = JSON.parse(localStorage.getItem('aurex_pins') || '[]');
    if (pins.indexOf(ticker) >= 0) return;
    pins.push(ticker);
    localStorage.setItem('aurex_pins', JSON.stringify(pins));
    _refreshFavStars();
  } catch(e) { console.error('aurex_pins', e); }
};

window._lpCompartirPortfolio = function(ticker, item) {
  var prcs = window._pcPrices || {};
  var precio = prcs[ticker] || (item && item.precio_compra) || 0;
  var pnlPct = (item && item.precio_compra > 0) ? ((precio - item.precio_compra)/item.precio_compra*100) : 0;
  var emoji = pnlPct >= 0 ? '🚀' : '📉';
  var pctStr = (pnlPct >= 0 ? '+' : '') + pnlPct.toFixed(2) + '%';
  var precioStr = '$' + precio.toLocaleString(window._numLocale(), { minimumFractionDigits:2, maximumFractionDigits:2 });
  var texto = ticker + ' — ' + precioStr + ' | ' + pctStr + ' en mi portfolio ' + emoji + ' vía Cobrex\n\n' +
    'https://cobrex.io';
  if (navigator.share) {
    navigator.share({ title: 'Cobrex — ' + ticker, text: texto }).catch(function(){});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(texto);
    alert(t('mkt_copiado'));
  }
};

window._lpCompartirMercados = function(ticker) {
  var prcs = window._pcPrices || {};
  var precio = prcs[ticker];
  var precioStr = precio ? ' — $' + precio.toLocaleString(window._numLocale(), { minimumFractionDigits:2, maximumFractionDigits:2 }) : '';
  var texto = ticker + precioStr + ' | seguimiento en Cobrex\n\nhttps://cobrex.io';
  if (navigator.share) {
    navigator.share({ title: 'Cobrex — ' + ticker, text: texto }).catch(function(){});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(texto);
    alert(t('mkt_copiado'));
  }
};

window._lpQuitarFavorito = function(ticker) {
  try {
    var pins = JSON.parse(localStorage.getItem('aurex_pins') || '[]');
    var idx = pins.indexOf(ticker);
    if (idx < 0) return;
    pins.splice(idx, 1);
    localStorage.setItem('aurex_pins', JSON.stringify(pins));
    _refreshFavStars();
  } catch(e) { console.error('aurex_pins remove', e); }
};

function _isFavorito(ticker) {
  try { return (JSON.parse(localStorage.getItem('aurex_pins') || '[]')).indexOf(ticker) >= 0; } catch(e) { return false; }
}

// Mostrar/ocultar estrella entre logo y ticker (igual a nativa IMG_003)
// En nativa: [logo] ⭐AAPL  — la estrella es inline con el ticker, sin gap extra
function _refreshFavStars() {
  var pins;
  try { pins = JSON.parse(localStorage.getItem('aurex_pins') || '[]'); } catch(e) { pins = []; }
  document.querySelectorAll('#cnt .item-row').forEach(function(el) {
    var ticker = el.id.replace('row-', '');
    var nameCol = el.children[1]; // div flex-column con ticker + nombre
    if (!nameCol) return;
    var tickerSpan = nameCol.children[0]; // span con el texto del ticker
    if (!tickerSpan) return;
    var hasStar = tickerSpan.textContent.indexOf('⭐') >= 0;
    // Limpiar estrella DOM vieja si existe
    var oldStar = el.querySelector('.fav-star');
    if (oldStar) oldStar.remove();
    if (pins.indexOf(ticker) >= 0) {
      if (!hasStar) tickerSpan.textContent = '⭐' + tickerSpan.textContent;
    } else {
      if (hasStar) tickerSpan.textContent = tickerSpan.textContent.replace('⭐', '');
    }
  });
}

// Long press Mercados — réplica EXACTA de nativa MercadosScreen L1300-1363
// POP detalle de activo (TAP en Mercados / búsqueda / "Análisis IA" del menú) — paridad nativa MercadosScreen.js showSearchDetail (L944-1019)
window._closeMktDetail = function(){ var o=document.getElementById('mkt-detail-overlay'); if(o) o.remove(); };
window._mktShowDetailCard = function(act) {
  if(typeof act === 'string'){ var _tk=act, _l=window._IA_ACTIVOS||[]; act=null; for(var _i=0;_i<_l.length;_i++){ if(_l[_i].s===_tk){ act=_l[_i]; break; } } if(!act) act={s:_tk}; }
  if(!act || !act.s) return;
  window._closeMktDetail();
  var ticker = act.s, name = act.n || act.nombre || '', tipo = act.t || act.tipo || '';
  var sig = (typeof _getSignalForSym==='function') ? _getSignalForSym(ticker) : null;
  var precio = (sig && sig.precio) || (window._pcPrices && window._pcPrices[ticker]) || null;
  var pct24 = (sig && sig.precio24h>0 && precio) ? ((precio - sig.precio24h)/sig.precio24h*100)
            : (window._pcChange24 && window._pcChange24[ticker] !== undefined ? window._pcChange24[ticker] : null);
  var objetivo = sig && sig.objetivo;
  var dir = sig && sig.direccion;
  var dirColor = dir==='alcista'?'var(--green)':dir==='bajista'?'var(--red)':dir==='alta_conf'?'var(--gold)':'var(--textSec)';
  var dirLabel = dir==='alcista'?t('ia_w_alcista'):dir==='bajista'?t('ia_w_bajista'):dir==='alta_conf'?t('ia_w_altaconf'):'--';
  var prob = sig && (sig.confianza || sig.prob_principal);
  var isFav = _isFavorito(ticker);
  var _logoSrc = act.logo || ((typeof _getMktLogo==='function') ? _getMktLogo(act, act.tab) : '');
  var _ini = (ticker[0]||'?');
  var logoHtml = _logoSrc
    ? '<img src="'+_logoSrc+'" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;" onerror="this.outerHTML=\'<div style=&quot;width:40px;height:40px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff&quot;>'+_ini+'</div>\'"/>'
    : '<div style="width:40px;height:40px;border-radius:50%;background:'+(act.color||'var(--border)')+';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff">'+_ini+'</div>';
  var boxCss='flex:1;background:var(--bg);border-radius:10px;padding:10px;text-align:center;', lblCss='font-size:9px;color:var(--textSec);margin-bottom:4px;', valCss='font-size:16px;font-weight:700;';
  var ov = document.createElement('div');
  ov.id = 'mkt-detail-overlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:20px;-webkit-tap-highlight-color:rgba(0,0,0,0);';
  var h = '<div style="background:var(--card);border:1px solid var(--border2);border-radius:20px;width:100%;max-width:320px;padding:16px;box-sizing:border-box;">';
  h += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">'+logoHtml+'<div style="flex:1;min-width:0;"><div style="font-size:18px;font-weight:700;color:var(--text);">'+ticker+'</div><div style="font-size:12px;color:var(--textSec);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+(name?name:ticker)+(tipo?' · '+tipo:'')+'</div></div><div id="mkt-det-x" style="font-size:22px;color:var(--textSec);cursor:pointer;padding:0 4px;">✕</div></div>';
  h += '<div style="display:flex;gap:10px;margin-bottom:14px;">';
  h += '<div style="'+boxCss+'"><div style="'+lblCss+'">'+t('precio_row')+'</div><div style="'+valCss+'color:var(--text);">'+(precio?_fmt(precio,'precio'):'--')+'</div></div>';
  h += '<div style="'+boxCss+'"><div style="'+lblCss+'">24h</div><div style="'+valCss+'color:'+(pct24!=null&&pct24>=0?'var(--green)':'var(--red)')+';">'+(pct24!=null?_fmt(pct24,'pct'):'--')+'</div></div>';
  h += '<div style="'+boxCss+'"><div style="'+lblCss+'">'+t('mkt_lp_objetivo_ia')+'</div><div style="'+valCss+'color:var(--gold);">'+(objetivo?_fmt(objetivo,'precio'):'--')+'</div></div>';
  h += '</div>';
  h += '<div style="display:flex;gap:10px;margin-bottom:16px;"><div style="'+boxCss+'"><div style="'+lblCss+'">'+t('senal_ia_row')+'</div><div style="'+valCss+'color:'+dirColor+';">'+dirLabel+(prob?' '+prob+'%':'')+'</div></div></div>';
  h += '<div id="mkt-det-fav" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:10px;background:'+(isFav?'var(--gold)':'var(--goldBg)')+';border:1px solid var(--gold);cursor:pointer;margin-bottom:8px;"><span style="font-size:16px;">'+(isFav?'★':'☆')+'</span><span style="font-size:13px;font-weight:700;color:'+(isFav?'#000':'var(--gold)')+';">'+(isFav?t('mkt_lp_quitar_fav').replace('★ ',''):t('mkt_lp_agregar_fav').replace('★ ',''))+'</span></div>';
  h += '<div id="mkt-det-port" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:10px;background:#3B82F618;border:1px solid #3B82F680;cursor:pointer;margin-bottom:8px;"><span style="font-size:16px;">💼</span><span style="font-size:13px;font-weight:700;color:#3B82F6;">'+t('mkt_lp_agregar_portfolio')+'</span></div>';
  h += '<div id="mkt-det-close" style="padding:11px;border-radius:10px;border:1px solid var(--border2);text-align:center;cursor:pointer;"><span style="font-size:12px;font-weight:600;color:var(--textSec);">'+t('mkt_lp_cerrar')+'</span></div>';
  h += '</div>';
  ov.innerHTML = h;
  ov.addEventListener('click', function(e){ if(e.target===ov) window._closeMktDetail(); });
  document.body.appendChild(ov);
  document.getElementById('mkt-det-x').addEventListener('click', window._closeMktDetail);
  document.getElementById('mkt-det-close').addEventListener('click', window._closeMktDetail);
  document.getElementById('mkt-det-fav').addEventListener('click', function(){ if(isFav){ if(window._lpQuitarFavorito) window._lpQuitarFavorito(ticker); } else { if(window._lpAgregarFavorito) window._lpAgregarFavorito(ticker); } window._closeMktDetail(); });
  document.getElementById('mkt-det-port').addEventListener('click', function(){ window._closeMktDetail(); setTimeout(function(){ if(window.openPortModal) window.openPortModal(ticker); }, 50); });
};

window._showMercadosLPSheet = function(ticker, meta) {
  window._closeLPSheet();
  // Protección: si ticker es objeto, extraer .s
  if(typeof ticker === 'object' && ticker !== null) { meta = ticker; ticker = ticker.s || ''; }
  var name = meta ? (meta.n || meta.nombre || '') : '';
  var isFav = _isFavorito(ticker);

  var overlay = document.createElement('div');
  overlay.id = 'longpress-overlay';
  var modal = document.createElement('div');
  modal.id = 'longpress-modal';

  // Header: ticker + nombre centrado con separador (nativa L1309-1312)
  var header = document.createElement('div');
  header.style.cssText = 'text-align:center;padding:6px 0 10px;border-bottom:0.5px solid var(--border);margin-bottom:8px;';
  header.innerHTML = '<div style="font-size:14px;font-weight:800;color:var(--text);">'+ticker+'</div>' +
    (name && name !== ticker ? '<div style="font-size:10px;color:var(--textSec);margin-top:1px;">'+name+'</div>' : '');
  modal.appendChild(header);

  // 1. 📊 Análisis IA completo — nativa: gold15 bg + 1px gold border
  var analisisBtn = document.createElement('div');
  analisisBtn.style.cssText = 'display:flex;align-items:center;padding:10px 12px;border-radius:10px;background:rgba(212,160,23,0.08);border:1px solid var(--gold);margin-bottom:6px;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);';
  analisisBtn.innerHTML = '<span style="font-size:16px;margin-right:8px;">📊</span><span style="flex:1;font-size:13px;font-weight:700;color:var(--gold);">'+t('port_lp_analisis')+'</span>';
  analisisBtn.addEventListener('click', function() {
    window._closeLPSheet();
    var acts = window._IA_ACTIVOS || [];
    var act = null;
    for(var i=0;i<acts.length;i++){ if(acts[i].s===ticker){ act=acts[i]; break; } }
    if(!act) act = (meta && typeof meta==='object') ? meta : {s:ticker, n:name, tipo:'accion'};
    if(window._mktShowDetailCard) window._mktShowDetailCard(act);
  });
  modal.appendChild(analisisBtn);

  // 2. ⭐/☆ Favoritos — nativa: C.bg background
  var favBtn = document.createElement('div');
  favBtn.style.cssText = 'display:flex;align-items:center;padding:10px 12px;border-radius:10px;background:var(--bg);margin-bottom:6px;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);';
  favBtn.innerHTML = '<span style="font-size:15px;margin-right:8px;">'+(isFav?'⭐':'☆')+'</span><span style="flex:1;font-size:13px;font-weight:600;color:var(--text);">'+(isFav?t('mkt_lp_quitar_fav').replace('★ ',''):t('mkt_lp_agregar_fav').replace('★ ',''))+'</span>';
  favBtn.addEventListener('click', function() {
    window._closeLPSheet();
    if(isFav) window._lpQuitarFavorito(ticker);
    else window._lpAgregarFavorito(ticker);
  });
  modal.appendChild(favBtn);

  // 3. 💼 Agregar a Portfolio — nativa: C.bg background
  var portBtn = document.createElement('div');
  portBtn.style.cssText = 'display:flex;align-items:center;padding:10px 12px;border-radius:10px;background:var(--bg);margin-bottom:6px;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);';
  portBtn.innerHTML = '<span style="font-size:15px;margin-right:8px;">💼</span><span style="flex:1;font-size:13px;font-weight:600;color:var(--text);">'+t('mkt_lp_agregar_portfolio')+'</span>';
  portBtn.addEventListener('click', function() {
    window._closeLPSheet();
    setTimeout(function(){ if(window.openPortModal) window.openPortModal(ticker); }, 50);
  });
  modal.appendChild(portBtn);

  // 4. 📤 Compartir — nativa: C.bg background, marginBottom:8
  var shareBtn = document.createElement('div');
  shareBtn.style.cssText = 'display:flex;align-items:center;padding:10px 12px;border-radius:10px;background:var(--bg);margin-bottom:8px;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);';
  shareBtn.innerHTML = '<span style="font-size:15px;margin-right:8px;">📤</span><span style="flex:1;font-size:13px;font-weight:600;color:var(--text);">'+t('port_compartir')+'</span>';
  shareBtn.addEventListener('click', function() {
    var msg = ticker + ' \u2014 ' + (name||'') + '\nv\u00EDa Cobrex \u2014 cobrex.io';
    if(navigator.share) {
      navigator.share({text:msg}).catch(function(){});
    } else {
      navigator.clipboard.writeText(msg).then(function(){ alert(t('mkt_copiado')); }).catch(function(){});
    }
    window._closeLPSheet();
  });
  modal.appendChild(shareBtn);

  // 5. Cancelar — nativa: border only, no bg, centered
  var cancel = document.createElement('div');
  cancel.style.cssText = 'padding:9px;border-radius:10px;border:1px solid var(--border2);text-align:center;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);';
  cancel.innerHTML = '<span style="font-size:12px;font-weight:600;color:var(--textSec);">'+t('cancelar')+'</span>';
  cancel.addEventListener('click', window._closeLPSheet);
  modal.appendChild(cancel);

  overlay.appendChild(modal);
  overlay.addEventListener('click', function(e) {
    if(e.target === overlay) window._closeLPSheet();
  });
  document.body.appendChild(overlay);
};

// Editar posición — abre modal mínimo de edición de cantidad y precio
window._lpEditarPortItem = function(itemId) {
  var items = window._portItems || [];
  var item = null;
  for (var i=0; i<items.length; i++) if (items[i].id === itemId) { item = items[i]; break; }
  if (!item) { alert(t('port_item_not_found')); return; }
  // Modal inline para edit
  var existing = document.getElementById('lp-edit-modal'); if (existing) existing.remove();
  var ov = document.createElement('div');
  ov.id = 'lp-edit-modal';
  ov.style.cssText = 'position:fixed;inset:0;z-index:2100;background:rgba(0,0,0,0.5);' +
    'display:flex;align-items:center;justify-content:center;padding:20px;';
  ov.innerHTML =
    '<div style="background:var(--card);border-radius:16px;padding:18px;width:100%;max-width:320px;">' +
      '<div style="font-size:16px;font-weight:700;color:var(--text);text-align:center;margin-bottom:14px;">' +
        t('port_editar_title') + ' ' + item.simbolo + '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:12px;">' +
        '<div style="flex:1;"><div style="font-size:10px;color:var(--textDim);margin-bottom:4px;">'+t('port_cantidad_label')+'</div>' +
        '<input id="lp-edit-qty" type="number" step="any" min="0" value="' + item.cantidad + '" ' +
        'style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border2);' +
        'border-radius:8px;padding:9px 11px;color:var(--text);font-size:14px;outline:none;"/></div>' +
        '<div style="flex:1;"><div style="font-size:10px;color:var(--textDim);margin-bottom:4px;">'+t('port_precio_compra_short')+'</div>' +
        '<input id="lp-edit-price" type="number" step="any" min="0" value="' + item.precio_compra + '" ' +
        'style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border2);' +
        'border-radius:8px;padding:9px 11px;color:var(--text);font-size:14px;outline:none;"/></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;">' +
        '<div id="lp-edit-cancel" style="flex:1;text-align:center;padding:11px;border-radius:9px;' +
        'background:var(--border);color:var(--text);font-size:13px;font-weight:600;cursor:pointer;">'+t('cancelar')+'</div>' +
        '<div id="lp-edit-save" style="flex:1;text-align:center;padding:11px;border-radius:9px;' +
        'background:var(--green);color:var(--bg);font-size:13px;font-weight:700;cursor:pointer;">'+t('guardar')+'</div>' +
      '</div>' +
    '</div>';
  ov.addEventListener('click', function(e) { if (e.target === ov) ov.remove(); });
  document.body.appendChild(ov);
  document.getElementById('lp-edit-cancel').addEventListener('click', function(){ ov.remove(); });
  document.getElementById('lp-edit-save').addEventListener('click', function() {
    var q = parseFloat(document.getElementById('lp-edit-qty').value);
    var p = parseFloat(document.getElementById('lp-edit-price').value);
    if (!q || q <= 0 || !p || p <= 0) { alert(t('port_err_edit_values')); return; }
    item.cantidad = q;
    item.precio_compra = p;
    // Persistir si hay backend, sino localStorage
    try { localStorage.setItem('aurex_port_items', JSON.stringify(items)); } catch(_){}
    if (typeof window._renderPortfolioItems === 'function') window._renderPortfolioItems(items);
    if (typeof window._updateTotals === 'function') window._updateTotals(items);
    ov.remove();
  });
};

// Attach por tab — idempotente

function _attachAllPortfolioLP() {
  document.querySelectorAll('[id^="port-row-"]').forEach(function(el) {
    if (el._lpAttached) return;
    var uuid = el.id.replace('port-row-', '');
    var items = window._portItems || [];
    var item = null;
    for (var i=0; i<items.length; i++) if (items[i].id === uuid) { item = items[i]; break; }
    var ticker = item ? item.simbolo : uuid;
    var meta = _lpGetActivoMeta(ticker);
    var name = item ? (item.nombre || (meta ? meta.n : '')) : '';
    _attachLongPress(el, function() {
      window._showLPSheet(ticker, name, [
        { icon:'📊', label:t('port_lp_analisis'), variant:'primary',
          action: function(){ if (window.openPortItemDetail) window.openPortItemDetail(uuid); } },
        { icon:'✏️', label:t('port_lp_editar'),
          action: function(){ window._lpEditarPortItem(uuid); } },
        { icon:'📤', label:t('port_lp_compartir'),
          action: function(){ window._lpCompartirPortfolio(ticker, item); } },
        { icon:'🗑',  label:t('port_lp_confirmar_eliminar'), variant:'destructive',
          action: function(){
            if (confirm(t('port_lp_confirmar_eliminar') + ' ' + ticker + '?')) { if (window.deletePortfolioItem) window.deletePortfolioItem(uuid); }
          } }
      ]);
    });
  });
}

function _attachAllMercadosLP() {
  document.querySelectorAll('#cnt .item-row').forEach(function(el) {
    if (el._lpAttached) return;
    var ticker = el.id.replace('row-', '');
    var meta = _lpGetActivoMeta(ticker);
    _attachLongPress(el, function() {
      window._showMercadosLPSheet(ticker, meta);
    });
  });
}

function _attachAllWatchlistLP() {
  document.querySelectorAll('#watch-cnt > div[onclick^="wlOpenDetail"]').forEach(function(el) {
    if (el._lpAttached) return;
    var m = (el.getAttribute('onclick') || '').match(/wlOpenDetail\('([^']+)'\)/);
    var ticker = m ? m[1] : null;
    if (!ticker) return;
    var meta = _lpGetActivoMeta(ticker);
    var name = meta ? meta.n : '';
    _attachLongPress(el, function() {
      window._showLPSheet(ticker, name, [
        { icon:'📊', label:t('lp_analisis_ia'), variant:'primary',
          action: function(){ if (window.wlOpenDetail) window.wlOpenDetail(ticker); } },
        { icon:'🤝', label:t('wl_compartir_senal'),
          action: function(){ if (window._compartirSenal) window._compartirSenal(ticker); } },
        { icon:'🗑',  label:t('lp_quitar_lista'), variant:'destructive',
          action: function(){
            if (confirm(t('lp_quitar_confirm').replace('{x}', ticker))) { if (window.wlRemoveAsset) window.wlRemoveAsset(ticker); }
          } }
      ]);
    });
  });
}

window._initLongPressActions = function() {
  _attachAllPortfolioLP();
  _attachAllMercadosLP();
  _attachAllWatchlistLP();
  _refreshFavStars();
  // IA: NO long press (la nativa no lo tiene, solo click normal)
  function obs(containerId, fn) {
    var c = document.getElementById(containerId);
    if (!c || c._lpObsAdded) return;
    c._lpObsAdded = true;
    new MutationObserver(function(){ fn(); }).observe(c, { childList: true, subtree: false });
  }
  obs('port-cnt', _attachAllPortfolioLP);
  obs('cnt', function(){ _attachAllMercadosLP(); _refreshFavStars(); });
  obs('watch-cnt', _attachAllWatchlistLP);
};

// === Modal Idioma (igual a nativa IMG_1772) ===
window._openIdiomaModal = function() {
  var existing = document.getElementById('idioma-modal-overlay');
  if (existing) existing.remove();
  var currentLang = localStorage.getItem('aurex_lang') || 'es';
  var langs = [
    { code: 'es', flag: '🇪🇸', name: 'Español', soon: false },
    { code: 'en', flag: '🇺🇸', name: 'English', soon: false },
    { code: 'pt', flag: '🇧🇷', name: 'Português', soon: false },
    { code: 'zh', flag: '🇨🇳', name: '中文', soon: false },
    { code: 'fr', flag: '🇫🇷', name: 'Français', soon: false },
    { code: 'it', flag: '🇮🇹', name: 'Italiano', soon: false },
    { code: 'hi', flag: '🇮🇳', name: 'हिन्दी', soon: false },
    { code: 'ar', flag: '🇦🇪', name: 'العربية', soon: false }
  ];
  var rows = langs.map(function(l) {
    var selected = l.code === currentLang;
    var check = selected ? '<span style="color:#22c55e;font-size:16px;font-weight:700;">✓</span>' : '';
    var soonTag = l.soon ? ' <span style="color:#999;font-size:11px;">· SOON</span>' : '';
    var textColor = l.soon ? '#999' : '#222';
    return '<div onclick="' + (l.soon ? '' : "window._setIdioma('" + l.code + "')") + '" style="display:flex;align-items:center;justify-content:space-between;padding:14px 4px;border-bottom:1px solid #eee;cursor:' + (l.soon ? 'default' : 'pointer') + ';">' +
      '<span style="font-size:14px;color:' + textColor + ';">' + l.flag + ' ' + l.name + soonTag + '</span>' +
      check +
    '</div>';
  }).join('');
  var ov = document.createElement('div');
  ov.id = 'idioma-modal-overlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:20px;';
  ov.onclick = function(e) { if (e.target === ov) ov.remove(); };
  ov.innerHTML =
    '<div style="background:var(--card);border:3px solid var(--gold);border-radius:16px;padding:20px;width:100%;max-width:300px;">' +
      '<div style="text-align:center;font-size:16px;font-weight:700;color:#111;margin-bottom:14px;">'+t('idioma_label')+'</div>' +
      rows +
      '<div onclick="document.getElementById(\'idioma-modal-overlay\').remove()" style="margin-top:14px;text-align:center;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:14px;font-weight:600;color:var(--text);cursor:pointer;">'+t('cancelar')+'</div>' +
    '</div>';
  document.body.appendChild(ov);
};

window._setIdioma = function(code) {
  if (window._i18n) window._i18n.setLang(code);
  else localStorage.setItem('aurex_lang', code);
  var ov = document.getElementById('idioma-modal-overlay');
  if (ov) ov.remove();
  var flags = { es: '🇪🇸', en: '🇺🇸', pt: '🇧🇷', zh: '🇨🇳', fr: '🇫🇷', it: '🇮🇹', hi: '🇮🇳', ar: '🇸🇦' };
  var flagEl = document.getElementById('lang-flag');
  if (flagEl) flagEl.textContent = flags[code] || '🇪🇸';
};

// === LIVE refresh timer (punto 14) ===
window._liveLastFetch = Date.now();
(function _initLiveTimer() {
  function updateLiveTime() {
    var diff = Math.floor((Date.now() - (window._liveLastFetch || Date.now())) / 1000);
    var txt = diff < 60 ? t('mkt_live_hace_s') + diff + 's' : t('mkt_live_hace_s') + Math.floor(diff / 60) + t('mkt_live_hace_min');
    var el = document.getElementById('liveTime');
    if (el) el.textContent = txt;
    var el2 = document.getElementById('liveTimePort');
    if (el2) el2.textContent = txt;
  }
  setInterval(updateLiveTime, 10000);
  updateLiveTime();
})();

// === Inyección por tab (sort menus) ===

window._initSortMenus = function() { try {
  // PORTFOLIO
  if (!document.getElementById('portfolio-sort-wrap')) {
    var portCnt = document.getElementById('port-cnt');
    if (portCnt && portCnt.parentElement) {
      var pw = document.createElement('div');
      pw.style.cssText = 'display:flex;justify-content:flex-end;padding:6px 14px 2px;';
      pw.appendChild(_buildSortBtn('portfolio', function(k){ try { window._applyPortfolioSort(k); } catch(e){ console.error('sort port', e); } }));
      portCnt.parentElement.insertBefore(pw, portCnt);
      // No aplicar sort al init — solo cuando usuario selecciona opción
    }
  }

  // MERCADOS — entre .tabs y #cnt
  if (!document.getElementById('mercados-sort-wrap')) {
    var tabs = document.querySelector('#screen-mercados .tabs');
    var mktCnt = document.getElementById('cnt');
    if (tabs && mktCnt && tabs.parentElement) {
      var mw = document.createElement('div');
      mw.id = 'mercados-sort-wrap';
      mw.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:4px 14px 2px;gap:8px;';
      // ★ Solo favoritos — chip a la IZQUIERDA, misma fila que Ordenar (decisión Fernando: separado de los filtros de tipo de activo, que son otra cosa).
      var favChip = document.createElement('div');
      favChip.id = 'only-favs-chip'; favChip.onclick = window.toggleOnlyFavs;
      favChip.style.cssText = 'display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border-radius:8px;border:1px solid var(--border2);background:var(--card);color:var(--text);font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;-webkit-tap-highlight-color:rgba(0,0,0,0)';
      favChip.innerHTML = '⭐ <span>'+(window.t?window.t('solo_favoritos'):'Solo favoritos')+'</span>';
      mw.appendChild(favChip);
      mw.appendChild(_buildSortBtn('mercados', function(k){ try { window._applyMercadosSort(k); } catch(e){ console.error('sort mkt', e); } }));
      tabs.parentElement.insertBefore(mw, mktCnt);
      // re-aplicar el filtro de favoritos cuando se agregan filas nuevas a la lista
      if (!window._favObserver) { window._favObserver = new MutationObserver(function(){ if (window._onlyFavs && window._applyOnlyFavs) window._applyOnlyFavs(); }); window._favObserver.observe(mktCnt, { childList:true }); }
    }
  }

  // IA — sort inline ya está en HTML (ia-sort-inline), no inyectar segundo

  // WATCHLIST — MutationObserver
  var wc = document.getElementById('watch-cnt');
  if (wc && !wc._sortObserverAdded) {
    var inject = function() {
      if (!wc || wc.children.length < 2) return;
      if (document.getElementById('watchlist-sort-wrap')) return;
      var ww = document.createElement('div');
      ww.id = 'wl-sort-bar';
      ww.style.cssText = 'display:flex;justify-content:flex-end;padding:4px 14px 2px;';
      ww.appendChild(_buildSortBtn('watchlist', function(k){ try { window._applyWatchlistSort(k); } catch(e){ console.error('sort wl', e); } }));
      var anchor = wc.children[2] || null;
      if (anchor) wc.insertBefore(ww, anchor);
      else wc.appendChild(ww);
    };
    var obs = new MutationObserver(function() {
      // re-inyectar si se borró
      if (!document.getElementById('watchlist-sort-wrap')) inject();
    });
    obs.observe(wc, { childList: true });
    wc._sortObserverAdded = true;
    inject(); // intento inicial
  }
} catch(e) { console.error('_initSortMenus error:', e); } };

// ── M5: bloque "Cómo usar Cobrex" en Perfil (réplica de ComoUsarAurexBlock nativo) ──
window._COMOUSAR_TABS = [
  {icon:'💼',nameKey:'portfolio',items:[['➕','cu_portafolio_1'],['💰','cu_portafolio_2'],['⏱️','cu_portafolio_3'],['🌡️','cu_portafolio_4'],['👆','cu_portafolio_5'],['🔔','cu_portafolio_6'],['✋','cu_portafolio_7'],['📤','cu_portafolio_8'],['💱','cu_portafolio_9']]},
  {icon:'📊',nameKey:'mercados',items:[['🗂️','cu_mercados_1'],['🌍','cu_mercados_2'],['⏱️','cu_mercados_3'],['🔍','cu_mercados_4'],['👆','cu_mercados_5'],['✋','cu_mercados_6'],['💓','cu_mercados_7']]},
  {icon:'👀',nameKey:'watchlist',items:[['➕','cu_watchlist_1'],['⭐','cu_watchlist_2'],['➕','cu_watchlist_3'],['⚖️','cu_watchlist_4'],['📤','cu_watchlist_5'],['👆','cu_watchlist_6'],['✋','cu_watchlist_7']]},
  {icon:'🤖',nameKey:'ia',items:[['📋','cu_ia_1'],['🔀','cu_ia_2'],['💼','cu_ia_3'],['👆','cu_ia_4'],['📤','cu_ia_5']]},
  {icon:'🔔',nameKey:'alertas',items:[['📡','cu_alertas_1'],['🗂️','cu_alertas_2'],['🤖','cu_alertas_3'],['💓','cu_alertas_4'],['💰','cu_alertas_5'],['📅','cu_alertas_6'],['📋','cu_alertas_7']]},
  {icon:'👤',nameKey:'perfil',items:[['🌙','cu_perfil_1'],['🌐','cu_perfil_2'],['🔒','cu_perfil_3'],['📩','cu_perfil_4'],['💬','cu_perfil_5'],['🚪','cu_perfil_6']]},
  {icon:'⭐',nameKey:'plan_actual',items:[['🆓','plan_free_f1'],['🆓','plan_free_f2'],['🆓','plan_free_f8'],['🚀','plan_pro_f1'],['🚀','plan_pro_f2'],['🚀','plan_pro_f6'],['🚀','plan_pro_f3'],['👑','plan_elite_f2'],['👑','plan_elite_f3'],['👑','plan_elite_f4'],['👑','plan_elite_f5']]}
];
window._renderComoUsar = function(){
  var body=document.getElementById('comousar-body'); if(!body) return;
  var t=window.t||function(k){return k;};
  var h='<div style="font-size:12px;color:var(--textSec);margin-bottom:12px;line-height:1.5">'+t('como_usar_titulo')+'</div>';
  window._COMOUSAR_TABS.forEach(function(tab){
    h+='<div style="margin-bottom:8px">'+
       '<div class="cu-head" onclick="window._cuToggle(this)" style="background:var(--border);border:1px solid var(--border);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;cursor:pointer">'+
         '<span style="font-size:18px">'+tab.icon+'</span>'+
         '<span class="cu-name" style="flex:1;font-size:13px;font-weight:700;color:var(--text)">'+t(tab.nameKey)+'</span>'+
         '<span class="cu-chev" style="font-size:13px;color:var(--textSec)">▼</span>'+
       '</div>'+
       '<div class="cu-items" style="display:none;background:var(--card);border:1px solid var(--gold);border-radius:10px;margin-left:8px;margin-top:4px;padding:12px">'+
         tab.items.map(function(it){return '<div style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start"><span style="font-size:14px;margin-top:1px">'+it[0]+'</span><span style="flex:1;font-size:12px;color:var(--text);line-height:1.5">'+t(it[1])+'</span></div>';}).join('')+
       '</div>'+
     '</div>';
  });
  body.innerHTML=h;
};
window._cuToggle = function(el){
  var cont=el.parentNode.parentNode; var items=el.nextElementSibling; var open=items.style.display!=='none';
  // acordeón: uno abierto a la vez (igual a la nativa, openTab único)
  cont.querySelectorAll('.cu-items').forEach(function(x){x.style.display='none';});
  cont.querySelectorAll('.cu-head').forEach(function(x){x.style.background='var(--border)';x.style.borderColor='var(--border)';});
  cont.querySelectorAll('.cu-name').forEach(function(x){x.style.color='var(--text)';});
  cont.querySelectorAll('.cu-chev').forEach(function(x){x.textContent='▼';x.style.color='var(--textSec)';});
  if(!open){
    items.style.display='block';
    el.style.background='rgba(212,160,23,0.10)'; el.style.borderColor='var(--gold)';
    el.querySelector('.cu-name').style.color='var(--gold)';
    var ch=el.querySelector('.cu-chev'); ch.textContent='▲'; ch.style.color='var(--gold)';
  }
};
if (window._i18n && window._i18n.onLangChange) window._i18n.onLangChange(function(){ if(document.getElementById('comousar-body')) window._renderComoUsar(); });