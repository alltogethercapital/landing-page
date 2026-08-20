"use client";

// Licensed Shaders preset: Ascii Wave 2 (97a2eff9-5137-41b2-9b8d-f430342b4ee3).
import {
  Shader,
  Ascii,
  FilmGrain,
  Group,
  SineWave,
  SolidColor,
} from 'shaders/react'

export default function ShaderEffect() {
  return (
    <Shader className="ascii-background-shader" disableTelemetry={true}>
      <SolidColor
        color="#060f1f" />
      <Group
        blendMode="normal-oklch">
        <SolidColor
          color="#3a6b8c"
          visible={true} />
        <SineWave
          id="idmh10tevmvxufaxu22"
          amplitude={0.26}
          angle={36}
          color="#a8d5e2"
          frequency={0.3}
          position={{
            x: 0.5,
            y: 1
          }}
          softness={0.52}
          thickness={0.99}
          visible={true} />
        <Ascii
          cellSize={25}
          characters="〜*"
          fontFamily="Space Mono"
          maskSource="idmh10tevmvxufaxu22"
          visible={true} />
      </Group>
      <FilmGrain
        strength={0.05} />
    </Shader>
  )
}
