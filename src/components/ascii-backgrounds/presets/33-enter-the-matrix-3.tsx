"use client";

// Licensed Shaders preset: Enter The Matrix 3 (8f1220da-f88e-4114-baf2-f055310e299f).
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
        cellSize={24}
        characters="ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ"
        fontFamily="Geist Mono"
        gamma={1.2}
        spacing={0.55}>
        <FallingLines
          angle={180}
          colorA="#40ff5c"
          colorB="#032103ff"
          colorSpace="oklab"
          density={34}
          speed={0.45}
          speedVariance={1}
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
        tilt={21.9}
        zoom={1.4} />
    </Shader>
  )
}
