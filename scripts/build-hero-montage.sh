#!/bin/bash
# Rebuild the ASCII hero montage from the 1080p per-company masters.
#
# Shot selection favours clear silhouettes and strong luminance separation —
# what survives a character ramp. Screen recordings, macro shots, and domestic
# scenes where a robot reads as a person are deliberately excluded.
set -euo pipefail

SRC="/Users/hishamel-husseini/Documents/projects/alltogethercapital/heesh/processed-video"
OUT="$1"
CRF="${2:-16}"

# company | in-point | duration
#
# Ordered so no two consecutive shots share a sector or a company. Bias is
# toward machine detail — actuators, turbines, gear trains, reactor internals —
# over ambient or lifestyle footage.
#
# Software companies are represented by tight windows rather than excluded —
# each clip is mostly lifestyle footage, but each has a few seconds that read as
# genuinely technical, and those windows were checked through the shader.
#
# Deliberately absent:
#   Applied Intuition — tan bodywork on a beige floor, almost no luminance
#     separation, renders muddy through the ramp.
#   Figure @37.5 — a smooth humanoid torso on a plain background reads as a
#     person standing once it hits the ramp, not as a robot.
#   1X domestic footage — same failure: the robot reads as a person vacuuming.
#   Aurelius — subject too small against busy foliage.
#
# EVERY window below sits inside a single continuous shot of its source. Run
# scripts/check-hero-shots.sh after any edit — these clips contain inserts as
# short as two frames (Aalo has a lab technician spliced in at frames 69-72),
# and a window that spans one produces a jump cut in the montage. Use
# scripts/list-hero-stretches.sh to see where the safe windows are.
SHOTS=(
  "Shield AI|0.10|2.8"         # aerospace  — airframe against cloud
  "Figure|1.85|3.5"            # robotics   — hand in mesh glove
  "Aalo Atomics|3.12|2.9"      # energy     — reactor pool, after the insert
  "Replit|1.50|1.3"            # software   — code editor, syntax on dark
  "Apptronik|2.30|2.25"        # robotics   — humanoid, warehouse aisle
  "Quaise Energy|1.45|3.65"    # energy     — plasma drilling
  "Starcloud|2.00|3.5"         # space      — spacecraft over Earth
  "Unspun|11.40|1.95"          # industrial — gear train
  "Aalo Atomics|0.10|2.7"      # energy     — reactor face, before the insert
  "Figure|10.85|2.05"          # robotics   — shoulder actuator
  "Anduril|11.45|2.6"          # aerospace  — airframe
  "Exowatt|9.65|3.5"           # energy     — array from above
  "Hark|2.80|1.95"             # software   — emissive forms on black
  "Apptronik|25.90|3.15"       # robotics   — humanoid to camera
  "Quaise Energy|15.65|3.5"    # energy     — industrial hall
  "Starcloud|8.50|3.5"         # space      — orbital array
  "Aalo Atomics|7.83|1.45"     # energy     — pool, deep blue
  "Figure|27.10|2.45"          # robotics   — joints
  "Shield AI|9.60|3.5"         # aerospace  — formation at dusk
  "Aalo Atomics|13.08|1.7"     # energy     — molten pour
  "1X|0.10|2.9"                # robotics   — head, tight
  "OpenAI|10.35|2.35"          # software   — keyboard and terminal
  "Unspun|19.25|1.2"           # industrial — thread array (15.5-17.7 is defocused)
  "Quaise Energy|22.95|3.5"    # energy     — facility
  "Shield AI|20.45|3.5"        # aerospace  — airframe, low
  "Apptronik|20.45|1.85"       # robotics   — workbench
)

inputs=()
filters=""
labels=""
i=0
for shot in "${SHOTS[@]}"; do
  IFS='|' read -r name start dur <<< "$shot"
  inputs+=(-ss "$start" -t "$dur" -i "$SRC/$name.mp4")
  # Uniform normalisation: cover-crop to 16:9, exact-area downscale to the
  # shader's 480x270, constant 24fps, square pixels.
  filters+="[$i:v]scale=480:270:force_original_aspect_ratio=increase:flags=area,crop=480:270,fps=24,setsar=1,format=yuv420p[v$i];"
  labels+="[v$i]"
  i=$((i+1))
done

ffmpeg -v error -y "${inputs[@]}" \
  -filter_complex "${filters}${labels}concat=n=$i:v=1:a=0[out]" \
  -map "[out]" -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf "$CRF" -preset veryslow \
  -movflags +faststart "$OUT"

echo "shots: $i"
ffprobe -v error -show_entries format=duration,bit_rate -of default=nw=1 "$OUT"
