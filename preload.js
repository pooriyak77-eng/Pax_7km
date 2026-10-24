const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('quoteApi', {
  get: (symbols) => ipcRenderer.invoke('quotes', symbols)
});
