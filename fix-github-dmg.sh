#!/usr/bin/env bash
#
# Fix "App is damaged" error for BoxRFID downloaded from GitHub
# This removes macOS quarantine attributes that prevent the app from opening
#

set -e

APP_PATH="/Applications/BoxRFID – Filament Tag Manager.app"

echo "🔧 Fixing BoxRFID app downloaded from GitHub..."
echo ""

if [ ! -d "$APP_PATH" ]; then
    echo "❌ Error: App not found at $APP_PATH"
    echo ""
    echo "Please install the app first:"
    echo "  1. Open the DMG file"
    echo "  2. Drag 'BoxRFID – Filament Tag Manager' to /Applications"
    echo "  3. Run this script again"
    exit 1
fi

echo "📍 Found app at: $APP_PATH"
echo ""

echo "🔓 Removing quarantine attributes..."
sudo xattr -cr "$APP_PATH"

echo "✅ Done! Quarantine attributes removed."
echo ""

echo "🔐 Applying ad-hoc code signature..."
sudo codesign --force --deep --sign - "$APP_PATH" 2>/dev/null || true

echo ""
echo "✅ All done! You can now open the app:"
echo "   • Right-click the app in Applications"
echo "   • Select 'Open'"
echo "   • Click 'Open' in the security dialog"
echo ""
echo "Or run: open '$APP_PATH'"
echo ""
