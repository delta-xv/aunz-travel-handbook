const wikiTitles={
  "上海": "上海市",
  "墨尔本": "墨尔本",
  "凯恩斯": "凯恩斯",
  "悉尼": "悉尼",
  "皇后镇": "皇后镇 (新西兰)",
  "库克山": "奧拉基/庫克山",
  "基督城机场": "基督城機場",
  "奥克兰": "奧克蘭",
  "罗托鲁瓦": "羅托魯瓦",
  "大洋路": "大洋路",
  "弗林德斯街火车站": "佛林德茲街車站",
  "圣保罗大教堂": "圣保罗座堂 (墨尔本)",
  "霍西尔巷": "霍西尔巷",
  "Degraves Street": null,
  "皇家拱廊": "皇家拱廊",
  "十二门徒": "十二門徒石",
  "洛克阿德峡谷 / 沉船湾": "阿德湖峡",
  "阿波罗湾": "阿波罗贝",
  "大洋路纪念牌坊": "大洋路",
  "Split Point 灯塔": "斯普利特角灯塔",
  "卡尔顿花园": "卡爾頓花園",
  "维多利亚州立图书馆": "维多利亚州立图书馆",
  "维多利亚国家美术馆": "維多利亞國立美術館",
  "Fitzroy 街区": "斐茲洛伊區 (維多利亞省)",
  "墨尔本机场": "墨爾本機場",
  "绿岛": "綠島 (昆士蘭州)",
  "大堡礁海域": "大堡礁",
  "雨林自然公园": null,
  "原住民文化表演": "澳大利亚原住民",
  "库兰达野生动物园": null,
  "环形码头": "環形碼頭",
  "悉尼观鲸航线": "大翅鲸",
  "悉尼歌剧院": "悉尼歌剧院",
  "皇家植物园": "悉尼皇家植物園",
  "悉尼大学": "悉尼大學",
  "瓦卡蒂普湖": "瓦卡蒂普湖",
  "皇后镇花园": null,
  "埃格林顿山谷": null,
  "镜湖": null,
  "荷马隧道": null,
  "米佛峡湾": "米爾福德峽灣",
  "皇后镇镇中心": "皇后镇 (新西兰)",
  "Skyline Queenstown": "皇后镇 (新西兰)",
  "格林诺奇": "格林諾奇",
  "高空跳伞": "跳伞",
  "箭镇": "箭鎮",
  "卡瓦劳吊桥": null,
  "瓦纳卡孤独的树": null,
  "Aoraki / 库克山国家公园": "奧拉基/庫克山國家公園",
  "普卡基湖": "普卡基湖",
  "蒂卡波湖": "蒂卡普湖",
  "好牧羊人教堂": null,
  "边界犬雕像": "边境牧羊犬",
  "怀托摩萤火虫洞": "懷托摩洞穴",
  "怀奥塔普地热世界": "怀奥塔普",
  "红木森林": null,
  "罗托鲁瓦政府花园": null,
  "波利尼西亚温泉": null,
  "霍比特人村": "哈比村",
  "玛塔玛塔": "馬塔馬塔",
  "奥克兰皇后街": null,
  "奥克兰机场": "奧克蘭機場"
};
const events=[
 {at:'2026-09-24T17:00:00+08:00',title:'浦东机场集合',detail:'17:00 · 上海浦东国际机场 T1 航站楼 14号门 L岛'},
 {at:'2026-09-24T20:30:00+08:00',title:'飞往墨尔本',detail:'MU737 · 20:30 起飞；17:00 于 T1 航站楼 14号门 L岛集合'},
 {at:'2026-09-25T09:00:00+10:00',title:'抵达墨尔本',detail:'开始澳大利亚段行程'},
 {at:'2026-09-27T18:55:00+10:00',title:'飞往凯恩斯',detail:'JQ946 · 18:55 起飞'},
 {at:'2026-09-28T10:30:00+10:00',title:'绿岛大堡礁',detail:'大冒险号出海 · 约 10:30'},
 {at:'2026-09-29T15:35:00+10:00',title:'飞往悉尼',detail:'JQ955 · 15:35 起飞'},
 {at:'2026-09-30T09:30:00+10:00',title:'悉尼观鲸',detail:'库克船长游轮 · 约 09:30'},
 {at:'2026-10-01T10:50:00+10:00',title:'飞往皇后镇',detail:'JQ223 · 10:50 起飞'},
 {at:'2026-10-02T07:00:00+13:00',title:'米佛峡湾',detail:'峡湾国家公园一日游'},
 {at:'2026-10-04T08:00:00+13:00',title:'前往库克山',detail:'箭镇 · 瓦纳卡 · Aoraki'},
 {at:'2026-10-05T20:30:00+13:00',title:'飞往奥克兰',detail:'基督城机场 · JQ242'},
 {at:'2026-10-06T08:00:00+13:00',title:'北岛环线',detail:'怀托摩 · 怀奥塔普 · 罗托鲁瓦'},
 {at:'2026-10-07T22:00:00+13:00',title:'返程上海',detail:'奥克兰机场 · MU780'},
 {at:'2026-10-08T05:30:00+08:00',title:'抵达上海',detail:'旅程圆满结束'}
];

const logbookIcons={"compass":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 1v4m0 14v4M1 12h4m14 0h4M8 16l2-6 6-2-2 6-6 2Z\"/><path d=\"m10 10 4 4\"/>","calendar":"<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"1\"/><path d=\"M7 2v6m10-6v6M3 10h18\"/>","list":"<path d=\"M8 5h13M8 12h13M8 19h13\"/><circle cx=\"3\" cy=\"5\" r=\".6\"/><circle cx=\"3\" cy=\"12\" r=\".6\"/><circle cx=\"3\" cy=\"19\" r=\".6\"/>","map":"<path d=\"m3 5 6-3 6 3 6-3v17l-6 3-6-3-6 3V5Zm6-3v17m6-14v17\"/>","ticket":"<path d=\"M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Zm12 0v3m0 3v2m0 3v3\"/>","bulb":"<path d=\"M8 18h8m-7 3h6M8 15c0-3-3-3-3-7a7 7 0 0 1 14 0c0 4-3 4-3 7v3H8v-3Z\"/>","pin":"<path d=\"M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/>","share":"<circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><path d=\"m9 10 6-4M9 14l6 4\"/>","arrow":"<path d=\"m9 5 7 7-7 7\"/>","back":"<path d=\"m15 5-7 7 7 7\"/>","plane":"<path d=\"m2 14 8-4V3c0-2 4-2 4 0v7l8 4v3l-8-2v4l3 2H7l3-2v-4l-8 2v-3Z\"/>","bed":"<path d=\"M3 4v17m18-11v11M3 17h18M3 9h18v8M7 9V6h10v3\"/>","meal":"<path d=\"M5 2v7m4-7v7M3 2v5c0 4 8 4 8 0V2M7 10v12M19 2c-4 3-4 10 0 10V2Zm0 10v10\"/>","document":"<path d=\"M5 2h10l4 4v16H5V2Zm10 0v5h4M8 11h8m-8 4h8m-8 4h5\"/>","clock":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 6v6l4 2\"/>","refresh":"<path d=\"M20 9a8 8 0 0 0-14-4L3 8m0-6v6h6M4 15a8 8 0 0 0 14 4l3-3m0 6v-6h-6\"/>","external":"<path d=\"M14 3h7v7M21 3l-11 11M10 3H3v18h18v-7\"/>"};
function logbookIcon(name){return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${logbookIcons[name]||''}</svg>`}
const storage={get(key){try{return JSON.parse(localStorage.getItem(key))}catch{return null}},set(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}};
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateKey=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const tripDates=itinerary.map(x=>'2026-'+x.date.replace('/','-'));
function currentDayIndex(now=new Date()){return tripDates.indexOf(dateKey(now))}
function addDays(key,count){const d=new Date(key+'T12:00:00');d.setDate(d.getDate()+count);return dateKey(d)}
function mapLink(name){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(name)}
const relatedWiki={'大洋路纪念牌坊':'大洋路','原住民文化表演':'澳大利亚原住民','悉尼观鲸航线':'座头鲸','皇后镇镇中心':'皇后镇','Skyline Queenstown':'皇后镇','边界犬雕像':'边境牧羊犬','红木森林':'华卡雷瓦雷瓦地区'};
function wikiLink(name,inline=false){const title=wikiTitles[name];const url=title?'https://zh.wikipedia.org/zh-cn/'+encodeURIComponent(title):'https://zh.wikipedia.org/w/index.php?'+new URLSearchParams({search:name+' '+(name==='镜湖'?'新西兰':''),title:'Special:Search'});const label=inline?name:title?(relatedWiki[name]?'相关百科：'+relatedWiki[name]:'中文百科 ↗'):'中文百科搜索 ↗';return `<a class="${inline?'city-link':'wiki-link'}" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`}
const tripFlightDates=Object.fromEntries(itinerary.flatMap((day,index)=>(day.time.match(/\b(?:MU|JQ|VA)\d{2,4}\b/g)||[]).map(flight=>[flight,tripDates[index]])));
function flightStatusURL(flight){const date=tripFlightDates[flight]||dateKey(new Date());return 'https://flights.ctrip.com/actualtime/detail.html?'+new URLSearchParams({flightNo:flight,date})}
function flightLinks(text){return escapeHtml(text).replace(/\b(MU|JQ|VA)(\d{2,4})\b/g,flight=>`<a class="flight-link" href="${escapeHtml(flightStatusURL(flight))}" target="_blank" rel="noopener" title="携程 · ${flight} 航班动态">${flight} ↗</a>`)}

function wearMarkup(x){const w=clothing[x.d];return w?`<section class="wear-guide"><div class="wear-head"><h4>穿衣建议</h4><span class="wear-weather">气候参考 · ${w.weather}</span></div><div class="wear-formula">${w.formula}</div><div class="wear-note">${w.note}</div><div class="wear-carry"><b>随身：</b>${w.carry}</div></section>`:''}
function detailMarkup(x){const sites=attractions[x.d]||[];return `<div class="story"><p>${flightLinks(x.summary)}</p><div class="detail-grid"><div><b>交通</b>${flightLinks(x.time)}</div><div><b>餐食</b>${x.meal}</div><div><b>住宿</b>${x.hotel}</div><div><b>安排</b>${['D4','D10'].includes(x.d)?'自由活动 + 集合':'跟团安排'}</div></div>${wearMarkup(x)}${sites.length?`<div class="attractions-title">景点介绍</div><div class="attraction-list">${sites.map((a,j)=>{const guide=(deepGuides[x.d]||[])[j]||[];return `<details class="attraction"><summary><span class="attraction-no">${String(j+1).padStart(2,'0')}</span>${escapeHtml(a[0])}</summary><div class="deep-guide">${wikiLink(a[0])}<div class="guide-line"><b>简介</b><span>${a[1]}</span><span>${guide[0]||''}</span></div><div class="guide-line"><b>游览提示</b><span>${guide[1]||''}</span><span>${guide[2]||''}</span></div>${guide[3]?`<details class="mini-guide"><summary>拍摄与提醒</summary><p>${guide[3]}</p></details>`:''}</div></details>`}).join('')}</div>`:''}${placeButtons(x)}${x.warn?`<p class="warning">${x.warn}</p>`:''}</div>`}
itinerary.forEach((x,i)=>{const el=document.createElement('article');el.id='day-'+(i+1);el.className='day card';el.dataset.region=i===0||i===14?'flight':i<7?'au':'nz';el.innerHTML=`<button class="day-head" id="day-heading-${i+1}" aria-expanded="false" aria-controls="day-body-${i+1}"><span class="day-index"><b>${x.d}</b><small>${x.date}</small></span><span class="day-copy"><span class="day-title">${x.title}</span><span class="day-caption">${x.time}</span></span>${logbookIcon('arrow')}</button><div class="day-body" id="day-body-${i+1}" role="region" aria-labelledby="day-heading-${i+1}" hidden>${detailMarkup(x)}<div class="inline-day-actions"><button class="outline-btn" data-share-day="${i}">分享这一天</button><button class="outline-btn" data-collapse-day="${i}">收起</button></div></div>`;el.querySelector('button').onclick=()=>toggleInlineDay(i);document.getElementById('timeline').appendChild(el)});
const sheet=document.getElementById('actionSheet');
let sheetOpener=null,activeView='',renderedSheet='',expandedDay=null;
const viewIds=['today','itinerary','route-map'],viewScroll={};
function isOpen(el){return el.hasAttribute('open')}
function focusQuietly(el){try{el?.focus({preventScroll:true})}catch{el?.focus()}}
function openModal(el){if(isOpen(el))return;if(typeof el.showModal==='function')el.showModal();else{el.setAttribute('open','');el.classList.add('fallback-dialog');el.setAttribute('role','dialog');el.setAttribute('aria-modal','true')}}
function closeModal(el){if(!isOpen(el))return;if(typeof el.close==='function'&&!el.classList.contains('fallback-dialog'))el.close();else el.removeAttribute('open')}
function routeState(){const parts=location.hash.slice(1).split('/'),match=/^day-(\d+)$/.exec(parts[1]||'');const day=match&&Number(match[1])>=1&&Number(match[1])<=15?Number(match[1])-1:null;return{view:day!==null?'itinerary':viewIds.includes(parts[0])?parts[0]:'today',day}}
function setExpandedDay(index){expandedDay=index;document.querySelectorAll('.day').forEach((row,i)=>{const open=i===index;row.classList.toggle('expanded',open);row.querySelector('.day-head').setAttribute('aria-expanded',String(open));row.querySelector('.day-body').hidden=!open})}
function setItineraryFilter(filter){document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));document.querySelectorAll('.day').forEach(d=>d.hidden=filter!=='all'&&d.dataset.region!==filter)}
function scrollToDay(index){if(activeView!=='itinerary'||isOpen(sheet))return;const row=document.getElementById('day-'+(index+1));if(!row||row.hidden)return;const header=document.getElementById('itineraryHeader');window.scrollTo({top:Math.max(0,scrollY+row.getBoundingClientRect().top-header.getBoundingClientRect().height-12),behavior:'auto'})}
function scrollToCurrentDay(){if(activeView!=='itinerary'||isOpen(sheet)||routeState().day!==null)return;setItineraryFilter('all');const today=currentDayIndex();scrollToDay(today>=0?today:dateKey(new Date())<tripDates[0]?0:itinerary.length-1)}
function syncNavigation(){const route=routeState(),sheetState=history.state?.app==='aunz-touch'?history.state.sheet:null;const changed=activeView!==route.view,changedDay=expandedDay!==route.day;let returnFocus=null;
  if(changed){if(activeView)viewScroll[activeView]=scrollY;activeView=route.view;document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==activeView);document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.hash==='#'+activeView;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
  setExpandedDay(route.view==='itinerary'?route.day:null);
  if(sheetState){const key=JSON.stringify(sheetState);if(key!==renderedSheet){renderSheet(sheetState);renderedSheet=key}const wasOpen=isOpen(sheet);openModal(sheet);if(!wasOpen)focusQuietly(document.getElementById('closeSheet'))}else if(isOpen(sheet)){closeModal(sheet);renderedSheet='';returnFocus=sheetOpener}
  document.body.classList.toggle('dialog-open',isOpen(sheet));document.querySelector('.app').inert=isOpen(sheet);document.querySelector('.mobile-nav').inert=isOpen(sheet);document.getElementById('modalBackdrop').hidden=!(isOpen(sheet)&&sheet.classList.contains('fallback-dialog'));
  if(returnFocus)requestAnimationFrame(()=>focusQuietly(returnFocus));
  if(!sheetState&&(changed||changedDay)){requestAnimationFrame(()=>{if(activeView==='itinerary'){if(route.day!==null){setItineraryFilter('all');scrollToDay(route.day)}else if(changed)scrollToCurrentDay()}else if(changed)window.scrollTo(0,viewScroll[activeView]||0)})}
  document.title=(route.day!==null?itinerary[route.day].d+' '+itinerary[route.day].title:document.querySelector(`[data-nav][href="#${activeView}"] span`).textContent)+' · 澳新旅行手册';
}
function toggleInlineDay(index){const next=expandedDay===index?null:index;history.replaceState(null,'','#itinerary'+(next===null?'':'/day-'+(next+1)));syncNavigation();requestAnimationFrame(()=>scrollToDay(index))}
function collapseInlineDay(index){history.replaceState(null,'','#itinerary');syncNavigation();requestAnimationFrame(()=>{scrollToDay(index);focusQuietly(document.querySelector('#day-'+(index+1)+' .day-head'))})}
function openDay(index){if(index<0||index>=itinerary.length)return;history.pushState(null,'','#itinerary/day-'+(index+1));syncNavigation()}
function openSheet(data,opener=document.activeElement){if(!isOpen(sheet))sheetOpener=opener;history.pushState({app:'aunz-touch',kind:'sheet',sheet:data},'',location.href);syncNavigation()}
function closeSheet(){if(history.state?.app==='aunz-touch'&&history.state.sheet)history.back();else{closeModal(sheet);syncNavigation()}}
function goView(id){if(activeView===id){if(id==='itinerary'){history.replaceState(null,'','#itinerary');syncNavigation();scrollToCurrentDay()}else window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return}history.pushState(null,'','#'+id);syncNavigation()}
document.querySelectorAll('[data-nav],.today-actions a[href="#itinerary"]').forEach(a=>a.onclick=e=>{e.preventDefault();goView(a.hash.slice(1))});
document.getElementById('closeSheet').onclick=closeSheet;sheet.addEventListener('cancel',e=>{e.preventDefault();closeSheet()});sheet.addEventListener('click',e=>{if(e.target!==sheet)return;const r=sheet.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeSheet()});document.getElementById('modalBackdrop').onclick=closeSheet;
window.addEventListener('popstate',syncNavigation);window.addEventListener('hashchange',syncNavigation);
if(!viewIds.includes(location.hash.slice(1).split('/')[0]))history.replaceState(null,'','#today');
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{history.replaceState(null,'','#itinerary');syncNavigation();setItineraryFilter(b.dataset.filter);const header=document.getElementById('itineraryHeader');window.scrollTo({top:scrollY+header.getBoundingClientRect().top,behavior:'auto'})});
document.addEventListener('click',e=>{const share=e.target.closest('[data-share-day]'),collapse=e.target.closest('[data-collapse-day]');if(share)shareDay(Number(share.dataset.shareDay),share);if(collapse)collapseInlineDay(Number(collapse.dataset.collapseDay))});
document.addEventListener('keydown',e=>{if(!isOpen(sheet)||!sheet.classList.contains('fallback-dialog'))return;if(e.key==='Escape'){e.preventDefault();closeSheet()}if(e.key==='Tab'){const controls=[...sheet.querySelectorAll('a[href],button:not([disabled]),textarea,input,select,summary,[tabindex="0"]')].filter(el=>el.getClientRects().length);if(!controls.length)return;const first=controls[0],last=controls.at(-1);if(e.shiftKey&&(document.activeElement===first||!sheet.contains(document.activeElement))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(document.activeElement===last||!sheet.contains(document.activeElement))){e.preventDefault();first.focus()}}});

const handle=document.getElementById('sheetHandle');let drag=null;
handle.addEventListener('pointerdown',e=>{if(!e.isPrimary)return;drag={id:e.pointerId,y:e.clientY};handle.setPointerCapture(e.pointerId)});
handle.addEventListener('pointermove',e=>{if(drag&&drag.id===e.pointerId)sheet.style.transform=`translateY(${Math.max(0,e.clientY-drag.y)}px)`});
function finishDrag(e){if(!drag)return;const distance=e.clientY-drag.y;drag=null;sheet.style.transform='';if(e.type==='pointerup'&&distance>80)closeSheet()}
handle.addEventListener('pointerup',finishDrag);handle.addEventListener('pointercancel',finishDrag);

const cities={shanghai:['上海',31.2304,121.4737,'Asia/Shanghai'],melbourne:['墨尔本',-37.8136,144.9631,'Australia/Melbourne'],coast:['十二门徒',-38.665,143.104,'Australia/Melbourne'],cairns:['凯恩斯',-16.9186,145.7781,'Australia/Brisbane'],sydney:['悉尼',-33.8688,151.2093,'Australia/Sydney'],queenstown:['皇后镇',-45.0312,168.6626,'Pacific/Auckland'],milford:['米佛峡湾',-44.671,167.926,'Pacific/Auckland'],cook:['库克山',-43.735,170.096,'Pacific/Auckland'],tekapo:['蒂卡波湖',-44.004,170.477,'Pacific/Auckland'],rotorua:['罗托鲁瓦',-38.1368,176.2497,'Pacific/Auckland'],auckland:['奥克兰',-36.8485,174.7633,'Pacific/Auckland']};
const dayCities=['shanghai','melbourne','coast','melbourne','cairns','cairns','sydney','queenstown','milford','queenstown','cook','tekapo','rotorua','auckland','shanghai'];
const isAppleMobile=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const mapNames={amap:'高德地图',baidu:'百度地图',apple:'Apple 地图',google:'Google 地图'};
const placeRegions=['上海','墨尔本','墨尔本','墨尔本','凯恩斯','凯恩斯','悉尼','皇后镇','米佛峡湾','皇后镇','库克山','蒂卡波','罗托鲁瓦','奥克兰','上海'];
function dayPlaces(index){const places=itinerary[index].places;return places.length?places:['Shanghai Pudong International Airport']}
function placeQuery(index,name){const country=index===0||index===14?'China':index<7?'Australia':'New Zealand';return name+', '+country}
function mapURL(provider,index,name,directions=false){const query=placeQuery(index,name);const regions={Shanghai:'上海',Melbourne:'墨尔本',Cairns:'凯恩斯',Sydney:'悉尼',Queenstown:'皇后镇',Christchurch:'基督城',Auckland:'奥克兰',Rotorua:'罗托鲁瓦',Waitomo:'怀托摩',Hobbiton:'玛塔玛塔',Tekapo:'蒂卡波',Wanaka:'瓦纳卡'};const region=Object.entries(regions).find(([english])=>name.includes(english))?.[1]||placeRegions[index];if(provider==='amap')return 'https://uri.amap.com/search?'+new URLSearchParams({keyword:query,city:region,view:'list',src:'aunz-handbook',callnative:'1'});if(provider==='baidu')return 'https://api.map.baidu.com/place/search?'+new URLSearchParams({query,region,output:'html',src:'webapp.aunz-handbook.travel'});if(provider==='apple')return 'https://maps.apple.com/?'+new URLSearchParams(directions?{daddr:query}:{q:query});return 'https://www.google.com/maps/'+(directions?'dir/':'search/')+'?'+new URLSearchParams(directions?{api:'1',destination:query}:{api:'1',query})}
function placeButtons(x){const index=Number(x.d.slice(1))-1;return `<div class="places-label">地点与路线</div><div class="places">${dayPlaces(index).map((name,j)=>`<button class="place place-button" data-place-day="${index}" data-place-index="${j}" aria-haspopup="dialog"><span>⌖ ${escapeHtml(name)}</span><span aria-hidden="true">›</span></button>`).join('')}</div>`}
function notifyTouch(message){if(isOpen(sheet))document.getElementById('sheetStatus').textContent=message;const toast=document.getElementById('touchToast');toast.textContent=message;toast.classList.add('visible');clearTimeout(notifyTouch.timer);notifyTouch.timer=setTimeout(()=>toast.classList.remove('visible'),3000)}
function shareData(index){const x=itinerary[index],url=new URL(location.href);url.hash='itinerary/day-'+(index+1);url.search='';return{title:`${x.d} · ${x.title}`,text:`2026/${x.date} · ${x.d} ${x.title}\n${x.summary}\n交通：${x.time}\n住宿：${x.hotel}`,url:url.href}}
async function shareDay(index,opener=document.activeElement){const data=shareData(index);if(window.isSecureContext&&typeof navigator.share==='function'){try{await navigator.share(data);return}catch(error){if(error.name==='AbortError')return}}openSheet({type:'share',day:index},opener)}
async function copyText(text,field){if(window.isSecureContext&&navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);notifyTouch('已复制');return true}catch{}}if(field){field.focus();field.select();field.setSelectionRange(0,field.value.length);try{if(document.execCommand('copy')){notifyTouch('已复制');return true}}catch{}document.getElementById('sheetStatus').textContent='请长按文字，选择“复制”。';return false}openSheet({type:'copy',text});return false}
function renderSheet(data){const title=document.getElementById('sheetTitle'),content=document.getElementById('sheetContent');content.scrollTop=0;document.getElementById('sheetStatus').textContent='';
  if(data.type==='places'){title.textContent=itinerary[data.day].d+' · 当天地点';content.innerHTML=`${placeButtons(itinerary[data.day])}`;return}
  if(data.type==='map'){const name=dayPlaces(data.day)[data.place];if(!name){content.textContent='地点不存在';return}title.textContent='用地图打开';const order=isAppleMobile?['apple','amap','baidu','google']:['amap','baidu','google','apple'];content.innerHTML=`<p class="place-name">${escapeHtml(name)}</p><div class="provider-list">${order.map(provider=>`<div class="provider-row"><strong>${mapNames[provider]}</strong><div><a class="outline-btn" href="${escapeHtml(mapURL(provider,data.day,name))}" target="_blank" rel="noopener">查看地点 ↗</a>${['apple','google'].includes(provider)?`<a class="outline-btn" href="${escapeHtml(mapURL(provider,data.day,name,true))}" target="_blank" rel="noopener">路线 ↗</a>`:''}</div></div>`).join('')}</div><label class="copy-label" for="copyField">地点名称</label><textarea id="copyField" readonly rows="2">${escapeHtml(placeQuery(data.day,name))}</textarea><button class="outline-btn sheet-copy" id="copySheet">复制地点名称</button>`;
  }else{const share=data.type==='share'?shareData(data.day):null;title.textContent=share?'分享这一天':'复制内容';const text=share?share.text+'\n'+share.url:data.text;content.innerHTML=`<textarea id="copyField" readonly rows="7">${escapeHtml(text)}</textarea><button class="primary-btn sheet-copy" id="copySheet">复制${share?'行程':'内容'}</button>${share&&/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname)?'<p class="source-note">链接仅限当前局域网，行程文字可直接分享。</p>':''}`}
  document.getElementById('copySheet').onclick=()=>{const field=document.getElementById('copyField');copyText(field.value,field)};
}
document.addEventListener('click',e=>{const button=e.target.closest('[data-place-day]');if(button)openSheet({type:'map',day:Number(button.dataset.placeDay),place:Number(button.dataset.placeIndex)},button)});
document.getElementById('todayPlaces').onclick=e=>openSheet({type:'places',day:displayedDay},e.currentTarget);document.getElementById('shareToday').onclick=e=>shareDay(displayedDay,e.currentTarget);
const dateRail=document.getElementById('dateRail');let selectedDay='auto';
dateRail.innerHTML='<button class="date-chip" data-day="auto" aria-pressed="true"><span>自动</span><strong>今天</strong></button>'+itinerary.map((x,i)=>`<button class="date-chip" data-day="${i}" aria-pressed="false" aria-label="${x.date} ${x.d} ${escapeHtml(x.title)}"><span>${x.date}</span><strong>${x.d}</strong></button>`).join('');
dateRail.addEventListener('click',e=>{const button=e.target.closest('[data-day]');if(!button)return;selectedDay=button.dataset.day;renderToday();button.scrollIntoView({block:'nearest',inline:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
function updateDateRail(){dateRail.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.day===selectedDay));b.classList.toggle('is-today',Number(b.dataset.day)===currentDayIndex()&&b.dataset.day!=='auto')})}
function weatherDetailURL(city){return 'https://www.windy.com/'+cities[city][1].toFixed(4)+'/'+cities[city][2].toFixed(4)}

let displayedDay=0,lastSystemDate='',weatherGeneration=0,lastWeatherRefresh=0;
function renderToday(){updateDateRail();const now=new Date(),key=dateKey(now),idx=currentDayIndex(now),manual=selectedDay!=='auto';displayedDay=manual?Number(selectedDay):idx>=0?idx:key<tripDates[0]?0:14;const x=itinerary[displayedDay];document.getElementById('systemDate').textContent=new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(now)+'';document.getElementById('todayPhase').textContent=manual?`行程预览 · 2026/${x.date}`:idx>=0?`今天 · 第 ${idx+1} / 15 天`:key<tripDates[0]?'9月24日出发':'行程已结束';document.getElementById('todayTitle').textContent=`${x.d} · ${x.title}`;document.getElementById('todaySummary').textContent=x.summary;document.getElementById('todayFacts').innerHTML=`<div><b>${logbookIcon('plane')}交通</b><span>${flightLinks(x.time)}</span></div><div><b>${logbookIcon('bed')}住宿</b><span>${x.hotel}</span></div><div><b>${logbookIcon('meal')}餐食</b><span>${x.meal}</span></div>`;document.getElementById('todayDetail').textContent='查看行程';document.getElementById('todayWear').innerHTML=wearMarkup(x);document.querySelectorAll('.day').forEach((d,i)=>d.classList.toggle('current',i===idx));updateNextEvent();loadWeather();}
function updateNextEvent(){const next=events.find(e=>new Date(e.at)>new Date());const el=document.getElementById('nextEvent');if(!next){el.innerHTML='<summary>行程已结束</summary><p>可继续查看旅行资料。</p>';return}const delta=Math.max(0,new Date(next.at)-new Date()),days=Math.floor(delta/86400000),hours=Math.floor(delta%86400000/3600000),mins=Math.floor(delta%3600000/60000);el.innerHTML=`<summary>${logbookIcon('clock')}<span>下一安排：${escapeHtml(next.title)}</span>${logbookIcon('arrow')}</summary><p>还有 ${days} 天 ${hours} 小时 ${mins} 分钟<br>${flightLinks(next.detail)}</p>`;}
document.getElementById('todayDetail').onclick=e=>openDay(displayedDay,e.currentTarget);
function weatherTargets(){const start=selectedDay==='auto'?dateKey(new Date()):tripDates[displayedDay];return Array.from({length:4},(_,i)=>{const date=addDays(start,i),idx=tripDates.indexOf(date);return{date,city:idx>=0?dayCities[idx]:'shanghai'}})}
function weatherName(code){if(code===0)return '晴';if([1,2].includes(code))return '晴间多云';if(code===3)return '阴';if([45,48].includes(code))return '雾';if([51,53,55,56,57].includes(code))return '毛毛雨';if([61,63,65,66,67].includes(code))return '雨';if([71,73,75,77,85,86].includes(code))return '雪';if([80,81,82].includes(code))return '阵雨';if([95,96,99].includes(code))return '雷雨';return '暂无天气现象'}
function validWeather(data){return data&&Array.isArray(data.daily?.time)&&Array.isArray(data.daily?.temperature_2m_max)&&Array.isArray(data.daily?.temperature_2m_min)}
function weatherCache(city){const v=storage.get('aunz-weather-v1-'+city);return v&&validWeather(v.data)&&Number.isFinite(v.savedAt)&&v.savedAt<=Date.now()+60000?v:null}
async function fetchWeather(city,force){const cached=weatherCache(city);if(!force&&cached&&Date.now()-cached.savedAt<1800000)return{...cached,cached:true};const [,lat,lon,zone]=cities[city];const params=new URLSearchParams({latitude:lat,longitude:lon,current:'temperature_2m,weather_code',daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',timezone:zone,forecast_days:'16'});const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);try{const response=await fetch('https://api.open-meteo.com/v1/forecast?'+params,{signal:controller.signal});if(!response.ok)throw Error('天气暂不可用');const data=await response.json();if(!validWeather(data))throw Error('天气数据不完整');const value={savedAt:Date.now(),data};storage.set('aunz-weather-v1-'+city,value);return value}catch{return cached&&Date.now()-cached.savedAt<86400000?{...cached,stale:true}:{unavailable:true}}finally{clearTimeout(timeout)}}
function weatherContent(target,result){const data=result.data,daily=data?.daily,index=daily?.time.indexOf(target.date)??-1;const has=index>=0&&Number.isFinite(daily.temperature_2m_min[index])&&Number.isFinite(daily.temperature_2m_max[index]);const city=cities[target.city],today=dateKey(new Date()),isToday=target.date===today;const link=wikiLink(city[0],true);let body='';if(has){const min=Math.round(daily.temperature_2m_min[index]),max=Math.round(daily.temperature_2m_max[index]),rain=daily.precipitation_probability_max?.[index];const current=data.current;const currentDate=current?.time?.slice(0,10);if(isToday&&currentDate===target.date&&Number.isFinite(current?.temperature_2m))body+=`<div class="weather-current">${result.stale?'上次天气':'现在'} ${Math.round(current.temperature_2m)}° · ${weatherName(current.weather_code)}<div class="weather-meta">当地 ${escapeHtml(current.time.slice(11,16))}</div></div>`;body+=`<div class="weather-temp">${min}° / ${max}°</div><div class="weather-meta">${weatherName(daily.weather_code?.[index])}<br>降雨概率 ${Number.isFinite(rain)?rain+'%':'暂无'}</div>`;}else body=`<p class="weather-meta">${result.unavailable?'暂未获取天气，请联网重试。':'暂无该日期预报，临近时再看。'}</p>`;const stamp=result.savedAt?new Intl.DateTimeFormat('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(result.savedAt)):'';return `<div class="weather-date">${target.date.slice(5).replace('-','/')} · ${isToday?'今天':target.date===addDays(today,1)?'明天':new Intl.DateTimeFormat('zh-CN',{weekday:'short'}).format(new Date(target.date+'T12:00:00'))}</div><h3>${link}</h3>${body}<span class="weather-status">${result.stale?'更新失败 · 上次预报':result.cached?'已缓存':stamp?'更新于':'稍后刷新重试'} ${stamp}${stamp?'（设备时间）':''}</span><a class="weather-detail-link" href="${weatherDetailURL(target.city)}" target="_blank" rel="noopener">详细天气 · Windy ↗</a>`}
async function loadWeather(force=false){const generation=++weatherGeneration,targets=weatherTargets();lastWeatherRefresh=Date.now();const grid=document.getElementById('weatherGrid');grid.innerHTML=targets.map((t,i)=>`<article class="card weather-card" id="weather-${i}"><div class="weather-date">${t.date.slice(5)}</div><h3>${cities[t.city][0]}</h3><p class="weather-meta">天气加载中…</p></article>`).join('');const button=document.getElementById('refreshWeather');button.disabled=true;await Promise.all([...new Set(targets.map(t=>t.city))].map(async city=>{const result=await fetchWeather(city,force);if(generation!==weatherGeneration)return;targets.forEach((target,i)=>{if(target.city===city)document.getElementById('weather-'+i).innerHTML=weatherContent(target,result)})}));if(generation===weatherGeneration)button.disabled=false}
document.getElementById('refreshWeather').onclick=()=>loadWeather(true);
function checkDate(){const key=dateKey(new Date());if(key!==lastSystemDate){lastSystemDate=key;renderToday();requestAnimationFrame(scrollToCurrentDay)}else{updateNextEvent();if(Date.now()-lastWeatherRefresh>=1800000)loadWeather()}}
window.addEventListener('online',()=>loadWeather(true));document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkDate()});setInterval(checkDate,30000);checkDate();
document.querySelectorAll('.route-summary span').forEach(e=>{const text=e.textContent;if(text.includes(' / '))e.innerHTML=text.split(' / ').map(n=>wikiLink(n,true)).join(' / ');else if(wikiTitles[text])e.innerHTML=wikiLink(text,true)});


syncNavigation();
window.addEventListener('load',()=>requestAnimationFrame(()=>{if(!isOpen(sheet)){const route=routeState();if(activeView==='itinerary'){if(route.day!==null)scrollToDay(route.day);else scrollToCurrentDay()}else window.scrollTo(0,viewScroll[activeView]||0)}}));
for(const rail of document.querySelectorAll('.date-rail,.weather-grid,.sequence')){
  let drag=null,suppressClick=false;
  rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;suppressClick=false;drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:rail.scrollLeft,active:false}});
  rail.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.active){if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy))return;drag.active=true;rail.setPointerCapture(e.pointerId);rail.classList.add('is-mouse-dragging')}e.preventDefault();rail.scrollLeft=drag.left-dx;});
  const finishRailDrag=e=>{if(!drag||e.pointerId!==drag.id)return;suppressClick=drag.active;drag=null;rail.classList.remove('is-mouse-dragging');if(rail.hasPointerCapture(e.pointerId))rail.releasePointerCapture(e.pointerId);setTimeout(()=>suppressClick=false,0)};
  rail.addEventListener('pointerup',finishRailDrag);rail.addEventListener('pointercancel',finishRailDrag);rail.addEventListener('pointerleave',()=>{if(drag&&!drag.active)drag=null});
  rail.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation()}},true);
  rail.addEventListener('dragstart',e=>e.preventDefault());
}
