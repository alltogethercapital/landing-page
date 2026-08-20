"use client";

// Licensed Shaders preset: Realigning 6 (8567f84d-5003-4c90-b841-172abdec4817).
import {
  Shader,
  Ascii,
  ChromaticAberration,
  FallingLines,
  SolidColor,
  Surface3D,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" toneMapping="neutral" disableTelemetry={true}>
      <SolidColor
        color="#000000" />
      <Ascii
        cellSize={20}
        characters="▊⎕ ▊⎕ ▊"
        fontFamily="Geist Mono"
        spacing={0.8}>
        <Surface3D
          amplitude={0.61}
          cursorIntensity={0}
          cursorSpeed={0}
          farCutoff={0.12}
          frequency={1.7}
          height={-0.32}
          highlights={48}
          lighting={42}
          lightX={-0.49}
          lightY={-0.72}
          lightZ={0.3}
          octaves={1}
          roll={31}
          tilt={65}
          zoom={0.61}>
          <SolidColor
            color="#000000" />
          <FallingLines
            angle={0}
            colorA="#f15514"
            colorB="#ffc919"
            density={60}
            speed={0.05}
            speedVariance={0.72}
            strokeWidth={0.5}
            trailLength={0.15} />
        </Surface3D>
      </Ascii>
      <ChromaticAberration
        strength={0.03} />
    </Shader>
  )
}
