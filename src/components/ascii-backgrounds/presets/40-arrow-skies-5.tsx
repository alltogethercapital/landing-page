"use client";

// Licensed Shaders preset: Arrow Skies 5 (c4b40180-2579-48ae-bac5-036389be60bc).
import {
  Shader,
  Ascii,
  Circle,
  Godrays,
  LinearGradient,
  WaveDistortion,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <LinearGradient
        colorA="#fff700"
        colorSpace="oklch"
        end={{
          x: 0.5,
          y: 0
        }}
        start={{
          x: 0.5,
          y: 1
        }} />
      <Godrays
        blendMode="linearDodge"
        center={{
          x: 0.5,
          y: 1
        }}
        density={0.11}
        intensity={0.7}
        opacity={0.2}
        rayColor="#87b4ff"
        speed={2}
        visible={true} />
      <Ascii
        characters="↖↖↗↗">
        <LinearGradient
          colorA="#fff700"
          colorSpace="oklch"
          end={{
            x: 0.5,
            y: 0
          }}
          start={{
            x: 0.5,
            y: 1
          }} />
        <WaveDistortion
          angle={61}
          frequency={2.2}
          speed={3.9}
          strength={0.5} />
        <Circle
          blendMode="normal-oklch"
          center={{
            x: 0.53,
            y: 1
          }}
          color="#ffdd00"
          radius={1.87}
          softness={1} />
      </Ascii>
    </Shader>
  )
}
