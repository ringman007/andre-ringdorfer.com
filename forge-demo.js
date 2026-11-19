(() => {
  const workspace = document.querySelector('.fw');
  if (!workspace) return;
  const scenes = [
    {id:'brief', time:'23:40', chapter:'01 / THE BRIEF', title:'One reminder. Twice.', caption:'You leave a task. Forge picks it up.'},
    {id:'inspect', time:'23:52', chapter:'02 / INVESTIGATE', title:'Find the cause.', caption:'It follows the code and reproduces the problem.'},
    {id:'fix', time:'00:16', chapter:'03 / MAKE THE CHANGE', title:'A small, focused fix.', caption:'It changes the code and explains the decision.'},
    {id:'test', time:'00:28', chapter:'04 / CHECK THE WORK', title:'Prove it works.', caption:'It checks the fix and the behavior around it.'},
    {id:'review', time:'08:30', chapter:'05 / THE HANDOFF', title:'Ready when I am.', caption:'A change, the checks and an explanation. Ready for me.'}
  ];
  const panels = [...workspace.querySelectorAll('[data-fw-scene]')];
  const buttons = [...workspace.querySelectorAll('[data-fw-stage]')];
  const play = document.getElementById('fw-play');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = motion.matches ? 4 : 0;
  let playing = !motion.matches, visible = false, timer;
  function render() {
    const scene = scenes[index];
    workspace.dataset.stage = scene.id;
    workspace.dataset.playing = String(playing);
    panels.forEach(panel => { panel.hidden = panel.dataset.fwScene !== scene.id; });
    document.getElementById('fw-clock').textContent = scene.time;
    document.getElementById('fw-period').textContent = index === 4 ? 'MORNING · HKT' : index > 1 ? 'AFTER MIDNIGHT' : 'TONIGHT · HKT';
    document.getElementById('fw-chapter').textContent = scene.chapter;
    document.getElementById('fw-title').textContent = scene.title;
    document.getElementById('fw-caption').textContent = scene.caption;
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      button.dataset.past = String(i < index);
    });
    play.innerHTML = playing ? 'Pause <span aria-hidden="true">Ⅱ</span>' : 'Play <span aria-hidden="true">▷</span>';
    play.setAttribute('aria-label', playing ? 'Pause Forge explainer' : 'Play Forge explainer');
  }
  function schedule() {
    clearTimeout(timer);
    if (playing && visible && !document.hidden) timer = setTimeout(() => {
      index = (index + 1) % scenes.length;
      render(); schedule();
    }, index === 4 ? 8000 : 6000);
  }
  buttons.forEach((button, i) => button.addEventListener('click', () => {
    index = i; playing = false; render(); schedule();
  }));
  play.addEventListener('click', () => { playing = !playing; render(); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { playing = !motion.matches; if (motion.matches) index = 4; render(); schedule(); });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, {threshold:.2}).observe(workspace);
  render();
})();
