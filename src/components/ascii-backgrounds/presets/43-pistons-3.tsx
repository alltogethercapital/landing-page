"use client";

// Licensed Shaders preset: Pistons 3 (a3157072-2910-4275-a1ad-1a7e208ff7af).
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
        color="#162b52" />
      <Ascii
        cellSize={54}
        characters="▄║█"
        fontFamily="Geist Mono"
        gamma={0.95}>
        <Godrays
          backgroundColor="#04c3d8"
          center={{
            x: 0,
            y: 1
          }}
          density={0.2}
          intensity={0.9}
          rayColor="#602692"
          spotty={0} />
      </Ascii>
      <Paper
        displacement={0}
        grainScale={3}
        roughness={0.85} />
    </Shader>
  )
}
