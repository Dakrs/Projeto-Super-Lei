const path = require('path');
const { BrowserWindow } = require('electron');
const Positioner = require('electron-positioner');


class ApiURLWindow {
    constructor(url,par) {
      this.window = new BrowserWindow({
        width: 600,
        height: 450,
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
      //this.window.webContents.openDevTools();
      /**
      this.window.once('ready-to-show', () => {
        this.window.show();
        par.window.hide();
      });

      this.window.on('closed',() => {
        par.window.show();
      })*/
    }
}


module.exports = ApiURLWindow;
