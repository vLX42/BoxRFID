#!/usr/bin/env bash
set -euo pipefail

echo "== BoxRFID macOS NFC Reader Diagnostic =="

# 1. Basic environment
echo "\n[Node/Electron Versions]"
node -v || echo "Node not found"

# 2. USB enumeration
echo "\n[USB Enumeration for ACR/ACS]"
system_profiler SPUSBDataType 2>/dev/null | grep -i -A5 'acr' || echo "No ACR122-like device found via system_profiler"

echo "\n[ioreg Vendor/Product IDs]"
ioreg -p IOUSB -l 2>/dev/null | grep -i 'acr' -A4 | grep -E 'idVendor|idProduct' || echo "No matching ioreg entries"

# 3. pcscd status
echo "\n[pcscd Process Status]"
pgrep -fl pcscd || echo "pcscd not listed (may still be managed by launchd)"

# 4. pcsc-tools check
echo "\n[pcsc_scan check]"
echo "pcsc_scan not available on macOS Homebrew (macOS uses built-in PC/SC)"

# 5. Note about Electron vs System Node
echo "\n[Node nfc-pcsc detection]"
echo "Note: System Node is v$(node -v) but Electron uses its own Node runtime."
echo "The native module must be tested via 'npm start' (Electron) not direct Node."
echo "To test reader: Run 'NODE_ENV=development npm start' and check app console."

# 6. Recent pcsc logs (requires macOS unified logging)
echo "\n[Recent pcscd log lines (last 3m)]"
log show --last 3m 2>/dev/null | grep -i pcscd | tail -n 20 || echo "No recent pcscd log lines"

echo "\n== Diagnostic Complete =="
