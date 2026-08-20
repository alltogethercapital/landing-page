"use client";

// Licensed Shaders preset: Glitch Trail (b21dd29d-92a4-4bc4-937f-edb846d7871d).
import {
  Shader,
  ChromaticAberration,
  CursorTrail,
  GridDistortion,
  ImageTexture,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <ImageTexture
        objectFit="cover"
        url="/hero-videos/ascii-homepage.1738e13b.jpg" />
      <CursorTrail
        id="idmi61gnmkxf1citdd1"
        colorA="#ffffff"
        colorB="#ffffff"
        opacity={0}
        radius={1.15}
        shrink={0.5}
        visible={false} />
      <ChromaticAberration
        maskSource="idmi61gnmkxf1citdd1"
        strength={0.08}>
        <ImageTexture
          objectFit="cover"
          url="/hero-videos/ascii-homepage.1738e13b.jpg" />
      </ChromaticAberration>
      <GridDistortion
        gridSize={30}
        intensity={3}
        radius={2} />
    </Shader>
  )
}
