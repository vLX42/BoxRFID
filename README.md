# BoxRFID – Filament Tag Manager

BoxRFID is a Windows desktop app (Electron) to read and write NFC/RFID tags used by QIDI Box, a multi color System for QIDI Plus 4 and QIDI Q2 3D printers. It lets you set material, color, and manufacturer codes (not yet supported by QIDI Box, Maybe in future), read tags, and auto‑read when a tag is detected.

- Platform: Windows (Electron)
- Version: 1.0.0
- License: CC BY‑NC‑SA 4.0

## Features
- Write filament data (material, color, manufacturer) to compatible tags
- Read and display tag data
- Auto‑read mode when a tag is presented; clears when removed
- Multi language support (DE, EN, FR, ES, PT, ZH)
- Support Import of "officiall_filas_list.cfg" - optional
- Support edit / delete filaments from Filament list and Vendor list
- Uses PC/SC (nfc-pcsc) for reader support (tested with ACR122U)


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


## Windows development setup (PowerShell)

Prerequisites:
- Windows 10/11, PowerShell

Install tools:
```powershell
winget install -e --id Git.Git
winget install -e --id OpenJS.NodeJS.LTS
```

Clone and install:
```powershell
git clone https://github.com/TinkerBarn/BoxRFID.git
cd BoxRFID
npm install
```

Generate app icons (optional if already present):
```powershell
# Place a square PNG (ideally 1024x1024) at: assets\source-icon.png
npm i -D sharp png-to-ico
node tools/generate-icons-from-png.js
```

Run in development:
```powershell
$env:NODE_ENV="development"
npm run dev
```

Build for Windows:
```powershell
npm run build-win
# Outputs in dist\
# - BoxRFID – Filament Tag Manager Setup 1.0.0.exe (installer)
# - BoxRFID – Filament Tag Manager 1.0.0.exe (portable, no setup)
```

Notes:
- EXE/installer icon comes from electron-builder `build.win.icon` → `assets/icon.ico`
- Window/taskbar icon set in `main.js`:
  ```js
  icon: process.platform === 'win32'
    ? path.join(__dirname, 'assets', 'icon.ico')
    : path.join(__dirname, 'assets', 'icon.png')
  ```

## Folder structure (excerpt)
```
assets/
  icon.ico
  icon.png
  source-icon.png        # optional input for generator
  tmp-icons/             # ignored
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
