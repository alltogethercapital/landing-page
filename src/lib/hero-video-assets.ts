export type HeroVideoSource = {
  src: string;
  type: string;
};

export const HERO_VIDEOS = {
  shieldAiXbat: [
    {
      src: "/hero-videos/shield-ai-xbat.1440-av1.c4ff1caa.mp4",
      type: 'video/mp4; codecs="av01.0.12M.08, mp4a.40.2"',
    },
    {
      src: "/hero-videos/shield-ai-xbat.1080-h264.34ed717b.mp4",
      type: 'video/mp4; codecs="avc1.640028, mp4a.40.2"',
    },
  ],
  oneXNeoFactory: [
    {
      src: "/hero-videos/1x-neo-factory.1440-av1.50f583a4.mp4",
      type: 'video/mp4; codecs="av01.0.12M.08, mp4a.40.2"',
    },
    {
      src: "/hero-videos/1x-neo-factory.1080-h264.f109d706.mp4",
      type: 'video/mp4; codecs="avc1.640028, mp4a.40.2"',
    },
  ],
  figure03: [
    {
      src: "/hero-videos/figure-03.1080-h264.7e8e7c0f.mp4",
      type: 'video/mp4; codecs="avc1.640028, mp4a.40.2"',
    },
  ],
} as const;

export const FIRST_HERO_VIDEO = HERO_VIDEOS.shieldAiXbat[0].src;
