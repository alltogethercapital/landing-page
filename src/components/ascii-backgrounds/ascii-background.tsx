"use client";

import dynamic from "next/dynamic";

const AsciiBackgroundRuntime = dynamic(
  () =>
    import("@/components/ascii-backgrounds/ascii-background-runtime").then(
      ({ AsciiBackgroundRuntime }) => AsciiBackgroundRuntime,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="ascii-background-stage" aria-hidden="true">
        <div className="ascii-background-fallback" />
      </div>
    ),
  },
);

export function AsciiBackground() {
  return <AsciiBackgroundRuntime />;
}
