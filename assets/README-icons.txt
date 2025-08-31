Place your source PNG as: assets/source-icon.png
Then run:
  npm i -D sharp png-to-ico
  node tools/generate-icons-from-png.js

Outputs:
  - assets/icon.ico  (used by electron-builder for the EXE/Installer)
  - assets/icon.png  (256x256, used by BrowserWindow)