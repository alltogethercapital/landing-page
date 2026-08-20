"use client";

// Licensed Shaders preset: Ascii Wave 1 (128a514b-9642-4032-a925-9b59c31575a0).
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
          amplitude={0.26}
          angle={36}
          color="#16ded7"
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
