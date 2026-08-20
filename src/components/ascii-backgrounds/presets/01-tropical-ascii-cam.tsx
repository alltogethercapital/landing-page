"use client";

// Licensed Shaders preset: Tropical Ascii Cam (3ae43706-ba57-4884-845f-1cc5b413ef59).
import {
  Shader,
  Ascii,
  ImageTexture,
  SolidColor,
  Tritone,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <SolidColor
        color="#1f0e45" />
      <Ascii
        cellSize={24}
        characters="⌁⌗⌔⌭">
        <ImageTexture
          objectFit="cover"
          url="/hero-videos/ascii-homepage.1738e13b.jpg" />
        <Tritone
          blendMid={0.23}
          colorA="#004ad4"
          colorB="#ffbf00"
          colorC="#0aa9ff"
          colorSpace="oklch"
          visible={true} />
      </Ascii>
    </Shader>
  )
}
