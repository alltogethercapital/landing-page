"use client";

// Licensed Shaders preset: Arrow Skies 2 (51e9190c-97d4-4cfe-82d8-d7cfc1b95d81).
import {
  Shader,
  Ascii,
  Circle,
  LinearGradient,
  WaveDistortion,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <LinearGradient
        colorA="#ff0091"
        colorB="#220047"
        colorSpace="oklch"
        end={{
          x: 0.53,
          y: 0.32
        }}
        start={{
          x: 0,
          y: 1
        }} />
      <Ascii
        characters="↖↖↗↗">
        <LinearGradient
          colorA="#fff700"
          colorB="#00004a"
          colorSpace="oklch"
          end={{
            x: 0.53,
            y: 0.51
          }}
          start={{
            x: 0,
            y: 1
          }} />
        <WaveDistortion
          angle={151}
          frequency={1.4}
          speed={3.9}
          strength={0.5} />
        <Circle
          blendMode="normal-oklch"
          center={{
            x: 0.3,
            y: 0.82
          }}
          color="#ffdd00"
          radius={1.87}
          softness={1} />
      </Ascii>
    </Shader>
  )
}
