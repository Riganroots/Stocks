const STOCKS = [
  {symbol:'NABIL',name:'Nabil Bank Limited',sector:'Commercial Bank',price:528.7,prev:528.5,volume:60383,score:82,status:'Research'},
  {symbol:'GBIME',name:'Global IME Bank Limited',sector:'Commercial Bank',price:243.0,prev:243.9,volume:78565,score:79,status:'Watch'},
  {symbol:'SHIVM',name:'Shivam Cements Ltd.',sector:'Manufacturing',price:681.0,prev:685.0,volume:106558,score:76,status:'Watch'},
  {symbol:'CHCL',name:'Chilime Hydropower Company Limited',sector:'Hydropower',price:339.0,prev:341.7,volume:53796,score:74,status:'Neutral'},
  {symbol:'NLIC',name:'Nepal Life Insurance Co. Ltd.',sector:'Life Insurance',price:726.9,prev:727.9,volume:7723,score:71,status:'Neutral'},
  {symbol:'NRIC',name:'Nepal Re-Insurance Company Limited',sector:'Others',price:802.9,prev:803.0,volume:7826,score:61,status:'Caution'},
  {symbol:'API',name:'Api Power Company Ltd.',sector:'Hydropower',price:338.8,prev:341.0,volume:262514,score:69,status:'Watch'},
  {symbol:'HDL',name:'Himalayan Distillery Limited',sector:'Manufacturing',price:1293.0,prev:1286.0,volume:102119,score:77,status:'Research'},
  {symbol:'ADBL',name:'Agricultural Development Bank Limited',sector:'Commercial Bank',price:309.0,prev:310.0,volume:25817,score:null,status:'Insufficient'},
  {symbol:'KAHL',name:'Kalanga Hydro Limited',sector:'Hydropower',price:458.0,prev:467.0,volume:23329,score:null,status:'Insufficient'},
  {symbol:'KBL',name:'Kumari Bank Limited',sector:'Commercial Bank',price:225.5,prev:225.0,volume:524588,score:null,status:'Insufficient'},
  {symbol:'MBJC',name:'Madhya Bhotekoshi Jalavidyut Company Limited',sector:'Hydropower',price:295.0,prev:293.7,volume:56578,score:null,status:'Insufficient'},
  {symbol:'MKHC',name:'Maya Khola Hydropower Company Limited',sector:'Hydropower',price:249.0,prev:254.0,volume:7319,score:null,status:'Insufficient'},
  {symbol:'NIBSF2',name:'NIBL Samriddhi Fund 2',sector:'Mutual Fund',price:8.62,prev:8.63,volume:20899,score:null,status:'Insufficient'},
  {symbol:'OMPL',name:'Om Megashree Pharmaceuticals Limited',sector:'Manufacturing',price:867.0,prev:856.9,volume:3656,score:null,status:'Insufficient'},
  {symbol:'PSF',name:'Prabhu Select Fund',sector:'Mutual Fund',price:10.92,prev:10.9,volume:16400,score:null,status:'Insufficient'},
  {symbol:'RHGCL',name:'Rapti Hydro and General Construction Limited',sector:'Hydropower',price:259.9,prev:260.0,volume:9500,score:null,status:'Insufficient'},
  {symbol:'RHPL',name:'Rasuwagadhi Hydropower Company Limited',sector:'Hydropower',price:167.4,prev:168.0,volume:40582,score:null,status:'Insufficient'},
  {symbol:'SAIL',name:'Shreenagar Agritech Industries Limited',sector:'Manufacturing',price:962.0,prev:978.8,volume:8500,score:null,status:'Insufficient'},
  {symbol:'SCB',name:'Standard Chartered Bank Limited',sector:'Commercial Bank',price:663.0,prev:661.0,volume:9574,score:null,status:'Insufficient'},
  {symbol:'SPDL',name:'Synergy Power Development Ltd.',sector:'Hydropower',price:345.1,prev:347.8,volume:50298,score:null,status:'Insufficient'},
  {symbol:'UPPER',name:'Upper Tamakoshi Hydropower Ltd',sector:'Hydropower',price:189.9,prev:191.0,volume:65932,score:null,status:'Insufficient'}
];

const META = {priceDate:'2026-10-02',previousDate:'2026-10-01',priceSource:'socrateai-official/nepse-open-data'};
const FUNDAMENTALS = (window.NEPSE_FUNDAMENTALS && window.NEPSE_FUNDAMENTALS.records) || {};
const TECHNICALS = (window.NEPSE_GENERATED && window.NEPSE_GENERATED.technicals) || {};
const MODEL_SCORES = (window.NEPSE_GENERATED && window.NEPSE_GENERATED.scores) || {};
const ANNOUNCEMENTS = (window.NEPSE_ANNOUNCEMENTS && window.NEPSE_ANNOUNCEMENTS.items) || [];
const MARKET_META = window.NEPSE_GENERATED || {};
const SWING_SCANNER = (window.NEPSE_SWING_SETUPS && window.NEPSE_SWING_SETUPS.setups) || {};
const SWING_SCANNER_META = window.NEPSE_SWING_SETUPS || {};
const SWING_BACKTEST = window.NEPSE_SWING_BACKTEST || {};
const DAILY_SWING_PLAN = window.NEPSE_DAILY_SWING_PLAN || {};
const TRADING_COSTS = window.NEPSE_TRADING_COSTS || {};
const COST_SENSITIVITY = window.NEPSE_SWING_COST_SENSITIVITY || {};
STOCKS.forEach(function(x){var t=TECHNICALS[x.symbol];if(!t)return;if(t.close!=null)x.price=Number(t.close);if(t.prevClose!=null)x.prev=Number(t.prevClose);if(t.lastVolume!=null)x.volume=Number(t.lastVolume);});
const HISTORY = {"API":[{"date":"2026-09-23","close":334,"open":338,"high":338.9,"low":333.5,"volume":233458},{"date":"2026-09-24","close":334.8,"open":334,"high":335.7,"low":330.1,"volume":222689},{"date":"2026-09-28","close":335,"open":336,"high":337.9,"low":333,"volume":156452},{"date":"2026-09-29","close":334,"open":336,"high":336,"low":331,"volume":172257},{"date":"2026-09-30","close":335,"open":335,"high":336.5,"low":333.4,"volume":202365},{"date":"2026-10-01","close":341,"open":335,"high":345,"low":332,"volume":673559},{"date":"2026-10-02","close":338.8,"open":341,"high":344,"low":335.2,"volume":262514}],"CHCL":[{"date":"2026-09-23","close":354.5,"open":361,"high":362,"low":352.5,"volume":68382},{"date":"2026-09-24","close":352,"open":336.8,"high":359,"low":336.8,"volume":83517},{"date":"2026-09-28","close":353.3,"open":352,"high":360,"low":345.3,"volume":73527},{"date":"2026-09-29","close":349,"open":351,"high":355,"low":346.4,"volume":30207},{"date":"2026-09-30","close":348.8,"open":350,"high":350,"low":345,"volume":65137},{"date":"2026-10-01","close":341.7,"open":349.1,"high":350,"low":341.2,"volume":61162},{"date":"2026-10-02","close":339,"open":341.7,"high":345,"low":339,"volume":53796}],"GBIME":[{"date":"2026-09-23","close":243,"open":247.5,"high":247.5,"low":240.8,"volume":265691},{"date":"2026-09-24","close":243.8,"open":247.5,"high":247.5,"low":240.4,"volume":223433},{"date":"2026-09-28","close":243.2,"open":243.8,"high":244,"low":240,"volume":152777},{"date":"2026-09-29","close":242.2,"open":243.5,"high":244,"low":241,"volume":175880},{"date":"2026-09-30","close":243.5,"open":230.1,"high":245,"low":230.1,"volume":156159},{"date":"2026-10-01","close":243.9,"open":245,"high":245,"low":242,"volume":160436},{"date":"2026-10-02","close":243,"open":244,"high":244.9,"low":242,"volume":78565}],"HDL":[{"date":"2026-09-23","close":1278.3,"open":1284,"high":1290,"low":1270.2,"volume":160341},{"date":"2026-09-24","close":1312,"open":1280,"high":1320,"low":1270.2,"volume":269642},{"date":"2026-09-28","close":1323,"open":1312,"high":1363,"low":1305.1,"volume":269014},{"date":"2026-09-29","close":1297,"open":1323,"high":1329,"low":1285,"volume":177277},{"date":"2026-09-30","close":1292,"open":1261,"high":1296,"low":1261,"volume":106475},{"date":"2026-10-01","close":1286,"open":1292,"high":1298.8,"low":1283,"volume":78951},{"date":"2026-10-02","close":1293,"open":1350,"high":1350,"low":1285,"volume":102119}],"NABIL":[{"date":"2026-09-23","close":565,"open":570,"high":570,"low":565,"volume":88866},{"date":"2026-09-24","close":569,"open":566,"high":570,"low":566,"volume":70719},{"date":"2026-09-28","close":567,"open":570,"high":570.4,"low":567,"volume":71595},{"date":"2026-09-29","close":566,"open":567,"high":568,"low":563,"volume":124364},{"date":"2026-09-30","close":530.7,"open":538,"high":538.9,"low":529,"volume":96131},{"date":"2026-10-01","close":528.5,"open":531,"high":532,"low":525,"volume":73612},{"date":"2026-10-02","close":528.7,"open":529,"high":533,"low":525,"volume":60383}],"NLIC":[{"date":"2026-09-23","close":743.4,"open":792.7,"high":792.7,"low":736,"volume":19283},{"date":"2026-09-24","close":745,"open":706.3,"high":745,"low":706.3,"volume":8391},{"date":"2026-09-28","close":736,"open":745,"high":745,"low":735,"volume":26881},{"date":"2026-09-29","close":735,"open":736,"high":736,"low":730.1,"volume":20365},{"date":"2026-09-30","close":727.8,"open":734,"high":745,"low":725,"volume":14088},{"date":"2026-10-01","close":727.9,"open":727,"high":739,"low":721,"volume":12080},{"date":"2026-10-02","close":726.9,"open":691.6,"high":740,"low":691.6,"volume":7723}],"NRIC":[{"date":"2026-09-23","close":820,"open":873.6,"high":873.6,"low":799,"volume":13340},{"date":"2026-09-24","close":817,"open":800,"high":847,"low":800,"volume":9109},{"date":"2026-09-28","close":806.2,"open":817,"high":820,"low":805.3,"volume":15010},{"date":"2026-09-29","close":805,"open":765.9,"high":817.9,"low":765.9,"volume":19736},{"date":"2026-09-30","close":806,"open":805,"high":808,"low":799,"volume":7214},{"date":"2026-10-01","close":803,"open":800.1,"high":809.4,"low":795.5,"volume":12520},{"date":"2026-10-02","close":802.9,"open":795,"high":809,"low":795,"volume":7826}],"SHIVM":[{"date":"2026-09-23","close":687,"open":686,"high":697,"low":685,"volume":555257},{"date":"2026-09-24","close":702,"open":689,"high":704.5,"low":686.1,"volume":513184},{"date":"2026-09-28","close":695.1,"open":737.1,"high":737.1,"low":691,"volume":424127},{"date":"2026-09-29","close":690.1,"open":693,"high":697,"low":685,"volume":250541},{"date":"2026-09-30","close":684.5,"open":691,"high":691,"low":683,"volume":222414},{"date":"2026-10-01","close":685,"open":685,"high":689.5,"low":680.1,"volume":134104},{"date":"2026-10-02","close":681,"open":692,"high":692,"low":680.3,"volume":106558}]};
const DEFAULT_HOLDINGS = [];

const state = {
  page:'dashboard',
  selected:'NABIL',
  holdings:read('nepseHoldings',DEFAULT_HOLDINGS),
  watchlist:read('nepseWatchlist',['NABIL','GBIME','SHIVM','NRIC']),
  alerts:read('nepseAlerts',[
    {symbol:'NABIL',type:'Price',rule:'Below Rs 500'},
    {symbol:'GBIME',type:'Score',rule:'Above 80'}
  ]),
  swingPlans:read('nepseSwingPlans',{}),
  swingSettings:read('nepseSwingSettings',{capital:'',riskPct:''}),
  tradeJournal:read('nepseTradeJournal',[]),
  swingScannerMin:read('nepseSwingScannerMin',50)
};

function read(k,fallback){try{var v=localStorage.getItem(k);return v?JSON.parse(v):fallback;}catch(e){return fallback;}}
function save(){
  localStorage.setItem('nepseHoldings',JSON.stringify(state.holdings));
  localStorage.setItem('nepseWatchlist',JSON.stringify(state.watchlist));
  localStorage.setItem('nepseAlerts',JSON.stringify(state.alerts));
  localStorage.setItem('nepseSwingPlans',JSON.stringify(state.swingPlans));
  localStorage.setItem('nepseSwingSettings',JSON.stringify(state.swingSettings));
  localStorage.setItem('nepseTradeJournal',JSON.stringify(state.tradeJournal));
  localStorage.setItem('nepseSwingScannerMin',JSON.stringify(state.swingScannerMin));
}
function s(sym){return STOCKS.find(function(x){return x.symbol===sym;});}
function money(n){return 'Rs '+Math.round(n).toLocaleString('en-IN');}
function pct(n){return (n>=0?'+':'')+Number(n).toFixed(2)+'%';}
function change(x){return x.prev?((x.price-x.prev)/x.prev*100):0;}
function fundamental(sym){return FUNDAMENTALS[sym]||null;}
function technical(sym){return TECHNICALS[sym]||null;}
function modelScore(sym){return MODEL_SCORES[sym]||null;}
function effectiveScore(x){var m=modelScore(x.symbol);return m&&m.status==='scored'?m.score:null;}
function effectiveStatus(x){var m=modelScore(x.symbol);return m&&m.status==='scored'?m.label:'Insufficient';}
function techValue(v,suffix){return v==null?'Pending':Number(v).toFixed(2)+(suffix||'');}
function currentPE(x){var f=fundamental(x.symbol);return f&&f.eps>0?x.price/f.eps:null;}
function currentPBV(x){var f=fundamental(x.symbol);return f&&f.bookValue>0?x.price/f.bookValue:null;}
function ratio(v){return v==null||!isFinite(v)?'N/M':Number(v).toFixed(2);}
function actionText(f){
  if(!f)return 'No sourced corporate-action snapshot';
  var a=[];
  if(f.dividend!=null)a.push('Cash dividend '+f.dividend.toFixed(2)+'%');
  if(f.bonus!=null)a.push('Bonus '+f.bonus.toFixed(2)+'%');
  if(f.rightShare)a.push('Right '+f.rightShare);
  return a.length?a.join(' · '):'No recent action captured in V1';
}
function validationText(x){
  var f=fundamental(x.symbol);
  if(!f||f.sourceDate!==META.priceDate)return 'Cross-check not same-date';
  var diff=Math.abs(x.price-f.sourcePrice)/(f.sourcePrice||1)*100;
  return diff<=0.25?'Same-date cross-check OK ('+diff.toFixed(2)+'%)':'Price-source mismatch '+diff.toFixed(2)+'%';
}
function num(v,d){return v==null||!isFinite(Number(v))?null:Number(Number(v).toFixed(d==null?2:d));}
function marketDate(){return MARKET_META.latestMarketDate||META.priceDate;}
function generatedTime(){return MARKET_META.generatedAt||'not generated yet';}
function dataAgeLabel(asOf){
  if(!asOf)return 'date unavailable';
  var d=new Date(asOf+'T00:00:00'),now=new Date(),days=Math.floor((now-d)/86400000);
  if(!isFinite(days))return asOf;
  return asOf+' · '+Math.max(0,days)+' calendar day'+(days===1?'':'s')+' old';
}
function swingDraft(x){
  var t=technical(x.symbol);
  if(!t||t.atr14==null||t.support20==null||t.resistance20==null||t.sma20==null)return null;
  var close=Number(t.close==null?x.price:t.close),atr=Number(t.atr14),support=Number(t.support20),sma20=Number(t.sma20);
  var entryLow=Math.max(support,Math.min(close,sma20)-0.5*atr);
  var entryHigh=Math.max(entryLow+0.15*atr,Math.min(close+0.25*atr,sma20+0.35*atr));
  var mid=(entryLow+entryHigh)/2;
  var stop=Math.min(entryLow-0.75*atr,support-0.25*atr);
  var risk=mid-stop;
  if(risk<=0)return null;
  return {
    symbol:x.symbol,entryLow:num(entryLow),entryHigh:num(entryHigh),stop:num(stop),
    target1:num(mid+1.5*risk),target2:num(mid+2.5*risk),atr14:num(atr),
    support20:num(support),resistance20:num(t.resistance20),asOf:t.asOf||marketDate(),
    method:'ATR/support template',dataAge:dataAgeLabel(t.asOf||marketDate())
  };
}
function getPlan(sym){return state.swingPlans[sym]||null;}
function sizePosition(plan,capital,riskPct){
  capital=Number(capital);riskPct=Number(riskPct);
  if(!plan||!isFinite(capital)||capital<=0||!isFinite(riskPct)||riskPct<=0)return null;
  var mid=(Number(plan.entryLow)+Number(plan.entryHigh))/2,perShare=mid-Number(plan.stop);
  if(!isFinite(perShare)||perShare<=0)return null;
  var budget=capital*riskPct/100;
  var byRisk=Math.floor(budget/perShare),byCapital=Math.floor(capital/mid),qty=Math.max(0,Math.min(byRisk,byCapital));
  return {qty:qty,riskBudget:num(budget),positionValue:num(qty*mid),plannedRisk:num(qty*perShare),perShareRisk:num(perShare)};
}
function planAlert(x,plan){
  if(!plan)return {level:'none',text:'No saved swing plan'};
  var close=Number(x.price),t=technical(x.symbol);
  if(plan.status==='closed')return {level:'none',text:'Plan closed'};
  if(close<=Number(plan.stop))return {level:'danger',text:'STOP level reached/breached at latest close'};
  if(close>=Number(plan.target2))return {level:'good',text:'Target 2 reached/exceeded at latest close'};
  if(close>=Number(plan.target1))return {level:'good',text:'Target 1 reached/exceeded at latest close'};
  if(t&&t.sma20!=null&&close<Number(t.sma20))return {level:'warn',text:'Trend warning: close is below SMA20'};
  if(close>=Number(plan.entryLow)&&close<=Number(plan.entryHigh))return {level:'info',text:'Latest close is inside planned entry range'};
  return {level:'none',text:'No price trigger at latest close'};
}
function scannerRows(minScore){
  minScore=Number(minScore==null?50:minScore);
  return STOCKS.map(function(x){var q=SWING_SCANNER[x.symbol];return q&&q.status==='scanned'?{stock:x,setup:q}:null;})
    .filter(function(v){return v&&v.setup.setupScore>=minScore;})
    .sort(function(a,b){return b.setup.setupScore-a.setup.setupScore;});
}
function scannerLabelClass(label){
  if(label==='High-quality setup')return 'good';
  if(label==='Developing setup')return 'info';
  if(label==='Mixed setup')return 'warn';
  return 'bad';
}
function announcementItems(sym){
  var items=ANNOUNCEMENTS.slice();
  var f=fundamental(sym);
  if(f&&(f.dividend!=null||f.bonus!=null||f.rightShare)){
    items.unshift({
      id:'corp-'+sym,scope:'company',symbols:[sym],category:'corporate-action',
      title:sym+' corporate-action snapshot: '+actionText(f),
      publishedAt:f.sourceDate||'unknown',fetchedAt:(window.NEPSE_ANNOUNCEMENTS&&window.NEPSE_ANNOUNCEMENTS.generatedAt)||'unknown',
      source:f.source||'Company detail source',sourceUrl:f.sourceUrl||'',summary:'Sourced company-detail snapshot; verify the formal book-close/approval notice before acting.',impact:'company'
    });
  }
  return items.filter(function(a){return !a.symbols||!a.symbols.length||a.symbols.indexOf(sym)>=0;}).sort(function(a,b){return String(b.publishedAt).localeCompare(String(a.publishedAt));});
}
function groundedExplanation(x){
  var t=technical(x.symbol),p=getPlan(x.symbol),a=announcementItems(x.symbol)[0],parts=[];
  parts.push('Market close '+money(x.price)+' as of '+marketDate()+'.');
  if(t){
    parts.push('RSI14 '+techValue(t.rsi14)+', SMA20 '+(t.sma20==null?'pending':money(t.sma20))+', SMA50 '+(t.sma50==null?'pending':money(t.sma50))+'.');
    if(t.atr14!=null)parts.push('ATR14 '+money(t.atr14)+' ('+techValue(t.atrPct14,'%')+'), 20-session support '+money(t.support20)+' and resistance '+money(t.resistance20)+'.');
  }
  if(p){var al=planAlert(x,p);parts.push('Saved plan: entry '+money(p.entryLow)+'–'+money(p.entryHigh)+', stop '+money(p.stop)+', targets '+money(p.target1)+' / '+money(p.target2)+'. '+al.text+'.');}
  if(a)parts.push('Latest sourced announcement context: '+a.title+' Published '+a.publishedAt+' by '+a.source+'.');
  parts.push('Market dataset generated '+generatedTime()+'. Fees and current holdings are not assumed.');
  return parts.join(' ');
}
function historyStats(sym){
  var rows=HISTORY[sym]||[];
  if(!rows.length)return {ret:0,avgVolume:0,low:0,high:0};
  var closes=rows.map(function(r){return r.close;});
  var avg=rows.reduce(function(a,r){return a+r.volume;},0)/rows.length;
  return {ret:closes.length>1?(closes[closes.length-1]-closes[0])/closes[0]*100:0,avgVolume:avg,low:Math.min.apply(null,closes),high:Math.max.apply(null,closes)};
}
function spark(sym){
  var rows=HISTORY[sym]||[], vals=rows.map(function(r){return r.close;});
  if(vals.length<2)return '<div class="muted">Not enough history.</div>';
  var w=620,h=180,p=12,min=Math.min.apply(null,vals),max=Math.max.apply(null,vals);
  var pts=vals.map(function(v,i){var x=p+i*(w-2*p)/(vals.length-1);var y=h-p-(v-min)/(max-min||1)*(h-2*p);return x.toFixed(1)+','+y.toFixed(1);}).join(' ');
  return '<svg class="spark" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none"><polyline points="'+pts+'"></polyline></svg>';
}
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}

function portfolio(){
  var invested=0,current=0,sectors={},allCostKnown=state.holdings.length>0,knownPositions=0;
  state.holdings.forEach(function(h){
    var x=s(h.symbol);if(!x)return;
    current+=h.qty*x.price;
    sectors[x.sector]=(sectors[x.sector]||0)+h.qty*x.price;
    if(h.avg==null || Number(h.avg)<=0){allCostKnown=false;}
    else{invested+=h.qty*Number(h.avg);knownPositions++;}
  });
  return {
    invested:invested,current:current,costKnown:allCostKnown,
    knownPositions:knownPositions,unknownCostPositions:state.holdings.length-knownPositions,
    pl:allCostKnown?current-invested:null,
    ret:(allCostKnown&&invested)?(current-invested)/invested*100:null,
    sectors:sectors
  };
}

function nav(){
  var items=[['dashboard','Dashboard'],['swing','Swing Desk'],['companies','Companies'],['portfolio','Portfolio'],['screener','Screener'],['watchlist','Watchlist'],['alerts','Alerts']];
  return '<aside class="side"><div class="brand"><b>NC</b><span><strong>NEPSE Copilot</strong><small>Private research terminal</small></span></div><nav>'+
    items.map(function(i){return '<button class="'+(state.page===i[0]?'active':'')+'" data-nav="'+i[0]+'">'+i[1]+'</button>';}).join('')+
    '</nav><div class="source"><b>Data status</b><br>Market close: '+marketDate()+'<br>Generated: '+generatedTime()+'<br><span>Trades manual · fees unconfirmed</span></div></aside>';
}
function header(title,sub){
  return '<header><div><small>NEPSE COPILOT V1</small><h1>'+title+'</h1><p>'+(sub||'Research and portfolio decision support')+'</p></div><button class="primary" data-nav="portfolio">+ Add holding</button></header>'+
  '<div class="notice"><b>Data:</b> market close '+marketDate()+' · pipeline '+generatedTime()+'. Fundamentals and corporate actions are sourced separately. Swing levels are editable technical drafts; trades remain manual and fees/current holdings are not assumed.</div>';
}
function card(label,value,sub,cls){return '<div class="card metric"><span>'+label+'</span><strong>'+value+'</strong><small class="'+(cls||'')+'">'+sub+'</small></div>';}
function table(rows){
  return '<div class="table"><table><thead><tr><th>Company</th><th>Price</th><th>Change</th><th>Volume</th><th>Score</th><th>Status</th></tr></thead><tbody>'+
  rows.map(function(x){var c=change(x),sc=effectiveScore(x),st=effectiveStatus(x),score=sc==null?'—':sc+'/100';return '<tr data-stock="'+x.symbol+'"><td><b>'+x.symbol+'</b><small>'+x.name+'</small></td><td>'+money(x.price)+'</td><td class="'+(c>=0?'up':'down')+'">'+pct(c)+'</td><td>'+x.volume.toLocaleString('en-IN')+'</td><td><b>'+score+'</b></td><td><span class="pill '+(st==='Research'?'good':st==='Caution'?'bad':'warn')+'">'+st+'</span></td></tr>';}).join('')+
  '</tbody></table></div>';
}

function dashboard(){
  var p=portfolio();
  var sorted=STOCKS.filter(function(x){return effectiveScore(x)!=null;}).sort(function(a,b){return effectiveScore(b)-effectiveScore(a);});
  var exp=Object.keys(p.sectors).sort(function(a,b){return p.sectors[b]-p.sectors[a];});
  return header('Dashboard','Snapshot '+META.priceDate+' · personal portfolio')+
  '<section class="metrics">'+
  card('Portfolio value',money(p.current),'Current prototype value')+
  card('Invested',p.costKnown?money(p.invested):'—',p.costKnown?'Cost basis':'Average buy prices needed')+
  card('Total P/L',p.costKnown?money(p.pl):'—',p.costKnown?pct(p.ret):p.unknownCostPositions+' positions missing cost',p.costKnown?(p.pl>=0?'up':'down'):'')+
  card('Watchlist',state.watchlist.length,state.alerts.length+' active alerts')+
  '</section>'+
  '<section class="two"><div class="card block"><div class="title"><div><h2>Research candidates</h2><p>Only companies passing the evidence gate</p></div></div>'+(sorted.length?table(sorted.slice(0,6)):'<p class="muted">No production-gated scores yet. The automated refresh will populate them when enough data is available.</p>')+'</div>'+
  '<div class="card block"><div class="title"><div><h2>Portfolio exposure</h2><p>By current value</p></div></div>'+
  (exp.length?exp.map(function(sec){var v=p.sectors[sec],q=p.current?v/p.current*100:0;return '<div class="exposure"><div><b>'+sec+'</b><span>'+q.toFixed(1)+'%</span></div><i><em style="width:'+q+'%"></em></i></div>';}).join(''):'<p class="muted">No holdings yet.</p>')+
  '</div></section>';
}

function companies(){
  return header('Companies','Search the prototype universe')+
  '<div class="controls"><input id="companySearch" placeholder="Search symbol, company or sector"><select id="sectorFilter"><option value="">All sectors</option>'+
  Array.from(new Set(STOCKS.map(function(x){return x.sector;}))).map(function(v){return '<option>'+v+'</option>';}).join('')+'</select></div>'+
  '<div id="companyTable">'+table(STOCKS)+'</div>';
}

function stockPage(){
  var x=s(state.selected),c=change(x),watched=state.watchlist.indexOf(x.symbol)>=0,f=fundamental(x.symbol),pe=currentPE(x),pb=currentPBV(x),ms=modelScore(x.symbol),sc=effectiveScore(x),st=effectiveStatus(x);
  return header(x.symbol+' · '+x.name,x.sector+' · close '+META.priceDate)+
  '<section class="stockHero"><div class="card block"><div class="stockTop"><div><span class="muted">Close</span><strong>'+money(x.price)+'</strong><small class="'+(c>=0?'up':'down')+'">'+pct(c)+' vs '+META.previousDate+'</small></div>'+
  '<button id="watchBtn" class="'+(watched?'primary':'')+'">'+(watched?'★ Watching':'☆ Add to watchlist')+'</button></div>'+
  '<div class="facts">'+card('EPS',f?f.eps:'—',f?f.period+' · sourced':'Missing')+card('P/E',ratio(pe),'Close ÷ sourced EPS')+card('Book value',f?money(f.bookValue):'—',f?f.period+' · sourced':'Missing')+card('P/B',ratio(pb),'Close ÷ sourced book value')+'</div></div>'+
  '<div class="card scoreBox"><span>Research score</span><strong>'+(sc==null?'—':sc)+'</strong><small>'+(sc==null?'insufficient verified data':'/100 · model '+(ms?ms.modelVersion:'') )+'</small><div class="pill '+(st==='Research'?'good':st==='Caution'?'bad':'warn')+'">'+st+'</div>'+(sc==null&&ms&&ms.missing&&ms.missing.length?'<p class="scoreMissing">Missing: '+ms.missing.join(', ')+'</p>':'')+'</div></section>'+
  '<section class="card block historyCard"><div class="title"><div><h2>Recent price history</h2><p>Seven available sessions from the public OHLC development source</p></div></div>'+spark(x.symbol)+(function(){var hs=historyStats(x.symbol);return '<div class="historyStats">'+card('7-session return',pct(hs.ret),'From first to latest close',hs.ret>=0?'up':'down')+card('Average volume',Math.round(hs.avgVolume).toLocaleString('en-IN'),'Available sessions')+card('Close range',money(hs.low)+' – '+money(hs.high),'Available sessions')+'</div>';})()+'</section>'+
  '<section class="two"><div class="card block"><div class="title"><div><h2>Why this score?</h2><p>Evidence-style explanation</p></div></div><ul class="thesis">'+
  '<li>EPS: '+(f?f.eps:'—')+' · '+(f?f.period:'missing')+' ('+(f?f.source:'no source')+').</li><li>Current P/E from selected close: '+ratio(pe)+'.</li><li>Current P/B from selected close: '+ratio(pb)+'.</li><li>Corporate action snapshot: '+actionText(f)+'.</li><li>Data validation: '+validationText(x)+'.</li><li>RSI and the 0–100 score are still prototype values and are not yet used as production evidence.</li></ul></div>'+
  '<div class="card block"><div class="title"><div><h2>Technical engine</h2><p>Calculated from stored OHLC history</p></div></div>'+(function(){var t=technical(x.symbol);if(!t)return '<p class="muted">Awaiting the first automated history refresh.</p>';return '<div class="techGrid">'+card('RSI 14',techValue(t.rsi14),'Wilder RSI')+card('SMA 20',t.sma20==null?'Pending':money(t.sma20),'20-session average')+card('SMA 50',t.sma50==null?'Pending':money(t.sma50),'50-session average')+card('20D avg volume',t.avgVolume20==null?'Pending':Math.round(t.avgVolume20).toLocaleString('en-IN'),'Calculated history')+'</div>';})()+'</div></section>'+
  '<div class="card block riskBlock"><div class="title"><div><h2>Score evidence</h2><p>Auditable component breakdown</p></div></div>'+(ms&&ms.status==='scored'?'<div class="scoreParts">'+Object.keys(ms.components).map(function(k){return '<div><span>'+k+'</span><b>'+ms.components[k]+'</b></div>';}).join('')+'</div><p class="muted">Model '+ms.modelVersion+' · fundamental '+ms.fundamentalPeriod+' · technical '+ms.technicalAsOf+'</p>':'<p class="muted">No score is shown until required evidence is available.</p>')+'</div>'+
  '<div class="card block riskBlock"><div class="title"><div><h2>Grounded explanation</h2><p>Uses stored market data + sourced announcements</p></div></div><p>'+esc(groundedExplanation(x))+'</p><p class="muted">Market as-of '+marketDate()+' · pipeline '+generatedTime()+'</p></div>'+
  '<div class="card block riskBlock"><div class="title"><div><h2>Latest announcement context</h2><p>Sourced, timestamped evidence</p></div></div>'+(function(){var aa=announcementItems(x.symbol).slice(0,3);return aa.length?aa.map(function(a){return '<div class="announcement"><div><b>'+esc(a.title)+'</b><small>'+esc(a.source)+' · published '+esc(a.publishedAt)+' · fetched '+esc(a.fetchedAt||'—')+'</small></div>'+(a.sourceUrl?'<a href="'+esc(a.sourceUrl)+'" target="_blank" rel="noopener">Source</a>':'')+'</div>';}).join(''):'<p class="muted">No announcement context loaded.</p>';})()+'</div>'+
  '<div class="card block riskBlock"><div class="title"><div><h2>Risk note</h2><p>Decision support, not execution</p></div></div><p>The research score and swing levels are prioritisation/planning aids, not automatic trade instructions. Missing evidence produces no score; orders remain manual.</p></div>';
}

function portfolioPage(){
  var p=portfolio();
  var rows=state.holdings.map(function(h,i){
    var x=s(h.symbol);if(!x)return '';
    var val=h.qty*x.price,hasCost=h.avg!=null&&Number(h.avg)>0,pl=hasCost?val-h.qty*Number(h.avg):null;
    return '<tr><td><b>'+h.symbol+'</b><small>'+x.name+'</small></td><td>'+h.qty+'</td><td>'+(hasCost?money(h.avg):'—')+'</td><td>'+money(x.price)+'</td><td>'+money(val)+'</td><td class="'+(hasCost?(pl>=0?'up':'down'):'')+'">'+(hasCost?money(pl):'—')+'</td><td><button class="danger small" data-remove="'+i+'">Remove</button></td></tr>';
  }).join('');
  return header('Portfolio','Your private holdings · stored only in this browser')+
  '<section class="metrics">'+card('Current value',money(p.current),'Snapshot '+META.priceDate)+card('Invested',p.costKnown?money(p.invested):'—',p.costKnown?'Cost basis':'Average buy prices needed')+card('P/L',p.costKnown?money(p.pl):'—',p.costKnown?pct(p.ret):p.unknownCostPositions+' positions missing cost',p.costKnown?(p.pl>=0?'up':'down'):'')+'</section>'+
  '<div class="card block"><div class="notice"><b>Privacy:</b> imported holdings stay in your browser local storage. They are not stored in this Git repository.</div>'+
  '<div class="form"><button type="button" id="importPortfolio">Import portfolio JSON</button><input id="portfolioFile" type="file" accept=".json,application/json" hidden><button type="button" id="exportPortfolio">Export portfolio JSON</button><button type="button" id="clearPortfolio" class="danger">Clear local portfolio</button></div>'+
  '<form id="holdingForm" class="form"><select name="symbol">'+STOCKS.map(function(x){return '<option>'+x.symbol+'</option>';}).join('')+'</select><input name="qty" type="number" min="0.01" step="0.01" placeholder="Quantity" required><input name="avg" type="number" min="0" step="0.01" placeholder="Average buy price (optional)"><input name="date" type="date"><button class="primary">Add holding</button></form>'+
  '<div class="table"><table><thead><tr><th>Company</th><th>Qty</th><th>Avg</th><th>Close</th><th>Value</th><th>P/L</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
}
function screener(){
  return header('Screener','Filter the prototype universe')+
  '<div class="card block"><form id="screenForm" class="form"><select name="sector"><option value="">All sectors</option>'+Array.from(new Set(STOCKS.map(function(x){return x.sector;}))).map(function(v){return '<option>'+v+'</option>';}).join('')+'</select><input name="score" type="number" value="70" min="0" max="100" placeholder="Min model score"><input name="pe" type="number" value="40" min="0" placeholder="Max sourced P/E"><input name="pb" type="number" value="5" min="0" step="0.1" placeholder="Max sourced P/B"><button class="primary">Run screen</button></form><div id="screenResults">'+table(STOCKS.filter(function(x){var pe=currentPE(x),pb=currentPBV(x),sc=effectiveScore(x);return sc!=null&&sc>=70&&pe!=null&&pe<=40&&pb!=null&&pb<=5;}))+'</div></div>';
}

function swingDesk(){
  var watched=STOCKS.filter(function(x){return state.watchlist.indexOf(x.symbol)>=0;});
  var plans=Object.keys(state.swingPlans).map(function(k){return state.swingPlans[k];}).filter(Boolean);
  var alertsNow=plans.map(function(p){var x=s(p.symbol);return x?{symbol:p.symbol,alert:planAlert(x,p),plan:p}:null;}).filter(function(v){return v&&v.alert.level!=='none';});
  var planRows=plans.map(function(p){
    var x=s(p.symbol),sz=sizePosition(p,p.capital||state.swingSettings.capital,p.riskPct||state.swingSettings.riskPct),al=x?planAlert(x,p):{level:'none',text:'Symbol missing'};
    return '<tr><td><b>'+esc(p.symbol)+'</b><small>'+esc(p.status||'planned')+'</small></td><td>'+money(p.entryLow)+'–'+money(p.entryHigh)+'</td><td>'+money(p.stop)+'</td><td>'+money(p.target1)+' / '+money(p.target2)+'</td><td>'+(sz?sz.qty+' sh<br><small>risk '+money(sz.plannedRisk)+'</small>':'—')+'</td><td><span class="swingAlert '+al.level+'">'+esc(al.text)+'</span></td><td><button class="small" data-edit-plan="'+esc(p.symbol)+'">Edit</button> <button class="danger small" data-delete-plan="'+esc(p.symbol)+'">Delete</button></td></tr>';
  }).join('');
  var watchCards=watched.map(function(x){
    var t=technical(x.symbol),d=swingDraft(x),p=getPlan(x.symbol);
    return '<div class="swingCandidate"><div><b>'+x.symbol+'</b><small>'+x.name+'</small></div><div><span>Close</span><b>'+money(x.price)+'</b></div><div><span>RSI</span><b>'+(t?techValue(t.rsi14):'Pending')+'</b></div><div><span>Support / Resistance</span><b>'+(t&&t.support20!=null?money(t.support20)+' / '+money(t.resistance20):'Pending')+'</b></div><div><span>Draft entry</span><b>'+(d?money(d.entryLow)+'–'+money(d.entryHigh):'Pending refresh')+'</b>'+(d?'<small>'+esc(d.dataAge)+'</small>':'')+'</div><button class="small '+(p?'':'primary')+'" data-draft-plan="'+x.symbol+'">'+(p?'Refresh draft':'Create draft')+'</button></div>';
  }).join('');
  var scan=scannerRows(state.swingScannerMin==null?50:state.swingScannerMin);
  var scanRows=scan.map(function(v){
    var x=v.stock,q=v.setup,m=q.metrics||{},flags=(q.riskFlags||[]);
    return '<tr><td><b>'+x.symbol+'</b><small>'+x.name+'</small></td><td><span class="pill '+scannerLabelClass(q.label)+'">'+q.setupScore+'/100</span><small>'+q.label+'</small></td><td>'+techValue(m.rsi14)+'</td><td>'+(m.volumeRatio==null?'—':Number(m.volumeRatio).toFixed(2)+'×')+'</td><td>'+(m.supportDistancePct==null?'—':Number(m.supportDistancePct).toFixed(1)+'%')+'</td><td>'+(m.resistanceHeadroomPct==null?'—':Number(m.resistanceHeadroomPct).toFixed(1)+'%')+'</td><td>'+(flags.length?flags.map(function(f){return '<span class="riskTag">'+esc(f.replaceAll('_',' '))+'</span>';}).join(' '):'<span class="muted">none</span>')+'</td><td><button class="small" data-add-swing-watch="'+x.symbol+'">'+(state.watchlist.indexOf(x.symbol)>=0?'Watching':'Add watch')+'</button> <button class="small primary" data-scanner-draft="'+x.symbol+'">Draft plan</button></td></tr>';
  }).join('');
  var daily=(DAILY_SWING_PLAN.candidates||[]),dailyHist=DAILY_SWING_PLAN.historicalCheck||{},dailyDev=dailyHist.development||{},dailyHold=dailyHist.laterPeriod||{};
  var dailyRows=daily.map(function(c){
    var d=c.draft||{},m=c.metrics||{},x=s(c.symbol),news=announcementItems(c.symbol)[0];
    return '<tr><td><b>'+esc(c.symbol)+'</b><small>'+esc(c.pattern||'pattern match')+'</small></td><td>'+(c.close==null?'—':money(c.close))+'<small>'+esc(c.marketAsOf||'—')+'</small></td><td>'+money(d.entryLow)+'–'+money(d.entryHigh)+'</td><td>'+money(d.stop)+'</td><td>'+money(d.target1)+' / '+money(d.target2)+'</td><td>'+techValue(m.rsi14)+'</td><td>'+(m.supportDistancePct==null?'—':Number(m.supportDistancePct).toFixed(1)+'%')+'</td><td>'+(news?'<small>'+esc(news.title)+'</small>':'<span class="muted">No specific announcement loaded</span>')+'</td><td><button class="small" data-add-swing-watch="'+esc(c.symbol)+'">'+(state.watchlist.indexOf(c.symbol)>=0?'Watching':'Add watch')+'</button> <button class="small primary" data-daily-draft="'+esc(c.symbol)+'">Open plan</button></td></tr>';
  }).join('');
  var stress=(COST_SENSITIVITY.scenarios||[]);
  var stressRows=stress.map(function(sv){var g=sv.dailyGateLaterPeriod||{};return '<tr><td>'+sv.slippageBpsPerSide+' bps/side</td><td>'+(g.trades==null?'—':g.trades)+'</td><td>'+(g.netWinRatePct==null?'—':Number(g.netWinRatePct).toFixed(1)+'%')+'</td><td>'+(g.netAvgR==null?'—':Number(g.netAvgR).toFixed(2)+'R')+'</td><td>'+(g.netProfitFactorR==null?'—':Number(g.netProfitFactorR).toFixed(2))+'</td></tr>';}).join('');
  var bt=SWING_BACKTEST.overall||null,btBuckets=SWING_BACKTEST.byScoreBucket||{};
  var btCards=bt?'<div class="backtestMetrics">'+card('Historical trades',bt.trades,'Walk-forward fills')+card('Gross avg R',bt.avgR==null?'—':Number(bt.avgR).toFixed(2)+'R','Before trading costs')+card('Net avg R',bt.netAvgR==null?'—':Number(bt.netAvgR).toFixed(2)+'R','After modeled fees + CGT')+card('Net profit factor',bt.netProfitFactorR==null?'—':Number(bt.netProfitFactorR).toFixed(2),'Modeled net R gains ÷ losses')+'</div>':'<p class="muted">Backtest awaiting refresh.</p>';
  var bucketRows=['80-100','65-79','50-64'].map(function(k){var b=btBuckets[k]||{};return '<tr><td><b>'+k+'</b></td><td>'+(b.trades==null?'—':b.trades)+'</td><td>'+(b.winRatePct==null?'—':Number(b.winRatePct).toFixed(1)+'%')+'</td><td>'+(b.avgR==null?'—':Number(b.avgR).toFixed(2)+'R')+'</td><td>'+(b.netAvgR==null?'—':Number(b.netAvgR).toFixed(2)+'R')+'</td><td>'+(b.netProfitFactorR==null?'—':Number(b.netProfitFactorR).toFixed(2))+'</td></tr>';}).join('');
  var marketNews=ANNOUNCEMENTS.slice().sort(function(a,b){return String(b.publishedAt).localeCompare(String(a.publishedAt));}).slice(0,4).map(function(a){
    return '<div class="announcement"><div><b>'+esc(a.title)+'</b><small>'+esc(a.source)+' · published '+esc(a.publishedAt)+' · fetched '+esc(a.fetchedAt||'—')+'</small></div>'+(a.sourceUrl?'<a href="'+esc(a.sourceUrl)+'" target="_blank" rel="noopener">Source</a>':'')+'</div>';
  }).join('');
  return header('Swing Desk','Short-term planning · manual execution')+
  '<section class="metrics">'+card('Daily pattern matches',daily.length,'Provisional gate')+card('Swing watchlist',watched.length,'Symbols under review')+card('Saved plans',plans.length,'Local browser only')+card('Market as-of',marketDate(),dataAgeLabel(marketDate()))+'</section>'+
  '<div class="card block dailyPlanBlock"><div class="title"><div><h2>Daily Plan</h2><p>Provisional support-pullback pattern · market '+esc(DAILY_SWING_PLAN.marketAsOf||marketDate())+'</p></div><span class="pill warn">'+esc(DAILY_SWING_PLAN.validationStatus||'pending')+'</span></div><div class="validationStrip"><div><b>'+(dailyDev.trades==null?'—':dailyDev.trades)+'</b><span>development trades</span></div><div><b>'+(dailyDev.avgR==null?'—':Number(dailyDev.avgR).toFixed(2)+'R')+'</b><span>development avg R</span></div><div><b>'+(dailyHold.trades==null?'—':dailyHold.trades)+'</b><span>later-period trades</span></div><div><b>'+(dailyHold.avgR==null?'—':Number(dailyHold.avgR).toFixed(2)+'R')+'</b><span>later-period avg R</span></div></div><p class="muted">'+esc(DAILY_SWING_PLAN.validationNote||'Awaiting validation data.')+'</p><div class="table"><table><thead><tr><th>Symbol</th><th>Close</th><th>Draft entry</th><th>Stop</th><th>Targets</th><th>RSI</th><th>From support</th><th>Announcement context</th><th></th></tr></thead><tbody>'+(dailyRows||'<tr><td colspan="9">No symbols match the provisional gate at the latest stored close.</td></tr>')+'</tbody></table></div><p class="muted">Gate: within 6% of 20-session support · RSI 30–49 · 20-day average volume ≥20,000 · ATR &lt;5%. This is a research filter, not an instruction to buy.</p></div>'+
  '<div class="card block scannerBlock"><div class="title"><div><h2>Swing Scanner</h2><p>Technical setup quality only · '+esc(SWING_SCANNER_META.marketAsOf||marketDate())+' · model '+esc(SWING_SCANNER_META.modelVersion||'pending')+'</p></div><div class="scannerFilter"><label>Min score <input id="scannerMinScore" type="number" min="0" max="100" value="'+esc(state.swingScannerMin==null?50:state.swingScannerMin)+'"></label></div></div><div id="scannerTable" class="table"><table><thead><tr><th>Symbol</th><th>Setup</th><th>RSI</th><th>Vol ratio</th><th>From support</th><th>To resistance</th><th>Risk flags</th><th></th></tr></thead><tbody>'+(scanRows||'<tr><td colspan="8">No scanner results yet.</td></tr>')+'</tbody></table></div><p class="muted">Setup score combines trend, RSI regime, liquidity, current volume participation and distance from 20-session support. It is not the long-term research score and is not a trade recommendation.</p></div>'+
  '<div class="card block costModel"><div class="title"><div><h2>Trading cost model</h2><p>Sourced defaults · configurable</p></div></div><div class="costGrid">'+card('Broker',esc(TRADING_COSTS.broker||'—'),'Current public pricing')+card('Regulatory fee',TRADING_COSTS.regulatoryFeePct==null?'—':TRADING_COSTS.regulatoryFeePct+'%','Both buy & sell')+card('Short-term CGT',TRADING_COSTS.capitalGainsTax?TRADING_COSTS.capitalGainsTax.residentIndividualShortTermPct+'%':'—','Profitable resident-individual sale')+card('DP sell charge',TRADING_COSTS.dpChargeSell==null?'—':money(TRADING_COSTS.dpChargeSell),'Provisional; confirm contract note')+'</div><p class="muted">Cost model as of '+esc(TRADING_COSTS.asOf||'—')+'. Actual broker contract notes override this model.</p></div>'+
  '<div class="card block stressBlock"><div class="title"><div><h2>Slippage stress test</h2><p>Later-period support-pullback validation</p></div></div><div class="table"><table><thead><tr><th>Slippage</th><th>Trades</th><th>Net win rate</th><th>Net avg R</th><th>Net PF</th></tr></thead><tbody>'+(stressRows||'<tr><td colspan="5">Awaiting sensitivity refresh.</td></tr>')+'</tbody></table></div><p class="muted">This checks whether the provisional pattern survives less favorable execution prices. Slippage is modeled on both entry and exit.</p></div>'+'<div class="card block backtestBlock"><div class="title"><div><h2>Walk-forward validation</h2><p>Historical scanner behavior · no look-ahead signals</p></div></div>'+btCards+'<div class="table"><table><thead><tr><th>Scanner bucket</th><th>Trades</th><th>Gross win rate</th><th>Gross avg R</th><th>Net avg R</th><th>Net PF</th></tr></thead><tbody>'+bucketRows+'</tbody></table></div><p class="muted">Assumptions: up to 3 sessions for entry, Target 1 objective, max 10-session hold, same-candle stop/target assumes stop first. Net results use the sourced Naasa brokerage slabs, 0.015% regulatory fee, short-term CGT and a provisional Rs 25 sell-side DP charge. Slippage remains 0 until execution data is available.</p></div>'+
  '<div class="card block"><div class="title"><div><h2>Risk & position sizing</h2><p>Optional account inputs; fees are not included yet</p></div></div><form id="swingSettingsForm" class="form"><input name="capital" type="number" min="0" step="0.01" placeholder="Capital available" value="'+esc(state.swingSettings.capital||'')+'"><input name="riskPct" type="number" min="0" step="0.1" placeholder="Risk % per trade" value="'+esc(state.swingSettings.riskPct||'')+'"><button class="primary">Save sizing inputs</button></form><p class="muted">Position size = min(risk-budget shares, capital-limit shares). Current holdings are not inferred from historical trades.</p></div>'+
  '<section class="two swingTwo"><div class="card block"><div class="title"><div><h2>Swing watchlist</h2><p>Technical drafts use ATR14 + 20-session support</p></div></div><div class="swingCandidates">'+(watchCards||'<p class="muted">Add symbols to Watchlist first.</p>')+'</div></div>'+
  '<div class="card block"><div class="title"><div><h2>Plan editor</h2><p>All levels remain editable</p></div></div><form id="swingPlanForm" class="planForm"><select name="symbol" id="planSymbol">'+STOCKS.map(function(x){return '<option>'+x.symbol+'</option>';}).join('')+'</select><div class="planGrid"><label>Entry low<input name="entryLow" type="number" step="0.01" required></label><label>Entry high<input name="entryHigh" type="number" step="0.01" required></label><label>Stop<input name="stop" type="number" step="0.01" required></label><label>Target 1<input name="target1" type="number" step="0.01" required></label><label>Target 2<input name="target2" type="number" step="0.01" required></label><label>Status<select name="status"><option value="planned">Planned</option><option value="active">Active</option><option value="closed">Closed</option></select></label></div><div class="form"><button type="button" id="useDraftPlan">Use technical draft</button><button class="primary">Save plan</button></div></form></div></section>'+
  '<div class="card block swingPlans"><div class="title"><div><h2>Saved plans & sell alerts</h2><p>Alerts evaluate the latest stored close only; no order is sent</p></div></div><div class="table"><table><thead><tr><th>Symbol</th><th>Entry</th><th>Stop</th><th>Targets</th><th>Position size</th><th>Alert</th><th></th></tr></thead><tbody>'+(planRows||'<tr><td colspan="7">No saved swing plans.</td></tr>')+'</tbody></table></div></div>'+
  '<section class="two"><div class="card block"><div class="title"><div><h2>Sourced announcements</h2><p>Announcement dates are kept separate from market-data timestamps</p></div></div><div class="announcementList">'+(marketNews||'<p class="muted">No announcement data loaded.</p>')+'</div></div><div class="card block"><div class="title"><div><h2>Historical trade journal</h2><p>Private browser storage</p></div></div><p>Nine historical transactions can be imported locally for review. They are not committed to Git, and they are not treated as current holdings.</p><div class="form"><button type="button" id="importTrades">Import trades JSON</button><input id="tradesFile" type="file" accept=".json,application/json" hidden><button type="button" id="exportTrades">Export journal</button></div><p class="muted">'+state.tradeJournal.length+' journal records currently stored in this browser. Fees remain unconfirmed unless included in an imported record.</p></div></section>';
}

function watchlist(){
  var rows=STOCKS.filter(function(x){return state.watchlist.indexOf(x.symbol)>=0;});
  return header('Watchlist','Companies you are following for research or swing review')+'<div class="card block"><div class="title"><div><h2>Watchlist</h2><p>Open Swing Desk to create entry/stop/target plans</p></div><button data-nav="swing">Open Swing Desk</button></div>'+(rows.length?table(rows):'<p class="muted">Your watchlist is empty.</p>')+'</div>';
}

function alerts(){
  return header('Alerts','Prototype alert rules')+'<div class="card block"><form id="alertForm" class="form"><select name="symbol">'+STOCKS.map(function(x){return '<option>'+x.symbol+'</option>';}).join('')+'</select><select name="type"><option>Price</option><option>Score</option><option>Volume</option><option>Disclosure</option></select><input name="rule" placeholder="e.g. Below Rs 500" required><button class="primary">Add alert</button></form><div class="alertList">'+state.alerts.map(function(a,i){return '<div><span><b>'+esc(a.symbol)+'</b><small>'+esc(a.type)+' · '+esc(a.rule)+'</small></span><button class="danger small" data-alert-remove="'+i+'">Remove</button></div>';}).join('')+'</div></div>';
}

function page(){
  if(state.page==='swing')return swingDesk();
  if(state.page==='companies')return companies();
  if(state.page==='stock')return stockPage();
  if(state.page==='portfolio')return portfolioPage();
  if(state.page==='screener')return screener();
  if(state.page==='watchlist')return watchlist();
  if(state.page==='alerts')return alerts();
  return dashboard();
}
function render(){document.getElementById('app').innerHTML='<div class="shell">'+nav()+'<main>'+page()+'</main></div>';bind();}
function bind(){
  document.querySelectorAll('[data-nav]').forEach(function(b){b.onclick=function(){state.page=b.dataset.nav;render();};});
  document.querySelectorAll('[data-stock]').forEach(function(r){r.onclick=function(){state.selected=r.dataset.stock;state.page='stock';render();};});
  var search=document.getElementById('companySearch'),sector=document.getElementById('sectorFilter');
  function filterCompanies(){if(!search)return;var q=search.value.toLowerCase(),sec=sector.value;var rows=STOCKS.filter(function(x){return (!sec||x.sector===sec)&&(!q||(x.symbol+' '+x.name+' '+x.sector).toLowerCase().indexOf(q)>=0);});document.getElementById('companyTable').innerHTML=table(rows);document.querySelectorAll('[data-stock]').forEach(function(r){r.onclick=function(){state.selected=r.dataset.stock;state.page='stock';render();};});}
  if(search){search.oninput=filterCompanies;sector.onchange=filterCompanies;}
  var watch=document.getElementById('watchBtn');if(watch)watch.onclick=function(){var i=state.watchlist.indexOf(state.selected);if(i>=0)state.watchlist.splice(i,1);else state.watchlist.push(state.selected);save();render();};
  var hf=document.getElementById('holdingForm');if(hf)hf.onsubmit=function(e){e.preventDefault();var f=new FormData(hf),avg=f.get('avg');state.holdings.push({symbol:f.get('symbol'),qty:Number(f.get('qty')),avg:avg?Number(avg):null,date:f.get('date')||''});save();render();};
  var importBtn=document.getElementById('importPortfolio'),fileInput=document.getElementById('portfolioFile');
  if(importBtn&&fileInput){importBtn.onclick=function(){fileInput.click();};fileInput.onchange=function(){
    var file=fileInput.files&&fileInput.files[0];if(!file)return;
    var reader=new FileReader();reader.onload=function(){
      try{
        var data=JSON.parse(reader.result),items=Array.isArray(data)?data:(data.holdings||[]);
        var clean=items.map(function(h){return {symbol:String(h.symbol||'').toUpperCase(),qty:Number(h.qty),avg:(h.avg==null||h.avg==='')?null:Number(h.avg),date:h.date||''};})
          .filter(function(h){return s(h.symbol)&&isFinite(h.qty)&&h.qty>0&&((h.avg==null)||isFinite(h.avg));});
        if(!clean.length)throw new Error('No valid holdings');
        state.holdings=clean;save();render();
      }catch(err){alert('Could not import portfolio JSON: '+err.message);}
    };reader.readAsText(file);
  };}
  var exportBtn=document.getElementById('exportPortfolio');if(exportBtn)exportBtn.onclick=function(){
    var blob=new Blob([JSON.stringify({asOf:META.priceDate,holdings:state.holdings},null,2)],{type:'application/json'});
    var url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nepse-portfolio.json';a.click();URL.revokeObjectURL(url);
  };
  var clearBtn=document.getElementById('clearPortfolio');if(clearBtn)clearBtn.onclick=function(){if(confirm('Clear portfolio stored in this browser?')){state.holdings=[];save();render();}};
  document.querySelectorAll('[data-remove]').forEach(function(b){b.onclick=function(){state.holdings.splice(Number(b.dataset.remove),1);save();render();};});
  var sf=document.getElementById('screenForm');if(sf)sf.onsubmit=function(e){e.preventDefault();var f=new FormData(sf),sec=f.get('sector'),score=Number(f.get('score')||0),peMax=Number(f.get('pe')||9999),pbMax=Number(f.get('pb')||9999);var rows=STOCKS.filter(function(x){var pe=currentPE(x),pb=currentPBV(x),sc=effectiveScore(x);return (!sec||x.sector===sec)&&sc!=null&&sc>=score&&pe!=null&&pe<=peMax&&pb!=null&&pb<=pbMax;});document.getElementById('screenResults').innerHTML=table(rows);document.querySelectorAll('[data-stock]').forEach(function(r){r.onclick=function(){state.selected=r.dataset.stock;state.page='stock';render();};});};
  var af=document.getElementById('alertForm');if(af)af.onsubmit=function(e){e.preventDefault();var f=new FormData(af);state.alerts.push({symbol:f.get('symbol'),type:f.get('type'),rule:f.get('rule')});save();render();};
  document.querySelectorAll('[data-alert-remove]').forEach(function(b){b.onclick=function(){state.alerts.splice(Number(b.dataset.alertRemove),1);save();render();};});
  var swingSettingsForm=document.getElementById('swingSettingsForm');if(swingSettingsForm)swingSettingsForm.onsubmit=function(e){e.preventDefault();var f=new FormData(swingSettingsForm);state.swingSettings={capital:f.get('capital')||'',riskPct:f.get('riskPct')||''};save();render();};
  var scannerMinScore=document.getElementById('scannerMinScore');if(scannerMinScore)scannerMinScore.onchange=function(){var v=Math.max(0,Math.min(100,Number(scannerMinScore.value)||0));state.swingScannerMin=v;save();render();};
  function fillPlanForm(sym,useDraft){
    var form=document.getElementById('swingPlanForm');if(!form)return;
    var x=s(sym),p=useDraft?(x?swingDraft(x):null):getPlan(sym);
    form.elements.symbol.value=sym;
    if(!p)return;
    ['entryLow','entryHigh','stop','target1','target2'].forEach(function(k){form.elements[k].value=p[k]==null?'':p[k];});
    if(p.status)form.elements.status.value=p.status;
  }
  document.querySelectorAll('[data-draft-plan]').forEach(function(b){b.onclick=function(){fillPlanForm(b.dataset.draftPlan,true);document.getElementById('swingPlanForm').scrollIntoView({behavior:'smooth',block:'center'});};});
  document.querySelectorAll('[data-add-swing-watch]').forEach(function(b){b.onclick=function(){var sym=b.dataset.addSwingWatch;if(state.watchlist.indexOf(sym)<0)state.watchlist.push(sym);save();render();};});
  document.querySelectorAll('[data-scanner-draft]').forEach(function(b){b.onclick=function(){var sym=b.dataset.scannerDraft;if(state.watchlist.indexOf(sym)<0)state.watchlist.push(sym);save();render();setTimeout(function(){fillPlanForm(sym,true);var form=document.getElementById('swingPlanForm');if(form)form.scrollIntoView({behavior:'smooth',block:'center'});},0);};});
  document.querySelectorAll('[data-daily-draft]').forEach(function(b){b.onclick=function(){var sym=b.dataset.dailyDraft;if(state.watchlist.indexOf(sym)<0)state.watchlist.push(sym);save();render();setTimeout(function(){fillPlanForm(sym,true);var form=document.getElementById('swingPlanForm');if(form)form.scrollIntoView({behavior:'smooth',block:'center'});},0);};});
  document.querySelectorAll('[data-edit-plan]').forEach(function(b){b.onclick=function(){fillPlanForm(b.dataset.editPlan,false);document.getElementById('swingPlanForm').scrollIntoView({behavior:'smooth',block:'center'});};});
  document.querySelectorAll('[data-delete-plan]').forEach(function(b){b.onclick=function(){delete state.swingPlans[b.dataset.deletePlan];save();render();};});
  var planForm=document.getElementById('swingPlanForm');if(planForm)planForm.onsubmit=function(e){e.preventDefault();var f=new FormData(planForm),sym=String(f.get('symbol'));state.swingPlans[sym]={symbol:sym,entryLow:Number(f.get('entryLow')),entryHigh:Number(f.get('entryHigh')),stop:Number(f.get('stop')),target1:Number(f.get('target1')),target2:Number(f.get('target2')),status:f.get('status')||'planned',capital:state.swingSettings.capital,riskPct:state.swingSettings.riskPct,updatedAt:new Date().toISOString()};save();render();};
  var draftBtn=document.getElementById('useDraftPlan');if(draftBtn)draftBtn.onclick=function(){var form=document.getElementById('swingPlanForm');fillPlanForm(form.elements.symbol.value,true);};
  var importTrades=document.getElementById('importTrades'),tradesFile=document.getElementById('tradesFile');if(importTrades&&tradesFile){importTrades.onclick=function(){tradesFile.click();};tradesFile.onchange=function(){var file=tradesFile.files&&tradesFile.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(){try{var data=JSON.parse(reader.result),items=Array.isArray(data)?data:(data.trades||data.transactions||[]);if(!Array.isArray(items)||!items.length)throw new Error('No trade records');state.tradeJournal=items;save();render();}catch(err){alert('Could not import trades JSON: '+err.message);}};reader.readAsText(file);};}
  var exportTrades=document.getElementById('exportTrades');if(exportTrades)exportTrades.onclick=function(){var blob=new Blob([JSON.stringify({trades:state.tradeJournal,feesConfirmed:false},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nepse-trade-journal.json';a.click();URL.revokeObjectURL(url);};
}
render();