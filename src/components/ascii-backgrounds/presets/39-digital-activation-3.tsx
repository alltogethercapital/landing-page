"use client";

// Licensed Shaders preset: Digital Activation 3 (be229fa2-d17a-46de-b539-31b4d4f30e0b).
import {
  Shader,
  Ascii,
  DotGrid,
  Glass,
  SolidColor,
  Spiral,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <SolidColor
        color="#0e0f14" />
      <DotGrid
        color="#292936"
        density={49}
        dotSize={0.1} />
      <Glass
        aberration={0.8}
        center={{
          x: 0,
          y: 0
        }}
        cutout={true}
        edgeSoftness={0.2}
        fresnel={0}
        fresnelSoftness={0.23}
        highlight={0}
        highlightSoftness={0.16}
        lightAngle={274}
        refraction={2}
        scale={1.45}
        shape={{
          type: "ringSDF",
          radius: 0.8,
          thickness: 0.185
        }}>
        <SolidColor
          color="#0e0f14" />
        <Ascii
          characters="◘•"
          gamma={0.8}
          spacing={0.8}>
          <Spiral
            center={{
              x: 0.07,
              y: 0.66
            }}
            colorA="#0a131f"
            colorB="#55ff0a"
            softness={0.4} />
        </Ascii>
      </Glass>
    </Shader>
  )
}
