"use client";

// Licensed Shaders preset: Free Stars and Stripes 1 (9863146a-c4d7-4902-9a83-8ddb093a088d).
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
        cellSize={32}
        characters="★▬★▤"
        opacity={0.95}>
        <Stripes
          angle={159}
          density={1}
          softness={0.5} />
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
        pan={20.4}
        tilt={29.5}
        zoom={1.75} />
      <TiltShift
        angle={115}
        center={{
          x: 0.67,
          y: 0.52
        }}
        falloff={0.39}
        width={0.34} />
    </Shader>
  )
}
