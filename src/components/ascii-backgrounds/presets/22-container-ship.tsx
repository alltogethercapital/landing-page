"use client";

// Licensed Shaders preset: Container Ship (5eabcbad-36b5-4c3a-9a32-20dbf54364a6).
import {
  Shader,
  Ascii,
  ChromaFlow,
  ImageTexture,
  SolidColor,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <ChromaFlow
        id="idmot2nu7k5xbjsnmcu"
        baseColor="#ffffff"
        downColor="#ffffff"
        intensity={1.4}
        leftColor="#ffffff"
        momentum={10}
        rightColor="#ffffff"
        upColor="#ffffff"
        visible={false} />
      <SolidColor
        color="#0c0b17" />
      <Ascii
        characters="▁▂▃▄▅▆▇█"
        fontFamily="Geist Mono"
        gamma={{
          type: "map",
          source: "idmot2nu7k5xbjsnmcu",
          channel: "alpha",
          inputMax: 1,
          inputMin: 0,
          outputMax: 3,
          outputMin: 0
        }}>
        <ImageTexture
          objectFit="cover"
          url="/hero-videos/ascii-homepage.1738e13b.jpg" />
      </Ascii>
    </Shader>
  )
}
