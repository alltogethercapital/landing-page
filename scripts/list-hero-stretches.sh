#!/bin/bash
# List every continuous stretch of at least MINLEN seconds across the company
# masters — i.e. every span with no scene change inside it. These are the only
# safe places to take a montage shot from.
#
# Usage: scripts/list-hero-stretches.sh [minlen]
set -uo pipefail

SRC="/Users/hishamel-husseini/Documents/projects/alltogethercapital/heesh/processed-video"
MIN="${1:-1.5}"

for f in "$SRC"/*.mp4; do
  name=$(basename "$f" .mp4)
  case "$name" in Homepage|Anthropic) continue ;; esac
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  ffmpeg -nostdin -hide_banner -i "$f" -filter:v "select='gt(scene,0.12)',showinfo" -f null - 2>&1 \
    | grep -oE "pts_time:[0-9.]+" | sed 's/pts_time://' \
    | awk -v n="$name" -v d="$dur" -v m="$MIN" '
        BEGIN{p=0}
        { if ($1-p >= m) printf "%-18s %6.2f -> %6.2f   (%.2fs)\n", n, p, $1, $1-p; p=$1 }
        END{ if (d-p >= m) printf "%-18s %6.2f -> %6.2f   (%.2fs)\n", n, p, d, d-p }'
done
