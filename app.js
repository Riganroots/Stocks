const STOCKS = [
  {symbol:'NABIL',name:'Nabil Bank Ltd.',sector:'Commercial Bank',price:528.7,prev:528.5,volume:60383,score:82,eps:28.4,pe:21.5,roe:15.7,pb:2.2,rsi:58,status:'Research'},
  {symbol:'GBIME',name:'Global IME Bank Ltd.',sector:'Commercial Bank',price:243.0,prev:243.9,volume:78565,score:79,eps:22.1,pe:14.1,roe:13.8,pb:1.6,rsi:54,status:'Watch'},
  {symbol:'SHIVM',name:'Shivam Cements Ltd.',sector:'Manufacturing',price:681.0,prev:685.0,volume:106558,score:76,eps:17.8,pe:32.8,roe:11.1,pb:2.7,rsi:63,status:'Watch'},
  {symbol:'CHCL',name:'Chilime Hydropower Co.',sector:'Hydropower',price:339.0,prev:341.7,volume:53796,score:74,eps:20.6,pe:25.3,roe:12.4,pb:2.5,rsi:49,status:'Neutral'},
  {symbol:'NLIC',name:'Nepal Life Insurance Co.',sector:'Life Insurance',price:726.9,prev:727.9,volume:7723,score:71,eps:19.4,pe:37.5,roe:10.8,pb:3.1,rsi:57,status:'Neutral'},
  {symbol:'NRIC',name:'Nepal Reinsurance Co.',sector:'Non-Life Insurance',price:802.9,prev:803.0,volume:7826,score:61,eps:14.1,pe:63.3,roe:8.9,pb:4.2,rsi:44,status:'Caution'},
  {symbol:'API',name:'Api Power Company Ltd.',sector:'Hydropower',price:338.8,prev:341.0,volume:262514,score:69,eps:10.7,pe:26.7,roe:9.8,pb:2.3,rsi:66,status:'Watch'},
  {symbol:'HDL',name:'Himalayan Distillery Ltd.',sector:'Manufacturing',price:1293.0,prev:1286.0,volume:102119,score:77,eps:44.5,pe:29.6,roe:24.6,pb:7.2,rsi:55,status:'Research'}
];

const META = {priceDate:'2026-10-02',previousDate:'2026-10-01',priceSource:'socrateai-official/nepse-open-data'};
const HISTORY = {"API":[{"date":"2026-09-23","close":334,"open":338,"high":338.9,"low":333.5,"volume":233458},{"date":"2026-09-24","close":334.8,"open":334,"high":335.7,"low":330.1,"volume":222689},{"date":"2026-09-28","close":335,"open":336,"high":337.9,"low":333,"volume":156452},{"date":"2026-09-29","close":334,"open":336,"high":336,"low":331,"volume":172257},{"date":"2026-09-30","close":335,"open":335,"high":336.5,"low":333.4,"volume":202365},{"date":"2026-10-01","close":341,"open":335,"high":345,"low":332,"volume":673559},{"date":"2026-10-02","close":338.8,"open":341,"high":344,"low":335.2,"volume":262514}],"CHCL":[{"date":"2026-09-23","close":354.5,"open":361,"high":362,"low":352.5,"volume":68382},{"date":"2026-09-24","close":352,"open":336.8,"high":359,"low":336.8,"volume":83517},{"date":"2026-09-28","close":353.3,"open":352,"high":360,"low":345.3,"volume":73527},{"date":"2026-09-29","close":349,"open":351,"high":355,"low":346.4,"volume":30207},{"date":"2026-09-30","close":348.8,"open":350,"high":350,"low":345,"volume":65137},{"date":"2026-10-01","close":341.7,"open":349.1,"high":350,"low":341.2,"volume":61162},{"date":"2026-10-02","close":339,"open":341.7,"high":345,"low":339,"volume":53796}],"GBIME":[{"date":"2026-09-23","close":243,"open":247.5,"high":247.5,"low":240.8,"volume":265691},{"date":"2026-09-24","close":243.8,"open":247.5,"high":247.5,"low":240.4,"volume":223433},{"date":"2026-09-28","close":243.2,"open":243.8,"high":244,"low":240,"volume":152777},{"date":"2026-09-29","close":242.2,"open":243.5,"high":244,"low":241,"volume":175880},{"date":"2026-09-30","close":243.5,"open":230.1,"high":245,"low":230.1,"volume":156159},{"date":"2026-10-01","close":243.9,"open":245,"high":245,"low":242,"volume":160436},{"date":"2026-10-02","close":243,"open":244,"high":244.9,"low":242,"volume":78565}],"HDL":[{"date":"2026-09-23","close":1278.3,"open":1284,"high":1290,"low":1270.2,"volume":160341},{"date":"2026-09-24","close":1312,"open":1280,"high":1320,"low":1270.2,"volume":269642},{"date":"2026-09-28","close":1323,"open":1312,"high":1363,"low":1305.1,"volume":269014},{"date":"2026-09-29","close":1297,"open":1323,"high":1329,"low":1285,"volume":177277},{"date":"2026-09-30","close":1292,"open":1261,"high":1296,"low":1261,"volume":106475},{"date":"2026-10-01","close":1286,"open":1292,"high":1298.8,"low":1283,"volume":78951},{"date":"2026-10-02","close":1293,"open":1350,"high":1350,"low":1285,"volume":102119}],"NABIL":[{"date":"2026-09-23","close":565,"open":570,"high":570,"low":565,"volume":88866},{"date":"2026-09-24","close":569,"open":566,"high":570,"low":566,"volume":70719},{"date":"2026-09-28","close":567,"open":570,"high":570.4,"low":567,"volume":71595},{"date":"2026-09-29","close":566,"open":567,"high":568,"low":563,"volume":124364},{"date":"2026-09-30","close":530.7,"open":538,"high":538.9,"low":529,"volume":96131},{"date":"2026-10-01","close":528.5,"open":531,"high":532,"low":525,"volume":73612},{"date":"2026-10-02","close":528.7,"open":529,"high":533,"low":525,"volume":60383}],"NLIC":[{"date":"2026-09-23","close":743.4,"open":792.7,"high":792.7,"low":736,"volume":19283},{"date":"2026-09-24","close":745,"open":706.3,"high":745,"low":706.3,"volume":8391},{"date":"2026-09-28","close":736,"open":745,"high":745,"low":735,"volume":26881},{"date":"2026-09-29","close":735,"open":736,"high":736,"low":730.1,"volume":20365},{"date":"2026-09-30","close":727.8,"open":734,"high":745,"low":725,"volume":14088},{"date":"2026-10-01","close":727.9,"open":727,"high":739,"low":721,"volume":12080},{"date":"2026-10-02","close":726.9,"open":691.6,"high":740,"low":691.6,"volume":7723}],"NRIC":[{"date":"2026-09-23","close":820,"open":873.6,"high":873.6,"low":799,"volume":13340},{"date":"2026-09-24","close":817,"open":800,"high":847,"low":800,"volume":9109},{"date":"2026-09-28","close":806.2,"open":817,"high":820,"low":805.3,"volume":15010},{"date":"2026-09-29","close":805,"open":765.9,"high":817.9,"low":765.9,"volume":19736},{"date":"2026-09-30","close":806,"open":805,"high":808,"low":799,"volume":7214},{"date":"2026-10-01","close":803,"open":800.1,"high":809.4,"low":795.5,"volume":12520},{"date":"2026-10-02","close":802.9,"open":795,"high":809,"low":795,"volume":7826}],"SHIVM":[{"date":"2026-09-23","close":687,"open":686,"high":697,"low":685,"volume":555257},{"date":"2026-09-24","close":702,"open":689,"high":704.5,"low":686.1,"volume":513184},{"date":"2026-09-28","close":695.1,"open":737.1,"high":737.1,"low":691,"volume":424127},{"date":"2026-09-29","close":690.1,"open":693,"high":697,"low":685,"volume":250541},{"date":"2026-09-30","close":684.5,"open":691,"high":691,"low":683,"volume":222414},{"date":"2026-10-01","close":685,"open":685,"high":689.5,"low":680.1,"volume":134104},{"date":"2026-10-02","close":681,"open":692,"high":692,"low":680.3,"volume":106558}]};
const DEFAULT_HOLDINGS = [
  {symbol:'NABIL',qty:500,avg:485,date:'2026-04-10'},
  {symbol:'SHIVM',qty:300,avg:520,date:'2026-05-21'},
  {symbol:'CHCL',qty:400,avg:455,date:'2026-07-03'}
];

const state = {
  page:'dashboard',
  selected:'NABIL',
  holdings:read('nepseHoldings',DEFAULT_HOLDINGS),
  watchlist:read('nepseWatchlist',['NABIL','GBIME','SHIVM','NRIC']),
  alerts:read('nepseAlerts',[
    {symbol:'NABIL',type:'Price',rule:'Below Rs 500'},
    {symbol:'GBIME',type:'Score',rule:'Above 80'}
  ])
};

function read(k,fallback){try{var v=localStorage.getItem(k);return v?JSON.parse(v):fallback;}catch(e){return fallback;}}
function save(){localStorage.setItem('nepseHoldings',JSON.stringify(state.holdings));localStorage.setItem('nepseWatchlist',JSON.stringify(state.watchlist));localStorage.setItem('nepseAlerts',JSON.stringify(state.alerts));}
function s(sym){return STOCKS.find(function(x){return x.symbol===sym;});}
function money(n){return 'Rs '+Math.round(n).toLocaleString('en-IN');}
function pct(n){return (n>=0?'+':'')+Number(n).toFixed(2)+'%';}
function change(x){return x.prev?((x.price-x.prev)/x.prev*100):0;}
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
  var invested=0,current=0,sectors={};
  state.holdings.forEach(function(h){var x=s(h.symbol);if(!x)return;invested+=h.qty*h.avg;current+=h.qty*x.price;sectors[x.sector]=(sectors[x.sector]||0)+h.qty*x.price;});
  return {invested:invested,current:current,pl:current-invested,ret:invested?(current-invested)/invested*100:0,sectors:sectors};
}

function nav(){
  var items=[['dashboard','Dashboard'],['companies','Companies'],['portfolio','Portfolio'],['screener','Screener'],['watchlist','Watchlist'],['alerts','Alerts']];
  return '<aside class="side"><div class="brand"><b>NC</b><span><strong>NEPSE Copilot</strong><small>Private research terminal</small></span></div><nav>'+
    items.map(function(i){return '<button class="'+(state.page===i[0]?'active':'')+'" data-nav="'+i[0]+'">'+i[1]+'</button>';}).join('')+
    '</nav><div class="source"><b>Data status</b><br>Price/volume snapshot: '+META.priceDate+'<br><span>Fundamentals & scores: demo</span></div></aside>';
}
function header(title,sub){
  return '<header><div><small>NEPSE COPILOT V1</small><h1>'+title+'</h1><p>'+(sub||'Research and portfolio decision support')+'</p></div><button class="primary" data-nav="portfolio">+ Add holding</button></header>'+
  '<div class="notice"><b>Prototype:</b> company close/volume comes from a dated public OHLC development snapshot. EPS, P/E, ROE, RSI, scores and overall market summary are still illustrative.</div>';
}
function card(label,value,sub,cls){return '<div class="card metric"><span>'+label+'</span><strong>'+value+'</strong><small class="'+(cls||'')+'">'+sub+'</small></div>';}
function table(rows){
  return '<div class="table"><table><thead><tr><th>Company</th><th>Price</th><th>Change</th><th>Volume</th><th>Score</th><th>Status</th></tr></thead><tbody>'+
  rows.map(function(x){var c=change(x);return '<tr data-stock="'+x.symbol+'"><td><b>'+x.symbol+'</b><small>'+x.name+'</small></td><td>'+money(x.price)+'</td><td class="'+(c>=0?'up':'down')+'">'+pct(c)+'</td><td>'+x.volume.toLocaleString('en-IN')+'</td><td><b>'+x.score+'/100</b></td><td><span class="pill '+(x.status==='Research'?'good':x.status==='Caution'?'bad':'warn')+'">'+x.status+'</span></td></tr>';}).join('')+
  '</tbody></table></div>';
}

function dashboard(){
  var p=portfolio();
  var sorted=STOCKS.slice().sort(function(a,b){return b.score-a.score;});
  var exp=Object.keys(p.sectors).sort(function(a,b){return p.sectors[b]-p.sectors[a];});
  return header('Dashboard','Snapshot '+META.priceDate+' · personal portfolio')+
  '<section class="metrics">'+
  card('Portfolio value',money(p.current),'Current prototype value')+
  card('Invested',money(p.invested),'Cost basis')+
  card('Total P/L',money(p.pl),pct(p.ret),p.pl>=0?'up':'down')+
  card('Watchlist',state.watchlist.length,state.alerts.length+' active alerts')+
  '</section>'+
  '<section class="two"><div class="card block"><div class="title"><div><h2>Research candidates</h2><p>Prioritised by demo score</p></div></div>'+table(sorted.slice(0,6))+'</div>'+
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
  var x=s(state.selected),c=change(x),watched=state.watchlist.indexOf(x.symbol)>=0;
  return header(x.symbol+' · '+x.name,x.sector+' · close '+META.priceDate)+
  '<section class="stockHero"><div class="card block"><div class="stockTop"><div><span class="muted">Close</span><strong>'+money(x.price)+'</strong><small class="'+(c>=0?'up':'down')+'">'+pct(c)+' vs '+META.previousDate+'</small></div>'+
  '<button id="watchBtn" class="'+(watched?'primary':'')+'">'+(watched?'★ Watching':'☆ Add to watchlist')+'</button></div>'+
  '<div class="facts">'+card('EPS',x.eps,'Demo fundamental')+card('P/E',x.pe,'Demo valuation')+card('ROE',x.roe+'%','Demo fundamental')+card('RSI',x.rsi,'Demo technical')+'</div></div>'+
  '<div class="card scoreBox"><span>Research score</span><strong>'+x.score+'</strong><small>/100 · demo model</small><div class="pill '+(x.status==='Research'?'good':x.status==='Caution'?'bad':'warn')+'">'+x.status+'</div></div></section>'+
  '<section class="card block historyCard"><div class="title"><div><h2>Recent price history</h2><p>Seven available sessions from the public OHLC development source</p></div></div>'+spark(x.symbol)+(function(){var hs=historyStats(x.symbol);return '<div class="historyStats">'+card('7-session return',pct(hs.ret),'From first to latest close',hs.ret>=0?'up':'down')+card('Average volume',Math.round(hs.avgVolume).toLocaleString('en-IN'),'Available sessions')+card('Close range',money(hs.low)+' – '+money(hs.high),'Available sessions')+'</div>';})()+'</section>'+
  '<section class="two"><div class="card block"><div class="title"><div><h2>Why this score?</h2><p>Evidence-style explanation</p></div></div><ul class="thesis">'+
  '<li>Profitability proxy: ROE '+x.roe+'% (demo).</li><li>Valuation proxy: P/E '+x.pe+' (demo).</li><li>Momentum proxy: RSI '+x.rsi+' (demo).</li><li>Latest dated volume: '+x.volume.toLocaleString('en-IN')+' shares.</li></ul></div>'+
  '<div class="card block"><div class="title"><div><h2>Risk note</h2><p>Decision support, not execution</p></div></div><p>The score is not a buy/sell instruction. Production mode will refuse to score a company when required verified evidence is missing.</p></div></section>';
}

function portfolioPage(){
  var p=portfolio();
  var rows=state.holdings.map(function(h,i){var x=s(h.symbol);if(!x)return '';var val=h.qty*x.price,pl=val-h.qty*h.avg;return '<tr><td><b>'+h.symbol+'</b><small>'+x.name+'</small></td><td>'+h.qty+'</td><td>'+money(h.avg)+'</td><td>'+money(x.price)+'</td><td>'+money(val)+'</td><td class="'+(pl>=0?'up':'down')+'">'+money(pl)+'</td><td><button class="danger small" data-remove="'+i+'">Remove</button></td></tr>';}).join('');
  return header('Portfolio','Your private holdings')+
  '<section class="metrics">'+card('Current value',money(p.current),'Snapshot value')+card('Invested',money(p.invested),'Cost basis')+card('P/L',money(p.pl),pct(p.ret),p.pl>=0?'up':'down')+'</section>'+
  '<div class="card block"><form id="holdingForm" class="form"><select name="symbol">'+STOCKS.map(function(x){return '<option>'+x.symbol+'</option>';}).join('')+'</select><input name="qty" type="number" min="1" placeholder="Quantity" required><input name="avg" type="number" min="0" step="0.01" placeholder="Average price" required><input name="date" type="date"><button class="primary">Add holding</button></form>'+
  '<div class="table"><table><thead><tr><th>Company</th><th>Qty</th><th>Avg</th><th>Close</th><th>Value</th><th>P/L</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
}

function screener(){
  return header('Screener','Filter the prototype universe')+
  '<div class="card block"><form id="screenForm" class="form"><select name="sector"><option value="">All sectors</option>'+Array.from(new Set(STOCKS.map(function(x){return x.sector;}))).map(function(v){return '<option>'+v+'</option>';}).join('')+'</select><input name="score" type="number" value="70" min="0" max="100" placeholder="Min score"><input name="pe" type="number" value="40" min="0" placeholder="Max P/E"><input name="roe" type="number" value="10" min="0" placeholder="Min ROE"><button class="primary">Run screen</button></form><div id="screenResults">'+table(STOCKS.filter(function(x){return x.score>=70&&x.pe<=40&&x.roe>=10;}))+'</div></div>';
}

function watchlist(){
  var rows=STOCKS.filter(function(x){return state.watchlist.indexOf(x.symbol)>=0;});
  return header('Watchlist','Companies you are following')+'<div class="card block">'+(rows.length?table(rows):'<p class="muted">Your watchlist is empty.</p>')+'</div>';
}

function alerts(){
  return header('Alerts','Prototype alert rules')+'<div class="card block"><form id="alertForm" class="form"><select name="symbol">'+STOCKS.map(function(x){return '<option>'+x.symbol+'</option>';}).join('')+'</select><select name="type"><option>Price</option><option>Score</option><option>Volume</option><option>Disclosure</option></select><input name="rule" placeholder="e.g. Below Rs 500" required><button class="primary">Add alert</button></form><div class="alertList">'+state.alerts.map(function(a,i){return '<div><span><b>'+esc(a.symbol)+'</b><small>'+esc(a.type)+' · '+esc(a.rule)+'</small></span><button class="danger small" data-alert-remove="'+i+'">Remove</button></div>';}).join('')+'</div></div>';
}

function page(){
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
  var hf=document.getElementById('holdingForm');if(hf)hf.onsubmit=function(e){e.preventDefault();var f=new FormData(hf);state.holdings.push({symbol:f.get('symbol'),qty:Number(f.get('qty')),avg:Number(f.get('avg')),date:f.get('date')||''});save();render();};
  document.querySelectorAll('[data-remove]').forEach(function(b){b.onclick=function(){state.holdings.splice(Number(b.dataset.remove),1);save();render();};});
  var sf=document.getElementById('screenForm');if(sf)sf.onsubmit=function(e){e.preventDefault();var f=new FormData(sf),sec=f.get('sector'),score=Number(f.get('score')||0),pe=Number(f.get('pe')||9999),roe=Number(f.get('roe')||0);var rows=STOCKS.filter(function(x){return (!sec||x.sector===sec)&&x.score>=score&&x.pe<=pe&&x.roe>=roe;});document.getElementById('screenResults').innerHTML=table(rows);document.querySelectorAll('[data-stock]').forEach(function(r){r.onclick=function(){state.selected=r.dataset.stock;state.page='stock';render();};});};
  var af=document.getElementById('alertForm');if(af)af.onsubmit=function(e){e.preventDefault();var f=new FormData(af);state.alerts.push({symbol:f.get('symbol'),type:f.get('type'),rule:f.get('rule')});save();render();};
  document.querySelectorAll('[data-alert-remove]').forEach(function(b){b.onclick=function(){state.alerts.splice(Number(b.dataset.alertRemove),1);save();render();};});
}
render();