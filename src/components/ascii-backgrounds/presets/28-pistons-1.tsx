"use client";

// Licensed Shaders preset: Pistons 1 (70d6ad9e-95a5-4569-8a31-0dcaeddee95e).
import {
  Shader,
  Ascii,
  Godrays,
  Paper,
  SolidColor,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" toneMapping="aces" disableTelemetry={true}>
      <SolidColor
        color="#2b1d59" />
      <Ascii
        cellSize={54}
        characters="▄║█"
        fontFamily="Geist Mono"
        gamma={0.6}>
        <Godrays
          backgroundColor="#3513b9"
          center={{
            x: 1,
            y: 0
          }}
          density={0.2}
          intensity={0.9}
          rayColor="#13b648"
          spotty={0} />
      </Ascii>
      <Paper
        displacement={0}
        grainScale={3}
        roughness={0.85} />
    </Shader>
  )
}
