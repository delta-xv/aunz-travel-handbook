(() => {
  'use strict';
  const sections = [...document.querySelectorAll('.notice-section')];
  const content = document.getElementById('noticeContent');
  const outline = document.getElementById('contents');
  const back = document.getElementById('noticeBack');
  const navigation = document.getElementById('sectionNavigation');
  const previous = document.getElementById('previousSection');
  const next = document.getElementById('nextSection');
  let current = -1, outlineScroll = 0, outlineLink = null, scrollFrame;

  function showSection() {
    const id = location.hash.slice(1);
    const index = sections.findIndex(section => section.id === id);
    if (current === -1 && index !== -1) outlineScroll = content.scrollTop;
    current = index;
    const atOutline = current === -1;
    outline.hidden = !atOutline;
    sections.forEach((section, i) => section.hidden = i !== current);
    navigation.hidden = atOutline;
    back.href = atOutline ? 'index.html#today' : '#contents';
    back.textContent = atOutline ? '← 手册' : '← 目录';
    previous.disabled = current <= 0;
    next.disabled = current === sections.length - 1;
    document.getElementById('sectionCounter').textContent = atOutline ? '' : `${current + 1} / ${sections.length}`;
    document.title = (atOutline ? '出团通知' : sections[current].dataset.title + ' · 出团通知') + ' · 澳新旅行手册';
    cancelAnimationFrame(scrollFrame);
    const section = sections[current];
    scrollFrame = requestAnimationFrame(() => {
      content.scrollTo(0, atOutline ? outlineScroll : 0);
      const focus = atOutline ? outlineLink : section.querySelector('[tabindex="-1"]');
      focus?.focus({ preventScroll: true });
    });
  }

  outline.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link) outlineLink = link;
  });
  previous.onclick = () => { if (current > 0) location.hash = sections[current - 1].id; };
  next.onclick = () => { if (current < sections.length - 1) location.hash = sections[current + 1].id; };
  window.addEventListener('hashchange', showSection);
  showSection();
})();
