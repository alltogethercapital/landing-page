"use client";

// Licensed Shaders preset: Bad Signal 1 (adfa5af4-3363-49e1-a930-9d1018cc3e9c).
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
        colorA="#25f55c"
        colorB="#f0bc22"
        detail={1}
        blend={50} />
      <CRTScreen
        blendMode="hardLight"
        brightness={1.1}
        colorShift={3.6}
        contrast={1.2}>
        <Checkerboard />
        <SineWave
          amplitude={0.01}
          frequency={0.9}
          softness={0.27}
          thickness={0.78} />
        <CursorTrail
          radius={1} />
        <Ascii />
      </CRTScreen>
    </Shader>
  )
}
