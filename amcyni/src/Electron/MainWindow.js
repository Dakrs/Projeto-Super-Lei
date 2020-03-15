const path = require('path');
const { BrowserWindow } = require('electron');
const Positioner = require('electron-positioner');


class MainWindow {
    constructor() {
      this.window = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'hidden',
        movable: true,
        resizable: false,
        webPreferences: {
          nodeIntegration: true,
        },
        show: false,
      })

      this.window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
      this.window.webContents.openDevTools();
    }
}


module.exports = MainWindow;
