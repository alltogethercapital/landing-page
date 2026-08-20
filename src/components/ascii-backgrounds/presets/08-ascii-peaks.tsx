"use client";

// Licensed Shaders preset: ASCII Peaks (7f41b77a-62a2-42df-a227-ad7ed0760327).
import {
  Shader,
  Ascii,
  CRTScreen,
  Glow,
  GridDistortion,
  SolidColor,
  Stripes,
  WaveDistortion,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <SolidColor
        color="#02090f" />
      <Ascii
        cellSize={33}
        characters="O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0O0"
        fontFamily="Source Code Pro"
        gamma={1.35}
        spacing={0.75}
        visible={true}>
        <Stripes
          angle={-28}
          balance={0.3}
          colorA="#0fdcff"
          colorB="#030217"
          density={1}
          softness={0.5}
          speed={0.1}
          visible={true} />
        <WaveDistortion
          angle={90}
          frequency={4}
          strength={0.59}
          visible={true}
          waveType="triangle" />
        <GridDistortion
          gridSize={18}
          intensity={5}
          radius={3}
          visible={true} />
      </Ascii>
      <Glow
        intensity={9.44}
        size={1.98}
        threshold={0.12}
        visible={true} />
      <CRTScreen
        brightness={3}
        colorShift={0.8}
        pixelSize={19}
        scanlineFrequency={250}
        scanlineIntensity={0.29}
        visible={true} />
    </Shader>
  )
}
