# macOS Installation and Troubleshooting Guide

## How to Install BoxRFID on macOS

### Step 1: Mount the DMG
1. Double-click the DMG file appropriate for your Mac:
   - **Apple Silicon (M1/M2/M3/M4):** `BoxRFID – Filament Tag Manager-1.0.0-arm64.dmg`
   - **Intel:** `BoxRFID – Filament Tag Manager-1.0.0.dmg`

### Step 2: Install the Application
1. Drag the app icon to the Applications folder
2. Eject the DMG

### Step 3: First Launch
**You will encounter a security warning because this is a self-built app.**

## Common Errors and Solutions

### Error: "BoxRFID cannot be opened because the developer cannot be verified"

This is the most common error with self-built apps on macOS.

**Solution 1 (Easiest - Recommended):**
1. Open Finder and go to Applications
2. Find "BoxRFID – Filament Tag Manager"
3. Right-click (or Control-click) the app
4. Select "Open" from the menu
5. Click "Open" in the security dialog
6. The app will now launch and you won't see this warning again

**Solution 2 (Command Line):**
```bash
sudo xattr -cr '/Applications/BoxRFID – Filament Tag Manager.app'
```

**Solution 3 (Terminal - Advanced):**
```bash
# Remove quarantine attribute and re-sign
sudo xattr -cr '/Applications/BoxRFID – Filament Tag Manager.app'
sudo codesign --force --deep --sign - '/Applications/BoxRFID – Filament Tag Manager.app'
```

### Error: "BoxRFID is damaged and can't be opened"

This usually happens when macOS Gatekeeper is blocking the app.

**Solution:**
```bash
sudo xattr -cr '/Applications/BoxRFID – Filament Tag Manager.app'
sudo codesign --force --deep --sign - '/Applications/BoxRFID – Filament Tag Manager.app'
```

Then try opening the app again.

### Error: The app opens but NFC reader doesn't work

**Solution:**
1. Make sure your ACR122U or compatible NFC reader is connected
2. Install PC/SC Lite support (if not already installed):
   ```bash
   brew install pcsc-lite
   ```
3. Check if the PC/SC daemon is running:
   ```bash
   sudo launchctl list | grep pcscd
   ```

### Error: "Operation not permitted" when trying to access NFC reader

**Solution:**
You may need to grant permissions:
1. Go to System Settings (or System Preferences)
2. Navigate to Privacy & Security
3. Look for any BoxRFID permissions requests
4. Grant the necessary permissions

### Build Errors

#### Error during `npm run build-mac`: "node-gyp failed to rebuild"

**Solution:**
Make sure you have all dependencies installed:
```bash
# Install build dependencies
brew install python pkg-config pcsc-lite

# Install Xcode Command Line Tools
xcode-select --install

# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build-mac
```

#### Error: "Cannot find module"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Uninstalling BoxRFID

To completely remove BoxRFID from your Mac:

```bash
# Remove the application
sudo rm -rf '/Applications/BoxRFID – Filament Tag Manager.app'

# Remove user data (if any)
rm -rf ~/Library/Application\ Support/BoxRFID
rm -rf ~/Library/Preferences/com.tinkerbarn.BoxRFID.plist
rm -rf ~/Library/Saved\ Application\ State/com.tinkerbarn.BoxRFID.savedState
```

## Helper Script

Use the included `install-macos.sh` script for guided installation:

```bash
./install-macos.sh
```

This script will:
- Find the correct DMG for your system
- Open it for you
- Provide clear instructions for handling security warnings

## Why These Security Warnings Happen

macOS has a security feature called **Gatekeeper** that requires apps to be signed with a valid Apple Developer ID certificate. Since this is a self-built app (or built without a paid Apple Developer account), it doesn't have this signature.

This is **completely normal** for self-built Electron apps and doesn't mean there's anything wrong with the application. You're simply telling macOS that you trust this app that you built yourself.

## Still Having Issues?

1. Check the build log: `cat build.log` (if you captured build output)
2. Make sure you're using the correct DMG for your Mac architecture
3. Verify all system dependencies are installed: `brew list | grep -E 'pcsc|pkg-config'`
4. Try building with: `npm run build-mac 2>&1 | tee build.log`

## Support

For issues specific to the BoxRFID application, please refer to the main README.md or contact: boxrfid@tinkerbarn.de
