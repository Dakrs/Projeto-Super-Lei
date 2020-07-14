const path = require('path');
const { BrowserWindow } = require('electron');
const Positioner = require('electron-positioner');


class LoginWindow {
    constructor() {
      this.window = new BrowserWindow({
        width: 350,
        height: 400,
        titleBarStyle: 'hidden',
        movable: true,
        resizable: false,//false
        webPreferences: {
          //nodeIntegration: false,
          preload: LOGIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
          contextIsolation: true,
        },
        show: false,
      })
      this.window.loadURL(LOGIN_WINDOW_WEBPACK_ENTRY);
      this.window.webContents.openDevTools();
    }
}


module.exports = LoginWindow;
