const { NFC } = require('nfc-pcsc');

class NFCService {
  constructor() {
    this.nfc = new NFC();
    this.isConnected = false;
    this.currentReader = null;
    this.lastUID = null;
    this._busy = false;

    this._init();
  }

  _init() {
    this.nfc.on('reader', async (reader) => {
      this.currentReader = reader;
      this.isConnected = true;

      // ACR122U specific initialization for macOS compatibility
      try {
        console.log('Initializing ACR122U reader...');
        // Disable LED and buzzer
        await reader.transmit(Buffer.from([0xFF, 0x00, 0x52, 0x00, 0x00]), 40);
        // Load authentication keys directly (bypass the load command issue)
        // This pre-loads keys into the reader's volatile memory
        const vendorKey = Buffer.from([0xD3, 0xF7, 0xD3, 0xF7, 0xD3, 0xF7]);
        const standardKey = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);
        
        // Load key into slot 0 (vendor key)
        await reader.transmit(Buffer.concat([
          Buffer.from([0xFF, 0x82, 0x00, 0x00, 0x06]),
          vendorKey
        ]), 40);
        
        // Load key into slot 1 (standard key)
        await reader.transmit(Buffer.concat([
          Buffer.from([0xFF, 0x82, 0x00, 0x01, 0x06]),
          standardKey
        ]), 40);
        
        console.log('ACR122U initialized successfully');
      } catch (err) {
        console.log('ACR122U init warning (may not be critical):', err.message);
      }

      reader.on('card', (card) => {
        this.lastUID = card?.uid || null;
        reader.card = card;
      });

      reader.on('card.off', () => {
        this.lastUID = null;
        reader.card = null;
      });

      reader.on('error', (_err) => {});
      reader.on('end', () => {
        this.isConnected = false;
        this.currentReader = null;
        this.lastUID = null;
      });
    });

    this.nfc.on('error', (_err) => {
      this.isConnected = false;
      this.currentReader = null;
      this.lastUID = null;
    });
  }

  getCurrentUID() { return this.lastUID || null; }

  async _withLock(fn) {
    if (this._busy) throw new Error('Busy');
    this._busy = true;
    try { return await fn(); } finally { this._busy = false; }
  }

  // key sequence: Vendor (D3 F7 ...) then standard (FF ...)
  async _authenticateBlock(block = 4) {
    if (!this.currentReader) throw new Error('NFC Reader nicht verbunden');
    if (!this.currentReader.card) throw new Error('Keine Karte auf dem Reader');
    
    const reader = this.currentReader;
    
    // Use direct APDU authentication command instead of reader.authenticate()
    // This bypasses the "load authentication key" issue on macOS
    const keys = [
      { key: Buffer.from([0xD3, 0xF7, 0xD3, 0xF7, 0xD3, 0xF7]), slot: 0 },
      { key: Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), slot: 1 }
    ];
    
    let lastErr = null;
    for (const { key, slot } of keys) {
      try {
        // Method 1: Try using pre-loaded key from slot
        const authCmd = Buffer.from([
          0xFF, 0x86, 0x00, 0x00, 0x05,  // APDU: Authenticate with stored key
          0x01,                           // Version
          0x00,                           // Byte 2 (MSB of block)
          block,                          // Block number
          0x60,                           // Key type A
          slot                            // Key slot number (0 or 1)
        ]);
        
        const response = await reader.transmit(authCmd, 40);
        // Check for success (90 00)
        if (response.length >= 2 && response[response.length - 2] === 0x90 && response[response.length - 1] === 0x00) {
          console.log(`Authenticated block ${block} with key slot ${slot}`);
          return true;
        }
      } catch (e) {
        console.log(`Auth attempt with slot ${slot} failed:`, e.message);
        
        // Method 2: Try direct key load and authenticate
        try {
          // Load key into volatile memory
          await reader.transmit(Buffer.concat([
            Buffer.from([0xFF, 0x82, 0x00, slot, 0x06]),
            key
          ]), 40);
          
          // Authenticate using that key
          const authCmd = Buffer.from([
            0xFF, 0x86, 0x00, 0x00, 0x05,
            0x01, 0x00, block, 0x60, slot
          ]);
          const response = await reader.transmit(authCmd, 40);
          
          if (response.length >= 2 && response[response.length - 2] === 0x90 && response[response.length - 1] === 0x00) {
            console.log(`Authenticated block ${block} with direct key load`);
            return true;
          }
        } catch (e2) {
          lastErr = e2;
        }
      }
    }
    
    throw lastErr || new Error('Authentication failed for all keys');
  }

  async readTag() {
    if (!this.currentReader) throw new Error('NFC Reader nicht verbunden');
    return this._withLock(async () => {
      await this._authenticateBlock(4);
      const data = await this.currentReader.read(4, 16, 16);
      const material = data[0] || 0;
      const color = data[1] || 0;
      const manufacturer = data[2] || 1;
      return { material, color, manufacturer, rawData: Array.from(data) };
    });
  }

  async writeTag(materialCode, colorCode, manufacturerCode = 1) {
    if (!this.currentReader) throw new Error('NFC Reader nicht verbunden');
    return this._withLock(async () => {
      await this._authenticateBlock(4);
      const buf = Buffer.alloc(16, 0x00);
      buf[0] = Number(materialCode) || 0;
      buf[1] = Number(colorCode) || 0;
      buf[2] = Number(manufacturerCode) || 1;
      await this.currentReader.write(4, buf, 16);
      return true;
    });
  }

  getStatus() {
    return {
      connected: this.isConnected,
      readerName: this.currentReader ? this.currentReader.reader.name : null,
      cardPresent: !!(this.currentReader && this.currentReader.card),
      uid: this.lastUID
    };
  }
}

module.exports = NFCService;