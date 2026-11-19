(() => {
  const stage = document.querySelector('.money-cinema');
  if (!stage) return;
  const screens = [...stage.querySelectorAll('[data-money-view]')];
  const buttons = [...stage.querySelectorAll('[data-money-target]')];
  const play = document.getElementById('money-play');
  const number = document.getElementById('money-networth');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [
    {id:'dashboard', chapter:'01 / THE BIG PICTURE', headline:'Your whole financial life. In one view.', caption:'The whole picture, without opening a dozen apps.'},
    {id:'changes', chapter:'02 / FOLLOW THE MOVEMENT', headline:'Don’t just see what changed. Know why.', caption:'Money added. Market returns. Currency moves. Finally separated.'},
    {id:'holdings', chapter:'03 / GO ONE LEVEL DEEPER', headline:'Every position. Across every account.', caption:'From a single number to every asset behind it.'},
    {id:'spending', chapter:'04 / MAKE ROOM FOR MORE', headline:'See where it went. Decide what comes next.', caption:'A clearer view of everyday spending. A little more room for life.'}
  ];
  const duration = 6;
  const viewport = document.createElement('div');
  viewport.className = 'money-screen-stack';
  screens[0].before(viewport);
  viewport.append(...screens);
  screens.forEach(screen => screen.addEventListener('animationend', event => {
    if (event.target === screen && event.animationName === 'money-screen-out') {
      screen.classList.remove('is-leaving');
      screen.hidden = screen.dataset.moneyView !== scenes[index].id;
    }
  }));
  let index = -1, sceneTime = 0, previous = 0, visible = false, paused = reduced.matches, manual = false;
  function setNumber(value) {
    const formatted = '$' + Math.round(value).toLocaleString('en-US');
    if (number.firstChild.nodeValue !== formatted) number.firstChild.nodeValue = formatted;
  }
  function show(next) {
    if (index === next) return;
    const outgoing = index;
    index = next;
    const scene = scenes[index];
    stage.dataset.moneyScene = scene.id;
    screens.forEach((screen, i) => {
      const active = i === index;
      const leaving = i === outgoing && !reduced.matches;
      screen.classList.toggle('is-leaving', leaving);
      screen.hidden = !active && !leaving;
      screen.inert = !active;
      screen.setAttribute('aria-hidden', String(!active));
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.moneyTarget === scene.id)));
    document.getElementById('money-chapter').textContent = scene.chapter;
    document.getElementById('money-headline').textContent = scene.headline;
    document.getElementById('money-caption').textContent = scene.caption;

  }
  function render() {
    stage.style.setProperty('--money-progress', manual || reduced.matches ? 1 : Math.min(sceneTime / duration, 1));
    if (index === 0) {
      const progress = manual || reduced.matches ? 1 : Math.min(sceneTime / 1.7, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      // Entirely fictional figures, independent of the private application.
      setNumber(1242000 + 42600 * eased);
    }
  }
  function labelPlay() {
    play.innerHTML = paused ? 'Play <span aria-hidden="true">▷</span>' : 'Pause <span aria-hidden="true">Ⅱ</span>';
    play.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' DailyMoney preview');
  }
  buttons.forEach((button, i) => button.addEventListener('click', () => {
    paused = true;
    manual = true;
    sceneTime = 0;
    previous = 0;
    show(i); render(); labelPlay();
  }));
  play.addEventListener('click', () => {
    paused = !paused;
    if (!paused) manual = false;
    previous = 0;
    render(); labelPlay();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      paused = true;
      screens.forEach((screen, i) => {
        screen.classList.remove('is-leaving');
        screen.hidden = i !== index;
      });
      render(); labelPlay();
    }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      previous = 0;
    }, {threshold:.15}).observe(stage);
  } else visible = true;
  document.addEventListener('visibilitychange', () => { previous = 0; });
  function frame(now) {
    if (previous && visible && !paused && !document.hidden) {
      sceneTime += (now - previous) / 1000;
      if (sceneTime >= duration) {
        const steps = Math.floor(sceneTime / duration);
        sceneTime %= duration;
        show((index + steps) % scenes.length);
      }
      render();
    }
    previous = now;
    requestAnimationFrame(frame);
  }
  show(0); render(); labelPlay();
  requestAnimationFrame(frame);
})();
