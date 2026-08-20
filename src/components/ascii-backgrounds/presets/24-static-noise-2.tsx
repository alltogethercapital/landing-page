"use client";

// Licensed Shaders preset: Static Noise 2 (2c312028-55b2-4c66-8aed-c1b86c035b77).
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
          x: 1.02,
          y: 0.08
        }}
        opacity={0.14}
        size={0.39}
        softness={1}
        stops={[{ color: "#11df02", position: 0 }, { color: "#1519c5", position: 1 }]} />
      <Blob
        center={{
          x: -0.03,
          y: 0.86
        }}
        opacity={0.14}
        size={0.39}
        softness={1}
        stops={[{ color: "#11df02", position: 0 }, { color: "#1519c5", position: 1 }]} />
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
          rotY: { type: "mouse", axis: "x", outputMin: -40, outputMax: 40 },
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
