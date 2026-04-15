const storageKey = 'calorie-calculator-theme';
const allowedThemes = ['aurora', 'ocean', 'forest', 'midnight'];

function getStoredTheme() {
  const value = window.localStorage.getItem(storageKey);
  if (allowedThemes.includes(value)) {
    return value;
  }
  return 'aurora';
}

function applyTheme(theme) {
  const resolvedTheme = allowedThemes.includes(theme) ? theme : 'aurora';
  document.body.dataset.theme = resolvedTheme;
  window.localStorage.setItem(storageKey, resolvedTheme);
}

function syncButtons(buttons, activeTheme) {
  buttons.forEach((button) => {
    const isActive = button.dataset.theme === activeTheme;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

export function createThemeModule() {
  const buttons = Array.from(document.querySelectorAll('[data-theme-option]'));
  const initialTheme = getStoredTheme();

  applyTheme(initialTheme);
  syncButtons(buttons, initialTheme);

  function bind() {
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const nextTheme = button.dataset.theme;
        applyTheme(nextTheme);
        syncButtons(buttons, document.body.dataset.theme);
      });
    });
  }

  return {
    bind
  };
}
