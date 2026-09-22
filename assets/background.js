(() => {
  const root = document.documentElement;
  let width, resizeTimer;

  function fitBackground() {
    width = root.clientWidth;
    root.style.setProperty('--background-height', `${Math.max(1, window.innerHeight - 170)}px`);
  }

  fitBackground();
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    if (root.clientWidth !== width) resizeTimer = setTimeout(fitBackground, 200);
  });
})();
