"use client";

// Licensed Shaders preset: Bad Signal 3 (08091894-f4c9-4ef8-82fb-73d548353e57).
import {
  Shader,
  Ascii,
  CRTScreen,
  Checkerboard,
  CursorTrail,
  SineWave,
  Swirl,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <Swirl
        blend={60}
        colorA="#ff6600"
        colorB="#00ffee"
        detail={1.9}
        speed={2.8} />
      <CRTScreen
        blendMode="hardLight"
        brightness={1.1}
        colorShift={4.8}
        contrast={1.2}>
        <Checkerboard />
        <SineWave
          amplitude={0.01}
          frequency={0.9}
          softness={0.27}
          thickness={0.78} />
        <CursorTrail
          colorA="#ffee00"
          radius={1} />
        <Ascii
          cellSize={65}
          spacing={0.5} />
      </CRTScreen>
    </Shader>
  )
}
