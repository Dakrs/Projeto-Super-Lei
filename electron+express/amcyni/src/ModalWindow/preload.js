const { ipcRenderer,contextBridge } = require('electron')
import API_MAIN from '../MainWindow/Ipc';

contextBridge.exposeInMainWorld(
  'API',
  {
    GOOGLE_URL: API_MAIN.getGOOGLEURL,
    OUTLOOK_URL: API_MAIN.getOUTLOOKURL,
    close_modal: () => ipcRenderer.send('close-modal'),
  }
)
