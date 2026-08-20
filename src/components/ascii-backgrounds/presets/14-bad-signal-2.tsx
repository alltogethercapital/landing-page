"use client";

// Licensed Shaders preset: Bad Signal 2 (ae53eacf-8bdc-4532-8e86-a468f21911a0).
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
        blend={40}
        colorA="#e725f5"
        colorB="#2c22f0"
        detail={1.7}
        speed={2} />
      <CRTScreen
        blendMode="hardLight"
        brightness={1.1}
        colorShift={3.9}
        contrast={1.2}>
        <Checkerboard />
        <SineWave
          amplitude={0.01}
          frequency={0.9}
          softness={0.27}
          thickness={0.78} />
        <CursorTrail
          radius={1} />
        <Ascii
          cellSize={100}
          spacing={0.2} />
      </CRTScreen>
    </Shader>
  )
}
