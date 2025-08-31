const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const NFCService = require('./nfc-service');

let mainWindow;
const nfcService = new NFCService();

let isBusy = false;

// Auto-read state
let autoEnabled = false;
let autoLoop = null;
let lastAutoUID = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 800,
    minWidth: 600,                 // min width 600
    minHeight: 800,                // min height 800
    backgroundColor: '#ffffff',    // white background
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: process.platform === 'win32'
    ? path.join(__dirname, 'assets', 'icon.ico')  // Windows: .ico
    : path.join(__dirname, 'assets', 'icon.png'), // Linux/macOS: .png
    title: 'QIDI RFID Tag Writer/Reader',
    show: false,
    autoHideMenuBar: true
  });

  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => mainWindow.show());

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

function sendAutoStatus(payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('rfid-auto-status', payload);
  }
}

function startAutoLoop() {
  if (autoLoop) return;
  autoLoop = setInterval(async () => {
    try {
      if (!autoEnabled) return;
      if (isBusy) return;

      const uid = nfcService.getCurrentUID();
      if (uid && uid !== lastAutoUID) {
        // New tag appeared or changed
        isBusy = true;
        try {
          const data = await nfcService.readTag();
          lastAutoUID = uid;
          sendAutoStatus({ present: true, tagData: data, error: null });
        } catch (err) {
          sendAutoStatus({ present: true, tagData: null, error: err.message || String(err) });
        } finally {
          isBusy = false;
        }
      } else if (!uid && lastAutoUID) {
        // Tag removed
        lastAutoUID = null;
        sendAutoStatus({ present: false, tagData: null, error: null });
      }
    } catch (err) {
      // On unexpected error, mark as not present
      lastAutoUID = null;
      sendAutoStatus({ present: false, tagData: null, error: err.message || String(err) });
    }
  }, 200); // fast, responsive
}

function stopAutoLoop() {
  if (autoLoop) {
    clearInterval(autoLoop);
    autoLoop = null;
  }
  lastAutoUID = null;
}

// IPC handlers: RFID
ipcMain.handle('rfid-write', async (_event, { materialCode, colorCode, manufacturerCode }) => {
  if (isBusy) return { success: false, message: 'Busy' };
  isBusy = true;
  try {
    await nfcService.writeTag(
      parseInt(materialCode, 10),
      parseInt(colorCode, 10),
      parseInt(manufacturerCode || 1, 10)
    );
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message || String(err) };
  } finally {
    isBusy = false;
  }
});

ipcMain.handle('rfid-read', async () => {
  if (isBusy) return { success: false, message: 'Busy' };
  isBusy = true;
  try {
    const data = await nfcService.readTag();
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message || String(err) };
  } finally {
    isBusy = false;
  }
});

ipcMain.handle('rfid-status', () => {
  return nfcService.getStatus();
});

ipcMain.handle('rfid-auto', async (_event, { enable }) => {
  autoEnabled = !!enable;
  if (autoEnabled) {
    startAutoLoop();
    // If a tag is already present, try a first read immediately
    const uid = nfcService.getCurrentUID();
    if (uid) {
      if (!isBusy) {
        isBusy = true;
        try {
          const data = await nfcService.readTag();
          lastAutoUID = uid;
          sendAutoStatus({ present: true, tagData: data, error: null });
        } catch (err) {
          sendAutoStatus({ present: true, tagData: null, error: err.message || String(err) });
        } finally {
          isBusy = false;
        }
      }
    }
  } else {
    stopAutoLoop();
    sendAutoStatus({ present: false, tagData: null, error: null });
  }
  return { enabled: autoEnabled };
});

// IPC handlers: File dialog and file system access for official cfg
ipcMain.handle('dialog:openFile', async (event, options = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    ...options
  });
  return result; // { canceled: boolean, filePaths: string[] }
});

ipcMain.handle('fs:readFile', async (_event, { path: filePath, encoding = 'utf8' }) => {
  const data = await fsp.readFile(filePath, { encoding });
  return data.toString();
});

ipcMain.handle('fs:exists', async (_event, { path: filePath }) => {
  try {
    await fsp.access(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
});

// Window controls (optional)
ipcMain.handle('minimize-window', () => mainWindow && mainWindow.minimize());
ipcMain.handle('maximize-window', () => mainWindow && mainWindow.maximize());
ipcMain.handle('close-window', () => mainWindow && mainWindow.close());

// App lifecycle
app.whenReady().then(() => {
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('web-contents-created', (_event, contents) => {
  contents.on('new-window', (navigationEvent) => navigationEvent.preventDefault());
});