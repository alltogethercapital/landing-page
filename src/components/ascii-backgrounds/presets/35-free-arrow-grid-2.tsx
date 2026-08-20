"use client";

// Licensed Shaders preset: Free Arrow Grid 2 (f44849d2-c161-4dc3-804a-00484d7174ab).
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
          cells={22}
          colorB="#383e42" />
        <Ripples
          blendMode="overlay"
          frequency={23.8}
          opacity={0.32}
          speed={1.9}
          thickness={0.3} />
        <Blob
          id="idmh47oyx205ue8s7u1"
          colorA="#5cf525"
          colorB="#1e6ce9"
          deformation={0.37}
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
          cellSize={60}
          characters="⦉⦊" />
        <Bulge
          edges="mirror"
          falloff={1}
          radius={2.6}
          strength={-0.29}
          transform={{
            edges: "mirror",
            rotation: 35
          }} />
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
