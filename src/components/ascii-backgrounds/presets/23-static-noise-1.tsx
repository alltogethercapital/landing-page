"use client";

// Licensed Shaders preset: Static Noise 1 (4296a6e2-c82d-48ae-8393-788bb38a44f1).
import {
  Shader,
  Blob,
  ChromaticAberration,
  LinearGradient,
  Particles,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" toneMapping="neutral" disableTelemetry={true}>
      <LinearGradient
        stops={[{ color: "#030303", position: 0 }, { color: "#18181c", position: 1 }]} />
      <Blob
        center={{
          x: 0.92,
          y: 0.74
        }}
        opacity={0.14}
        size={0.39}
        softness={1}
        stops={[{ color: "#6fa1ce", position: 0 }, { color: "#9659ef", position: 1 }]} />
      <Blob
        center={{
          x: 0.05,
          y: 0.11
        }}
        opacity={0.14}
        size={0.39}
        softness={1}
        stops={[{ color: "#6fa1ce", position: 0 }, { color: "#9659ef", position: 1 }]} />
      <Particles
        agitation={0.45}
        colorA="#c0d8eb"
        colorB="#000000"
        count={16000}
        damping={0}
        depth={0.05}
        exposure={3}
        mouseInfluence={-4.23}
        scale={0.9}
        shape={{
          depth: 0.05,
          bevel: 0,
          rotX: 5,
          rotY: { type: "mouse", axis: "x", outputMin: 40, outputMax: -40 },
          rotZ: 0,
          type: "svg",
          svgUrl: "/shaders/ascii-assets/static-noise-shape.svg",
          geometry: "extrude"
        }}
        shapeSdfUrl="/shaders/ascii-assets/static-noise-shape.sdf.bin"
        shapeType="svgExtrude3D"
        size={2}
        softness={0.51}
        spread={0.29} />
      <ChromaticAberration
        angle={184}
        strength={0.05} />
    </Shader>
  )
}
