export const SITE_THEME_STORAGE_KEY = "machine-spirit-theme";

// Runs before hydration so the default light appearance and saved choices never flash.
export const SITE_THEME_SCRIPT = `(() => {
  let theme = new URLSearchParams(location.search).get('theme');
  if (theme !== 'light' && theme !== 'dark') {
    try { theme = localStorage.getItem('${SITE_THEME_STORAGE_KEY}'); } catch {}
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = 'light';
  }
  document.documentElement.dataset.siteTheme = theme;
})();`;
