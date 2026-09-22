(() => {
  'use strict';
  const pages=[...document.querySelectorAll('.notice-page')];
  const content=document.getElementById('noticeContent');
  const previous=document.getElementById('previousPage'),next=document.getElementById('nextPage');
  let current=0;
  function showPage(index){
    if(index<0||index>=pages.length)return;
    current=index;
    pages.forEach((page,i)=>page.hidden=i!==current);
    previous.disabled=current===0;
    next.disabled=current===pages.length-1;
    document.getElementById('pageCounter').textContent=`${current+1} / ${pages.length}`;
    content.scrollTo(0,0);
  }
  previous.onclick=()=>showPage(current-1);
  next.onclick=()=>showPage(current+1);
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
  showPage(0);
})();
