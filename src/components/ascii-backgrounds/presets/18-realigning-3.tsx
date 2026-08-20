"use client";

// Licensed Shaders preset: Realigning 3 (f6c7812a-51e1-4cb0-a3aa-4dc5e0943e34).
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
          farCutoff={0.1}
          frequency={1.7}
          height={-0.07}
          highlights={48}
          lighting={42}
          lightX={-0.49}
          lightY={-0.72}
          lightZ={0.3}
          octaves={1}
          roll={-1}
          tilt={10}
          zoom={0.79}>
          <SolidColor
            color="#000000" />
          <FallingLines
            angle={181}
            colorA="#78fd12"
            colorB="#697d6e"
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
