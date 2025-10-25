#!/bin/bash
# Helper script to install and run BoxRFID on macOS
# This script handles the Gatekeeper security prompt

echo "BoxRFID macOS Installation Helper"
echo "==================================="
echo ""

# Find the DMG file
if [ -f "dist/BoxRFID – Filament Tag Manager-1.0.0-arm64.dmg" ]; then
    DMG_FILE="dist/BoxRFID – Filament Tag Manager-1.0.0-arm64.dmg"
    echo "Found ARM64 (Apple Silicon) version"
elif [ -f "dist/BoxRFID – Filament Tag Manager-1.0.0.dmg" ]; then
    DMG_FILE="dist/BoxRFID – Filament Tag Manager-1.0.0.dmg"
    echo "Found x64 (Intel) version"
else
    echo "Error: No DMG file found in dist/ folder"
    echo "Please run 'npm run build-mac' first"
    exit 1
fi

echo ""
echo "To install BoxRFID:"
echo "1. Double-click: $DMG_FILE"
echo "2. Drag 'BoxRFID – Filament Tag Manager.app' to the Applications folder"
echo "3. When you first open it, macOS will show a security warning"
echo ""
echo "To bypass the security warning:"
echo "   Option A (Easy): Right-click the app → Select 'Open' → Click 'Open' in the dialog"
echo "   Option B (Command): Run this command:"
echo "   sudo xattr -cr '/Applications/BoxRFID – Filament Tag Manager.app'"
echo ""
echo "Opening DMG now..."
open "$DMG_FILE"
echo ""
echo "After installation, if the app won't open due to security:"
echo "Run: sudo xattr -cr '/Applications/BoxRFID – Filament Tag Manager.app'"
