# BoxRFID – Filament Tag Manager

BoxRFID is a cross-platform desktop app (Electron) to read and write NFC/RFID tags used by QIDI Box, a multi color System for QIDI Plus 4 and QIDI Q2 3D printers. It lets you set material, color, and manufacturer codes (not yet supported by QIDI Box, Maybe in future), read tags, and auto‑read when a tag is detected.

- Platform: Windows, macOS, Linux (Electron)
- Version: 1.0.0
- License: CC BY‑NC‑SA 4.0

**macOS Support:** Special thanks to [LexyGuru](https://github.com/LexyGuru) for the macOS compatibility modifications.

## Features
- Write filament data (material, color, manufacturer) to compatible tags
- Read and display tag data
- Auto‑read mode when a tag is presented; clears when removed
- Multi language support (DE, EN, FR, ES, PT, ZH)
- Support Import of "officiall_filas_list.cfg" - optional
- Support edit / delete filaments from Filament list and Vendor list
- Uses PC/SC (nfc-pcsc) for reader support (tested with ACR122U)

## REQUIREMENTS
- ACR122U USB reader/writer (i.e. https://www.amazon.com/ACR122U-Contactless-Reader-Lianshi-Writer/dp/B07DK9GX1N)
- Mifare classic 1K tags (i.e. https://www.amazon.com/BABIQT-Sticker-Classic-Self-Adhesive-Stickers/dp/B0BZRS35CT)

## 🚀 DOWNLOAD & START!

> **IMPORTANT:**  
> You do **not** need to compile the code yourself!  
> Simply download the latest binaries directly from the release page:
>
> 👉 **[BoxRFID v1.0.0 – Download](https://github.com/TinkerBarn/BoxRFID/releases/tag/v1.0.0)**
>
> Available platforms:
> - **Windows:** EXE installer and portable version
> - **macOS:** DMG files for Intel (x64) and Apple Silicon (ARM64)
> - **Linux:** AppImage and DEB packages
>
> This allows you to get started right away, without setting up a development environment.


## HOW TO USE DIY RFID FILAMENT SPOOLS WITH THE QIDI BOX

- Curious how it works in practice?  
  Check out this short YouTube video and see how effortlessly you can switch filament spools using DIY RFID tags with your QIDI Box:

[![Watch the video](https://img.youtube.com/vi/LO6eAkdcSCA/hqdefault.jpg)](https://youtu.be/LO6eAkdcSCA)


## SCREENSHOTS
- Main Menu

![Main Menu](screenshots/Main%20Menu%20v1.0.0.png)


- Read tag Information and Show result

![Read Tag Information](screenshots/Read%20Tag%20Information%20v1.0.0.png)


- Write tag Information - ABS and Dark Blue selected - Write successfully

![Write Tag Information](screenshots/Write%20Tag%20Information%20v1.0.0.png)


- Setup Language

![Setup - Language](screenshots/Setup%20-%20Language%20v1.0.0.png)


- Setup Materials

![Setup - Materials](screenshots/Setup%20-%20Materials%20v1.0.0.png)


- Setup Manufacturers - only available if in Setup - General activated

![Setup - Manufacturers](screenshots/Setup%20-%20Manufacturers%20v1.0.0.png)


- Setup General

![Setup - General](screenshots/Setup%20-%20General%20v1.0.0.png)



## Windows Development Setup (PowerShell)

This guide will walk you through setting up a complete development environment for BoxRFID on Windows, and building your own EXE from the code.  
It is designed for users with little or no prior experience in Node.js or Electron development.

---

### **Prerequisites**

- **Operating System:** Windows 10 or 11  
- **Terminal:** PowerShell (default on Windows)
- **Admin Rights:** You may need administrator rights to install software

---

### **Step 1: Install Necessary Tools**

Open PowerShell as an administrator and run the following commands one by one.  
This will install Git (for downloading code) and Node.js LTS (needed to build and run Electron apps):

```powershell
winget install -e --id Git.Git
winget install -e --id OpenJS.NodeJS.LTS
```

If you get errors, make sure [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) is available, or install the tools manually from their websites.

---

### **Step 2: Download the BoxRFID Code**

Clone (download) the source code from GitHub:

```powershell
git clone https://github.com/TinkerBarn/BoxRFID.git
cd BoxRFID
```

---

### **Step 3: Install Project Dependencies**

Install the required packages using npm (Node Package Manager):

```powershell
npm install
```

---

### **Step 4: (Optional) Generate Application Icons**

If you want to customize or regenerate the app icon, place a square PNG (ideally 1024x1024) at `assets\source-icon.png`, then run:

```powershell
npm i -D sharp png-to-ico
node tools/generate-icons-from-png.js
```

If you don't need to change the icon, you can skip this step.

---

### **Step 5: Run the App in Development Mode**

You can test and develop the app before building the EXE:

```powershell
$env:NODE_ENV="development"
npm run dev
```

This will start the app in development mode. If you see errors about missing dependencies, double-check you ran `npm install`.

---

### **Step 6: Build the Windows Executable (EXE)**

To compile the app and create the Windows installer and portable EXE, run:

```powershell
npm run build-win
```

After building, you will find the following files in the `dist\` folder:

- `BoxRFID – Filament Tag Manager Setup 1.0.0.exe` (Windows installer)
- `BoxRFID – Filament Tag Manager 1.0.0.exe` (portable, runs without installation)

---

### **Notes & Troubleshooting**

- The EXE/installer icon is set in `assets/icon.ico`. If you change the icon, rebuild the EXE.
- If you have issues with permissions, try running PowerShell as Administrator.
- Some antivirus programs may flag newly built EXE files. This is a common false positive for Electron apps you build yourself.
- If you want to update the code, run `git pull` in the `BoxRFID` folder, then repeat the build steps.

---

### **Further Reading**

- [Electron Documentation](https://www.electronjs.org/docs)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [npm Documentation](https://docs.npmjs.com/)

---

## macOS Development Setup

This guide will walk you through setting up a development environment for BoxRFID on macOS, and building your own DMG from the code.

---

### **Prerequisites**

- **Operating System:** macOS 10.15 (Catalina) or later  
- **Terminal:** Terminal.app or iTerm2
- **Admin Rights:** You may need administrator rights to install software
- **System Dependencies:** Python, pkg-config, and PC/SC Lite for NFC support

---

### **Step 1: Install Necessary Tools**

Open Terminal and install the required tools using Homebrew (install Homebrew first if you don't have it):

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Git, Node.js, and system dependencies
brew install git node python pkg-config pcsc-lite
```

Alternatively, you can download and install Node.js directly from [nodejs.org](https://nodejs.org/).

---

### **Step 2: Download the BoxRFID Code**

Clone (download) the source code from GitHub:

```bash
git clone https://github.com/TinkerBarn/BoxRFID.git
cd BoxRFID
```

---

### **Step 3: Install Project Dependencies**

Install the required packages using npm (Node Package Manager):

```bash
npm install
```

---

### **Step 4: (Optional) Generate Application Icons**

If you want to customize or regenerate the app icons, place a square PNG (ideally 1024x1024) at `assets/source-icon.png`, then run:

```bash
npm install -D sharp png-to-ico
node tools/generate-icons-from-png.js
```

If you don't need to change the icons, you can skip this step.

---

### **Step 5: Run the App in Development Mode**

You can test and develop the app before building the DMG:

```bash
NODE_ENV=development npm run dev
```

This will start the app in development mode. If you see errors about missing dependencies, double-check you ran `npm install`.

---

### **Step 6: Build the macOS Executable (DMG)**

To compile the app and create the macOS app, run:

```bash
npm run build-mac
```

After building, you will find the following files in the `dist/` folder:

- `BoxRFID – Filament Tag Manager-1.0.0-arm64.dmg` (Apple Silicon M1, M2, etc.)
- `BoxRFID – Filament Tag Manager 1.0.0.dmg` (Intel x64)

---

### **Notes & Troubleshooting**

- The macOS app icon comes from `assets/AppIcon.icns`. If you change the icon, rebuild the DMG.
- **macOS Security Warning:** Since this is a self-built app (not signed with a Developer ID certificate), macOS will show a security warning when you first try to open it.
  
  **To bypass the security warning:**
  - **Method 1 (Easiest):** Right-click the app in Applications → Select "Open" → Click "Open" in the dialog
  - **Method 2 (Command line):** Run this command in Terminal:
    ```bash
    sudo xattr -cr '/Applications/BoxRFID – Filament Tag Manager.app'
    ```
  - **Method 3 (Helper script):** Run `./install-macos.sh` from the project directory for guided installation

- **If you get "App is damaged and can't be opened"** (common with GitHub releases):
  ```bash
  # This removes the quarantine flag that macOS adds to downloaded files
  sudo xattr -cr '/Applications/BoxRFID – Filament Tag Manager.app'
  
  # If still not working, also run:
  sudo codesign --force --deep --sign - '/Applications/BoxRFID – Filament Tag Manager.app'
  ```
  
  **Why this happens:** Apps downloaded from GitHub aren't notarized by Apple. This is normal for open-source builds. Local builds don't have this issue.
- If you have issues with permissions, you may need to allow the app in System Settings > Privacy & Security.
- If you get errors about missing PC/SC Lite during build, make sure you installed the system dependencies: `brew install pkg-config pcsc-lite`
- If native module compilation fails, you may need to install Xcode Command Line Tools: `xcode-select --install`
- If you want to update the code, run `git pull` in the `BoxRFID` folder, then repeat the build steps.
- **Note**: The `--publish never` flag in the build script prevents electron-builder from trying to publish to GitHub releases, which avoids the GH_TOKEN error during local builds.

---

### **Further Reading**

- [Electron Documentation](https://www.electronjs.org/docs)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [npm Documentation](https://docs.npmjs.com/)

---

## Creating Releases (GitHub)

The repository includes automated GitHub Actions workflows that build DMG files for macOS when you create a new release.

> **💡 Code Signing**: By default, builds are unsigned (free). To enable code signing and avoid the "damaged app" warning, see [CODE_SIGNING_SETUP.md](CODE_SIGNING_SETUP.md) for instructions. Requires Apple Developer Account ($99/year).

### **How to Create a Release**

1. **Push your changes** to the `main` branch
2. **Go to your GitHub repository** in a web browser
3. **Click "Releases"** in the right sidebar (or go to `https://github.com/vLX42/BoxRFID/releases`)
4. **Click "Draft a new release"**
5. **Create a tag** (e.g., `v1.0.1`, `v1.1.0`) - must start with `v`
6. **Fill in release details**:
   - Release title (e.g., "Version 1.0.1")
   - Description (what's new, bug fixes, etc.)
7. **Click "Publish release"**

### **What Happens Automatically**

When you publish a release, GitHub Actions will:
- ✅ Trigger the build workflow
- ✅ Build DMG files for both **x64** (Intel) and **ARM64** (Apple Silicon)
- ✅ Automatically attach both DMG files to your release
- ✅ Make them available for download

You can check the build progress in the **Actions** tab of your repository.

### **Manual Trigger**

You can also trigger builds manually:
1. Go to the **Actions** tab in your repository
2. Select **"Build macOS App"**
3. Click **"Run workflow"**
4. Choose the branch and click **"Run workflow"**

---

## macOS NFC Reader Setup & Troubleshooting

### 🚀 Quick Start: 5-Minute Setup

**What you need:**
- ACR122U USB NFC reader
- macOS 12.0 or later
- 5 minutes

**Setup flowchart:**
```
1. Plug in reader → USB port
2. Verify detection → system_profiler command
3. Install app → Download DMG or build
4. Launch app → Right-click "Open" (first time)
5. Test tag → Place on reader
✅ Green light = Success!
```

---

### Quick Start Guide: Getting USB NFC Reader Working on macOS

This step-by-step guide will help you get your ACR122U USB NFC reader working with the BoxRFID app on macOS.

#### Prerequisites
- ACR122U NFC reader (or compatible PC/SC reader)
- macOS 12.0 or later
- USB-A port (or USB-C adapter)

#### Step 1: Physical Connection
1. **Plug in the reader** directly to a USB port on your Mac
   - ⚠️ **Important**: Use a direct USB port, not through a hub (initially)
   - Make sure you're using a **data cable**, not a charge-only cable
   
2. **Verify USB detection**:
   ```bash
   system_profiler SPUSBDataType | grep -i "acr"
   ```
   
   **Expected output** (something like):
   ```
   ACS ACR122U PICC Interface:
     Product ID: 0x2200
     Vendor ID: 0x072f (Advanced Card Systems Ltd.)
   ```
   
   ✅ If you see this, your reader is physically detected!  
   ❌ If nothing appears, try:
   - Different USB port
   - Different USB cable
   - Restart your Mac

#### Step 2: Verify PC/SC Service (Built into macOS)

macOS includes a built-in PC/SC service (no installation needed). To verify it's working:

```bash
# Check if pcscd is running
pgrep -fl pcscd
```

**What you should see**: Either a process number or nothing (it starts on-demand)

**Note**: You do **NOT** need to install anything from Homebrew for basic functionality. macOS handles PC/SC automatically.

#### Step 3: Install the App

Choose one of these methods:

**Option A: Use Pre-built DMG** (Recommended)
1. Download the DMG from [Releases](https://github.com/vLX42/BoxRFID/releases)
   - Choose **ARM64** for Apple Silicon (M1/M2/M3/M4)
   - Choose **x64** for Intel Macs
2. Open the DMG file
3. Drag the app to `/Applications`
4. **Important:** Remove quarantine attributes (required for GitHub releases):
   
   **Easy method** - Download and run the fix script:
   ```bash
   curl -O https://raw.githubusercontent.com/vLX42/BoxRFID/main/fix-github-dmg.sh
   chmod +x fix-github-dmg.sh
   ./fix-github-dmg.sh
   ```
   
   **Manual method:**
   ```bash
   sudo xattr -cr '/Applications/BoxRFID – Filament Tag Manager.app'
   ```
   
5. Right-click the app and select "Open" (first time only, to bypass Gatekeeper)

**Option B: Build from Source**
```bash
# Clone and build
git clone https://github.com/vLX42/BoxRFID.git
cd BoxRFID
npm install
npm run build-mac

# Install the built DMG
open dist/*.dmg
```

#### Step 4: First Launch

1. **Open the app** (remember to right-click → Open on first launch)

2. **Check for security prompts**:
   - macOS may show a security warning
   - Go to **System Settings → Privacy & Security**
   - Click **"Open Anyway"** if the app is blocked

3. **Look for the connection indicator** in the app:
   - 🟢 Green = Reader connected
   - 🔴 Red = Reader not connected

#### Step 5: Test Tag Reading

1. **Place an NFC tag** on the reader (flat on top, centered)
2. The reader should detect it automatically
3. Tag UID should appear in the app

#### Troubleshooting: "Read error: NFC Reader nicht verbunden"

If you see this error, the app can't detect your reader. Try these steps in order:

**Quick Fixes:**
1. **Unplug and replug** the reader (wait 5 seconds)
2. **Restart the app**
3. **Try a different USB port**

**If still not working:**

Run the diagnostic script:
```bash
cd /path/to/BoxRFID
./diagnose-reader-macos.sh
```

This will show:
- ✅ USB device detection
- ✅ PC/SC daemon status  
- ✅ Reader vendor/product IDs
- ✅ Recent system logs

**Common Issues:**

| Symptom | Solution |
|---------|----------|
| Reader not in USB list | Try different cable/port, restart Mac |
| "Authentication failed" error | This is now fixed in v1.0.0+ with APDU commands |
| Red light stays on | Normal - ACR122U LED indicates power |
| Reader works in dev mode but not built app | Rebuild app: `npm run build-mac` |

#### Step 6: Advanced Setup (Only if needed)

Most users won't need this, but if you want additional tools:

```bash
# Install optional PC/SC tools
brew install pcsc-tools

# Test reader directly
pcsc_scan
# Press Ctrl+C to stop
```

If `pcsc_scan` shows your reader and detects cards, but the app doesn't work, try:
```bash
# Run app in development mode to see console logs
NODE_ENV=development npm start
# Check console for error messages
```

#### Step 7: Verify It's Working

✅ **You're all set if:**
- Green connection indicator in the app
- Placing a tag shows the UID
- You can read/write tags successfully

🎉 **Success!** You can now read and write QIDI filament tags.

---

### Detailed Troubleshooting

If the quick start didn't work, here's more detailed troubleshooting:

### 1. Hardware Check
1. Plug the ACR122U directly into a USB port (avoid unpowered hubs initially).
2. Use a known-good USB cable (data capable, not charge-only).
3. Run:
  ```bash
  system_profiler SPUSBDataType | grep -A5 -i "acr"
  ```
  You should see an entry like `ACS ACR122U PICC Interface`.

### 2. PC/SC Service (pcscd) Verification
macOS ships a built‑in PC/SC daemon. In most cases you do NOT need to install `pcsc-lite` from Homebrew. Before adding extra components, verify the built‑in service:
```bash
log stream --predicate 'process == "pcscd"' --info | grep -i acr &
sleep 3; # plug or replug reader while this runs
```
Stop with Ctrl+C once you see enumeration messages.

### 3. Optional: Install Open Source Drivers & Tools
If the reader does not appear, you can install the open‑source stack and tools:
```bash
brew install ccid pcsc-tools
```
Then test detection:
```bash
pcsc_scan
```
`pcsc_scan` should list the reader and when you place a tag it should show ATR changes. If this works, the app should also detect cards.

### 4. Confirm Vendor / Product IDs
The genuine ACR122U typically reports Vendor ID `0x072F` and Product ID `0x2200`.
Check via:
```bash
ioreg -p IOUSB -l | grep -i "acr" -A4 | grep -E "idVendor|idProduct"
```
If IDs are different (clone devices sometimes vary), it should still work, but note the variance when troubleshooting.

### 5. Common Causes of "Reader nicht verbunden"
| Cause | Fix |
|-------|-----|
| Reader not enumerated | Replug, try different port, avoid hubs |
| PC/SC daemon not responding | Reboot macOS; avoid running a second Homebrew pcscd concurrently |
| Missing CCID driver (rare on modern macOS) | `brew install ccid` |
| Permissions / first-use security prompt | Open System Settings > Privacy & Security and allow app if blocked |
| Faulty cable / insufficient power | Change cable or use powered hub |

### 6. Testing Outside the App
The diagnostic scripts test with system Node, but the app uses Electron's bundled Node. To test reader detection:
```bash
# Quick test in development mode (best approach)
NODE_ENV=development npm start
# Watch console for reader connection messages

# Alternative: Check if reader visible to system
system_profiler SPUSBDataType | grep -i acr
```

### 7. Card Placement Tips
The ACR122U antenna is usually near the top surface under the logo. If reads intermittently:
- Try placing tag flat and still for 1–2 seconds.
- Rotate 180° or flip if detection fails.
- Avoid metallic surfaces directly under the reader.

### 8. Reset / Recover Sequence
If everything appears stuck:
```bash
killall pcscd 2>/dev/null || true
sudo launchctl stop com.apple.pcscd 2>/dev/null || true
sudo launchctl start com.apple.pcscd
unplug && replug the reader
pcsc_scan
```

### 9. Diagnostic Script
You can run the helper script to collect basic info:
```bash
./diagnose-reader-macos.sh
./setup-macos-reader.sh   # (alternative) performs install + quick detection
```
It will print USB enumeration, pcscd status, and attempt a minimal Node detection run.

### 10. ACR122U Authentication on macOS

**Note**: Versions 1.0.0+ include fixes for ACR122U authentication issues on macOS.

The app now uses direct APDU commands to:
- Pre-load authentication keys into the reader during initialization
- Authenticate using vendor-specific commands that bypass macOS PC/SC limitations
- Automatically retry with fallback methods if first authentication fails

If you're using an older version and seeing "Could not load authentication key" errors:
1. Update to the latest version
2. Or rebuild from source: `npm run build-mac`

The authentication process now:
- Loads keys (D3F7... vendor key and FFFF... standard key) into reader memory slots
- Uses APDU command `0xFF 0x86` for direct authentication
- Falls back to reloading keys if authentication fails
- Validates response codes (90 00 = success)

This fix specifically addresses ACR122U readers on macOS where the standard PC/SC `authenticate()` function doesn't work reliably.

### 10. When It Still Fails
Gather output from:
```bash
pcsc_scan
node -e 'const { NFC } = require("nfc-pcsc"); new NFC()'
log show --last 5m | grep -i pcscd
```
Then compare with working examples or open an issue with logs attached.

### Summary (Quick Fix Path)
1. Plug reader directly → verify with `system_profiler`.
2. Install tools: `brew install pcsc-tools` → run `pcsc_scan`.
3. If missing: install `brew install ccid`.
4. Use diagnostic script if still failing.
5. Confirm the app now shows connection (green indicator).
 6. (Optional) Run `./setup-macos-reader.sh` for automated steps.

---



## Notes
- EXE/installer icon comes from electron-builder `build.win.icon` → `assets/icon.ico`
- macOS App/icon comes from electron-builder `build.mac.icon` → `assets/AppIcon.icns`
- Window/taskbar icon set in `main.js`:
  ```js
  icon: process.platform === 'win32'
    ? path.join(__dirname, 'assets', 'icon.ico')
    : path.join(__dirname, 'assets', 'icon.png')
  ```

## Folder structure (excerpt)
```
assets/
  AppIcon.icns           # macOS app icon
  icon.ico
  icon.png
  source-icon.png        # optional input for generator
  tmp-icons/             # ignored
build/
  entitlements.mac.plist # macOS entitlements
tools/
  generate-icons-from-png.js
main.js
preload.js
index.html
package.json
```

## License
Creative Commons Attribution‑NonCommercial‑ShareAlike 4.0 International (CC BY‑NC‑SA 4.0).
For commercial licensing, contact: boxrfid@tinkerbarn.de.

## About
BoxRFID is a desktop app (Electron) to read and write NFC/RFID tags for QIDI Box multi color system. Modified for macOS compatibility by [LexyGuru](https://github.com/LexyGuru).
