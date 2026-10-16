/** Shared 24×24 stroke geometry for the site and standalone gallery. */
export const UI_ICON_PATHS = {
  info: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 11v6M12 7h.01",
  search: "M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 1 1 15 0Z M16 16l5 5",
  close: "M6 6l12 12M18 6 6 18",
  play: "M8 4l12 8-12 8V4Z",
  pause: "M8 4v16M16 4v16",
  menu: "M4 6h16M4 12h16M4 18h16",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 1 1 8 0Z M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5",
  moon: "M20.5 14a8.5 8.5 0 0 1-10.5-10.5A8.5 8.5 0 1 0 20.5 14Z",
  "chevron-left": "M14 6l-6 6 6 6",
  "chevron-right": "M10 6l6 6-6 6",
  "chevron-down": "M6 10l6 6 6-6",
  refresh: "M3 10a9 9 0 1 1 2.9 9.2M3 4v6h6",
  "arrow-left": "M20 12H4M10 6l-6 6 6 6",
  "arrow-right": "M4 12h16M14 6l6 6-6 6",
  "arrow-up": "M12 20V4M6 10l6-6 6 6",
  "arrow-down": "M12 4v16M6 14l6 6 6-6",
  "arrow-up-right": "M6 18 18 6M6 6h12v12",
  "arrow-up-down": "M7 20V4M3 8l4-4 4 4M17 4v16M13 16l4 4 4-4",
  "corner-down-left": "M20 4v7a4 4 0 0 1-4 4H4M9 10l-5 5 5 5",
  mail: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM2 7l10 6 10-6",
  linkedin: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM7 10v7M7 7h.01M11 17v-7M11 13a3 3 0 0 1 6 0v4",
  x: "M4 3h4l12 18h-4L4 3ZM20 3 4 21",
  favorite: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z",
  "favorite-filled": "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3ZM9 12l2 2 4-4",
} as const;

export type UIIconName = keyof typeof UI_ICON_PATHS;

/** The reference search morph, plus restrained movement for theme/social controls. */
export const UI_ICON_HOVER_PATHS: Partial<Record<UIIconName, string>> = {
  search: "M19 10a8 8 0 1 1-16 0 8 8 0 1 1 16 0Z M17 16l4 5",
  close: "M4.5 4.5l15 15M19.5 4.5l-15 15",
  moon: "M20.6956 12.7976a8.5 8.5 0 0 1-11.8591-8.9365A8.5 8.5 0 1 0 20.6956 12.7976Z",
  sun: "M15.6955 13.5307A4 4 0 1 1 8.3045 10.4693A4 4 0 1 1 15.6955 13.5307ZM15.8268 2.7612L15.0615 4.6090M8.9385 19.3910L8.1732 21.2388M2.7612 8.1732L4.6090 8.9385M19.3910 15.0615L21.2388 15.8268M8.2116 2.8541L9.0234 4.8139M14.9766 19.1861L15.7884 21.1459M2.8541 15.7884L4.8139 14.9766M19.1861 9.0234L21.1459 8.2116",
  mail: "M22 10.5v9a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 19.5v-9L12 3l10 7.5ZM22 10.5l-9.1 6a1.6 1.6 0 0 1-1.8 0L2 10.5",
  linkedin: "M5 2.5h14a2.5 2.5 0 0 1 2.5 2.5v14a2.5 2.5 0 0 1-2.5 2.5H5a2.5 2.5 0 0 1-2.5-2.5V5a2.5 2.5 0 0 1 2.5-2.5ZM7 10v7M7 7h.01M11 17v-7M11 12.5a3 3 0 0 1 6 0V17",
  x: "M3.7428 4.9809L7.3077 4.4799L20.2572 19.0191L16.6923 19.5201L3.7428 4.9809ZM18.0026 2.9768L5.9974 21.0232",
};
