(() => {
  const grid = document.getElementById('github-grid');
  if (!grid) return;
  const scroll = grid.closest('.github-scroll');
  const dateFormat = new Intl.DateTimeFormat('en', {month:'long', day:'numeric', year:'numeric', timeZone:'UTC'});
  const monthFormat = new Intl.DateTimeFormat('en', {month:'short', timeZone:'UTC'});

  async function load() {
    try {
      const response = await fetch('https://github-contributions-api.jogruber.de/v4/ringman007?y=last', {signal:AbortSignal.timeout(12000)});
      if (!response.ok) throw new Error('Calendar unavailable');
      const {contributions: days} = await response.json();
      if (!Array.isArray(days) || !days.length || days.length > 380) throw new Error('Invalid calendar');
      const dates = days.map(day => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isInteger(day.count) || day.count < 0 || !Number.isInteger(day.level) || day.level < 0 || day.level > 4) throw new Error('Invalid day');
        const date = new Date(day.date + 'T00:00:00Z');
        if (isNaN(date) || date.toISOString().slice(0,10) !== day.date) throw new Error('Invalid date');
        return date;
      });
      const start = dates[0].getTime() - dates[0].getUTCDay() * 86400000;
      const positions = dates.map(date => Math.round((date.getTime() - start) / 86400000));
      if (positions.some((position, i) => i > 0 && position !== positions[i - 1] + 1)) throw new Error('Invalid date order');
      grid.style.setProperty('--weeks', Math.floor(positions.at(-1) / 7) + 1);
      const fragment = document.createDocumentFragment();
      const label = (text, column, row) => {
        const span = document.createElement('span');
        span.textContent = text;
        span.className = 'github-grid-label';
        span.style.gridColumn = column;
        span.style.gridRow = row;
        span.setAttribute('aria-hidden', 'true');
        fragment.append(span);
      };
      label('Mon', 1, 3); label('Wed', 1, 5); label('Fri', 1, 7);
      const buttons = days.map((day, i) => {
        const date = dates[i], week = Math.floor(positions[i] / 7);
        if (i === 0 || date.getUTCDate() === 1) label(monthFormat.format(date), week + 2, 1);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'github-day';
        button.dataset.level = day.level;
        button.dataset.date = day.date;
        button.style.gridColumn = week + 2;
        button.style.gridRow = date.getUTCDay() + 2;
        button.setAttribute('aria-label', `${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${dateFormat.format(date)}`);
        button.tabIndex = i === days.length - 1 ? 0 : -1;
        fragment.append(button);
        return button;
      });
      const tooltip = document.createElement('div');
      tooltip.className = 'github-tooltip';
      tooltip.id = 'github-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.hidden = true;
      document.body.append(tooltip);
      let active;
      const hide = () => { tooltip.hidden = true; active = null; };
      const show = button => {
        active = button;
        tooltip.textContent = button.getAttribute('aria-label');
        tooltip.hidden = false;
        const rect = button.getBoundingClientRect(), box = tooltip.getBoundingClientRect();
        tooltip.style.left = Math.max(8, Math.min(innerWidth - box.width - 8, rect.left + rect.width / 2 - box.width / 2)) + 'px';
        tooltip.style.top = (rect.top > box.height + 16 ? rect.top - box.height - 10 : rect.bottom + 10) + 'px';
      };
      const select = button => {
        buttons.forEach(item => { item.tabIndex = item === button ? 0 : -1; });
        show(button);
      };
      buttons.forEach((button, i) => {
        button.addEventListener('pointerenter', () => show(button));
        button.addEventListener('pointerleave', hide);
        button.addEventListener('focus', () => select(button));
        button.addEventListener('blur', hide);
        button.addEventListener('click', () => select(button));
        button.addEventListener('keydown', event => {
          if (event.key === 'Escape') { hide(); return; }
          const offsets = {ArrowLeft:-7, ArrowRight:7, ArrowUp:-1, ArrowDown:1};
          let next;
          if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = buttons.length - 1;
          else if (event.key in offsets) next = Math.max(0, Math.min(buttons.length - 1, i + offsets[event.key]));
          else return;
          event.preventDefault();
          buttons[next].focus({preventScroll:true});
          buttons[next].scrollIntoView({block:'nearest', inline:'nearest', behavior:'instant'});
          show(buttons[next]);
        });
      });
      document.addEventListener('pointerdown', event => { if (active && event.target !== active) hide(); });
      window.addEventListener('scroll', hide, true);
      window.addEventListener('resize', hide);
      grid.append(fragment);
      grid.hidden = false;
      document.getElementById('github-image').hidden = true;
      document.getElementById('github-unavailable').hidden = true;
      document.getElementById('github-calendar-hint').textContent = 'Past year · Hover or tap a square for details';
    } catch {
      // Keep the image and direct GitHub link when live data cannot be loaded.
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load(); }
    }, {rootMargin:'300px'});
    observer.observe(scroll);
  } else load();
})();
