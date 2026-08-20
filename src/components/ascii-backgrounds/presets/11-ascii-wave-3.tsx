"use client";

// Licensed Shaders preset: Ascii Wave 3 (5d810714-6a3c-45f4-9920-d79c84f2edf2).
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
        color="#0b0f24" />
      <Group
        blendMode="normal-oklch">
        <SolidColor
          color="#5413ed"
          visible={true} />
        <SineWave
          id="idmh10tevmvxufaxu22"
          amplitude={0.5}
          angle={281}
          color="#16ded7"
          frequency={16.7}
          position={{
            x: 0.5,
            y: 1
          }}
          softness={0.52}
          thickness={2}
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
