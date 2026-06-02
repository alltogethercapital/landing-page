"use client";

import ReactDOM from "react-dom";
import { FIRST_HERO_VIDEO } from "@/lib/hero-video-assets";

export function HeroVideoPreload() {
  ReactDOM.preload(FIRST_HERO_VIDEO, {
    as: "video",
    fetchPriority: "high",
    type: "video/mp4",
  });

  return null;
}
