#!/bin/bash
# Genererar assets/icon.icns från assets/icon.png (kräver 1024x1024 PNG)

set -e

SRC="assets/icon.png"
ICONSET="assets/icon.iconset"
OUT="assets/icon.icns"

if [ ! -f "$SRC" ]; then
  echo "Fel: $SRC saknas. Lägg en 1024x1024 PNG där."
  exit 1
fi

mkdir -p "$ICONSET"

sips -z 16   16   "$SRC" --out "$ICONSET/icon_16x16.png"
sips -z 32   32   "$SRC" --out "$ICONSET/icon_16x16@2x.png"
sips -z 32   32   "$SRC" --out "$ICONSET/icon_32x32.png"
sips -z 64   64   "$SRC" --out "$ICONSET/icon_32x32@2x.png"
sips -z 128  128  "$SRC" --out "$ICONSET/icon_128x128.png"
sips -z 256  256  "$SRC" --out "$ICONSET/icon_128x128@2x.png"
sips -z 256  256  "$SRC" --out "$ICONSET/icon_256x256.png"
sips -z 512  512  "$SRC" --out "$ICONSET/icon_256x256@2x.png"
sips -z 512  512  "$SRC" --out "$ICONSET/icon_512x512.png"
cp "$SRC"               "$ICONSET/icon_512x512@2x.png"

iconutil -c icns "$ICONSET" --output "$OUT"
rm -rf "$ICONSET"

echo "✓ $OUT skapad"
