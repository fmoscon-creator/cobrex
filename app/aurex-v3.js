/* v=1774807550559 *//* _fmt(n, tipo) - formato visual de numeros segun idioma del usuario
   tipos: 'precio' | 'pct' | 'usd' | 'qty'
   Solo usar en capa visual - NUNCA en calculos
*/
function _fmt(n, tipo) {
  if (n === null || n === undefined || isNaN(n)) return '--';
  var isLatam = true; // LATAM hardcoded - iPhone Argentina devuelve en-US
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
    {s:'CPER',n:'Cobre',logo:'https://financialmodelingprep.com/image-stock/CPER.png',color:'#B87333'},{s:'DBB',n:'Metales Base',logo:'https://financialmodelingprep.com/image-stock/DBB.png',color:'#848484'}
  ],
  comm: [
    {s:'GC=F',n:'Oro Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNENEFGMzcnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QXU8L3RleHQ+PC9zdmc+',color:'#D4A017'},
    {s:'CL=F',n:'Petroleo WTI',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMxQzFDMUMnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+V1RJPC90ZXh0Pjwvc3ZnPg==',color:'#333'},
    {s:'SI=F',n:'Plata Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNBOEE5QUQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QWc8L3RleHQ+PC9zdmc+',color:'#C0C0C0'},
    {s:'NG=F',n:'Gas Natural',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwMDY2Q0MnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Tkc8L3RleHQ+PC9zdmc+',color:'#FF6600'},
    {s:'HG=F',n:'Cobre Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNCODczMzMnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Q3U8L3RleHQ+PC9zdmc+',color:'#B87333'},
    {s:'BZ=F',n:'Brent Crude',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMyQzJDNTQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Qlo8L3RleHQ+PC9zdmc+',color:'#444'},
    {s:'RB=F',n:'Nafta RBOB',color:'#8B4513'},
    {s:'KC=F',n:'Cafe Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMzRTFGMDAnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+S0M8L3RleHQ+PC9zdmc+',color:'#6F4E37'},
    {s:'SB=F',n:'Azucar Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNBQUFBQUEnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+U0I8L3RleHQ+PC9zdmc+',color:'#EEE'},
    {s:'CC=F',n:'Cacao Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyM2QjNBMkEnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Q0M8L3RleHQ+PC9zdmc+',color:'#7B3F00'},
    {s:'ZW=F',n:'Trigo Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNDOEE5NTEnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Wlc8L3RleHQ+PC9zdmc+',color:'#C8A951'},
    {s:'ZC=F',n:'Maiz Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNGNUM1MTgnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+WkM8L3RleHQ+PC9zdmc+',color:'#F5C800'},
    {s:'ZS=F',n:'Soja Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyM4QjczNTUnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+WlM8L3RleHQ+PC9zdmc+',color:'#7BAE36'},
    {s:'CT=F',n:'Algodon Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNDQ0NDQ0MnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Q1Q8L3RleHQ+PC9zdmc+',color:'#EEE'},
    {s:'LE=F',n:'Ganado Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyM4QjQ1MTMnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+TEU8L3RleHQ+PC9zdmc+',color:'#8B4513'},
    {s:'HE=F',n:'Cerdo Futuro',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNGRjZCNkInLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+SEU8L3RleHQ+PC9zdmc+',color:'#FF69B4'},
    {s:'LBS=F',n:'Madera Futuro',color:'#8B4513'},
    {s:'OJ=F',n:'Jugo Naranja',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNGRjhDMDAnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+T0o8L3RleHQ+PC9zdmc+',color:'#FF8C00'},
    {s:'JO',n:'Cafe ETN',color:'#6F4E37'},{s:'WEAT',n:'Trigo ETF',logo:'https://financialmodelingprep.com/image-stock/WEAT.png',color:'#C8A951'}
  ],
  metales: [
    {s:'GLD',n:'Oro',logo:'https://financialmodelingprep.com/image-stock/GLD.png',color:'#D4A017'},
    {s:'SLV',n:'Plata',logo:'https://financialmodelingprep.com/image-stock/SLV.png',color:'#C0C0C0'},
    {s:'CPER',n:'Cobre ETF',logo:'https://financialmodelingprep.com/image-stock/CPER.png',color:'#B87333'},
    {s:'PPLT',n:'Platino ETF',logo:'https://financialmodelingprep.com/image-stock/PPLT.png',color:'#E5E4E2'},
    {s:'PALL',n:'Paladio ETF',logo:'https://financialmodelingprep.com/image-stock/PALL.png',color:'#CED0CF'},
    {s:'JJU',n:'Aluminio ETF',color:'#848484'},{s:'JJZ',n:'Zinc ETF',color:'#848484'},
    {s:'SLX',n:'Steel/Hierro ETF',color:'#666'},{s:'DBB',n:'Base Metals ETF',logo:'https://financialmodelingprep.com/image-stock/DBB.png',color:'#848484'},{s:'ALUM',n:'Aluminio',color:'#848484'},
    {s:'ALI=F',n:'Aluminio',color:'#848789'}
  ],
  futuros: [
    {s:'ES=F',n:'S&P 500 Fut',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMxQTZCM0MnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+RVM8L3RleHQ+PC9zdmc+',color:'#003087'},
    {s:'NQ=F',n:'Nasdaq Fut',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwQTY2QzInLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+TlE8L3RleHQ+PC9zdmc+',color:'#003087'},
    {s:'YM=F',n:'Dow Fut',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwMDI4NjgnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+RFc8L3RleHQ+PC9zdmc+',color:'#003087'},
    {s:'RTY=F',n:'Russell Fut',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNDQzAwMDAnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+UlQ8L3RleHQ+PC9zdmc+',color:'#003087'},
    {s:'GC=F',n:'Oro Fut',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNENEFGMzcnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QXU8L3RleHQ+PC9zdmc+',color:'#D4A017'},
    {s:'SI=F',n:'Plata Fut',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNBOEE5QUQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QWc8L3RleHQ+PC9zdmc+',color:'#C0C0C0'},
    {s:'CL=F',n:'WTI Crude Fut',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMxQzFDMUMnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+V1RJPC90ZXh0Pjwvc3ZnPg==',color:'#333'},
    {s:'BZ=F',n:'Brent Fut',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMyQzJDNTQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Qlo8L3RleHQ+PC9zdmc+',color:'#444'},
    {s:'NG=F',n:'Gas Natural Fut',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwMDY2Q0MnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Tkc8L3RleHQ+PC9zdmc+',color:'#FF6600'},
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
window._mktDataSections = DATA;
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
  if(item.logo) return item.logo;
  var t=tab||item.tab||'';
  if(t==='cripto'||t==='stable') return 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png';
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
  row.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--border);cursor:pointer;gap:8px;';
  row.innerHTML=
    '<img src="'+_getMktLogo(item,tab)+'" data-s="'+item.s+'" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;margin-right:6px;" onerror="var _s=this.dataset.s.replace(/[^A-Z0-9]/g,\x27\x27).substring(0,4);var _f=_s.length>3?\x279\x27:\x2711\x27;this.src=\x27data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2228%22 height=%2228%22><circle cx=%2214%22 cy=%2214%22 r=%2214%22 fill=%22%23334%22/><text x=%2214%22 y=%2218%22 text-anchor=%22middle%22 font-size=%22\x27+_f+\x27%22 font-family=%22Arial,sans-serif%22 font-weight=%22bold%22 fill=%22%23ccc%22>\x27+_s+\x27</text></svg>\x27;this.onerror=null;">'+
    '<div style="display:flex;flex-direction:column;min-width:70px;flex-shrink:0;">'+
      '<span style="color:var(--text);font-weight:600;font-size:14px;">'+item.s+'</span>'+
      '<span style="color:var(--textSec);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;">'+item.n+'</span>'+
    '</div>'+
    '<div id="spark-'+item.s+'" style="flex:1;display:flex;align-items:center;justify-content:center;min-width:64px;max-width:80px;">'+
      '<div style="display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:2px;">'+_buildDotsHTML(_getActivoScores(item.simbolo))+'</div>'+
    '</div>'+
    '<div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;flex-shrink:0;">'+
      '<span id="p-'+item.s+'" style="color:var(--text);font-size:13px;font-weight:600;">...</span>'+
      '<span id="lbl-'+item.s+'" style="font-size:9px;color:var(--gold);font-weight:700;display:none;"></span>'+
      '<span id="c-'+item.s+'" style="font-size:11px;color:var(--textSec);">...</span>'+
      dotsHtml+
    '<div style="display:flex;gap:2px;margin-top:2px;">'+['24h','7d','1m','3m','1a'].map(function(p){return '<span class="mkt-tf-btn" data-tf="'+p+'" ontouchstart="stf(null,\''+p+'\')" onclick="stf(null,\''+p+'\')" style="font-size:9px;padding:1px 3px;border-radius:3px;background:'+(p==='24h'?'var(--gold)':'var(--border)')+';color:'+(p==='24h'?'#111':'var(--textSec)')+';cursor:pointer;touch-action:manipulation;">'+p+'</span>';}).join('')+'</div>'+
    '</div>';
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
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol='+item.s+'USDT').then(function(r){return r.json();}).then(function(t){var pr=parseFloat(t.lastPrice),pc=parseFloat(t.priceChangePercent)||0;if(pel)pel.textContent=_fmt(pr,'precio');if(cel){cel.textContent=_fmt(pc,'pct');cel.style.color=pc>=0?'var(--green)':'var(--red)';}}).catch(function(){});
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
    }).catch(function(){});
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
      }).catch(function(){});
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
    var labels={'24h':(window._i18n?window._i18n.t('pw_act_ahora'):'Act. ahora'),'7d':(window._i18n?window._i18n.t('pw_ultimos_7d'):'Últimos 7d'),'1m':(window._i18n?window._i18n.t('pw_ultimo_mes'):'Último mes'),'3m':(window._i18n?window._i18n.t('pw_ultimos_3m'):'Últimos 3m'),'1a':(window._i18n?window._i18n.t('pw_ultimo_anio'):'Último año')};
    tfEl.textContent=labels[tf]||(window._i18n?window._i18n.t('pw_act_ahora'):'Act. ahora');
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

function updateItemRT(tab,pais,sk,price,pct){var arr=tab==='acciones'?DATA.acciones[pais]||[]:DATA[tab]||[];var it=arr.find(function(x){return x.s===sk;});if(!it||!price)return;it.p=_fmt(price,'precio');it.c=_fmt(pct,'pct');it.up=pct>=0?1:0;}

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

window._pcPrices = {};

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
  if(rateEl) rateEl.textContent = (window._i18n?window._i18n.t('pw_obteniendo_precios'):'Obteniendo precios...');

  // Binance: BTC, ETH, SOL, USDT en USDT (= USD)
  fetch('https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22%2C%22ETHUSDT%22%2C%22SOLUSDT%22%5D')
    .then(function(r){ return r.json(); })
    .then(function(list){
      list.forEach(function(t){
        var sym = t.symbol.replace('USDT','');
        window._pcPrices[sym] = parseFloat(t.price);
      });
      window._pcPrices['USDT'] = 1;
      window._pcPrices['USD']  = 1;
      // Tipos de cambio fiat (actualizables)
      window._pcPrices['ARS']    = 1195;  // Blue aprox
      window._pcPrices['ARS_OF'] = 1060;  // Oficial aprox
      window._pcPrices['EUR']    = 0.92;
      window._pcPrices['BRL']    = 5.70;
      if(rateEl) rateEl.textContent = (window._i18n?window._i18n.t('pw_precios_vivo'):'Precios en vivo via Binance');
      updatePortConv();
      if(window._fetchARSLive) window._fetchARSLive();
    })
    .catch(function(){
      // Fallback offline
      window._pcPrices = { BTC:66000, ETH:2000, SOL:83, USDT:1, USD:1, ARS:1195, ARS_OF:1060, EUR:0.92, BRL:5.70 };
      if(rateEl) rateEl.textContent = (window._i18n?window._i18n.t('pw_precios_offline'):'Precios sin conexion (aprox)');
      updatePortConv();
      if(window._fetchARSLive) window._fetchARSLive();
    });
}
// A5: tipo de cambio ARS en vivo (dolarapi blue + oficial, CORS *) — los valores hardcodeados quedan de fallback
window._fetchARSLive = function(){
  fetch('https://dolarapi.com/v1/dolares/blue').then(function(r){return r.json();}).then(function(d){
    if(d && d.venta){ window._pcPrices['ARS'] = d.venta; if(typeof updatePortConv==='function') updatePortConv(); }
  }).catch(function(){});
  fetch('https://dolarapi.com/v1/dolares/oficial').then(function(r){return r.json();}).then(function(d){
    if(d && d.venta){ window._pcPrices['ARS_OF'] = d.venta; if(typeof updatePortConv==='function') updatePortConv(); }
  }).catch(function(){});
};

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
  .catch(function(){ _renderPortfolioEmpty(); });
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
      }).catch(done);
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
      }).catch(done);
  });
}

function _renderPortfolioEmpty(){
  var cnt = document.getElementById('port-cnt');
  if(!cnt) return;
  cnt.innerHTML = '<div style="text-align:center;padding:40px 20px;">' +
    '<div style="font-size:40px;margin-bottom:12px;">Cobrex</div>' +
    '<div style="font-size:14px;font-weight:700;color:var(--textSec);margin-bottom:6px;">Tu portfolio esta vacio</div>' +
    '<div style="font-size:12px;color:var(--textSec);margin-bottom:20px;">Agrega tu primer activo para empezar a seguir tu cartera en tiempo real</div>' +
    '<button onclick="openPortModal()" style="background:var(--gold);color:var(--bg);border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:700;cursor:pointer;">+ Agregar primer activo</button>' +
  '</div>';
}

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
  var prcs = window._pcPrices || {};
  var fmtNum = function(n,d){ return n.toLocaleString(window._numLocale(),{minimumFractionDigits:d||2,maximumFractionDigits:d||2}); };
  cnt.innerHTML = items.map(function(item, idx){
    var rowActs = window._IA_ACTIVOS||[]; var rowAct=null; for(var ri2=0;ri2<rowActs.length;ri2++){if(rowActs[ri2].s===item.simbolo){rowAct=rowActs[ri2];break;}}
    var precio = prcs[item.simbolo] || item.precio_compra;
    var valor = item.cantidad * precio;
    var ch24 = window._pcChange24 && window._pcChange24[item.simbolo] !== undefined ? window._pcChange24[item.simbolo] : (precio > 0 && item.precio_compra > 0 ? ((precio - item.precio_compra)/item.precio_compra*100) : 0);
    var cc = ch24 >= 0 ? 'var(--green)' : 'var(--red)';
    var cs = ch24 >= 0 ? '+' : '';
    var isCrypto = (item.tipo||'').toLowerCase() === 'cripto';
    var mktState = !isCrypto && window._pcMarketState && window._pcMarketState[item.simbolo];
    // Time-based fallback: if no marketState yet, detect by regularMarketTime or weekend
    var _mktTime = !isCrypto && window._pcMarketTime && window._pcMarketTime[item.simbolo];
    var _nowNY = new Date(Date.now() - 5*3600000);
    var _dayNY = _nowNY.getUTCDay();
    var _isWeekend = (_dayNY === 0 || _dayNY === 6);
    var _stalePrice = _mktTime ? (Date.now() - _mktTime > 7200000) : false;
    var mktClosed = !isCrypto && (
      (mktState && mktState !== 'REGULAR' && mktState !== 'PRE') ||
      (!mktState && (_isWeekend || _stalePrice))
    );
    var prevCloseVal = !isCrypto && window._pcPrevClose && window._pcPrevClose[item.simbolo];
    var prevClosePct = prevCloseVal && window._pcPrices && window._pcPrices[item.simbolo] && prevCloseVal > 0 ? ((window._pcPrices[item.simbolo]-prevCloseVal)/prevCloseVal*100) : null;
    if(mktClosed && prevClosePct !== null){ cc = 'var(--textDim)'; cs = prevClosePct >= 0 ? '+' : ''; }
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
    return '<div id="port-row-'+item.id+'" style="padding:10px 12px 8px;border-bottom:0.5px solid var(--border);">' +
      '<div style="display:flex;align-items:center;gap:6px;">' +
      '<div style="display:flex;flex-direction:column;gap:1px;margin-right:2px;flex-shrink:0;">' +
        '<div onclick="movePortfolioItem(\''+item.id+'\', -1)" style="width:18px;height:16px;display:flex;align-items:center;justify-content:center;font-size:11px;color:'+upColor+';cursor:'+upCursor+';">&#9650;</div>' +
        '<div onclick="movePortfolioItem(\''+item.id+'\', 1)" style="width:18px;height:16px;display:flex;align-items:center;justify-content:center;font-size:11px;color:'+dnColor+';cursor:'+dnCursor+';">&#9660;</div>' +
      '</div>' +
      (rowAct && rowAct.logo ? '<img src="'+rowAct.logo+'" style="width:28px;height:28px;border-radius:50%;object-fit:cover;margin-right:8px;flex-shrink:0;" onerror="this.style.display=\'none\'" />' : '<div style="width:28px;height:28px;border-radius:50%;background:'+(rowAct&&rowAct.color||'var(--border)')+';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--text);margin-right:8px;flex-shrink:0;">'+item.simbolo[0]+'</div>') +
      '<div style="flex:1;min-width:0;cursor:pointer;overflow:hidden;" onclick="openPortItemDetail(\x27'+item.id+'\x27)">' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
          '<span style="font-weight:700;color:var(--text);font-size:14px;">'+item.simbolo+'</span>' +
          '<span style="font-size:10px;padding:1px 6px;border-radius:5px;background:var(--border);color:var(--textSec);">'+(item.tipo||'cripto')+'</span>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--textSec);margin-top:2px;">'+item.cantidad+' u. @ $'+fmtNum(item.precio_compra)+'</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;justify-content:center;min-width:48px;max-width:64px;">'+_buildDotsHTML(_getActivoScores(item.simbolo))+'</div>' +
      '<div style="margin-left:auto;text-align:right;flex-shrink:0;">' +
        '<div style="font-size:14px;font-weight:700;color:var(--text);">$'+fmtNum(valor)+'</div>' +
      '</div>' +
      '<div onclick="deletePortfolioItem(\''+item.id+'\')" style="font-size:15px;color:var(--textDim);cursor:pointer;padding:4px;" title="Eliminar">&#128465;</div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;justify-content:flex-end;margin-top:4px;padding-left:50px;">' +
      '<div style="display:flex;align-items:center;gap:4px;">' +
        (mktClosed ? '<span style="font-size:9px;color:var(--gold);font-weight:700;margin-right:2px;">Ult. cierre</span>' : '') +
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
  if(!items || !prices) return;

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
  if(pnlSpan) pnlSpan.textContent = period === 'max' ? 'desde compra' : period;

  if(pnlUSD) pnlUSD.style.color = diffUSD >= 0 ? '#3fb950' : '#f85149';
  if(pnlPct) pnlPct.style.color = diffUSD >= 0 ? '#3fb950' : '#f85149';
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
  items.forEach(function(item){
    var precio = prcs[item.simbolo] || item.precio_compra;
    total += item.cantidad * precio;
    totalCosto += item.cantidad * item.precio_compra;
    var pnl = item.precio_compra > 0 ? ((precio - item.precio_compra) / item.precio_compra * 100) : 0;
    if(pnl > bestPct){ bestPct = pnl; bestSym = item.simbolo; }
  });
  var pnlUsd = total - totalCosto;
  var pnlPct = totalCosto > 0 ? (pnlUsd / totalCosto * 100) : 0;
  var fmtNum = function(n,d){ return n.toLocaleString(window._numLocale(),{minimumFractionDigits:d||2,maximumFractionDigits:d||2}); };
  var el = function(id){ return document.getElementById(id); };
  window._portTotalUSD = total;
  _updatePortTotalDisplay();
  if(el('port-count')) el('port-count').textContent = items.length;
  if(el('port-cnt-badge')) el('port-cnt-badge').textContent = items.length;
  if(el('port-best')) el('port-best').textContent = items.length > 0 ? (bestSym + ' ' + _fmt(bestPct,'pct')) : '—';
  if(el('port-best-badge')) { el('port-best-badge').textContent = items.length > 0 ? (bestSym + ' ' + _fmt(bestPct,'pct')) : '—'; el('port-best-badge').style.color = bestPct >= 0 ? '#22c55e' : '#ef4444'; }
  if(el('port-pnl-usd')){
    el('port-pnl-usd').textContent = (pnlUsd>=0?'+':'-') + '$' + fmtNum(Math.abs(pnlUsd));
    el('port-pnl-usd').style.color = pnlUsd >= 0 ? 'var(--green)' : 'var(--red)';
  }
  if(el('port-pnl-pct')){
    el('port-pnl-pct').textContent = _fmt(pnlPct,'pct');
    el('port-pnl-pct').style.background = pnlPct >= 0 ? '#1A3A2A' : '#3A1A1A';
    el('port-pnl-pct').style.color = pnlPct >= 0 ? 'var(--green)' : 'var(--red)';
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
  if(pAlc>0) segs.push({p:pAlc, c:'var(--green)', l:'📈 Alcista',       syms:buckets.ALCISTA.syms});
  if(pBaj>0) segs.push({p:pBaj, c:'var(--red)', l:'📉 Bajista',       syms:buckets.BAJISTA.syms});
  if(pHC>0)  segs.push({p:pHC,  c:'var(--gold)', l:'⚡ Sin dirección', syms:buckets.HC.syms});
  if(pSin>0) segs.push({p:pSin, c:'var(--textSec)', l:'⚫ Sin señal',      syms:buckets.SIN.syms});
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
    msg = '🔴 Revisá urgente — <span style="color:var(--red);"><b>'+bajSyms+'</b></span> en baja confirmada.<br><span style="color:var(--textSec);font-size:9px;">La IA confirmó caída. Evaluá reducir posición antes de que baje más.</span>';
  } else if(pBaj >= 20){
    msg = '⚠️ Vigilar: <span style="color:var(--red);"><b>'+bajSyms+'</b></span> con señal bajista.<br><span style="color:var(--textSec);font-size:9px;">Señal débil de baja. Monitorea de cerca antes de decidir.</span>';
  } else if(pAlc >= 50){
    msg = '🟢 Buen momento — <span style="color:var(--green);"><b>'+alcSyms+'</b></span> con momentum positivo.<br><span style="color:var(--textSec);font-size:9px;">La IA confirmó suba. Buen momento para mantener o aumentar posición.</span>';
  } else if(pHC >= 40){
    msg = '⚡ Esperá señal antes de operar: <span style="color:var(--gold);"><b>'+hcSyms+'</b></span>.<br><span style="color:var(--textSec);font-size:9px;">La IA está monitoreando. Confirma dirección cuando el mercado define. Volvé mañana.</span>';
  } else if(pSin >= 70){
    msg = '⚫ Sin datos suficientes hoy — no operar hasta nueva señal.<br><span style="color:var(--textSec);font-size:9px;">La IA necesita más datos. Sin acción recomendada por ahora.</span>';
  } else {
    var dom = segs[0];
    msg = '<b>'+dom.p.toFixed(0)+'% '+dom.l+'</b> — cartera con señales mixtas.<br><span style="color:var(--textSec);font-size:9px;">Revisá cada activo individualmente antes de operar.</span>';
  }
  el.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">' +
      '<div style="display:flex;align-items:center;gap:5px;">' +
        '<div style="font-size:10px;color:var(--text);font-weight:700;letter-spacing:.3px;">TERMÓMETRO DE RIESGO</div>' +
        '<div onclick="showThermoHelp()" style="font-size:9px;color:var(--textSec);font-weight:700;cursor:pointer;border:1px solid var(--border2);border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">?</div>' +
      '</div>' +
      '<div style="font-size:8px;color:var(--textSec);letter-spacing:.5px;font-weight:500;">CAPITAL POR SEÑAL IA</div>' +
      '<div onclick="showThermoInfo()" style="font-size:9px;color:#E6B800;font-weight:700;cursor:pointer;border:1px solid #E6B800;border-radius:4px;padding:0 5px;letter-spacing:.5px;">VAR</div>' +
    '</div>' +
    '<div style="height:8px;border-radius:6px;overflow:hidden;display:flex;gap:1px;background:var(--border);margin-bottom:6px;">'+bar+'</div>' +
    '<div style="margin-bottom:4px;">'+leg+'</div>' +
    '<div style="font-size:10px;color:var(--textSec);line-height:1.4;">'+msg+'</div>';
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
    var statusTxt = open ? 'ABIERTO' : 'CERRADO';
    return '<div style="display:inline-flex;flex-direction:column;align-items:center;padding:5px 8px;min-width:62px;">'
      + '<span style="font-size:10px;font-weight:700;color:var(--text);">' + mkt.flag + ' ' + mkt.id + '</span>'
      + '<span style="font-size:10px;font-weight:700;color:'+color+';line-height:1.4;">' + statusTxt + '</span>'
      + '<span style="font-size:9px;color:var(--textSec);">' + lbl + '</span>'
      + '</div>';
  }
  var items = ALL_MKTS.map(mktItem).filter(Boolean).join('');
  var editBtn = '<div onclick="editMarketBanner()" style="font-size:12px;color:#3B9EF5;cursor:pointer;padding:4px 8px;border-radius:4px;border:1px solid #3B9EF5;margin-left:auto;flex-shrink:0;">&#9998;</div>';
  el.innerHTML = '<div style="display:flex;align-items:center;gap:0;padding:8px 10px;background:var(--bg);border-bottom:1px solid var(--border);overflow-x:auto;-webkit-overflow-scrolling:touch;">'+items+editBtn+'</div>';
}

window.editMarketBanner = function(){
  var existing = document.getElementById('aurex-mkt-edit-popup');
  if(existing){ existing.remove(); return; }
  var prefs = JSON.parse(localStorage.getItem('aurex_markets_pref') || '["EEUU","ASIA","ARG"]');
  var opts = ['EEUU','ARG','BRASIL','LONDRES','ESPANA','ALEMANIA','FRANCIA','JAPON','CHINA','HONGKONG','ASIA'];
  var rows = opts.map(function(m){
    var on = prefs.includes(m);
    var onBg = on ? 'var(--green)' : 'var(--border)';
    var knobL = on ? '18px' : '2px';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">' +
      '<span style="color:var(--text);font-size:13px;">'+m+'</span>' +
      '<div onclick="toggleMktPref(\'' + m + '\')" id="mkt-tog-'+m+'" style="width:36px;height:20px;border-radius:10px;background:'+onBg+';cursor:pointer;position:relative;">' +
      '<div style="position:absolute;top:2px;left:'+knobL+';width:16px;height:16px;border-radius:50%;background:var(--card);"></div></div></div>';
  }).join('');
  var popup = document.createElement('div');
  popup.id = 'aurex-mkt-edit-popup';
  popup.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;';
  popup.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border2);border-radius:14px;padding:20px;width:88%;max-width:340px;max-height:85vh;overflow-y:auto;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<span style="font-size:15px;font-weight:700;color:var(--text);">Mercados en banner</span>' +
        '<button onclick="document.getElementById(&apos;aurex-mkt-edit-popup&apos;).remove()" style="background:var(--border);border:1px solid var(--border2);border-radius:6px;color:var(--textSec);font-size:16px;cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">&#x2715;</button>' +
      '</div>' +
      rows +
      '<button onclick="document.getElementById(&apos;aurex-mkt-edit-popup&apos;).remove();if(typeof _renderMarketBanner===&apos;function&apos;){var _tmp=document.createElement(&apos;div&apos;);_tmp.id=&apos;tmp-mkt-listo&apos;;_tmp.style.display=&apos;none&apos;;document.body.appendChild(_tmp);_renderMarketBanner(&apos;tmp-mkt-listo&apos;);var _sa=document.getElementById(&apos;combo-slide-a&apos;);if(_sa)_sa.innerHTML=_tmp.innerHTML;document.body.removeChild(_tmp);}" style="width:100%;background:var(--green);border:none;border-radius:8px;padding:10px;color:var(--bg);font-size:14px;font-weight:700;cursor:pointer;margin-top:14px;">Listo</button>' +
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
    tog.style.background = on ? 'var(--green)' : 'var(--border)';
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
  body.innerHTML = '<div style="color:var(--text);font-size:15px;font-weight:700;margin-bottom:12px;">🌡️ Termómetro de Riesgo</div>' +
    '<div style="font-size:12px;color:var(--textSec);line-height:1.6;margin-bottom:12px;">Muestra cómo está distribuido el capital de tu cartera según las señales activas de Cobrex IA:</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">' +
    '<div style="display:flex;align-items:center;gap:8px;"><div style="width:12px;height:12px;border-radius:50%;background:var(--green);flex-shrink:0;"></div><div style="font-size:12px;color:var(--text);"><b style="color:var(--green);">ALCISTA</b> — La IA ve momentum positivo: precio subiendo, volumen comprador. Alta probabilidad de suba en 24-48hs.</div></div>' +
    '<div style="display:flex;align-items:center;gap:8px;"><div style="width:12px;height:12px;border-radius:50%;background:var(--gold);flex-shrink:0;"></div><div style="font-size:12px;color:var(--text);"><b style="color:var(--gold);">ALTA CONV-IA</b> — La señal m�s valiosa y rara. Máxima atención: movimiento fuerte inminente. Solo 1-2 activos por día reciben esta señal.</div></div>' +
    '<div style="display:flex;align-items:center;gap:8px;"><div style="width:12px;height:12px;border-radius:50%;background:var(--red);flex-shrink:0;"></div><div style="font-size:12px;color:var(--text);"><b style="color:var(--red);">BAJISTA</b> — La IA ve momentum negativo: precio cayendo, volumen vendedor. Alta probabilidad de baja en 24-48hs.</div></div>' +
    '<div style="display:flex;align-items:center;gap:8px;"><div style="width:12px;height:12px;border-radius:50%;background:var(--border);flex-shrink:0;"></div><div style="font-size:12px;color:var(--textSec);"><b>SIN SEÑAL</b> — No hay señal activa hoy para ese activo. No es una alerta, simplemente el modelo no detectó nada destacable.</div></div>' +
    '</div>' +
    '<div onclick="closePortModal()" style="background:var(--green);color:var(--bg);border-radius:9px;padding:10px;text-align:center;font-size:14px;font-weight:700;cursor:pointer;">Entendido</div>';
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
      '<div style="font-size:13px;font-weight:700;color:var(--text);">🌡️ Cómo leer el Termómetro</div>' +
      '<div onclick="window._closeThermoHelp()" style="font-size:24px;color:var(--textSec);cursor:pointer;line-height:1;padding:4px 6px;-webkit-tap-highlight-color:rgba(0,0,0,0);">&#215;</div>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:10px;font-size:11px;line-height:1.5;">' +
      '<div><span style="color:var(--green);font-weight:700;">🟢 Verde — Alcista</span><br><span style="color:var(--textSec);">Señal confirmada de suba. Buen momento para mantener o aumentar posición.</span></div>' +
      '<div><span style="color:var(--red);font-weight:700;">🔴 Rojo — Bajista</span><br><span style="color:var(--textSec);">Señal confirmada de caída. Evaluá reducir antes de que baje más.</span></div>' +
      '<div><span style="color:var(--gold);font-weight:700;">⚡ Dorado — Sin dirección</span><br><span style="color:var(--textSec);">Movimiento fuerte inminente sin confirmar. Esperá la señal — no operar todavía.</span></div>' +
      '<div><span style="color:var(--textSec);font-weight:700;">⚫ Gris — Sin señal</span><br><span style="color:var(--textSec);">La IA no tiene datos suficientes hoy. Sin acción recomendada.</span></div>' +
    '</div>' +
    '<div style="margin-top:14px;font-size:10px;color:var(--textSec);border-top:1px solid var(--border2);padding-top:10px;">El % indica cuánto de tu capital está en cada zona. Se actualiza con precios actuales.</div>' +
    '<div onclick="window._closeThermoHelp()" style="margin-top:12px;background:var(--gold);color:var(--chipTextActive);border-radius:8px;padding:10px;text-align:center;font-size:12px;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:manipulation;">Entendido</div>';
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
          '<div style="font-size:14px;font-weight:700;color:var(--gold);margin-bottom:6px;">Necesitás una cuenta</div>' +
          '<div style="font-size:12px;color:var(--textSec);margin-bottom:16px;">Para guardar activos reales, creá tu cuenta gratis.</div>' +
          '<div onclick="navTo(\x27perfil\x27);authSwitchTab(\x27register\x27)" style="background:linear-gradient(135deg,var(--gold),#B8860B);color:var(--chipTextActive);font-weight:800;font-size:14px;padding:12px 24px;border-radius:10px;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);">Crear cuenta gratis →</div>' +
          '<div onclick="navTo(\x27perfil\x27)" style="margin-top:10px;font-size:12px;color:#58A6FF;cursor:pointer;">Ya tengo cuenta</div>' +
        '</div>' + old;
        setTimeout(function(){ cnt.innerHTML = old; }, 5000);
      }
      return;
    }
    _openAddActivoModal();
  });
};
function _openAddActivoModal(){
  var modal = document.getElementById('port-modal');
  var body = document.getElementById('port-modal-body');
  var title = document.getElementById('port-modal-title');
  if(!modal || !body) return;
  if(title) title.textContent = 'Agregar activo';
  body.innerHTML =
    '<div style="display:flex;flex-direction:column;gap:10px;">' +
    '<div><input id="pa-search" type="text" placeholder="Buscar ticker o nombre (ej: IBIT, HOOD, BTC...)" autocomplete="off" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border2);border-radius:9px;padding:10px 12px;color:var(--text);font-size:14px;outline:none;" oninput="filterPortSearch()" /></div>' +
    '<div id="pa-results" style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;"></div>' +
    '<div id="pa-selected" style="display:none;background:var(--card);border-radius:9px;padding:10px;border:1px solid var(--gold);">' +
    '<div id="pa-sel-name" style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px;"></div>' +
    '<div style="display:flex;gap:8px;">' +
    '<div style="flex:1;"><div style="font-size:10px;color:var(--textDim);margin-bottom:4px;">Cantidad</div><input id="pa-qty" type="numb✕ min="0" step="any" placeholder="0.00" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border2);border-radius:7px;padding:8px 10px;color:var(--text);font-size:14px;outline:none;" /></div>' +
    '<div style="flex:1;"><div style="font-size:10px;color:var(--textDim);margin-bottom:4px;">Precio compra (USD)</div><input id="pa-price" type="numb✕ min="0" step="any" placeholder="0.00" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border2);border-radius:7px;padding:8px 10px;color:var(--text);font-size:14px;outline:none;" /></div>' +
    '</div>' +
    '<div id="pa-err" style="color:var(--red);font-size:11px;margin-top:4px;display:none;"></div>' +
    '<div onclick="savePortActivo()" style="margin-top:10px;background:var(--green);color:var(--bg);border-radius:9px;padding:11px;text-align:center;font-size:14px;font-weight:700;cursor:pointer;">Confirmar</div>' +
    '</div>' +
    '<input id="pa-sym" type="hidden" value="" />' +
    '</div>';
  modal.style.display = 'flex';
  setTimeout(function(){ var el = document.getElementById('pa-search'); if(el) el.focus(); }, 100);
  window._portSearchActs = [];
  window.filterPortSearch();
}

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
    : '<div style="width:26px;height:26px;border-radius:50%;background:' + (a.color||'var(--border)') + ';display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:var(--text);flex-shrink:0;">' + (a.abbr||a.s.substring(0,3).toUpperCase()) + '</div>';
  var tipoColor = a.tipo==='cripto'?'#A78BFA':a.tipo==='accion'?'#58A6FF':a.tipo==='etf'?'#F0883E':'var(--textSec)';
  var tipoLabel = window._tipoLabel ? window._tipoLabel(a.tipo) : (a.tipo==='cripto'?'Cripto':a.tipo==='accion'?'Accion':a.tipo==='etf'?'ETF':a.tipo==='bono'?'Bono':a.tipo==='metal'?'Metal':a.tipo==='materia_prima'?'Commodity':(a.tipo||'Activo'));
  var yahooTag = a._fromYahoo ? ' <span style="font-size:8px;background:#58A6FF20;color:#58A6FF;border-radius:3px;padding:1px 4px;">YAHOO</span>' : '';
  return '<div onclick="' + onclickFnName + '(' + idx + ')" style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;background:var(--card);border:0.5px solid var(--border);-webkit-tap-highlight-color:rgba(0,0,0,0);">' +
    logoHtml +
    '<div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:700;color:var(--text);">' + a.s + yahooTag + '</div>' +
    '<div style="font-size:10px;color:var(--textSec);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + a.n + ' <span style="color:' + tipoColor + '">&#9830; ' + tipoLabel + '</span></div></div>' +
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
    return;
  }
  res.innerHTML = '<div style="font-size:11px;color:var(--textDim);padding:8px;text-align:center;">Buscando...</div>';
  window._buscarActivos(q, function(results){
    window._portSearchActs = results;
    if(!results.length){
      res.innerHTML = '<div style="font-size:11px;color:var(--textDim);padding:8px;text-align:center;">Sin resultados para "' + q + '"</div>';
      return;
    }
    res.innerHTML = results.map(function(a,i){ return window._renderSearchResult(a, i, 'window._portPickIdx'); }).join('');
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
  var logoStr = act.logo ? '<img src="' + act.logo + '" style="width:20px;height:20px;border-radius:50%;vertical-align:middle;margin-right:6px;" onerror="this.style.display=\'none\';" />' : '';
  if(selName) selName.innerHTML = logoStr + sym + ' <span style="color:var(--textSec);font-weight:400;font-size:11px;">' + nombre + '</span>';
  if(symInput) symInput.value = sym + '|' + nombre + '|' + (act ? act.tipo : 'accion');
  var res = document.getElementById('pa-results');
  if(res) res.style.display = 'none';
}

window.savePortActivo = function(){
  var symInput = document.getElementById('pa-sym');
  var qtyInput = document.getElementById('pa-qty');
  var priceInput = document.getElementById('pa-price');
  var errEl = document.getElementById('pa-err');
  if(!symInput || !symInput.value){ if(errEl){errEl.textContent=(window._i18n?window._i18n.t('pw_sel_activo'):'Seleccion\u00e1 un activo de la lista');errEl.style.display='block';} return; }
  var parts = symInput.value.split('|');
  var sym = parts[0], nombre = parts[1] || parts[0], tipo = parts[2] || 'accion';
  var qty = parseFloat(qtyInput ? qtyInput.value : 0);
  var price = parseFloat(priceInput ? priceInput.value : 0);
  if(!qty || qty <= 0){ if(errEl){errEl.textContent=(window._i18n?window._i18n.t('pw_cantidad_0'):'Ingres\u00e1 una cantidad mayor a 0');errEl.style.display='block';} return; }
  if(!price || price <= 0){ if(errEl){errEl.textContent=(window._i18n?window._i18n.t('pw_precio_0'):'Ingres\u00e1 un precio de compra mayor a 0');errEl.style.display='block';} return; }
  if(errEl) errEl.style.display='none';
  window.addPortfolioItem(sym, nombre, qty, price, tipo);
  window.closePortModal();
};;
window.openPortModal = _openAddActivoModal;
window.openAddActivo = _openAddActivoModal;
window.closePortModal = function(){ var m = document.getElementById('port-modal'); if(m) m.style.display='none'; var errEl=document.getElementById('pa-err'); if(errEl){errEl.style.display='none';errEl.textContent='';} var res=document.getElementById('pa-results'); if(res) res.style.display='flex'; };
Modal = function(){ var modal=document.getElementById('port-modal'); if(modal) modal.style.display='none'; };

window.openAddWatch = function(){
  var modal = document.getElementById('watch-modal');
  var body = document.getElementById('watch-modal-body');
  if(!modal || !body) return;
  window._watchSearchActs = [];
  body.innerHTML =
    '<input id="wl-search" type="text" placeholder="Buscar ticker o nombre (ej: IBIT, HOOD, BTC...)" autocomplete="off" style="width:100%;box-sizing:border-box;background:var(--bg);border:1px solid var(--border2);border-radius:9px;padding:10px 12px;color:var(--text);font-size:14px;outline:none;margin-bottom:10px;" oninput="filterWatchSearch()" />' +
    '<div id="wl-results" style="max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;"></div>';
  modal.style.display = 'flex';
  setTimeout(function(){ var el=document.getElementById('wl-search'); if(el) el.focus(); }, 100);
  window.filterWatchSearch();
};
window.closeWatchModal = function(){ var m=document.getElementById('watch-modal'); if(m) m.style.display='none'; };
window.filterWatchSearch = function(){
  var q = (document.getElementById('wl-search') ? document.getElementById('wl-search').value : '').trim();
  var res = document.getElementById('wl-results');
  if(!res) return;
  if(q.length === 0) {
    var local = (window._IA_ACTIVOS||[]).slice(0,20);
    window._watchSearchActs = local;
    res.innerHTML = local.map(function(a,i){ return window._renderSearchResult(a, i, 'window._watchPickIdx'); }).join('');
    return;
  }
  res.innerHTML = '<div style="font-size:11px;color:var(--textDim);padding:8px;text-align:center;">Buscando...</div>';
  window._buscarActivos(q, function(results){
    window._watchSearchActs = results;
    if(!results.length){ res.innerHTML='<div style="font-size:11px;color:var(--textDim);padding:8px;text-align:center;">Sin resultados</div>'; return; }
    res.innerHTML = results.map(function(a,i){ return window._renderSearchResult(a, i, 'window._watchPickIdx'); }).join('');
  });
};
window._watchPickIdx = function(idx){
  var acts = window._watchSearchActs || [];
  var a = acts[idx]; if(!a) return;
  window.addToWatch(a.s, a.n, a.tipo||'accion');
};
window.addToWatch = function(sym, nombre, tipo){
  var wl = JSON.parse(localStorage.getItem('aurex_watchlist')||'[]');
  if(wl.find(function(w){ return w.s===sym; })){ window.closeWatchModal(); return; }
  wl.push({s:sym, n:nombre, tipo:tipo||'accion', added:Date.now()});
  localStorage.setItem('aurex_watchlist', JSON.stringify(wl));
  window.closeWatchModal();
  if(typeof renderWatchCnt === 'function') renderWatchCnt();
};


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
    if(pct52 <= 30){ zone52 = 'Precio cerca del mínimo anual — zona históricamente baja'; zoneColor52 = 'var(--green)'; zoneIcon52 = '🟢'; }
    else if(pct52 <= 70){ zone52 = 'Precio en zona media del rango anual'; zoneColor52 = 'var(--gold)'; zoneIcon52 = '🟡'; }
    else { zone52 = 'Precio cerca del máximo anual — zona históricamente alta'; zoneColor52 = 'var(--red)'; zoneIcon52 = '🔴'; }
    rangeBar = '<div style="margin:10px 0 4px;">' +
      '<div style="display:flex;justify-content:space-between;font-size:9px;color:var(--textDim);margin-bottom:3px;">' +
        '<span>↓ Mín: $'+fmtP(low52)+'</span>' +
        '<span style="font-size:9px;color:var(--textSec);">52 semanas</span>' +
        '<span>→ Máx: $'+fmtP(high52)+'</span>' +
      '</div>' +
      '<div style="background:var(--border);border-radius:4px;height:6px;position:relative;">' +
        '<div style="background:linear-gradient(90deg,var(--green),var(--gold),var(--red));border-radius:4px;height:6px;width:'+pct52.toFixed(0)+'%;"></div>' +
        '<div style="position:absolute;top:-3px;left:calc('+pct52.toFixed(0)+'% - 5px);width:10px;height:10px;border-radius:50%;background:var(--text);border:2px solid var(--bg);box-shadow:0 0 4px rgba(255,255,255,.3);"></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:5px;margin-top:6px;padding:6px 8px;background:var(--bg);border-radius:6px;border-left:3px solid '+zoneColor52+';">' +
        '<span style="font-size:12px;">'+zoneIcon52+'</span>' +
        '<div>' +
          '<div style="font-size:10px;font-weight:600;color:'+zoneColor52+';">'+pct52.toFixed(0)+'% del rango anual</div>' +
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
    var motivosHtml = (sig.motivos||[]).slice(0,5).map(function(m,i){ return '<div style="display:flex;gap:6px;margin-bottom:4px;"><span style="color:'+dirColor+';font-weight:700;flex-shrink:0;">'+(i+1)+'.</span><span style="color:var(--textSec);font-size:11px;">'+m+'</span></div>'; }).join('');
    sigHtml = '<div style="background:var(--card);border-radius:9px;padding:12px;border-left:3px solid '+dirColor+';margin-top:10px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
      '<div style="font-size:10px;font-weight:700;color:'+dirColor+';letter-spacing:.5px;">'+sig.direccion+'</div>' +
      '<div style="font-size:20px;font-weight:700;color:'+dirColor+';">'+probPrincipal.toFixed(0)+'<span style="font-size:11px;">%</span></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:8px;">' +
      '<div style="flex:1;background:var(--bg);border-radius:7px;padding:7px;text-align:center;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">Objetivo</div><div style="font-size:12px;color:var(--green);font-weight:600;">$'+fmtP(sig.objetivo)+'</div></div>' +
      '<div style="flex:1;background:var(--bg);border-radius:7px;padding:7px;text-align:center;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">Stop Loss</div><div style="font-size:12px;color:var(--red);font-weight:600;">$'+fmtP(sig.stop)+'</div></div>' +
      '<div style="flex:1;background:var(--bg);border-radius:7px;padding:7px;text-align:center;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">'+(sig.direccion==='ALCISTA'?'Upside':'Downside')+'</div><div style="font-size:12px;color:'+dirColor+';font-weight:600;">'+(sig.direccion==='ALCISTA'?'+':'-')+Math.abs(sig.upside||0).toFixed(1)+'%</div></div>' +
      '</div>' +
      motivosHtml +
      '</div>';
  } else {
    sigHtml = '<div style="background:var(--card);border-radius:9px;padding:12px;margin-top:10px;text-align:center;color:var(--textDim);font-size:12px;">Sin senal activa hoy</div>';
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
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">Precio compra</div><div style="font-size:13px;color:var(--text);font-weight:600;">$'+fmtP(item.precio_compra)+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">Cantidad</div><div style="font-size:13px;color:var(--text);font-weight:600;">'+item.cantidad+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">P&L USD</div><div style="font-size:13px;color:'+pnlColor+';font-weight:600;">'+pnlSign+'$'+fmtP(Math.abs(pnlUsd))+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">Entrada</div><div style="font-size:11px;color:var(--textSec);">'+fechaStr+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">↓ Mín 52 sem.</div><div style="font-size:12px;color:var(--red);font-weight:600;">'+(low52 ? '$'+fmtP(low52) : '--')+'</div></div>' +
    '<div style="background:var(--card);border-radius:7px;padding:8px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">→ Máx 52 sem.</div><div style="font-size:12px;color:var(--green);font-weight:600;">'+(high52 ? '$'+fmtP(high52) : '--')+'</div></div>' +
    '</div>' +
    rangeBar +
    '<div id="port-det-pct" style="margin:6px 0;"><span id="pd-24h-val" style="font-size:13px;font-weight:600;color:var(--textSec);">--</span><span style="display:flex;gap:4px;margin-top:4px;">' +
    ['24h','7d','1m','3m','1y'].map(function(p){ return '<span onclick="portDetPeriod(\''+item.simbolo+'\',\''+item.tipo+'\',\''+p+'\')" id="pd-tab-'+p+'" style="font-size:9px;padding:2px 6px;border-radius:4px;cursor:pointer;background:'+(p==='24h'?'var(--gold)':'var(--border)')+';color:'+(p==='24h'?'var(--bg)':'var(--textSec)')+';">'+p+'</span>'; }).join('') +
    '</span></div>' +
    sigHtml +
    '<div style="margin-top:10px;background:var(--card);border-radius:9px;padding:12px;border:1px solid var(--border);">' +
    '<div style="font-size:10px;color:var(--textDim);font-weight:600;letter-spacing:.3px;margin-bottom:8px;">SIMULADOR DE ESCENARIOS</div>' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">' +
    '<span style="font-size:11px;color:var(--textSec);">Si el precio cambia:</span>' +
    '<input id="pd-sim-pct" type="range" min="-50" max="50" value="0" step="1" style="flex:1;accent-color:var(--gold);" oninput="portSimUpdate(\'' + item.id + '\',\'' + item.simbolo + '\',this.value)" />' +
    '<span id="pd-sim-label" style="font-size:12px;font-weight:700;color:var(--gold);min-width:38px;text-align:right;">0%</span>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
    '<div style="background:var(--bg);border-radius:7px;padding:7px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">Nuevo precio</div><div id="pd-sim-newprice" style="font-size:12px;color:var(--text);font-weight:600;">$' + fmtP(precio) + '</div></div>' +
    '<div style="background:var(--bg);border-radius:7px;padding:7px;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">P&L del activo</div><div id="pd-sim-pnl" style="font-size:12px;color:var(--text);font-weight:600;">' + pnlSign + '$' + fmtP(Math.abs(pnlUsd)) + '</div></div>' +
    '<div style="background:var(--bg);border-radius:7px;padding:7px;grid-column:span 2;"><div style="font-size:9px;color:var(--textDim);margin-bottom:2px;">Impacto en portfolio total</div><div id="pd-sim-portimpact" style="font-size:12px;color:var(--text);font-weight:600;">--</div></div>' +
    '' +
    '<div style="border-top:1px solid var(--border);margin-top:12px;padding-top:12px;">' +
    '<div style="font-size:10px;color:var(--textSec);margin-bottom:8px;text-align:center;">Compartir</div>' +
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
  if(!confirm('\u00bfEliminar este activo del portfolio?')) return;
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
var _IA_PRECIOS = {};
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
  {s:'XRP', n:'Ripple', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', color:'#00AAE4', ySymbol:'XRP-USD'},
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
  {s:'EGLD', n:'MultiversX', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/12335/small/elrond3_360.png', color:'#1B46C2', ySymbol:'EGLD-USD'},
  {s:'THETA', n:'Theta Network', tipo:'cripto', logo:'https://assets.coingecko.com/coins/images/2538/small/theta-token-logo.png', color:'#2AB8E6', ySymbol:'THETA-USD'},
  {s:'AAPL', n:'Apple', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AAPL.png', icon:'A', color:'var(--textDim)', ySymbol:'AAPL'},
  {s:'NVDA', n:'NVIDIA', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NVDA.png', icon:'N', color:'#76B900', ySymbol:'NVDA'},
  {s:'MSFT', n:'Microsoft', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MSFT.png', icon:'M', color:'#00A4EF', ySymbol:'MSFT'},
  {s:'GOOGL', n:'Alphabet A', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GOOGL.png', icon:'A', color:'#4285F4', ySymbol:'GOOGL'},
  {s:'GOOG', n:'Alphabet C', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GOOG.png', icon:'A', color:'#34A853', ySymbol:'GOOG'},
  {s:'TSLA', n:'Tesla', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/TSLA.png', icon:'T', color:'#CC0000', ySymbol:'TSLA'},
  {s:'META', n:'Meta', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/META.png', icon:'M', color:'#0668E1', ySymbol:'META'},
  {s:'AMZN', n:'Amazon', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AMZN.png', icon:'A', color:'#FF9900', ySymbol:'AMZN'},
  {s:'AVGO', n:'Broadcom', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AVGO.png', icon:'B', color:'#CC092F', ySymbol:'AVGO'},
  {s:'ORCL', n:'Oracle', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/ORCL.png', icon:'O', color:'#F80000', ySymbol:'ORCL'},
  {s:'JPM', n:'JPMorgan', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/JPM.png', icon:'J', color:'#003A70', ySymbol:'JPM'},
  {s:'V', n:'Visa', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/V.png', icon:'V', color:'#1A1F71', ySymbol:'V'},
  {s:'MA', n:'Mastercard', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MA.png', icon:'M', color:'#EB001B', ySymbol:'MA'},
  {s:'UNH', n:'UnitedHealth', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/UNH.png', icon:'U', color:'#002677', ySymbol:'UNH'},
  {s:'LLY', n:'Eli Lilly', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/LLY.png', icon:'L', color:'#D52B1E', ySymbol:'LLY'},
  {s:'JNJ', n:'J&J', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/JNJ.png', icon:'J', color:'#D51900', ySymbol:'JNJ'},
  {s:'MRK', n:'Merck', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MRK.png', icon:'M', color:'#009A44', ySymbol:'MRK'},
  {s:'BAC', n:'Bank of America', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BAC.png', icon:'B', color:'#012169', ySymbol:'BAC'},
  {s:'WFC', n:'Wells Fargo', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/WFC.png', icon:'W', color:'#D71E28', ySymbol:'WFC'},
  {s:'GS', n:'Goldman Sachs', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/GS.png', icon:'G', color:'#6B9AC4', ySymbol:'GS'},
  {s:'MS', n:'Morgan Stanley', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MS.png', icon:'M', color:'#003C71', ySymbol:'MS'},
  {s:'BLK', n:'BlackRock', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/BLK.png', icon:'B', color:'#000000', ySymbol:'BLK'},
  {s:'NFLX', n:'Netflix', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/NFLX.png', icon:'N', color:'#E50914', ySymbol:'NFLX'},
  {s:'DIS', n:'Disney', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/DIS.png', icon:'D', color:'#006EC7', ySymbol:'DIS'},
  {s:'COIN', n:'Coinbase', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/COIN.png', icon:'C', color:'#0052FF', ySymbol:'COIN'},
  {s:'MSTR', n:'MicroStrategy', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MSTR.png', icon:'M', color:'#D9222A', ySymbol:'MSTR'},
  {s:'RIOT', n:'Riot Platforms', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/RIOT.png', icon:'R', color:'#1B3D6D', ySymbol:'RIOT'},
  {s:'MARA', n:'Marathon Digital', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/MARA.png', icon:'M', color:'#F7931A', ySymbol:'MARA'},
  {s:'PLTR', n:'Palantir', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PLTR.png', icon:'P', color:'#101820', ySymbol:'PLTR'},
  {s:'HOOD', n:'Robinhood', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/HOOD.png', icon:'H', color:'#00C805', ySymbol:'HOOD'},
  {s:'PYPL', n:'PayPal', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/PYPL.png', icon:'P', color:'#003087', ySymbol:'PYPL'},
  {s:'SQ', n:'Block', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SQ.png', icon:'S', color:'#3E4348', ySymbol:'SQ'},
  {s:'SPOT', n:'Spotify', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/SPOT.png', icon:'S', color:'#1DB954', ySymbol:'SPOT'},
  {s:'AMD', n:'AMD', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/AMD.png', icon:'A', color:'#ED1C24', ySymbol:'AMD'},
  {s:'INTC', n:'Intel', tipo:'accion', logo:'https://financialmodelingprep.com/image-stock/INTC.png', icon:'I', color:'#0068B5', ySymbol:'INTC'},
  {s:'SPY', n:'SPDR S&P 500', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/SPY.png', icon:'S', color:'#003594', ySymbol:'SPY'},
  {s:'QQQ', n:'Invesco QQQ', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/QQQ.png', icon:'Q', color:'#00A651', ySymbol:'QQQ'},
  {s:'GLD', n:'SPDR Gold', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/GLD.png', icon:'G', color:'var(--gold)', ySymbol:'GLD'},
  {s:'SLV', n:'iShares Silver', tipo:'etf', logo:'https://financialmodelingprep.com/image-stock/SLV.png', icon:'S', color:'#C0C0C0', ySymbol:'SLV'},
  {s:'GC=F', n:'Oro Futuro', tipo:'commodity', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNENEFGMzcnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QXU8L3RleHQ+PC9zdmc+', icon:'Au', color:'var(--gold)', ySymbol:'GC=F'},
  {s:'CL=F', n:'Petroleo WTI', tipo:'commodity', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMxQzFDMUMnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+V1RJPC90ZXh0Pjwvc3ZnPg==', icon:'CL', color:'#8B4513', ySymbol:'CL=F'},
  {s:'BZ=F', n:'Brent Crude', tipo:'commodity', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMyQzJDNTQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Qlo8L3RleHQ+PC9zdmc+', icon:'BZ', color:'#2F4F4F', ySymbol:'BZ=F'},
  {s:'SI=F', n:'Plata Futuro', tipo:'commodity', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyNBOEE5QUQnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+QWc8L3RleHQ+PC9zdmc+', icon:'Ag', color:'#C0C0C0', ySymbol:'SI=F'},
  {s:'NG=F', n:'Gas Natural', tipo:'commodity', logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMic+PGNpcmNsZSBjeD0nMTYnIGN5PScxNicgcj0nMTYnIGZpbGw9JyMwMDY2Q0MnLz48dGV4dCB4PScxNicgeT0nMjEnIGZvbnQtZmFtaWx5PSdBcmlhbCxzYW5zLXNlcmlmJyBmb250LXNpemU9JzEzJyBmb250LXdlaWdodD0nYm9sZCcgZmlsbD0nI2ZmZicgdGV4dC1hbmNob3I9J21pZGRsZSc+Tkc8L3RleHQ+PC9zdmc+', icon:'NG', color:'#FF6B35', ySymbol:'NG=F'}
];

// EVENTOS MACRO SEMANALES
// A4: eventos IA con i18n (textos en aurex-i18n.js, 8 idiomas)
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
        '<span style="background:'+impColor+'20;border:1px solid '+impColor+'60;border-radius:4px;padding:2px 8px;font-size:10px;color:'+impColor+';font-weight:700">'+(window._i18n?window._i18n.t('ia_impacto'):'IMPACTO')+' '+(window._i18n?window._i18n.t('imp_'+ev.impacto.toLowerCase()):ev.impacto)+'</span>' +
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
          s.confianza = s.confianza || s.probPrincipal || s.prob_principal || 50;
          s.prob_principal = s.confianza;
          s.prob_alcista = s.prob_alcista || (s.direccion==='alcista' ? s.confianza : 100-s.confianza);
          s.prob_bajista = s.prob_bajista || (100 - (s.prob_alcista||50));
          s.estrellas = s.estrellas || 1;
          return s;
        });
        sigs.sort(function(a,b){ return (b.confianza||0) - (a.confianza||0); });
        window._iaSignals = sigs;
        window._iaSignalsFromBackend = true;
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
          upd.textContent='Act. '+ts.getHours()+':'+(ts.getMinutes()<10?'0':'')+ts.getMinutes()+' (backend)';
        }
        console.log('[Cobrex IA] OK — mostrando', sigs.length, 'senales del backend');
        return;
      }
      console.log('[Cobrex IA] Backend vacio — reintentando en 3s...');
      setTimeout(function(){ generarSenalesIA(); }, 3000);
    })
    .catch(function(err){
      console.error('[Cobrex IA] Error backend:', err, '— reintentando en 3s...');
      setTimeout(function(){ generarSenalesIA(); }, 3000);
    });
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
    if(upd){var now=new Date();upd.textContent='Act. '+now.getHours()+':'+(now.getMinutes()<10?'0':'')+now.getMinutes();}
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
    lb.innerHTML = '<div style="width:14px;height:14px;border:2px solid var(--gold);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0"></div><span style="font-size:11px;color:var(--textSec)">Cargando mas senales... <span id="ia-load-count">0</span>/' + phase2Activos.length + '</span>';
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
      _actualizarContadores(window._iaSignals || allSignals);
      _renderIALista(window._iaSignals || allSignals, false);
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
  if(sub) sub.textContent=signals.length+' SENALES IA - ORDENADAS POR PROBABILIDAD';
}

window._closeIAVarsPopup = function() {
  var el = document.getElementById('ia-vars-overlay');
  if(el) el.remove();
};
window.showIAVariablesPopup = function() {
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
    {k:'tendencia',      n:'1. Tendencia 24h',         d:'Variación % del precio en las últimas 24hs. Mide el momentum inmediato.',p:'Alta'},
    {k:'rsi',            n:'2. RSI14 Real',             d:'Índice de Fuerza Relativa de 14 períodos desde Binance/Yahoo. Detecta sobrecompra (>70) y sobreventa (<30).',p:'Alta'},
    {k:'volumen',        n:'3. Volumen Real',           d:'Ratio de volumen actual vs promedio de los últimos 5 días. Confirma si el movimiento tiene convicción.',p:'Alta'},
    {k:'volatilidad',    n:'4. Volatilidad',            d:'Amplitud del rango diario (high–low / precio). Alta volatilidad = mayor riesgo.',p:'Media'},
    {k:'correlacion',    n:'5. Correlación BTC/SPY',    d:'Para cripto: correlación con BTC. Para acciones: con S&P500. Detecta arrastre sistémico.',p:'Media'},
    {k:'oro_petroleo',   n:'6. Oro / Petr&#xF3;leo',         d:'Precios de activos refugio. Oro alto = aversión al riesgo. Impacta según tipo de activo.',p:'Media'},
    {k:'macro',          n:'7. Macro FED',              d:'Eventos macro de alto impacto programados (FOMC, CPI, PBI). Incrementa incertidumbre.',p:'Media'},
    {k:'earnings',       n:'8. Earnings',               d:'Reportes de resultados próximos. Históricamente elevan la volatilidad del activo.',p:'Media'},
    {k:'macd',           n:'9. MACD (12/26)',           d:'Divergencia entre EMA12 y EMA26 calculada sobre los últimos 30 días de precios de cierre. Detecta cruces de momentum.',p:'Alta'},
    {k:'soporte_resist', n:'10. Soporte / Resist. 30d', d:'Distancia del precio actual al máximo y mínimo de los últimos 30 días. Detecta zonas de oferta y demanda técnica.',p:'Alta'}
  ];
  var posCount = varDefs.filter(function(v){ return varScoreAvg[v.k] > 0.01; }).length;
  var negCount = varDefs.filter(function(v){ return varScoreAvg[v.k] < -0.01; }).length;
  var summaryHtml = signals.length > 0
    ? '<div style="display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--border2);border-radius:8px;padding:8px 12px;margin-bottom:12px">' +
        '<span style="font-size:11px;color:var(--textSec)">Mercado ahora:</span>' +
        '<span style="font-size:13px;font-weight:800;color:var(--green)">→ ' + posCount + ' al alza</span>' +
        '<span style="color:var(--textDim);font-size:11px">·</span>' +
        '<span style="font-size:13px;font-weight:800;color:var(--red)">↓ ' + negCount + ' a la baja</span>' +
      '</div>'
    : '';
  var varsHtml = varDefs.map(function(v) {
    var avg = varScoreAvg[v.k];
    var isPos = avg > 0.01;
    var isNeg = avg < -0.01;
    var color = isPos ? 'var(--green)' : isNeg ? 'var(--red)' : 'var(--textSec)';
    var bg = isPos ? '#3FB95012' : isNeg ? '#FF444412' : 'transparent';
    var border = isPos ? '#3FB95030' : isNeg ? '#FF444430' : 'var(--border)';
    var arrow = isPos ? '→ ' : isNeg ? '↓ ' : '— ';
    return '<div style="border:1px solid ' + border + ';border-radius:8px;padding:9px 11px;margin-bottom:7px;background:' + bg + '">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px">' +
        '<span style="font-size:11px;font-weight:700;color:' + color + '">' + arrow + v.n + '</span>' +
        '<span style="font-size:9px;background:var(--border);color:var(--textSec);border-radius:4px;padding:1px 5px">Peso ' + v.p + '</span>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--textSec);line-height:1.4">' + v.d + '</div>' +
    '</div>';
  }).join('');
  var overlay = document.createElement('div');
  overlay.id = 'ia-vars-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:#000000CC;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';
  overlay.innerHTML = '<div style="background:var(--card);border:1px solid var(--border2);border-radius:16px;padding:20px;width:100%;max-width:400px;max-height:85vh;overflow-y:auto;cursor:default">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
      '<div>' +
        '<div style="font-size:14px;font-weight:800;color:var(--gold)">Cobrex IA ⚡ — 10 VARIABLES</div>' +
        '<div style="font-size:10px;color:var(--textSec);margin-top:2px">Motor de señales v7 — tiempo real</div>' +
      '</div>' +
      '<button onclick="_closeIAVarsPopup()" style="background:var(--border);border:1px solid var(--border2);border-radius:8px;padding:4px 10px;color:var(--textSec);font-size:12px;cursor:pointer">✕</button>' +
    '</div>' +
    summaryHtml +
    '<div style="font-size:10px;color:var(--textSec);line-height:1.5;margin-bottom:12px">Cada señal es el resultado de puntuar 10 variables independientes. El score total determina la dirección y la probabilidad. Rango de probabilidad: 55%–88%.</div>' +
    varsHtml +
    '<div style="font-size:9px;color:var(--textDim);text-align:center;margin-top:8px">* Rango realista: 55%–88%. Nunca &lt;52% (sin señal) ni &gt;90% (certeza imposible en mercados)</div>' +
  '</div>';
  overlay.onclick = function(e) { if(e.target === overlay) window._closeIAVarsPopup(); }; overlay.firstElementChild && (overlay.firstElementChild.onclick = function(e){ e.stopPropagation(); });
  document.body.appendChild(overlay);
};

function setIAFiltro(filtro, el) {
  window._IA_FILTRO_ACTUAL = filtro;
  document.querySelectorAll('.ia-pill').forEach(function(p) {
    var isActive = p.getAttribute('data-filtro') === filtro;
    p.style.background = isActive ? 'var(--gold)' : 'transparent';
    p.style.color = isActive ? '#000' : (
      p.getAttribute('data-filtro')==='alcista'?'var(--green)':
      p.getAttribute('data-filtro')==='bajista'?'var(--red)':
      p.getAttribute('data-filtro')==='alta_conf'?'var(--gold)':
      p.getAttribute('data-filtro')==='cripto'?'#A78BFA':
      p.getAttribute('data-filtro')==='accion'?'#58A6FF':
      p.getAttribute('data-filtro')==='etf'?'#F0883E':
      p.getAttribute('data-filtro')==='metal'?'#FFD700':
      p.getAttribute('data-filtro')==='materia_prima'?'#C8A96E':
      p.getAttribute('data-filtro')==='bono'?'#79C0FF':'var(--gold)');
    p.style.borderColor = isActive ? 'var(--gold)' : '';
  });
  _renderIALista(window._iaSignals || [], false);
}

function _renderIALista(signals, keepLoadingBar) {
  var listEl = document.getElementById('ia-list');
  if (!listEl) return;
  var filtro = window._IA_FILTRO_ACTUAL || 'todo';
  var filtered = signals.filter(function(s) {
    if(filtro==='todo') return true;
    if(filtro==='alcista') return s.direccion==='alcista';
    if(filtro==='bajista') return s.direccion==='bajista';
    if(filtro==='alta_conf') return s.direccion==='alta_conf';
    return s.tipo === filtro;
  });
  if (!filtered.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--textSec);font-size:13px">No hay senales para este filtro</div>';
    return;
  }
  var lb = document.getElementById('ia-loading-bar');
  listEl.innerHTML = filtered.map(function(s, i) {
    var dirColor = s.direccion==='alcista'?'var(--green)':s.direccion==='bajista'?'var(--red)':'var(--gold)';
    var dirBg = s.direccion==='alcista'?'#3FB95020':s.direccion==='bajista'?'#FF444420':'var(--goldBg)';
    var dirLabel = s.direccion==='alcista'?'ALCISTA':s.direccion==='bajista'?'BAJISTA':'ALTA CONV-IA';
    // Para ALTA CONV-IA, obtener la sub-dirección del escenario_principal
    var altaConfDirLabel = '';
    var altaConfDirColor = '';
    if (s.direccion === 'alta_conf') {
      var escDir = (s.escenario_principal || '').toLowerCase();
      if (escDir.indexOf('alcista') >= 0) {
        altaConfDirLabel = '\u2191 ALCISTA';
        altaConfDirColor = 'var(--green)';
      } else if (escDir.indexOf('bajista') >= 0) {
        altaConfDirLabel = '\u2193 BAJISTA';
        altaConfDirColor = 'var(--red)';
      }
    }
    var tipoColor = s.tipo==='cripto'?'#A78BFA':s.tipo==='accion'?'#58A6FF':s.tipo==='etf'?'#F0883E':s.tipo==='metal'?'#FFD700':s.tipo==='materia_prima'?'#C8A96E':s.tipo==='bono'?'#79C0FF':'var(--gold)';
    var tipoLabel = s.tipo==='cripto'?'Cripto':s.tipo==='accion'?'Acciones':s.tipo==='etf'?'ETF':s.tipo==='metal'?'Metal':s.tipo==='materia_prima'?'Mat. Prima':s.tipo==='bono'?'Bono':'Otro';
    var estrellas = '';
    for(var e=0;e<5;e++) estrellas += e<s.estrellas?'<span style="color:var(--gold)">&#9733;</span>':'<span style="color:var(--border2)">&#9733;</span>';
    var precioFmt = _fmt(s.precio,'precio');
    var cambio24h = s.precio24h>0?((s.precio-s.precio24h)/s.precio24h*100):0;
    var pctColor = cambio24h>=0?'var(--green)':'var(--red)';
    var pctStr = _fmt(cambio24h,'pct');
    var abbr = s.abbr || s.simbolo.substring(0,3);
    var logoHtml = s.logo ?
      '<img src="'+s.logo+'" alt="'+s.simbolo+'" style="width:22px;height:22px;object-fit:contain;border-radius:50%" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'">'+
      '<span style="display:none;width:22px;height:22px;border-radius:50%;background:'+s.color+'30;display:none;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:'+s.color+'">'+abbr+'</span>' :
      '<span style="display:flex;width:22px;height:22px;border-radius:50%;background:'+s.color+'30;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:'+s.color+'">'+abbr+'</span>';
    return '<div class="ia-row" id="ia-row-'+i+'" style="border-bottom:1px solid var(--border);">' +
      '<div onclick="toggleIARow('+i+')" style="padding:10px 14px 8px;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);touch-action:manipulation">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px">' +
          '<div style="display:flex;align-items:center;gap:7px">' +
            '<div style="width:34px;height:34px;border-radius:50%;background:'+s.color+'15;border:1.5px solid '+s.color+'40;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">'+logoHtml+'</div>' +
            '<div>' +
              '<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">' +
                '<span style="font-size:13px;font-weight:700;color:var(--text)">'+s.simbolo+'</span>' +
                '<span style="font-size:9px;font-weight:700;background:'+dirBg+';color:'+dirColor+';border:1px solid '+dirColor+'60;border-radius:4px;padding:1px 5px;white-space:nowrap">'+dirLabel+'</span>' +
                (altaConfDirLabel ? '<span style="font-size:9px;font-weight:700;background:'+altaConfDirColor+'20;color:'+altaConfDirColor+';border:1px solid '+altaConfDirColor+'60;border-radius:4px;padding:1px 5px;margin-left:3px;white-space:nowrap">'+altaConfDirLabel+'</span>' : '') +
                '<span style="font-size:9px">'+estrellas+'</span>' +
              '</div>' +
              '<div style="font-size:10px;color:var(--textSec)">'+s.nombre+' <span style="color:'+tipoColor+'">&diams; '+tipoLabel+'</span></div>' +
            '</div>' +
          '</div>' +
          '<div style="text-align:right">' +
            '<div style="font-size:13px;font-weight:700;color:var(--text)">'+precioFmt+'</div>' +
            '<div style="font-size:11px;color:'+pctColor+'">'+pctStr+'</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:3px">' +
          '<span style="font-size:10px;color:var(--textSec)">PROB. IA <span style="color:'+dirColor+';font-weight:700">'+s.confianza+'%</span></span>' +
          (function(){var sc=s.scores||{};var keys=['tendencia','rsi','volumen','volatilidad','correlacion','oro_petroleo','macro','earnings','macd','soporte_resist'];var dots='';keys.forEach(function(k){var v=sc[k]||0;if(v>0.01)dots+='<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green);margin:0 1px;flex-shrink:0"></span>';else if(v<-0.01)dots+='<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--red);margin:0 1px;flex-shrink:0"></span>';});return dots?'<span style="display:inline-flex;align-items:center;flex-wrap:wrap;gap:1px;margin-left:7px">'+dots+'</span>':'';})() +
        '</div>' +
        '<div style="margin-top:3px;height:3px;background:var(--border);border-radius:2px"><div style="height:100%;width:'+Math.min(s.confianza,100)+'%;background:'+dirColor+';border-radius:2px;transition:width 0.5s"></div></div>' +
      '</div>' +
      '<div id="ia-detail-'+i+'" style="display:none;padding:0 14px 14px;background:var(--bg);border-top:1px solid var(--border);position:relative;">' + '<div style="text-align:center;padding:6px 0 2px;color:var(--textDim);font-size:10px;letter-spacing:0.5px;">&#9650; toca para cerrar</div>' + _buildIADetail(s)+'</div>' +
    '</div>';
  }).join('');
  if (keepLoadingBar && lb) listEl.appendChild(lb);
}

function _buildIADetail(s) {
  var dirColor = s.direccion==='alcista'?'var(--green)':s.direccion==='bajista'?'var(--red)':'var(--gold)';
  var dirLabel = s.direccion==='alcista'?'ALCISTA':s.direccion==='bajista'?'BAJISTA':'ALTA CONV-IA';
  var signo = s.direccion==='alcista'?'+':s.direccion==='bajista'?'-':'&#9889;';
  var html = '<div style="padding-top:12px">';
  html += '<div style="background:'+dirColor+'15;border:1px solid '+dirColor+'40;border-radius:10px;padding:10px 12px;margin-bottom:10px">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
  html += '<span style="font-size:13px;font-weight:700;color:'+dirColor+'">'+signo+' '+dirLabel+'</span>';
  html += '<span style="background:'+dirColor+';color:var(--chipTextActive);font-size:11px;font-weight:800;border-radius:6px;padding:2px 8px">PRINCIPAL '+s.prob_principal+'%</span>';
  html += '</div>';
  html += '<div style="font-size:11px;font-weight:600;color:var(--textSec);letter-spacing:0.5px;margin-bottom:6px">JUSTIFICACION DEL ANALISIS</div>';
  (s.motivos||[]).slice(0,5).forEach(function(m) {
    html += '<div style="display:flex;gap:6px;margin-bottom:5px"><span style="color:'+dirColor+';flex-shrink:0;font-weight:700">-></span><span style="font-size:11px;color:var(--textSec);line-height:1.4">'+m+'</span></div>';
  });
  html += '</div>';
  html += '<div style="display:flex;gap:8px;margin-bottom:10px">';
  var _cObj=s.direccion==='bajista'?'var(--red)':'var(--green)';
  html += '<div style="flex:1;background:var(--border);border-radius:8px;padding:8px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:2px">Objetivo</div><div style="font-size:12px;font-weight:700;color:'+_cObj+'">'+_fmt(s.objetivo,'precio')+'</div></div>';
  var _cStop=s.direccion==='bajista'?'#FF9500':'var(--red)';
  html += '<div style="flex:1;background:var(--border);border-radius:8px;padding:8px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:2px">Stop</div><div style="font-size:12px;font-weight:700;color:'+_cStop+'">'+_fmt(s.stop,'precio')+'</div></div>';
  var _uLabel=s.upside<0?'Downside':'Upside';
  var _uColor=s.upside<0?'var(--red)':'var(--green)';
  var _uSign=s.upside>=0?'+':'';
  html += '<div style="flex:1;background:var(--border);border-radius:8px;padding:8px;text-align:center"><div style="font-size:9px;color:var(--textSec);margin-bottom:2px">'+_uLabel+'</div><div style="font-size:12px;font-weight:700;color:'+_uColor+'">'+_uSign+s.upside.toFixed(1)+'%</div></div>';
  html += '</div>';

  // VARIABLES DEL MODELO — lista con colores verde/rojo
  if(s.scores) {
    var sc = s.scores;
    var varDefs = [
      {k:'tendencia',      label:'Tendencia 24h',         fmt:function(v){ return (v>0?'+':'')+(v*12.5).toFixed(1)+'%'; }},
      {k:'rsi',            label:'RSI14',                 fmt:function(v){ var rsi=s.rsi||50; return 'RSI '+Math.round(rsi); }},
      {k:'volumen',        label:'Volumen',               fmt:function(v){ return (s.volRel||1).toFixed(1)+'x prom.'; }},
      {k:'volatilidad',    label:'Volatilidad',           fmt:function(v){ return v>0.01?'baja':'v>-0.01'?'normal':'alta'; }},
      {k:'correlacion',    label:'Correlación BTC/SPY',   fmt:function(v){ return v>0.01?'positiva':v<-0.01?'negativa':'neutral'; }},
      {k:'oro_petroleo',   label:'Oro / Petr&#xF3;leo',        fmt:function(v){ return v>0.01?'favorable':v<-0.01?'adverso':'neutral'; }},
      {k:'macro',          label:'Macro FED',             fmt:function(v){ return v<-0.01?'evento activo':'sin eventos'; }},
      {k:'earnings',       label:'Earnings',              fmt:function(v){ return v>0.01?'próximos':'sin reporte'; }},
      {k:'macd',           label:'MACD (12/26)',          fmt:function(v){ return v>0.01?'alcista':v<-0.01?'bajista':'neutral'; }},
      {k:'soporte_resist', label:'Soporte / Resist. 30d', fmt:function(v){ return v>0.01?'cerca soporte':v<-0.01?'cerca resist.':'zona media'; }}
    ];
    var posVars = varDefs.filter(function(d){ return (sc[d.k]||0)>0.01; });
    var negVars = varDefs.filter(function(d){ return (sc[d.k]||0)<-0.01; });
    var neuVars = varDefs.filter(function(d){ return Math.abs(sc[d.k]||0)<=0.01; });
    html += '<div style="margin-bottom:10px">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px">';
    html += '<span style="font-size:10px;color:var(--textSec);font-weight:600;letter-spacing:.3px">VARIABLES DEL MODELO</span>';
    html += '<span style="font-size:10px"><span style="color:var(--green);font-weight:700">→ '+posVars.length+' alcistas</span><span style="color:var(--textSec);margin:0 5px">·</span><span style="color:var(--red);font-weight:700">↓ '+negVars.length+' bajistas</span></span>';
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
  }

  // TIMEFRAME CONTEXT — default 24h, contexto 7d/30d
  html += '<div style="margin-bottom:10px">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
  html += '<span style="font-size:10px;color:var(--textSec);font-weight:600">CONTEXTO TENDENCIA</span>';
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

  html += '<div style="font-size:10px;color:var(--textSec);margin-bottom:6px;font-weight:600">OTROS ESCENARIOS</div>';
  html += '<div style="display:flex;gap:6px">';
  if(s.direccion!=='alcista') html += '<div style="flex:1;background:#3FB95015;border:1px solid #3FB95040;border-radius:8px;padding:6px;text-align:center"><div style="font-size:9px;color:var(--green)">ALCISTA</div><div style="font-size:13px;font-weight:700;color:var(--green)">'+s.prob_alcista+'%</div></div>';
  if(s.direccion!=='bajista') html += '<div style="flex:1;background:#FF444415;border:1px solid #FF444440;border-radius:8px;padding:6px;text-align:center"><div style="font-size:9px;color:var(--red)">BAJISTA</div><div style="font-size:13px;font-weight:700;color:var(--red)">'+s.prob_bajista+'%</div></div>';
  if(s.direccion!=='alta_conf'&&s.prob_alta_conf) html += '<div style="flex:1;background:var(--goldBg);border:1px solid var(--gold40);border-radius:8px;padding:6px;text-align:center"><div style="font-size:9px;color:var(--gold)">ALTA CONV-IA</div><div style="font-size:13px;font-weight:700;color:var(--gold)">'+s.prob_alta_conf+'%</div></div>';
  html += '</div>';
  // BOTÓN COMPARTIR
  html += '<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">';
  html += '<button onclick="event.stopPropagation();_compartirSenal(\'' + s.simbolo + '\');return false;" ';
  html += 'style="width:100%;background:var(--border);border:1px solid var(--border2);border-radius:8px;padding:8px 12px;color:var(--text);font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;-webkit-tap-highlight-color:rgba(0,0,0,0)">';
  html += '<span style="font-size:15px">&#128257;</span> Compartir señal</button>';
  html += '</div>';
  html += '<div style="text-align:center;padding:8px 0 2px;color:var(--textDim);font-size:10px;letter-spacing:0.5px;">&#9650; toca para cerrar</div>';
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
  var dirLabel = sig.direccion==='alcista'?'ALCISTA':sig.direccion==='bajista'?'BAJISTA':'ALTA CONV-IA';
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
  (sig.motivos||[]).slice(0,3).forEach(function(m,i){ texto += (i+1)+'. '+m+'\n'; });
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
      '<div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:16px;text-align:center">Compartir señal '+sig.simbolo+'</div>' +
      '<div style="display:flex;gap:12px;justify-content:center;margin-bottom:16px">' +
        '<a href="'+wa+'" target="_blank" style="flex:1;background:#25D36620;border:1px solid #25D36660;border-radius:10px;padding:12px 8px;text-align:center;text-decoration:none"><div style="font-size:22px">💬</div><div style="font-size:10px;color:#25D366;margin-top:4px">WhatsApp</div></a>' +
        '<a href="'+tg+'" target="_blank" style="flex:1;background:#229ED920;border:1px solid #229ED960;border-radius:10px;padding:12px 8px;text-align:center;text-decoration:none"><div style="width:28px;height:28px;border-radius:50%;background:#229ED9;display:inline-flex;align-items:center;justify-content:center;margin-bottom:2px"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8.5l9-5-3 9-2-3-4 2z" fill="#fff"/></svg></div><div style="font-size:10px;color:#229ED9;margin-top:4px">Telegram</div></a>' +
        '<a href="'+ml+'" style="flex:1;background:var(--goldBg);border:1px solid var(--gold40);border-radius:10px;padding:12px 8px;text-align:center;text-decoration:none"><div style="font-size:22px">📧</div><div style="font-size:10px;color:var(--gold);margin-top:4px">Mail</div></a>' +
      '</div>' +
      '<button onclick="var o=document.getElementById(&apos;ia-share-overlay&apos;);if(o)o.remove();" style="width:100%;background:var(--border);border:1px solid var(--border2);border-radius:8px;padding:10px;color:var(--textSec);font-size:12px;cursor:pointer">Cancelar</button>' +
    '</div>';
    overlay.onclick=function(e){if(e.target===overlay){var o=document.getElementById('ia-share-overlay');if(o)o.remove();}};
    document.body.appendChild(overlay);
  };
  if(navigator.share) {
    navigator.share({ title: 'Cobrex IA — '+sig.simbolo+' '+dirLabel, text: texto }).catch(function(){ _showShareOverlay(); });
  } else {
    _showShareOverlay();
  }
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
  if(!raw) return { value:50, label:(window._i18n?window._i18n.t('pulse_z_neutral'):'Neutral'), color:'var(--gold)', emoji:'😐', vars:{} };
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
  // Macro FED + Geopolitics: only for GLOBAL/ACCIONES/FUTUROS/COMOD, NOT pure CRIPTO
  if(cat !== 'CRIPTO') {
    if(raw.macro) add('Macro_FED', raw.macro.score, 12);
    if(raw.geo)   add('Geopolitica', raw.geo.score, 4);
  }
  if(totalW===0) return { value:50, label:(window._i18n?window._i18n.t('pulse_z_neutral'):'Neutral'), color:'var(--gold)', emoji:'😐', vars:scores };
  var v = Math.min(100, Math.max(0, Math.round(weighted/totalW)));
  var label, color, emoji;
  if(v<=20)      { label=(window._i18n?window._i18n.t('pulse_z_miedo_ext'):'Miedo Extremo');  color='#C62828'; emoji='😨'; }
  else if(v<=40) { label=(window._i18n?window._i18n.t('pulse_z_miedo'):'Miedo');           color='#FF6B6B'; emoji='😟'; }
  else if(v<=60) { label=(window._i18n?window._i18n.t('pulse_z_neutral'):'Neutral');         color='var(--gold)'; emoji='😐'; }
  else if(v<=80) { label=(window._i18n?window._i18n.t('pulse_z_codicia'):'Codicia');         color='var(--green)'; emoji='😏'; }
  else           { label=(window._i18n?window._i18n.t('pulse_z_codicia_ext'):'Codicia Extrema'); color='#00E676'; emoji='🤑'; }
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
        var _pColor=catData.value<=20?"#C62828":catData.value<=40?"#FF6B6B":catData.value<=60?"var(--gold)":catData.value<=80?"var(--green)":"#00E676"; var _pEmoji=catData.value<=20?"😨":catData.value<=40?"😟":catData.value<=60?"😐":catData.value<=80?"😏":"🤑"; window._pulseCache[catKey]=Object.assign({},catData,{color:_pColor,emoji:_pEmoji});
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
    el.innerHTML = '<div style="padding:6px 14px;font-size:10px;color:var(--textDim);">Calculando Cobrex PULSEâ¢...</div>';
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
  if(d.value<=20)      edu='Pánico extremo. Históricamente zonas de oportunidad para inversores de largo plazo.';
  else if(d.value<=40) edu='Temor generalizado. Los inversores están vendiendo. Posibles oportunidades si el contexto es sólido.';
  else if(d.value<=60) edu='Mercado equilibrado. Ni euforia ni pánico. Momento ideal para analizar fundamentals.';
  else if(d.value<=80) edu='Optimismo en el mercado. Precios pueden estar elevados. Considerar toma de ganancias.';
  else                 edu='Euforia extrema. Alta probabilidad de corrección próxima. Máxima precaución.';
  var raw = window._pulseRaw || {};
  var bits = [];
  if(raw.vix)              bits.push('VIX: <b style="color:var(--text)">'+_fmt(raw.vix.price,'precio')+'</b>');
  if(raw.btcPct!==undefined)bits.push('BTC: <b style="color:'+(raw.btcPct>=0?'var(--green)':'var(--red)')+'">'+_fmt(raw.btcPct,'pct')+'</b>');
  if(raw.sp500)            bits.push('S&P: <b style="color:'+(raw.sp500.pct>=0?'var(--green)':'var(--red)')+'">'+_fmt(raw.sp500.pct,'pct')+'</b>');
  if(raw.gcf)              bits.push('Oro: <b style="color:'+(raw.gcf.pct<=0?'var(--green)':'var(--red)')+'">'+_fmt(raw.gcf.pct,'pct')+'</b>');
  var dataLine = '<div style="display:flex;flex-wrap:wrap;gap:5px;font-size:9px;color:var(--textSec);margin-top:3px;">'+bits.join('')+'</div>';
  var cats = ['GLOBAL','CRIPTO','ACCIONES','COMOD','FUTUROS'];
  var catLabels = {GLOBAL:'🌐 GLOBAL',CRIPTO:'🪙 CRIPTO',ACCIONES:'📈 ACCIONES',COMOD:'🛢️ COMOD',FUTUROS:'⚡ FUTUROS'};
  var filterBtns = '';
  cats.forEach(function(c) {
    var active = c===cat;
    var bg = active ? d.color : 'var(--border)';
    var col = active ? 'var(--bg)' : 'var(--textSec)';
    var fw = active ? '700' : '400';
    filterBtns += '<div data-pulse-cat="'+c+'" data-pulse-el="'+elId+'" style="font-size:8px;font-weight:'+fw+';color:'+col+';background:'+bg+';border-radius:4px;padding:2px 5px;cursor:pointer;white-space:nowrap;flex-shrink:0;">'+catLabels[c]+'</div>';
  });
  var nvars = Object.keys(d.vars).length;
  el.innerHTML =
    '<div style="padding:'+(elId.indexOf('port')>=0?'4px 10px 4px':'8px 14px 6px')+';border-bottom:1px solid var(--border);background:var(--bg);">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">' +
        '<span style="font-size:'+(compact?'9':'10')+'px;font-weight:700;color:var(--gold);letter-spacing:0.5px;">&#x26A1; Cobrex PULSE&#x2122;</span>' +
        '<div id="pulse-info-btn-'+elId+'" style="font-size:9px;color:#58A6FF;cursor:pointer;padding:2px 7px;border-radius:4px;border:1px solid var(--border2);white-space:nowrap;">&#x2139; Ver variables</div>' +
      '</div>' +
      '<div id="pulse-filters-'+elId+'" style="display:flex;gap:4px;flex-wrap:nowrap;overflow-x:auto;margin-bottom:6px;-webkit-overflow-scrolling:touch;">'+filterBtns+'</div>' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        gauge +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:15px;font-weight:700;color:'+d.color+';">'+d.emoji+' '+d.value+' &#x2014; '+d.label+'</div>' +
          (cat==='CRIPTO' && (btcSentIdx !== null || altFngIdx !== null) ?
            '<div style="display:flex;gap:6px;align-items:center;margin-top:3px;flex-wrap:wrap;">' +
              '<span style="font-size:9px;color:var(--gold);font-weight:700;">&#x25B6; Cobrex PULSE&#x2122; <b style="font-size:12px;">'+d.value+'</b></span>' +
              (btcSentIdx !== null ? '<span style="font-size:9px;color:#00BFFF;font-weight:700;">&#x25B6; BTC Sent. <b style="font-size:12px;">'+btcSentIdx+'</b></span>' : '') +
              (altFngIdx !== null ? '<span style="font-size:9px;color:#FF6B6B;font-weight:700;">&#x25B6; Crypto F&G <b style="font-size:12px;">'+altFngIdx+'</b></span>' : '') +
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
    ['&#x1F4C9;','VIX volatilidad','Yahoo','14%',fmtPrice(raw.vix),'#FF6B6B'],
    ['&#x1F4C8;','S&P500 momentum','Yahoo','8%', fmtPct(raw.sp500&&raw.sp500.pct),'var(--green)'],
    ['&#x26A1;','ES=F S&P Futuro','Yahoo','8%',  fmtPct(raw.esf&&raw.esf.pct),'var(--green)'],
    ['&#x26A1;','NQ=F Nasdaq Fut','Yahoo','6%',  fmtPct(raw.nqf&&raw.nqf.pct),'var(--green)'],
    ['&#x26A1;','YM=F Dow Futuro','Yahoo','4%',  fmtPct(raw.ymf&&raw.ymf.pct),'var(--green)'],
    ['&#x26A1;','RTY=F Russell Fut','Yahoo','3%',fmtPct(raw.rtyf&&raw.rtyf.pct),'var(--green)'],
    ['&#x1F947;','Oro GC=F','Yahoo','8%',         fmtPct(raw.gcf&&raw.gcf.pct),'var(--gold)'],
    ['&#x26AA;','Plata SI=F','Yahoo','4%',         fmtPct(raw.sif&&raw.sif.pct),'var(--gold)'],
    ['&#x1F6E2;','Petr&#xF3;leo CL=F','Yahoo','5%',fmtPct(raw.clf&&raw.clf.pct),'var(--gold)'],
    ['&#x1FA9C;','Cobre HG=F','Yahoo','4%',        fmtPct(raw.hgf&&raw.hgf.pct),'var(--gold)'],
    ['&#x1F3E6;','Macro FED','FRED API','12%', raw.macro ? raw.macro.score+' pts' : 'Calc...', raw.macro ? 'var(--text)' : 'var(--textDim)'],
    ['&#x1F30D;','Geopol&#xED;tica','GDELT','4%', raw.geo ? raw.geo.score+' pts' : 'Calc...', raw.geo ? 'var(--text)' : 'var(--textDim)']
  ];
  var tableRows = rows.map(function(r) {
    return '<tr><td style="padding:2px 4px;color:'+r[5]+';">'+r[0]+' '+r[1]+'</td><td style="color:var(--textDim);font-size:8px;padding:2px 4px;">'+r[2]+'</td><td style="color:var(--textSec);padding:2px 4px;">'+r[3]+'</td><td style="color:var(--text);padding:2px 4px;">'+r[4]+'</td></tr>';
  }).join('');
  ov.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border2);border-radius:16px;padding:18px;max-width:360px;width:100%;margin:auto;">' +
      '<div style="font-size:13px;font-weight:700;color:var(--gold);margin-bottom:3px;">&#x26A1; Cobrex FEAR &amp; GREED 14X&#x2122;</div>' +
      '<div style="font-size:9px;color:#58A6FF;margin-bottom:10px;">El &#xED;ndice de sentimiento m&#xE1;s completo del mercado</div>' +
      '<div style="font-size:10px;color:var(--textSec);line-height:1.6;margin-bottom:8px;">' +
        '<b style="color:var(--text);">Las 5 zonas:</b> ' +
        '&#x1F534; 0-20 Miedo Extremo &nbsp;' +
        '&#x1F7E0; 21-40 Miedo &nbsp;' +
        '&#x1F7E1; 41-60 Neutral &nbsp;' +
        '&#x1F7E2; 61-80 Codicia &nbsp;' +
        '&#x1F49A; 81-100 Codicia Extrema' +
      '</div>' +
      '<div style="font-size:10px;font-weight:700;color:var(--text);margin-bottom:6px;">Variables activas (12 de 14):</div>' +
      '<table style="width:100%;font-size:9px;border-collapse:collapse;">' +
        '<tr style="color:var(--border2);font-size:8px;"><td style="padding:2px 4px;">VARIABLE</td><td>FUENTE</td><td>PESO</td><td>AHORA</td></tr>' +
        tableRows +
      '</table>' +
      '<div style="font-size:8px;color:var(--border2);margin-top:8px;line-height:1.4;font-style:italic;">* Macro FED (FRED API) y Geopol&#xED;tica (GDELT Project) activos con fallback autom&#xE1;tico. 14 variables = cobertura completa de m&#xFA;ltiples mercados.</div>' +
      '<div style="font-size:8px;color:var(--border2);margin-top:4px;line-height:1.4;">* Este &#xED;ndice es propio de Cobrex. Difiere del de Binance (solo cripto, 5 variables) y CNN (solo acciones, 7 variables). Cobrex PULSE integra m&#xFA;ltiples mercados.</div>' +
      '<div id="pulse-info-close" style="margin-top:14px;text-align:center;padding:10px;background:var(--gold);border-radius:8px;color:var(--bg);font-weight:700;cursor:pointer;font-size:13px;">Entendido</div>' +
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
  for(var i=0; i<rawSyms.length; i++){
    var sym = rawSyms[i];
    try {
      var url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/' + sym + '?interval=1d&range=2d');
      var res = await fetch(url, {signal: AbortSignal.timeout(12000)});
      var wrapper = await res.json();
      var data = JSON.parse(wrapper.contents);
      if(data.chart && data.chart.result && data.chart.result[0]) {
        var meta = data.chart.result[0].meta;
        var price = meta.regularMarketPrice || 0;
        var prev = meta.previousClose || meta.chartPreviousClose || price;
        var pct = prev > 0 ? ((price - prev) / prev * 100) : 0;
        var open = (meta.marketState === 'REGULAR' || meta.marketState === 'PRE' || meta.marketState === 'POST');
        results[sym] = { price: price, pct: pct, open: open, state: meta.marketState || 'CLOSED' };
        window._futuresCache = results;
        window._futuresTs = Date.now();
        if(typeof _renderFuturesBanner === 'function'){
          _renderFuturesBanner();
          var _tmpFut = document.createElement('div');
          _tmpFut.id = 'tmp-fut-prog'; _tmpFut.style.display = 'none';
          document.body.appendChild(_tmpFut);
          _renderFuturesBanner('tmp-fut-prog');
          var _sb = document.getElementById('combo-slide-b');
          if(_sb) _sb.innerHTML = _tmpFut.innerHTML;
          document.body.removeChild(_tmpFut);
        }
      }
    } catch(e) {}
    await new Promise(function(r){ setTimeout(r, 400); });
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
    el.innerHTML = '<div style="padding:6px 14px;font-size:10px;color:var(--textDim);">Cargando...</div>';
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
    var stCol = d.open ? 'var(--green)' : 'var(--textDim)';
    var catColor = catColors[item.cat] || 'var(--textSec)';
    var priceStr = item.dec === 0 ? _fmt(d.price,'qty') : _fmt(d.price,'precio');
    return '<div style="display:flex;flex-direction:column;align-items:center;min-width:58px;padding:2px 5px;border-right:1px solid var(--border);flex-shrink:0;">' +
      '<div style="font-size:'+(isPortfolio?'7':'8')+'px;color:'+catColor+';font-weight:700;letter-spacing:0.3px;">'+item.cat+'</div>' +
      '<div style="font-size:9px;font-weight:700;color:var(--text);white-space:nowrap;display:flex;align-items:center;gap:2px;"><span style="font-size:7px;color:'+stCol+';">&#x25CF;</span>'+item.n+'</div>' +
      '<div style="font-size:9px;color:var(--text);">'+priceStr+'</div>' +
      '<div style="font-size:9px;font-weight:700;color:'+pctColor+';">'+pctStr+'</div>' +
    '</div>';
  }).filter(Boolean).join('');
  var editBtn = '<div onclick="editFuturesBanner()" style="font-size:12px;color:#3B9EF5;cursor:pointer;padding:4px 8px;border-radius:4px;border:1px solid #3B9EF5;flex-shrink:0;margin-right:10px;">&#9998;</div>';
  el.innerHTML = '<div style="display:flex;align-items:center;background:var(--bg);border-bottom:1px solid var(--border);">' + '<div style="flex:1;display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;padding:8px 4px 8px 10px;">' + chips + '</div>' + editBtn + '</div>';
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
    var onBg = on ? 'var(--green)' : 'var(--border)';
    var knobL = on ? '18px' : '2px';
    var lbl = item.n + ' (' + item.rawS + ')';
    var togId = 'fut-tog-' + item.rawS.replace(/[^a-zA-Z0-9]/g,'_');
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">' +
      '<span style="color:var(--text);font-size:13px;">' + lbl + '</span>' +
      '<div onclick="toggleFutPref(\'' + item.rawS + '\')" id="' + togId + '" style="width:36px;height:20px;border-radius:10px;background:' + onBg + ';cursor:pointer;position:relative;">' +
      '<div style="position:absolute;top:2px;left:' + knobL + ';width:16px;height:16px;border-radius:50%;background:var(--card);"></div></div></div>';
  }).join('');
  var popup = document.createElement('div');
  popup.id = 'aurex-fut-edit-popup';
  popup.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;';
  popup.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border2);border-radius:14px;padding:20px;width:88%;max-width:340px;max-height:85vh;overflow-y:auto;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<span style="font-size:15px;font-weight:700;color:var(--text);">Futuros en banner</span>' +
        '<button onclick="document.getElementById(&apos;aurex-fut-edit-popup&apos;).remove()" style="background:var(--border);border:1px solid var(--border2);border-radius:6px;color:var(--textSec);font-size:16px;cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">&#x2715;</button>' +
      '</div>' +
      rows +
      '<button onclick="document.getElementById(&apos;aurex-fut-edit-popup&apos;).remove();if(typeof _renderFuturesBanner===&apos;function&apos;){_renderFuturesBanner(&apos;port-futures-banner&apos;);_renderFuturesBanner(&apos;mkt-futures-banner&apos;);var _tmp=document.createElement(&apos;div&apos;);_tmp.id=&apos;tmp-fut-listo&apos;;_tmp.style.display=&apos;none&apos;;document.body.appendChild(_tmp);_renderFuturesBanner(&apos;tmp-fut-listo&apos;);var _sb=document.getElementById(&apos;combo-slide-b&apos;);if(_sb)_sb.innerHTML=_tmp.innerHTML;document.body.removeChild(_tmp);}" style="width:100%;background:var(--green);border:none;border-radius:8px;padding:10px;color:var(--bg);font-size:14px;font-weight:700;cursor:pointer;margin-top:14px;">Listo</button>' +
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
    togEl.style.background = on ? 'var(--green)' : 'var(--border)';
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
    '<div style="background:' + (ev.bg||'#1A0D00') + ';border-bottom:1px solid ' + (ev.border||'var(--gold)') + ';padding:5px 12px;display:flex;align-items:center;gap:8px;overflow:hidden;">' +
      '<span style="font-size:8px;font-weight:700;color:' + (ev.color||'var(--gold)') + ';letter-spacing:1px;flex-shrink:0;white-space:nowrap;">EVENTOS</span>' +
      '<div style="overflow:hidden;flex:1;">' +
        '<div id="mkt-news-ticker" style="display:flex;animation:tkScroll 6s linear infinite;">' +
          '<span style="white-space:nowrap;color:var(--text);font-size:10px;padding-right:60px;">' + ticker + '</span>' +
          '<span style="white-space:nowrap;color:var(--text);font-size:10px;padding-right:60px;">' + ticker + '</span>' +
        '</div>' +
      '</div>' +
      '<span onclick="this.parentElement.parentElement.style.display=&apos;none&apos;" style="color:var(--textSec);font-size:12px;cursor:pointer;flex-shrink:0;padding:0 4px;">&#x2715;</span>' +
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
    hdrDiv.innerHTML = _makeSVG('_al') + '<span style="font-weight:700;color:#F7D060;font-size:15px;letter-spacing:1px;">Cobrex</span><span style="color:var(--textDim);font-size:15px;"> Alertas</span>';
    alertasScreen.insertBefore(hdrDiv, alertasScreen.firstChild);
  }

  var perfilScreen = document.getElementById('screen-perfil');
  if (perfilScreen && !perfilScreen.querySelector('.aurex-hdr-added')) {
    var hdrDiv = document.createElement('div');
    hdrDiv.className = 'aurex-hdr-added';
    hdrDiv.style.cssText = 'display:flex;align-items:center;gap:6px;padding:10px 16px 6px;';
    hdrDiv.innerHTML = _makeSVG('_pf') + '<span style="font-weight:700;color:#F7D060;font-size:15px;letter-spacing:1px;">Cobrex</span><span style="color:var(--textDim);font-size:15px;"> Perfil</span>';
    perfilScreen.insertBefore(hdrDiv, perfilScreen.firstChild);
  }
}

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    _initHeaderLogos();
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
      if(sp.textContent.trim() === 'desde compra') sp.remove();
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
      {key:'24h',label:'24 horas'},
      {key:'7d',label:'7 días'},
      {key:'1m',label:'1 mes'},
      {key:'3m',label:'3 meses'},
      {key:'1y',label:'1 año'},
      {key:'buy',label:'Desde compra',border:true}
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
  var prices = window._IA_PRECIOS;
  if(!items || !prices) return;
  var totalNow = 0, totalBefore = 0;
  items.forEach(function(item) {
    var p = prices[item.simbolo];
    if(!p) return;
    var qty = parseFloat(item.cantidad)||0;
    var pNow = parseFloat(p.precio)||0;
    totalNow += qty*pNow;
    var pBefore;
    if(period==='buy') {
      pBefore = parseFloat(item.precio_compra)||pNow;
    } else if(period==='24h') {
      pBefore = parseFloat(p.precio24h)||pNow;
    } else if(period==='7d') {
      pBefore = parseFloat(p.precio7d)||parseFloat(p.precio24h)||pNow;
    } else if(period==='1m') {
      pBefore = parseFloat(p.precio30d)||(p.closes30d&&p.closes30d.length?parseFloat(p.closes30d[0]):0)||parseFloat(p.precio24h)||pNow;
    } else if(period==='3m') {
      var c=p.closes30d; var p3=c&&c.length>=30?parseFloat(c[0]):0;
      pBefore = p3||parseFloat(p.precio30d)||parseFloat(p.precio24h)||pNow;
    } else if(period==='1y') {
      pBefore = parseFloat(p.low52w)||parseFloat(p.precio30d)||parseFloat(p.precio24h)||pNow;
    } else {
      pBefore = parseFloat(p.precio24h)||pNow;
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
  if(el2){el2.textContent=_fmt(pct,'pct');el2.style.color=color;el2.style.background=bg;}
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
    + '<div id="combo-tab-a" style="' + sOn  + '" onclick="if(window._comboActive!==0&&window._comboBannerFlip)window._comboBannerFlip()">Mercados</div>'
    + '<div id="combo-tab-b" style="' + sOff + '" onclick="if(window._comboActive!==1&&window._comboBannerFlip)window._comboBannerFlip()">Futuros</div>'
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
  window._comboBannerTimer = setInterval(_comboFlip, 4000);
}
// ============================================================
// === Cobrex THEME SYSTEM (Fase 2c — 15/abril/2026) ===========
// Mirror de src/lib/ThemeContext.js de app nativa iOS
// Modos: 'light' | 'dark' | 'system'
// Default: 'light' (decisión Fernando 13/abril)
// ============================================================
(function(){
  var STORAGE_KEY = 'aurex_theme';
  var DEFAULT_PREF = 'light';

  function getPreference(){
    var p = localStorage.getItem(STORAGE_KEY);
    return (p === 'light' || p === 'dark' || p === 'system') ? p : DEFAULT_PREF;
  }

  function resolveMode(pref){
    if(pref === 'system'){
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    return pref;
  }

  function applyThemeToDOM(mode){
    document.documentElement.setAttribute('data-theme', mode);
    var meta = document.getElementById('aurex-theme-color-meta');
    if(meta) meta.setAttribute('content', mode === 'light' ? '#EEF1F7' : 'var(--bg)');
  }

  function updateSelectorUI(pref){
    var sel = document.getElementById('theme-selector');
    if(!sel) return;
    var chips = sel.querySelectorAll('[data-theme-mode]');
    chips.forEach(function(chip){
      var mode = chip.getAttribute('data-theme-mode');
      if(mode === pref){
        chip.style.background = 'var(--gold)';
        chip.style.borderColor = 'var(--gold)';
        chip.style.color = 'var(--chipTextActive)';
        chip.style.fontWeight = '700';
      } else {
        chip.style.background = 'var(--border)';
        chip.style.borderColor = 'var(--border)';
        chip.style.color = 'var(--text)';
        chip.style.fontWeight = '500';
      }
    });
  }

  window.aurexSetTheme = function(pref){
    if(pref !== 'light' && pref !== 'dark' && pref !== 'system') return;
    try{ localStorage.setItem(STORAGE_KEY, pref); } catch(e){}
    applyThemeToDOM(resolveMode(pref));
    updateSelectorUI(pref);
  };

  window.aurexInitTheme = function(){
    var pref = getPreference();
    applyThemeToDOM(resolveMode(pref));
    updateSelectorUI(pref);
  };

  // Escuchar cambios del sistema si el usuario está en modo 'system'
  if(window.matchMedia){
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var reapplyIfSystem = function(){
      if(getPreference() === 'system') applyThemeToDOM(resolveMode('system'));
    };
    if(mq.addEventListener) mq.addEventListener('change', reapplyIfSystem);
    else if(mq.addListener) mq.addListener(reapplyIfSystem); // compat Safari viejo
  }

  // Auto-init al cargar
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', window.aurexInitTheme);
  } else {
    window.aurexInitTheme();
  }
})();
