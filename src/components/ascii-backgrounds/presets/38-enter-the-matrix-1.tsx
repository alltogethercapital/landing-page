"use client";

// Licensed Shaders preset: Enter The Matrix 1 (d9df03c5-1515-4e1f-b6fe-304767cdfc17).
import {
  Shader,
  Ascii,
  CRTScreen,
  FallingLines,
  Glow,
  Perspective,
  SolidColor,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <SolidColor
        color="#0b1410" />
      <Ascii
        cellSize={25}
        characters="ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ"
        fontFamily="Geist Mono"
        spacing={0.9}>
        <FallingLines
          colorA="#40ff5c"
          colorB="#032103ff"
          colorSpace="oklab"
          density={34}
          speed={0.45}
          speedVariance={0.55}
          strokeWidth={0.5}
          trailLength={0.7}
          visible={true} />
      </Ascii>
      <Glow
        intensity={6.8}
        size={2}
        threshold={0.4}
        visible={true} />
      <CRTScreen
        colorShift={0}
        pixelSize={112}
        scanlineFrequency={100}
        scanlineIntensity={0.1}
        vignetteIntensity={0.1}
        vignetteRadius={0.35}
        visible={true} />
      <Perspective
        edges="wrap"
        tilt={30}
        zoom={0.9} />
    </Shader>
  )
}
