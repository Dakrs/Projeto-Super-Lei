const path = require('path');
const { BrowserWindow } = require('electron');
const Positioner = require('electron-positioner');


class GoogleURLWindow {
    constructor(url,par) {
      this.window = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'hidden',
        movable: true,
        resizable: false,
        /**
        webPreferences: {
          //nodeIntegration: false,
          preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },*/
        show: false,
        modal: true,
        parent: par,
      })
      this.window.loadURL(url);
      this.window.webContents.openDevTools();
    }
}


module.exports = GoogleURLWindow;
