const { ipcRenderer } = require('electron')
const Store = require('electron-store');

window.ipcRenderer = ipcRenderer
window.Store = Store

/**
console.log('welel');

ipcRenderer.on('testing',(event,arg) => {
  console.log(arg);
})

ipcRenderer.send('test','ests');*/
