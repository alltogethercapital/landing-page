"use client";

// Licensed Shaders preset: Realigning 4 (a048791e-9781-44ff-90c2-6224d152c65e).
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
          farCutoff={0.08}
          frequency={1.7}
          height={-0.07}
          highlights={48}
          lighting={42}
          lightX={-0.49}
          lightY={-0.72}
          lightZ={0.3}
          octaves={1}
          roll={45}
          tilt={34}
          zoom={0.79}>
          <SolidColor
            color="#000000" />
          <FallingLines
            angle={193}
            colorA="#53f29a"
            colorB="#b50a0b"
            density={60}
            speed={0.05}
            speedVariance={0.72}
            strokeWidth={0.5}
            trailLength={0.33} />
        </Surface3D>
      </Ascii>
      <ChromaticAberration
        strength={0.03} />
    </Shader>
  )
}
