"use client";

// Licensed Shaders preset: Ascii Tunnel 5 (d4f87277-7a11-42a9-8486-274438f43e63).
import {
  Shader,
  Ascii,
  FallingLines,
  Form3D,
  RadialGradient,
  StudioBackground,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" colorSpace="srgb" disableTelemetry={true}>
      <RadialGradient
        center={{
          x: 0.5,
          y: 1
        }}
        colorA="#180726"
        colorB="#0f0f17"
        radius={0.8}
        visible={false} />
      <StudioBackground
        ambientIntensity={98}
        ambientSpeed={5}
        brightness={100}
        center={{
          x: 0.5,
          y: 1
        }}
        color="#0e1214"
        fillIntensity={0}
        keyIntensity={5}
        lightTarget={0} />
      <Ascii
        alphaThreshold={0.14}
        cellSize={12}
        characters="┉╳┉╳"
        gamma={0.25}
        preserveAlpha={false}>
        <Form3D
          glossiness={0}
          lighting={0}
          shape3d={{
            type: "torus",
            outerRadius: 102,
            tubeRadius: 100,
            rotX: -90,
            rotY: 0,
            rotZ: 0,
            spinX: 0,
            spinY: 0.5,
            spinZ: 0
          }}
          shape3dType="torus"
          zoom={92}>
          <FallingLines
            colorA="#ff088c"
            colorB="#ffb14a"
            density={17}
            speed={0.25}
            speedVariance={0.55}
            strokeWidth={0.38}
            trailLength={0.49} />
        </Form3D>
      </Ascii>
    </Shader>
  )
}
