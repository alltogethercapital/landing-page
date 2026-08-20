"use client";

// Licensed Shaders preset: Free Arrow Grid 1 (b0c05ae5-7938-430a-b8b2-8d03be3d5ee4).
import {
  Shader,
  Ascii,
  Blob,
  Bulge,
  CRTScreen,
  Checkerboard,
  ChromaFlow,
  CursorTrail,
  Group,
  Ripples,
  SolidColor,
  TiltShift,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <SolidColor
        color="#17171a" />
      <Group>
        <Checkerboard
          colorB="#383e42" />
        <Ripples
          blendMode="overlay"
          frequency={17.3}
          opacity={0.32}
          speed={1.9}
          thickness={0.3} />
        <Blob
          id="idmh47oyx205ue8s7u1"
          deformation={0.15}
          highlightColor="#fff71a"
          highlightIntensity={0.45}
          highlightX={0.06}
          highlightY={-0.1}
          softness={0.63}
          speed={2}
          visible={true} />
        <Ripples
          blendMode="overlay"
          frequency={6.2}
          maskSource="idmh47oyx205ue8s7u1"
          opacity={0.4}
          softness={0.57}
          speed={-0.5}
          thickness={0.39} />
        <ChromaFlow
          baseColor="#eef21d"
          downColor="#f0e1e1"
          intensity={1.5}
          leftColor="#e1e1f0"
          maskSource="idmh47oyx205ue8s7u1"
          momentum={10}
          rightColor="#ededd5"
          upColor="#c1e0c1" />
        <CursorTrail />
        <Ascii
          characters="⦉⦊" />
        <Bulge
          edges="mirror"
          falloff={0.21}
          radius={1.36}
          strength={0.5} />
      </Group>
      <TiltShift
        angle={90}
        falloff={0.26}
        intensity={10}
        width={0.29} />
      <CRTScreen
        brightness={2}
        colorShift={0.8}
        contrast={1.01}
        pixelSize={60}
        scanlineFrequency={210}
        scanlineIntensity={0.91} />
    </Shader>
  )
}
