#!/bin/bash
# Validate every shot window in build-hero-montage.sh against the source cuts.
#
# Several of these clips contain inserts as short as two frames — a lab
# technician spliced into a reactor sequence, for example. A window that spans
# one of those produces a jump cut in the montage, and sampling frames at 1-2fps
# steps straight over them. This checks the actual scene-change list instead.
#
# Written for the bash 3.2 that ships with macOS: no mapfile, no associative
# arrays.
set -uo pipefail

SRC="/Users/hishamel-husseini/Documents/projects/alltogethercapital/heesh/processed-video"
HERE="$(cd "$(dirname "$0")" && pwd)"
CACHE=$(mktemp -d)
trap 'rm -rf "$CACHE"' EXIT

fail=0
count=0

# Pull the shot list out of the build script so the two cannot drift apart.
sed -n '/^SHOTS=(/,/^)/p' "$HERE/build-hero-montage.sh" \
  | grep -oE '"[^"]+\|[0-9.]+\|[0-9.]+"' | tr -d '"' > "$CACHE/shots"

while IFS='|' read -r name start dur; do
  [ -z "$name" ] && continue
  count=$((count + 1))
  safe=$(echo "$name" | tr -c 'A-Za-z0-9' '_')
  if [ ! -f "$CACHE/$safe" ]; then
    # -nostdin matters: ffmpeg would otherwise consume the loop's input and eat
    # the first character of the next shot line.
    ffmpeg -nostdin -hide_banner -i "$SRC/$name.mp4" \
      -filter:v "select='gt(scene,0.12)',showinfo" -f null - 2>&1 \
      | grep -oE "pts_time:[0-9.]+" | sed 's/pts_time://' > "$CACHE/$safe"
  fi
  end=$(awk -v s="$start" -v d="$dur" 'BEGIN{printf "%.3f", s+d}')
  inside=$(awk -v s="$start" -v e="$end" '$1 > s+0.04 && $1 < e-0.04 {printf "%.3f ", $1}' "$CACHE/$safe")
  if [ -n "$inside" ]; then
    printf '  CUT INSIDE  %-16s %6ss +%-5ss   cuts at: %s\n' "$name" "$start" "$dur" "$inside"
    fail=1
  else
    printf '  clean       %-16s %6ss +%-5ss\n' "$name" "$start" "$dur"
  fi
done < "$CACHE/shots"

echo
if [ "$fail" -eq 1 ]; then
  echo "FAIL: at least one window spans a cut in its source clip."
  exit 1
fi
echo "OK: all $count windows sit inside a single continuous shot."
