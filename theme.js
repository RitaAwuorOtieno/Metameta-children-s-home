(() => {
  const root = document.documentElement;
  const themeKey = 'theme';
  let theme = 'light';

  try {
    const saved = localStorage.getItem(themeKey);
    theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch (_) {
    theme = 'light';
  }
  root.dataset.theme = theme;

  const pages = [
    ['index.html', 'Home'],
    ['about.html', 'About'],
    ['programs.html', 'Programs'],
    ['volunteer.html', 'Volunteer'],
    ['partner.html', 'Partner'],
    ['events.html', 'Events'],
    ['gallery.html', 'Gallery'],
    ['contact.html', 'Contact'],
    ['donate.html', 'Donate']
  ];

  function initThemeButton(button) {
    button.id = 'theme-mode-toggle';
    button.type = 'button';
    button.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true"></span>';
    setTheme(theme, button);
    button.addEventListener('click', () => setTheme(theme === 'dark' ? 'light' : 'dark', button));
  }

  function setTheme(nextTheme, button) {
    theme = nextTheme;
    root.dataset.theme = theme;
    try { localStorage.setItem(themeKey, theme); } catch (_) { /* Storage may be disabled. */ }
    const nextAction = theme === 'dark' ? 'light' : 'dark';
    button.setAttribute('aria-label', `Switch to ${nextAction} mode`);
    button.title = `Switch to ${nextAction} mode`;
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.querySelector('.theme-toggle-icon').textContent = String.fromCharCode(theme === 'dark' ? 0x2600 : 0x263E);
  }

  function initNavigation() {
    const nav = document.querySelector('.navbar');
    const list = nav?.querySelector('ul.nav, #nav-links');
    if (!nav || !list) {
      let button = nav?.querySelector('.theme-toggle');
      if (!button) {
        button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Change color theme');
        if (!nav) button.classList.add('theme-floating-toggle');
        (nav?.querySelector('.nav-container') || nav || document.body).appendChild(button);
      }
      initThemeButton(button);
      return;
    }

    nav.setAttribute('aria-label', 'Main navigation');
    const existingItems = [...list.children].filter(item => item.tagName === 'LI');
    const extras = existingItems.filter(item => {
      const link = item.querySelector('a[href]');
      return !link || !pages.some(([href]) => href === link.getAttribute('href'));
    });
    const byHref = new Map([...list.querySelectorAll('a[href]')].map(link => [link.getAttribute('href'), link.closest('li')]));

    pages.forEach(([href, label]) => {
      let item = byHref.get(href);
      if (!item) {
        item = document.createElement('li');
        item.className = 'nav-item';
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        item.appendChild(link);
      }
      const link = item.querySelector('a');
      if (link) {
        const current = location.pathname.split('/').pop() || 'index.html';
        link.classList.toggle('active', link.getAttribute('href') === current);
        if (link.classList.contains('active')) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
      list.appendChild(item);
    });
    extras.forEach(item => list.appendChild(item));

    let button = nav.querySelector('.theme-toggle');
    if (!button) {
      const item = document.createElement('li');
      item.className = 'nav-item theme-nav-item';
      button = document.createElement('button');
      button.className = 'theme-toggle';
      item.appendChild(button);
      list.appendChild(item);
    } else if (button.parentElement.tagName !== 'LI') {
      const item = document.createElement('li');
      item.className = 'nav-item theme-nav-item';
      item.appendChild(button);
      list.appendChild(item);
    }

    initThemeButton(button);

    const menu = nav.querySelector('#mobile-menu, .menu-toggle');
    if (menu) {
      menu.setAttribute('role', 'button');
      menu.setAttribute('tabindex', '0');
      menu.setAttribute('aria-label', 'Open navigation');
      menu.setAttribute('aria-expanded', 'false');
      menu.addEventListener('click', () => list.classList.toggle('active'));
      menu.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          menu.click();
        }
      });
      const observer = new MutationObserver(() => {
        const expanded = list.classList.contains('active');
        menu.setAttribute('aria-expanded', String(expanded));
        menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
      });
      observer.observe(list, { attributes: true, attributeFilter: ['class'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initNavigation, { once: true });
  else initNavigation();
})();
