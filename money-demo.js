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
  // Three deliberate camera beats per chapter, with a wide view between them.
  const shots = [
    [
      {target:'#money-networth', zoom:1.3, copy:'One number. Every account.'},
      {target:'.money-total-chart', zoom:1.28, copy:'Follow the direction, not just today’s balance.'},
      {target:'.money-allocation', zoom:1.15, copy:'See exactly how your money is split.'}
    ],
    [
      {target:'.money-change-heading .money-big-value', zoom:1.3, copy:'Start with what changed: +$18,460.'},
      {target:'.money-waterfall', zoom:1.12, copy:'Follow the movement, one step at a time.'},
      {target:'.money-change-key', zoom:1.2, copy:'$9,000 added. $9,460 earned. Different things.'}
    ],
    [
      {target:'.money-holdings-table tbody tr:first-child', zoom:1.16, copy:'Every holding, with its account and performance.'},
      {target:'.money-holdings-table tbody tr:nth-child(4) td:nth-child(3)', zoom:1.32, copy:'Go closer: a $164,300 position.'},
      {target:'.money-holdings-table tbody tr:nth-child(4) td:nth-child(2)', fallback:'.money-holdings-table tbody tr:nth-child(4) td:last-child', zoom:1.32, copy:'Then follow its trend. Up 8.7% in 14 days.'}
    ],
    [
      {target:'.money-spend-summary .money-big-value', zoom:1.3, copy:'Your monthly spending, clearly in view.'},
      {target:'.money-spend-ring', zoom:1.32, copy:'Four categories. An instant picture.'},
      {target:'.money-spend-categories', zoom:1.15, copy:'See where it goes, down to the category.'}
    ]
  ];
  const duration = 12;
  const beats = [[1,4.5], [4.8,8.3], [8.6,11.2]];
  const cameras = screens.map(screen => {
    const camera = document.createElement('div');
    camera.className = 'money-camera';
    camera.append(...screen.childNodes);
    const highlight = document.createElement('div');
    highlight.className = 'money-focus-frame';
    highlight.setAttribute('aria-hidden', 'true');
    camera.append(highlight);
    screen.append(camera);
    return {camera, highlight};
  });
  const director = document.createElement('div');
  director.className = 'money-director';
  const shotMarkers = document.createElement('span');
  shotMarkers.className = 'money-shot-markers';
  shotMarkers.setAttribute('aria-hidden', 'true');
  shotMarkers.innerHTML = '<i></i><i></i><i></i>';
  const direction = document.createElement('p');
  director.append(shotMarkers, direction);
  stage.querySelector('.money-app-footer').before(director);
  let geometry = [], lastBeat = -2;
  let index = -1, sceneTime = 0, previous = 0, visible = false, paused = reduced.matches, manual = false;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const ease = value => value * value * (3 - 2 * value);
  function measureShots() {
    if (index < 0) return;
    const {camera} = cameras[index];
    const rect = camera.getBoundingClientRect();
    const ratio = rect.width / camera.offsetWidth;
    if (!ratio) return;
    geometry = shots[index].map(shot => {
      let target = camera.querySelector(shot.target);
      if ((!target || !target.getClientRects().length) && shot.fallback) target = camera.querySelector(shot.fallback);
      if (!target || !target.getClientRects().length) return null;
      const box = target.getBoundingClientRect();
      return {x:(box.left - rect.left) / ratio, y:(box.top - rect.top) / ratio, width:box.width / ratio, height:box.height / ratio};
    });
  }
  function renderCamera() {
    const {camera, highlight} = cameras[index];
    const beat = reduced.matches ? -1 : beats.findIndex(([start,end]) => sceneTime >= start && sceneTime < end);
    if (beat !== lastBeat) {
      lastBeat = beat;
      // Entrance animations have settled by the first beat; refresh alignment.
      measureShots();
      direction.textContent = beat < 0 ? (reduced.matches ? 'Explore Dashboard, Changes, Holdings and Spending.' : 'Take in the whole picture.') : shots[index][beat].copy;
      [...shotMarkers.children].forEach((marker, i) => marker.classList.toggle('is-active', i === beat));
    }
    const box = geometry[beat];
    if (!box) {
      camera.style.transform = 'none';
      highlight.style.opacity = 0;
      return;
    }
    const [start, end] = beats[beat];
    const strength = ease(clamp(Math.min((sceneTime - start) / .85, (end - sceneTime) / .65), 0, 1));
    const width = camera.clientWidth, height = camera.clientHeight;
    const mobile = width < 620;
    const padding = mobile ? 5 : 8;
    // Keep the entire highlighted number/chart visible; never crop its labels.
    const maximum = Math.min(shots[index][beat].zoom, mobile ? 1.14 : 1.32, (width - 16) / (box.width + padding * 2), (height - 16) / (box.height + padding * 2));
    const scale = 1 + (Math.max(1, maximum) - 1) * strength;
    const x = clamp(width / 2 - (box.x + box.width / 2) * scale, width * (1 - scale), 0);
    const y = clamp(height * .46 - (box.y + box.height / 2) * scale, height * (1 - scale), 0);
    camera.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    Object.assign(highlight.style, {left:(box.x-padding)+'px', top:(box.y-padding)+'px', width:(box.width+padding*2)+'px', height:(box.height+padding*2)+'px', opacity:String(strength)});
  }
  function setNumber(value) {
    const formatted = '$' + Math.round(value).toLocaleString('en-US');
    if (number.firstChild.nodeValue !== formatted) number.firstChild.nodeValue = formatted;
  }
  function show(next) {
    if (index === next) return;
    index = next;
    const scene = scenes[index];
    stage.dataset.moneyScene = scene.id;
    screens.forEach(screen => { screen.hidden = screen.dataset.moneyView !== scene.id; });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.moneyTarget === scene.id)));
    document.getElementById('money-chapter').textContent = scene.chapter;
    document.getElementById('money-headline').textContent = scene.headline;
    document.getElementById('money-caption').textContent = scene.caption;
    lastBeat = -2;
    const {camera, highlight} = cameras[index];
    camera.style.transform = 'none';
    highlight.style.opacity = 0;
    measureShots();
  }
  function render() {
    stage.style.setProperty('--money-progress', manual || reduced.matches ? 1 : Math.min(sceneTime / duration, 1));
    stage.dataset.cameraPlaying = String(!paused && visible && !document.hidden && !reduced.matches);
    if (index === 0) {
      const progress = manual || reduced.matches ? 1 : Math.min(sceneTime / 1.7, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      // Entirely fictional figures, independent of the private application.
      setNumber(1242000 + 42600 * eased);
    }
    renderCamera();
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
    if (reduced.matches) { paused = true; render(); labelPlay(); }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      previous = 0;
    }, {threshold:.15}).observe(stage);
  } else visible = true;
  document.addEventListener('visibilitychange', () => { previous = 0; });
  new ResizeObserver(() => { measureShots(); render(); }).observe(stage);
  if (document.fonts) document.fonts.ready.then(() => { measureShots(); render(); });
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
