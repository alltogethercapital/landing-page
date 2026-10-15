import verifiedPortraits from "./verified-founder-portraits.json";

// Only reviewed personal photos with checked transparent assets are publishable.
// Unlisted source images deliberately have no fallback to an opaque photo/avatar.
export function founderPortraitSrc(source: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(verifiedPortraits, source)
    ? verifiedPortraits[source as keyof typeof verifiedPortraits]
    : undefined;
}
