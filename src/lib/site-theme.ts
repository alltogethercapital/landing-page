import { LIGHT_MODE_OPTIONS, LIGHT_MODE_STORAGE_KEY } from "@/lib/light-mode-options";

export const SITE_THEME_STORAGE_KEY = "machine-spirit-theme-session-v1";

// New sessions start light; an explicit choice persists while browsing this tab.
export const SITE_THEME_SCRIPT = `(() => {
  const params = new URLSearchParams(location.search);
  const lightIds = ${JSON.stringify(LIGHT_MODE_OPTIONS.map((option) => option.id))};
  let light = params.get('light');
  if (!lightIds.includes(light)) {
    try { light = sessionStorage.getItem('${LIGHT_MODE_STORAGE_KEY}'); } catch {}
  }
  const preview = lightIds.includes(light);
  document.documentElement.dataset.lightOption = preview ? light : '1';
  if (preview) {
    document.documentElement.dataset.lightPreview = 'true';
    try { sessionStorage.setItem('${LIGHT_MODE_STORAGE_KEY}', light); } catch {}
  }
  let theme = params.get('theme');
  if (preview && theme !== 'dark') {
    theme = 'light';
    try { sessionStorage.setItem('${SITE_THEME_STORAGE_KEY}', theme); } catch {}
  }
  if (theme !== 'light' && theme !== 'dark') {
    try { theme = sessionStorage.getItem('${SITE_THEME_STORAGE_KEY}'); } catch {}
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = 'light';
  }
  document.documentElement.dataset.siteTheme = theme;
})();`;
