const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require("path");
const fs = require('fs');
const initDatabase = require("./database");
//const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const { handleFileOpen, handleGetFolders, handleSaveTag, handleGetTags } = require('../src/Modules/DataHandler');

initDatabase.initDatabase();

const PLATFORMS = {
	MACOS: 'darwin',
	WINDOWS: 'win',
	LINUX: 'linux',
}

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: path.join(__dirname, './preload.js'),
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
	//mainWindow.loadURL('http://localhost:3000');
	mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
	//installExtension(REACT_DEVELOPER_TOOLS, {loadExtensionOptions: {allowFileAccess: true}})
	//	.then((name) => console.log(`Added Extension: ${name}`))
	//	.catch((err) => console.log('An error occurred: ', err));
	ipcMain.handle('dialog:openFile', handleFileOpen);
	ipcMain.handle('database:getFolders', handleGetFolders);
	ipcMain.handle('database:getTags', handleGetTags);
	ipcMain.handle('database:saveTag', (event, tag, fileId) => {
		console.log(tag, fileId)
		handleSaveTag(tag, fileId)
	});
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== PLATFORMS.MACOS) app.quit();
})
