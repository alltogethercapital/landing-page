export const SITE_THEME_STORAGE_KEY = "machine-spirit-theme-session-v1";

// New sessions start light; an explicit choice persists while browsing this tab.
export const SITE_THEME_SCRIPT = `(() => {
  let theme = new URLSearchParams(location.search).get('theme');
  if (theme !== 'light' && theme !== 'dark') {
    try { theme = sessionStorage.getItem('${SITE_THEME_STORAGE_KEY}'); } catch {}
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = 'light';
  }
  document.documentElement.dataset.siteTheme = theme;
})();`;
