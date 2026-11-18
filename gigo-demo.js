(() => {
  const phone = document.querySelector('.gg-phone');
  if (!phone) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const controls = [...document.querySelectorAll('[data-gg-scene]')];
  const views = [...phone.querySelectorAll('[data-gg-view]')];
  const play = document.getElementById('gg-play');
  const caption = document.getElementById('gg-caption');
  const message = phone.querySelector('.gg-message');
  const breakdown = phone.querySelector('.gg-breakdown');
  const ingredients = [...phone.querySelectorAll('.gg-ingredient')];
  const total = phone.querySelector('.gg-meal-total');
  const confirmation = phone.querySelector('.gg-confirm');
  const text = document.getElementById('gg-typed');
  const phrase = 'Spicy tuna hand roll';
  let scene = '', elapsed = 0, paused = reduce.matches, visible = false, previous = 0;
  const captions = {log:'Say it. See every ingredient.', home:'Every meal, in one daily view.', dashboard:'Small habits. The bigger picture.'};
  const setOpacity = (element, show) => {
    element.style.opacity = show ? 1 : 0;
    element.style.transform = show ? 'none' : 'translateY(6px)';
  };
  function renderLog(seconds) {
    const complete = seconds >= 8;
    text.textContent = complete ? phrase : phrase.slice(0, Math.max(0, Math.floor((seconds - .4) * 11)));
    setOpacity(message, seconds >= .4);
    setOpacity(breakdown, seconds >= 3);
    const shown = complete ? 3 : Math.max(0, Math.min(3, Math.floor(seconds - 3)));
    ingredients.forEach((element, i) => setOpacity(element, i < shown));
    setOpacity(total, seconds >= 7);
    setOpacity(confirmation, seconds >= 8);
    const calories = [0, 90, 150, 170][shown];
    document.getElementById('gg-left').textContent = (1254 - calories).toLocaleString('en-US');
    document.getElementById('gg-protein').textContent = [101,103,110,111][shown];
    document.getElementById('gg-progress-meal').style.width = calories / 2500 * 100 + '%';
  }
  function select(next) {
    if (next === scene) return;
    scene = next;
    phone.dataset.scene = next;
    views.forEach(view => { view.hidden = view.dataset.ggView !== next; });
    controls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.ggScene === next)));
    caption.textContent = captions[next];
  }
  function update() {
    const seconds = elapsed % 25;
    select(seconds < 12 ? 'log' : seconds < 18 ? 'home' : 'dashboard');
    renderLog(seconds);
  }
  function updatePlay() {
    play.innerHTML = paused ? 'Play <span aria-hidden="true">▷</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
    play.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' GoodInGoodOut animation');
  }
  controls.forEach(button => button.addEventListener('click', () => {
    elapsed = {log:8,home:12,dashboard:18}[button.dataset.ggScene];
    paused = true;
    update(); updatePlay();
  }));
  play.addEventListener('click', () => {
    paused = !paused;
    if (!paused && scene === 'log') elapsed = 0;
    previous = 0;
    update(); updatePlay();
  });
  reduce.addEventListener('change', () => {
    if (reduce.matches) { paused = true; elapsed = 12; update(); updatePlay(); }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; previous = 0; }, {threshold:.15}).observe(phone);
  } else visible = true;
  document.addEventListener('visibilitychange', () => { previous = 0; });
  function frame(now) {
    if (previous && visible && !paused && !document.hidden) {
      elapsed += (now - previous) / 1000;
      update();
    }
    previous = now;
    requestAnimationFrame(frame);
  }
  elapsed = reduce.matches ? 12 : 0;
  update(); updatePlay();
  requestAnimationFrame(frame);
})();
