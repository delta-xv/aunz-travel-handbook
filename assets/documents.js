(() => {
  'use strict';
  const data=window.departureNotice, pages=data.pages;
  const byId=id=>document.getElementById(id);
  const catalog=byId('catalog'),reader=byId('reader'),viewport=byId('pageViewport'),canvas=byId('pageCanvas'),image=byId('pageImage');
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize=value=>String(value).replace(/\s+/g,'').toLocaleLowerCase();
  let currentPage=0,zoom=1,mode='image',catalogScroll=0,lastOpener=null,loading=false;
  const zoomLevels=[1,1.5,2,2.5,3,4];
  const searchable=pages.map(p=>normalize(p.title+' '+p.text));
  function readProgress(){try{const n=Number(localStorage.getItem('aunz-notice-page'));return Number.isInteger(n)&&n>=1&&n<=pages.length?n:0}catch{return 0}}
  function storeProgress(n){try{localStorage.setItem('aunz-notice-page',String(n))}catch{}}
  function updateResume(){const n=readProgress(),link=byId('resumeReading');link.hidden=!n;if(n){link.href='#page-'+n;link.textContent=`继续阅读 · 第 ${n} 页 →`}}
  function excerpt(text,query){const compact=text.replace(/\s+/g,' '),flat=compact.replace(/\s/g,''),index=flat.toLocaleLowerCase().indexOf(normalize(query));if(index<0)return compact.slice(0,80);return (index>25?'…':'')+flat.slice(Math.max(0,index-25),index+70)+'…'}
  function renderIndex(){const query=byId('documentSearch').value.trim(),needle=normalize(query);const results=pages.filter((p,i)=>!needle||searchable[i].includes(needle));byId('searchStatus').textContent=needle?`找到 ${results.length} 页相关内容`:`共 ${pages.length} 页 · 点击任意页阅读`;byId('noResults').hidden=results.length>0;byId('pageList').innerHTML=results.map(p=>`<a class="page-link" href="#page-${p.number}"><img src="${p.thumbnail}" alt="第 ${p.number} 页缩略图" loading="lazy" width="58" height="82"><div><span class="page-number">第 ${p.number} / ${pages.length} 页</span><h3>${escape(p.title)}</h3>${needle?`<p class="search-snippet">${escape(excerpt(p.text,query))}</p>`:''}</div><span aria-hidden="true">›</span></a>`).join('')}
  byId('topicIndex').innerHTML=data.topics.map(t=>`<a class="topic-link" href="#page-${t.page}"><strong>${escape(t.label)}</strong><small>${escape(t.detail)}</small><span>第 ${t.page} 页起 →</span></a>`).join('');
  byId('pageSelect').innerHTML=pages.map(p=>`<option value="${p.number}">第 ${p.number} / ${pages.length} 页</option>`).join('');
  function setStatus(){byId('readerStatus').textContent=loading&&mode==='image'?'正在加载原稿…':`第 ${currentPage} / ${pages.length} 页 · ${mode==='image'?(zoom===1?'适合屏幕宽度':Math.round(zoom*100)+'% · 可横向拖动'):'文字辅助阅读'}`}
  function baseWidth(){return Math.max(240,Math.min(viewport.clientWidth-24,1100))}
  function sizeCanvas(){canvas.style.width=baseWidth()*zoom+'px';byId('fitPage').textContent=zoom===1?'适宽':Math.round(zoom*100)+'%';byId('zoomOut').disabled=zoom===1;byId('zoomIn').disabled=zoom===4;image.classList.toggle('zoomed',zoom>1);setStatus()}
  function setZoom(value,point){const oldWidth=canvas.getBoundingClientRect().width||baseWidth();const anchor=point||{x:viewport.clientWidth/2,y:Math.min(viewport.clientHeight/2,200)};const relativeX=(viewport.scrollLeft+anchor.x-canvas.offsetLeft)/oldWidth,relativeY=(viewport.scrollTop+anchor.y-12)/oldWidth;zoom=Math.max(1,Math.min(4,value));sizeCanvas();requestAnimationFrame(()=>{const width=canvas.getBoundingClientRect().width;viewport.scrollLeft=zoom===1?0:relativeX*width+canvas.offsetLeft-anchor.x;viewport.scrollTop=Math.max(0,relativeY*width+12-anchor.y)})}
  function setMode(value){mode=value;byId('imageMode').setAttribute('aria-pressed',String(value==='image'));byId('textMode').setAttribute('aria-pressed',String(value==='text'));viewport.hidden=value!=='image';byId('textViewport').hidden=value!=='text';byId('zoomControls').hidden=value!=='image';byId('textPageLabel').hidden=value!=='text';byId('textPageLabel').textContent=`${currentPage} / ${pages.length}`;if(value==='image')sizeCanvas();setStatus()}
  function loadImage(){const page=pages[currentPage-1];loading=true;byId('imageError').hidden=true;canvas.hidden=false;setStatus();image.alt=`出团通知，第 ${currentPage} 页：${page.title}`;image.src=page.image;image.setAttribute('fetchpriority','high');}
  image.addEventListener('load',()=>{loading=false;sizeCanvas()});
  image.addEventListener('error',()=>{loading=false;canvas.hidden=true;byId('imageError').hidden=false;byId('readerStatus').textContent='图片加载失败，可重试或打开原 PDF。'});
  function renderReader(number){currentPage=number;zoom=1;const p=pages[number-1];byId('readerTitle').textContent=p.title;byId('pageSelect').value=String(number);byId('pageText').textContent=p.text;byId('previousPage').disabled=number===1;byId('nextPage').disabled=number===pages.length;byId('textViewport').scrollTop=0;viewport.scrollTo(0,0);loadImage();setMode(mode);storeProgress(number);document.title=`第 ${number} 页 · ${p.title} · 出团通知`}
  function route(){const match=/^#page-(\d+)$/.exec(location.hash),number=match?Number(match[1]):0;const valid=Number.isInteger(number)&&number>=1&&number<=pages.length;if(valid){if(reader.hidden)catalogScroll=window.scrollY;catalog.hidden=true;reader.hidden=false;document.body.style.overflow='hidden';if(number!==currentPage)renderReader(number)}else{if(location.hash)history.replaceState(null,'',location.pathname+location.search);const wasOpen=!reader.hidden;reader.hidden=true;catalog.hidden=false;document.body.style.overflow='';currentPage=0;document.title='出团资料 · 澳新旅行日志';updateResume();if(wasOpen)requestAnimationFrame(()=>{window.scrollTo(0,catalogScroll);lastOpener?.focus({preventScroll:true})})}}
  function openPage(number,opener){if(number<1||number>pages.length)return;if(reader.hidden){lastOpener=opener||document.activeElement;history.pushState({noticeReader:true},'','#page-'+number)}else history.replaceState(history.state,'','#page-'+number);route()}
  catalog.addEventListener('click',e=>{const link=e.target.closest('a[href^="#page-"]');if(link){e.preventDefault();openPage(Number(link.hash.slice(6)),link)}});
  byId('backToCatalog').onclick=()=>{if(history.state?.noticeReader)history.back();else{history.replaceState(null,'',location.pathname+location.search);route()}};
  byId('pageSelect').onchange=e=>openPage(Number(e.target.value));
  byId('previousPage').onclick=()=>openPage(currentPage-1);byId('nextPage').onclick=()=>openPage(currentPage+1);
  byId('zoomIn').onclick=()=>setZoom(zoomLevels.find(x=>x>zoom)||4);byId('zoomOut').onclick=()=>setZoom([...zoomLevels].reverse().find(x=>x<zoom)||1);byId('fitPage').onclick=()=>setZoom(1);
  image.onclick=e=>{const r=viewport.getBoundingClientRect();setZoom(zoom===1?2.5:1,{x:e.clientX-r.left,y:e.clientY-r.top})};
  byId('imageMode').onclick=()=>setMode('image');byId('textMode').onclick=()=>setMode('text');byId('retryPage').onclick=loadImage;
  byId('documentSearch').addEventListener('input',renderIndex);function clearSearch(){byId('documentSearch').value='';renderIndex();byId('documentSearch').focus()}byId('clearSearch').onclick=clearSearch;byId('showAll').onclick=clearSearch;
  window.addEventListener('hashchange',route);window.addEventListener('popstate',route);window.addEventListener('resize',()=>{if(!reader.hidden&&mode==='image')sizeCanvas()});
  document.addEventListener('keydown',e=>{if(reader.hidden||e.target.closest('select,input,textarea,button'))return;if(e.key==='ArrowRight')openPage(currentPage+1);else if(e.key==='ArrowLeft')openPage(currentPage-1)});
  renderIndex();updateResume();route();
})();
