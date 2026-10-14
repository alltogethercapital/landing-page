import { icon, mountIcons, destroyIcons, setIcon } from "./gallery-icons.js";

(() => {
  const { logos, families } = window.MACHINE_SPIRIT;
  const $ = (id) => document.getElementById(id);
  const storageKey = "machine-spirit-ms-monograms-v1";
  let favorites = new Set();
  let activeFamily = "all";
  let shortlistOnly = false;
  let current = null;
  let previousOverflow = "";
  let opener = null;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    favorites = new Set(Array.isArray(saved.favorites) ? saved.favorites.filter((id) => logos.some((logo) => logo.id === id)) : []);
  } catch { /* Gallery works without persistent browser storage. */ }
  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ favorites: [...favorites] }));
      localStorage.setItem("machine-spirit-theme", document.body.classList.contains("dark") ? "dark" : "light");
    } catch { /* Keep session choices. */ }
  }
  function svg(logo, suffix = "", size) {
    // Prefix mask IDs so simultaneous card, detail, and size previews stay independent.
    const shapes = logo.shapes.replace(/id="([^"]+)"/g, (_, id) => `id="${id}${suffix}"`).replace(/url\(#([^\)]+)\)/g, (_, id) => `url(#${id}${suffix})`);
    return `<svg viewBox="0 0 240 240" aria-hidden="true"${size ? ` width="${size}" height="${size}"` : ""}>${shapes}</svg>`;
  }
  function shown() {
    const query = $("search").value.trim().toLowerCase();
    return logos.filter((logo) => (activeFamily === "all" || logo.family === activeFamily) && (!shortlistOnly || favorites.has(logo.id)) && (!query || `${logo.number} ${logo.id} ${logo.name} ${logo.familyName}`.toLowerCase().includes(query)));
  }
  function render() {
    const filtered = shown();
    destroyIcons($("grid"));
    $("grid").innerHTML = filtered.map((logo) => `<article class="card${favorites.has(logo.id) ? " saved" : ""}" data-logo="${logo.id}"><div class="card-top"><span class="number">${logo.number}${logo.recommended ? '<span class="pick-dot" title="Studio pick"></span>' : ""}</span><button class="favorite" data-save="${logo.id}" aria-label="${favorites.has(logo.id) ? "Remove" : "Save"} ${logo.number} ${logo.name} ${favorites.has(logo.id) ? "from" : "to"} shortlist" aria-pressed="${favorites.has(logo.id)}">${icon(favorites.has(logo.id) ? "favorite-filled" : "favorite")}</button></div><button class="preview" data-open="${logo.id}" aria-label="Preview ${logo.number} ${logo.name}">${svg(logo, "-card")}</button><div class="card-bottom"><div><h2>${logo.name}</h2><p>${logo.familyName}</p></div><a href="svg/${logo.file}" download aria-label="Download ${logo.number} ${logo.name} SVG" title="Download SVG">${icon("arrow-up-right", "arrow-down")}</a></div></article>`).join("");
    mountIcons($("grid"));
    $("clear-search").hidden = $("search").value.length === 0;
    $("favorite-count").textContent = String(favorites.size);
    $("results").textContent = `${filtered.length} ${filtered.length === 1 ? "MONOGRAM" : "MONOGRAMS"}${activeFamily !== "all" ? ` / ${families.find((family) => family.id === activeFamily).name.toUpperCase()}` : ""}`;
    $("empty").hidden = filtered.length > 0;
    $("grid").hidden = filtered.length === 0;
    $("empty-message").textContent = shortlistOnly && favorites.size === 0 ? "Save a few favorites using the star on each card." : "Try another style or clear your search.";
    $("all-view").setAttribute("aria-pressed", String(!shortlistOnly));
    $("favorites-view").setAttribute("aria-pressed", String(shortlistOnly));
    $("filters").querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.family === activeFamily)));
  }
  function toggleFavorite(id) {
    const focusedSave = document.activeElement?.dataset.save;
    const previousList = shown();
    const previousIndex = previousList.findIndex((logo) => logo.id === id);
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    save();
    // Update a focused card in place so keyboard selection can continue.
    if (shortlistOnly) {
      render();
      if (focusedSave) {
        const list = shown();
        const next = list[Math.min(previousIndex, list.length - 1)];
        const nextButton = next ? $("grid").querySelector(`[data-save="${next.id}"]`) : $("favorites-view");
        nextButton?.focus();
      }
    }
    else {
      const card = $("grid").querySelector(`[data-logo="${id}"]`);
      if (card) {
        const logo = logos.find((item) => item.id === id);
        const button = card.querySelector("[data-save]");
        const selected = favorites.has(id);
        card.classList.toggle("saved", selected);
        setIcon(button, selected ? "favorite-filled" : "favorite");
        button.setAttribute("aria-pressed", String(selected));
        button.setAttribute("aria-label", `${selected ? "Remove" : "Save"} ${logo.number} ${logo.name} ${selected ? "from" : "to"} shortlist`);
      }
      $("favorite-count").textContent = String(favorites.size);
    }
    updateDetailSave();
    updateDetailNavigation();
  }
  function updateDetailSave() {
    if (!current) return;
    const selected = favorites.has(current.id);
    $("detail-save-label").textContent = selected ? "In your shortlist" : "Add to shortlist";
    setIcon($("detail-save"), selected ? "favorite-filled" : "favorite");
    $("detail-save").setAttribute("aria-pressed", String(selected));
  }
  function updateDetailNavigation() {
    if (!current) return;
    const list = shown();
    const index = list.findIndex((logo) => logo.id === current.id);
    $("previous").disabled = index <= 0;
    $("next").disabled = index < 0 || index >= list.length - 1;
  }
  function updateDownloadTheme() {
    if (!current) return;
    const pngName = current.file.replace(".svg", document.body.classList.contains("dark") ? "-white.png" : "-ink.png");
    $("download-png").href = `png/${pngName}`;
    $("download-png").download = pngName;
  }
  function openLogo(id, updateHash = true) {
    current = logos.find((logo) => logo.id === id);
    if (!current) return;
    $("detail-number").textContent = `MACHINE SPIRIT / MS ${current.number}`;
    $("detail-family").textContent = current.familyName.toUpperCase();
    $("detail-title").textContent = current.name;
    $("detail-description").textContent = current.idea;
    $("detail-art").innerHTML = svg(current, "-detail");
    $("lockup").innerHTML = `${svg(current, "-lockup")}<span>Machine Spirit</span>`;
    $("sizes").innerHTML = [16, 24, 32, 48].map((size) => `<div class="size">${svg(current, `-size-${size}`, size)}<span>${size}px</span></div>`).join("");
    $("download-svg").href = `svg/${current.file}`;
    $("download-svg").download = current.file;
    updateDownloadTheme();
    updateDetailSave();
    updateDetailNavigation();
    if (!$("detail").open) {
      opener = document.activeElement;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      $("detail").showModal();
    }
    if (updateHash) history.replaceState(null, "", `#ms-${current.number}`);
  }
  function navigate(offset) {
    const list = shown();
    const index = list.findIndex((logo) => logo.id === current?.id);
    const next = list[index + offset];
    if (next) openLogo(next.id);
  }
  function setTheme(dark, persist = true) {
    document.body.classList.toggle("dark", dark);
    document.documentElement.dataset.siteTheme = dark ? "dark" : "light";
    $("theme-toggle").setAttribute("aria-label", dark ? "Switch to light background" : "Switch to dark background");
    $("theme-toggle").title = dark ? "Switch to light background" : "Switch to dark background";
    setIcon($("theme-toggle"), dark ? "sun" : "moon", persist);
    updateDownloadTheme();
    if (persist) {
      const url = new URL(location.href);
      if (url.searchParams.has("theme")) {
        url.searchParams.set("theme", dark ? "dark" : "light");
        history.replaceState(history.state, "", url);
      }
      save();
    }
  }
  $("filters").innerHTML = `<button data-family="all" aria-pressed="true">All directions</button>${families.map((family) => `<button data-family="${family.id}" aria-pressed="false">${family.name}</button>`).join("")}`;
  $("filters").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-family]");
    if (!button) return;
    activeFamily = button.dataset.family;
    render();
  });
  $("grid").addEventListener("click", (event) => {
    const favorite = event.target.closest("[data-save]");
    if (favorite) { toggleFavorite(Number(favorite.dataset.save)); return; }
    const preview = event.target.closest("[data-open]");
    if (preview) openLogo(Number(preview.dataset.open));
  });
  $("all-view").addEventListener("click", () => { shortlistOnly = false; render(); });
  $("favorites-view").addEventListener("click", () => { shortlistOnly = true; render(); });
  $("search").addEventListener("input", render);
  $("clear-search").addEventListener("click", () => { $("search").value = ""; render(); $("search").focus(); });
  $("reset").addEventListener("click", () => { shortlistOnly = false; activeFamily = "all"; $("search").value = ""; render(); });
  $("theme-toggle").addEventListener("click", () => setTheme(!document.body.classList.contains("dark")));
  $("close").addEventListener("click", () => $("detail").close());
  $("detail").addEventListener("close", () => {
    current = null;
    document.body.style.overflow = previousOverflow;
    history.replaceState(null, "", location.pathname + location.search);
    if (opener?.isConnected) opener.focus();
    else ($("grid").querySelector("[data-open]") || $("favorites-view")).focus();
    opener = null;
  });
  $("detail").addEventListener("click", (event) => {
    if (event.target !== $("detail")) return;
    const bounds = $("detail").getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) $("detail").close();
  });
  $("previous").addEventListener("click", () => navigate(-1));
  $("next").addEventListener("click", () => navigate(1));
  $("detail-save").addEventListener("click", () => { if (current) toggleFavorite(current.id); });
  document.addEventListener("keydown", (event) => {
    if (!$("detail").open || event.target instanceof HTMLInputElement) return;
    if (event.key === "ArrowRight") { event.preventDefault(); navigate(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); navigate(-1); }
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "machine-spirit-theme" && (event.newValue === "dark" || event.newValue === "light")) {
      setTheme(event.newValue === "dark", false);
    }
  });
  const requested = /^#ms-(\d{1,3})$/.exec(location.hash);
  mountIcons();
  render();
  setTheme(document.documentElement.dataset.siteTheme !== "light", false);
  if (requested) openLogo(Number(requested[1]), false);
})();
