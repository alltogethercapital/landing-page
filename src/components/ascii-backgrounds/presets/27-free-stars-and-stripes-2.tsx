"use client";

// Licensed Shaders preset: Free Stars and Stripes 2 (ceaf36ce-8870-401f-af70-747c848856b1).
import {
  Shader,
  Ascii,
  Perspective,
  SolidColor,
  Stripes,
  TiltShift,
  Tritone,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <SolidColor
        color="#00052e" />
      <Ascii
        cellSize={20}
        characters="★▬★▤"
        opacity={0.95}>
        <Stripes
          angle={159}
          density={1}
          softness={0.5}
          speed={0.1} />
        <Tritone
          colorA="#1100ff"
          colorB="#ffffff"
          colorC="#ff0000"
          colorSpace="oklab" />
      </Ascii>
      <Perspective
        fov={86}
        offset={{
          x: 0.39,
          y: 0.33
        }}
        pan={-8.1}
        tilt={-16.2}
        zoom={2.1} />
      <TiltShift
        angle={190}
        center={{
          x: 0.67,
          y: 0.52
        }}
        falloff={0.39}
        intensity={26}
        width={0.34} />
    </Shader>
  )
}
