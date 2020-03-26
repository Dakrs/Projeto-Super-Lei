const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const LoadingWindow = require('./Electron/LoadingWindow');
const MainWindow = require('./Electron/MainWindow');
import setIpc from './MainIpc';
var mongoose = require('mongoose');

/****************************
 * MONGO CONNECTION
 ****************************/
const DATABASE_NAME = 'Access';

mongoose.connect('mongodb://127.0.0.1:27017/' + DATABASE_NAME, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to Mongo at [${DATABASE_NAME}] database...`))
  .catch((erro) => console.log(`Mongo: Error connecting to [${DATABASE_NAME}]: ${erro}`))


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let loadwin = null;
let mainwin = null;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  loadwin = new LoadingWindow();

  loadwin.window.once('show',() => {
    mainwin = new MainWindow();
    mainwin.window.once('ready-to-show',() => {
      mainwin.window.show();
      loadwin.window.hide();
      loadwin.window.close();
    });
  });
  loadwin.window.show();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
setIpc();
