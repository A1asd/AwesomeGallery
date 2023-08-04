const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
	openFile: () => ipcRenderer.invoke('dialog:openFile'),
	getFolders: () => ipcRenderer.invoke('database:getFolders'),
	saveTag: (tag, fileId) => ipcRenderer.invoke('database:saveTag', tag, fileId),
	getTags: () => ipcRenderer.invoke('database:getTags'),
});
