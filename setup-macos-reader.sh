#!/usr/bin/env bash
set -euo pipefail

echo "== BoxRFID macOS NFC Reader Setup =="

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew not found. Install from https://brew.sh first." >&2
  exit 1
fi

echo "[1/5] Installing core dependencies (git node python pkg-config)"
brew install git node python pkg-config || true

echo "[2/5] PC/SC is built into macOS - no additional drivers needed for most readers"
echo "If reader not detected, macOS will use built-in CCID driver"

echo "[3/5] Checking Xcode Command Line Tools"
if ! xcode-select -p >/dev/null 2>&1; then
  echo "Requesting installation of Xcode Command Line Tools..."
  xcode-select --install || true
else
  echo "Xcode Command Line Tools already installed."
fi

echo "[4/5] USB enumeration (looking for ACR/ACS)"
system_profiler SPUSBDataType 2>/dev/null | grep -i -A3 'acr' || echo "No ACR122U found in system_profiler (if connected, try replugging)."

echo "[5/5] Reader detection test"
echo "The app uses Electron's Node runtime, not system Node."
echo "To test if reader works: Run 'NODE_ENV=development npm start'"
echo "If reader is plugged in, you should see a green connection indicator."

echo "\nIf the reader was not detected:"
echo " 1. Replug it (avoid hubs)"
echo " 2. Check USB with: system_profiler SPUSBDataType | grep -i acr"
echo " 3. See README macOS NFC section"
echo
echo "== Setup Complete =="