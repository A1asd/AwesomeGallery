const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
	openFile: () => ipcRenderer.invoke('dialog:openFile'),
	getFolders: () => ipcRenderer.invoke('database:getFolders'),
	getTags: () => ipcRenderer.invoke('database:getTags'),
	saveTag: (tag, fileId) => ipcRenderer.invoke('database:saveTag', tag, fileId),
	deleteTag: (tagId, fileId) => ipcRenderer.invoke('database:deleteTag', tagId, fileId),
	getAccent: () => ipcRenderer.invoke('system:getAccent'),
});
