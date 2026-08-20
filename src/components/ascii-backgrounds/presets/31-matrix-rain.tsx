"use client";

// Licensed Shaders preset: Matrix Rain (c22ccc93-ce81-40fd-8146-ef1f5a7c0854).
import {
  Shader,
  Ascii,
  CRTScreen,
  Glow,
  GridDistortion,
  SolidColor,
  Stripes,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <SolidColor
        color="#040f07" />
      <Ascii
        cellSize={22}
        characters="0000010101010101010101010101010101010101010101010101010"
        fontFamily="Space Mono"
        spacing={0.7}>
        <Stripes
          angle={-15}
          balance={0.4}
          colorA="#017000"
          colorB="#021702"
          softness={0.6}
          speed={0.1} />
        <GridDistortion
          decay={1}
          gridSize={21}
          intensity={5}
          radius={2} />
      </Ascii>
      <Glow
        intensity={20}
        size={1}
        threshold={0.02} />
      <CRTScreen
        brightness={2}
        colorShift={0.4}
        scanlineFrequency={250}
        scanlineIntensity={0.4} />
    </Shader>
  )
}
