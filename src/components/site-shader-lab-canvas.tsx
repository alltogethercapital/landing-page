"use client";

import { useState } from "react";
import { Dither, Shader, SineWave, SolidColor } from "shaders/react";
import type { SiteShaderOption } from "@/components/site-shader-options";

export function SiteShaderLabCanvas({
  option,
  reducedMotion,
}: {
  option: SiteShaderOption;
  reducedMotion: boolean;
}) {
  const [available, setAvailable] = useState(true);

  if (!available) return null;

  const speed = reducedMotion ? 0 : option.speed;
  const secondarySpeed = reducedMotion ? 0 : option.secondary?.speed;

  return (
    <Shader
      className="site-shader-lab-canvas"
      colorSpace="srgb"
      toneMapping="neutral"
      disableTelemetry
      onUnavailable={() => setAvailable(false)}
    >
      <SolidColor color={option.background} />
      <Dither
        colorA="transparent"
        colorB={option.dither}
        pattern={option.pattern}
        pixelSize={option.pixelSize}
        threshold={option.threshold}
        spread={option.spread}
      >
        <SineWave
          color={option.wave}
          angle={option.angle}
          amplitude={option.amplitude}
          frequency={option.frequency}
          position={option.position}
          softness={option.softness}
          speed={speed}
          thickness={option.thickness}
        />
        {option.secondary && (
          <SineWave
            color={option.accent}
            angle={option.secondary.angle}
            amplitude={option.secondary.amplitude}
            frequency={option.secondary.frequency}
            position={option.secondary.position}
            softness={option.secondary.softness}
            speed={secondarySpeed ?? 0}
            thickness={option.secondary.thickness}
          />
        )}
      </Dither>
    </Shader>
  );
}
