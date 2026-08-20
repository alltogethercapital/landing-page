"use client";

// Licensed Shaders preset: Photocopied 7 (9bb6cf98-77ba-49f4-b861-e61e4a3a1221).
import {
  Shader,
  Dither,
  Glass,
  Pixelate,
  Ripples,
  SolidColor,
  VHS,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <SolidColor
        color="#0a0a0a" />
      <Glass
        aberration={0}
        cutout={true}
        fresnel={0}
        fresnelSoftness={0}
        highlight={0}
        lightAngle={232}
        refraction={0.64}
        scale={0.8}
        shapeSdfUrl="/shaders/ascii-assets/photocopied-shape.sdf.bin"
        thickness={0.1}>
        <Ripples
          center={{
            x: 0.5,
            y: 0.12
          }}
          colorA="#a8c4d6"
          colorB="#212129"
          frequency={80} />
        <Pixelate
          scale={47}
          visible={true} />
        <Dither
          blendMode="colorDodge"
          colorMode="source"
          pixelSize={6}
          threshold={0.8} />
      </Glass>
      <VHS
        scanlineNoise={0.09}
        smear={0.3}
        wobble={0.61} />
    </Shader>
  )
}
