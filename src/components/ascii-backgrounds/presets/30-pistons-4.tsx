"use client";

// Licensed Shaders preset: Pistons 4 (2f4ff611-aaf8-41b7-9e6d-f8f6bf5d1606).
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
        color="#361f1f" />
      <Ascii
        cellSize={54}
        characters="▄║█"
        fontFamily="Geist Mono"
        gamma={1.35}>
        <Godrays
          backgroundColor="#e66f1d"
          center={{
            x: 0.5,
            y: 1
          }}
          density={0.2}
          intensity={0.9}
          rayColor="#6feafe"
          spotty={0} />
      </Ascii>
      <Paper
        displacement={0}
        grainScale={3}
        roughness={0.85} />
    </Shader>
  )
}
