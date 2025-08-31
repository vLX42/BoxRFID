/* Generate Windows .ico and PNG app icon from assets/source-icon.png
   Usage:
     1) npm i -D sharp png-to-ico
     2) Place your PNG at assets/source-icon.png
     3) node tools/generate-icons-from-png.js
   Output:
     - assets/icon.ico   (used by electron-builder for EXE/Installer)
     - assets/icon.png   (256x256, used by BrowserWindow icon)

   Change note:
   - Generates icons WITHOUT any border (randlos), with a rounded white background by default.
     Set BG_STYLE = 'gradient' for a gradient background or 'none' for transparent background.
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Handle ESM/CJS interop for png-to-ico (v2 CJS vs v3 ESM default)
let pngToIco;
try {
  const mod = require('png-to-ico');
  pngToIco = mod && (mod.default || mod);
} catch (e) {
  console.error('Failed to load "png-to-ico". Make sure it is installed: npm i -D png-to-ico');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'assets', 'source-icon.png');
const OUT_DIR = path.join(ROOT, 'assets');
const TMP_DIR = path.join(OUT_DIR, 'tmp-icons');

// Config
const BG_ADD = true;                     // true = draw rounded background behind your PNG
const BG_STYLE = 'white';                // 'white' | 'gradient' | 'none'
const BG_COLOR = '#FFFFFF';              // used when BG_STYLE === 'white'
const BG_GRAD_TOP = '#2b84b8';           // used when BG_STYLE === 'gradient'
const BG_GRAD_BOTTOM = '#1b5e8a';        // used when BG_STYLE === 'gradient'
const BG_RADIUS = 180;                   // corner radius (for 1024 canvas), scales for other sizes
const CONTENT_SCALE = 0.76;              // how large your PNG appears inside the square (0..1)
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]; // sizes included into .ico
const MASTER_SIZE = 1024;                // master canvas size
const APP_PNG_SIZE = 256;                // icon.png size

function bgSvg(size) {
  const radius = Math.round((BG_RADIUS / 1024) * size);
  if (BG_STYLE === 'none') {
    // Transparent full-blank canvas (handled elsewhere), return minimal SVG
    return Buffer.from(
      `<?xml version="1.0" encoding="UTF-8"?>
       <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"></svg>`
    );
  }
  if (BG_STYLE === 'white') {
    return Buffer.from(
      `<?xml version="1.0" encoding="UTF-8"?>
       <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
         <!-- Rounded white background, NO border -->
         <rect x="${size*0.0625}" y="${size*0.0625}" width="${size*0.875}" height="${size*0.875}"
               rx="${radius}" fill="${BG_COLOR}"/>
       </svg>`
    );
  }
  // Gradient background, NO border
  return Buffer.from(
    `<?xml version="1.0" encoding="UTF-8"?>
     <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stop-color="${BG_GRAD_TOP}"/>
           <stop offset="100%" stop-color="${BG_GRAD_BOTTOM}"/>
         </linearGradient>
       </defs>
       <rect x="${size*0.0625}" y="${size*0.0625}" width="${size*0.875}" height="${size*0.875}"
             rx="${radius}" fill="url(#g)"/>
     </svg>`
  );
}

async function composeOnBackground(size) {
  const bg = await sharp(bgSvg(size)).png().toBuffer();

  // Load and fit source PNG
  const contentSize = Math.round(size * CONTENT_SCALE);
  const content = await sharp(SRC)
    .resize(contentSize, contentSize, { fit: 'contain', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const margin = Math.round((size - contentSize) / 2);
  return sharp(bg)
    .composite([{ input: content, left: margin, top: margin }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function renderBase(size) {
  if (!BG_ADD || BG_STYLE === 'none') {
    // Use PNG as-is, letterboxed into square (transparent background)
    const contentSize = Math.round(size * CONTENT_SCALE);
    const content = await sharp(SRC)
      .resize(contentSize, contentSize, { fit: 'contain', withoutEnlargement: true })
      .png()
      .toBuffer();

    const margin = Math.round((size - contentSize) / 2);
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: content, left: margin, top: margin }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  }
  // With rounded background (white or gradient), no border
  return composeOnBackground(size);
}

(async () => {
  try {
    if (!fs.existsSync(SRC)) {
      throw new Error(`Source PNG not found at ${SRC}. Place your image as assets/source-icon.png`);
    }
    if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

    // 1) Build master image
    const masterPng = await renderBase(MASTER_SIZE);
    const masterPath = path.join(TMP_DIR, `icon-${MASTER_SIZE}.png`);
    fs.writeFileSync(masterPath, masterPng);

    // 2) Downscale to ICO sizes
    const icoPngBuffers = [];
    for (const s of ICO_SIZES) {
      const p = path.join(TMP_DIR, `icon-${s}.png`);
      const buf = await sharp(masterPng)
        .resize(s, s, { fit: 'cover' })
        .png({ compressionLevel: 9 })
        .toBuffer();
      fs.writeFileSync(p, buf);
      icoPngBuffers.push(buf); // pass buffers to png-to-ico
    }

    // 3) Create ICO
    const icoBuffer = await pngToIco(icoPngBuffers);
    const icoOut = path.join(OUT_DIR, 'icon.ico');
    fs.writeFileSync(icoOut, icoBuffer);

    // 4) Create app PNG (256x256)
    const appPngOut = path.join(OUT_DIR, 'icon.png');
    const appBuf = await sharp(masterPng)
      .resize(APP_PNG_SIZE, APP_PNG_SIZE, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(appPngOut, appBuf);

    console.log('Icons generated (borderless background):');
    console.log(' -', icoOut);
    console.log(' -', appPngOut);
    console.log('Temporary PNGs are in', TMP_DIR);
    if (BG_STYLE === 'white') {
      console.log('Background: rounded white square (no border).');
    } else if (BG_STYLE === 'gradient') {
      console.log('Background: rounded gradient square (no border).');
    } else {
      console.log('Background: none (transparent).');
    }
  } catch (err) {
    console.error('Icon generation failed:', err);
    process.exit(1);
  }
})();