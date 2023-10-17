const { contextBridge, ipcRenderer } = require('electron');
const { shell } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
	openFile: () => ipcRenderer.invoke('dialog:openFile'),
	updateFolderpathWithDialog: (folderId) => ipcRenderer.invoke('dialog:updateFolderpathWithDialog', folderId),
	getFolders: () => ipcRenderer.invoke('database:getFolders'),
	getFiles: () => ipcRenderer.invoke('database:getFiles'),
	getFoldersNotEmpty: () => ipcRenderer.invoke('database:getFoldersNotEmpty'),
	getFileById: (fileId) => ipcRenderer.invoke('database:getFileById', fileId),
	getFoldersByFolder: (folderId) => ipcRenderer.invoke('database:getFoldersByFolder', folderId),
	getFilesByFolder: (folderId) => ipcRenderer.invoke('database:getFilesByFolder', folderId),
	getFilesByTags: (tags) => ipcRenderer.invoke('database:getFilesByTags', tags),
	deleteFolder: (folder) => ipcRenderer.invoke('database:deleteFolder', folder),
	getTags: () => ipcRenderer.invoke('database:getTags'),
	getTagsByFolder: (folderId) => ipcRenderer.invoke('database:getTagsByFolder', folderId),
	saveTag: (tag, fileId) => ipcRenderer.invoke('database:saveTag', tag, fileId),
	deleteTag: (tagId, fileId) => ipcRenderer.invoke('database:deleteTag', tagId, fileId),
	saveViewToCollection: (viewMode, name, filterOptions) => ipcRenderer.invoke('database:saveViewToCollection', viewMode, name, filterOptions),
	getCollection: () => ipcRenderer.invoke('database:getCollection'),
	getAccent: () => ipcRenderer.invoke('system:getAccent'),

	//TODO: (node:25420) MaxListenersExceededWarning: Possible EventEmitter memory leak detected
	onAddAlert: (callback) => ipcRenderer.on('add-alert', callback),
	onRemoveAlert: (callback) => ipcRenderer.on('remove-alert', callback),

	// invoke in renderer like: window.myAPI.openFileInFolder('C:\\Users\\Johann\\Pictures\\Avatare\\nochzumachen\\gut als profile pic\\fE1bPC6.png')
	openFileInFolder: (filePath) => shell.showItemInFolder(filePath),
	openFileWithViewer: (filePath) => shell.openPath(filePath),
});
