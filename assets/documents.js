(() => {
  'use strict';
  const byId=id=>document.getElementById(id);
  const viewport=byId('pageViewport'),canvas=byId('pageCanvas'),image=byId('pageImage');
  const pageCount=16,zoomLevels=[1,1.5,2,2.5,3,4];
  let currentPage=1,zoom=1,loading=false;
  function status(){byId('readerStatus').textContent=`第 ${currentPage} / ${pageCount} 页${loading?' · 加载中…':zoom>1?' · '+Math.round(zoom*100)+'%':''}`}
  function baseWidth(){return Math.max(240,Math.min(viewport.clientWidth-24,1100))}
  function sizeCanvas(){canvas.style.width=baseWidth()*zoom+'px';byId('fitPage').textContent=zoom===1?'适宽':Math.round(zoom*100)+'%';byId('zoomOut').disabled=zoom===1;byId('zoomIn').disabled=zoom===4;image.classList.toggle('zoomed',zoom>1);status()}
  function setZoom(value,point){const oldWidth=canvas.getBoundingClientRect().width||baseWidth(),anchor=point||{x:viewport.clientWidth/2,y:Math.min(viewport.clientHeight/2,200)};const x=(viewport.scrollLeft+anchor.x-canvas.offsetLeft)/oldWidth,y=(viewport.scrollTop+anchor.y-12)/oldWidth;zoom=Math.max(1,Math.min(4,value));sizeCanvas();requestAnimationFrame(()=>{const width=canvas.getBoundingClientRect().width;viewport.scrollLeft=zoom===1?0:x*width+canvas.offsetLeft-anchor.x;viewport.scrollTop=Math.max(0,y*width+12-anchor.y)})}
  function loadPage(){loading=true;canvas.hidden=false;byId('imageError').hidden=true;image.alt=`出团通知，第${currentPage}页`;image.src=`assets/documents/departure-notice/page-${String(currentPage).padStart(2,'0')}.webp`;status()}
  function turnPage(step){const next=currentPage+step;if(next<1||next>pageCount)return;currentPage=next;zoom=1;viewport.scrollTo(0,0);byId('previousPage').disabled=next===1;byId('nextPage').disabled=next===pageCount;loadPage();sizeCanvas()}
  image.addEventListener('load',()=>{loading=false;sizeCanvas()});
  image.addEventListener('error',()=>{loading=false;canvas.hidden=true;byId('imageError').hidden=false;byId('readerStatus').textContent=`第 ${currentPage} 页加载失败`});
  byId('previousPage').onclick=()=>turnPage(-1);byId('nextPage').onclick=()=>turnPage(1);byId('previousPage').disabled=true;
  byId('zoomIn').onclick=()=>setZoom(zoomLevels.find(x=>x>zoom)||4);byId('zoomOut').onclick=()=>setZoom([...zoomLevels].reverse().find(x=>x<zoom)||1);byId('fitPage').onclick=()=>setZoom(1);
  image.onclick=e=>{const r=viewport.getBoundingClientRect();setZoom(zoom===1?2.5:1,{x:e.clientX-r.left,y:e.clientY-r.top})};byId('retryPage').onclick=loadPage;
  window.addEventListener('resize',sizeCanvas);
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
  sizeCanvas();
})();
