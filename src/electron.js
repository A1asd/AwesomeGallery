const { app, BrowserWindow, ipcMain, systemPreferences } = require('electron');
const path = require("path");
const initDatabase = require("./Modules/database");
const DataHandler = require('./Modules/DataHandler');

const config = {
	buildHTML: true,
	buildHTMLPath: path.join(__dirname, "../build/index.html"),
	openDevTools: true,
};

const accentColor = systemPreferences.getAccentColor();
initDatabase.initDatabase();

function handleAccent() {
	return accentColor;
}

const PLATFORMS = {
	MACOS: 'darwin',
	WINDOWS: 'win',
	LINUX: 'linux',
}

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: path.join(__dirname, './preload.js'),
		},
	});

	if (config.buildHTML) mainWindow.loadFile(config.buildHTMLPath);
	else mainWindow.loadURL('http://localhost:3000');
	if (config.openDevTools) mainWindow.webContents.openDevTools();
}

app.on("ready", () => {
	ipcMain.handle('dialog:openFile', DataHandler.handleFileOpen);
	ipcMain.handle('database:getFolders', DataHandler.handleGetFolders);
	ipcMain.handle('database:getTags', DataHandler.handleGetTags);
	ipcMain.handle('database:getCollection', DataHandler.handleGetCollection);
	ipcMain.handle('system:getAccent', handleAccent);
	ipcMain.handle('database:saveTag', (event, tag, fileId) => {
		DataHandler.handleSaveTag(tag, fileId)
	});
	ipcMain.handle('database:deleteTag', (event, tagId, fileId) => {
		DataHandler.handleDeleteTag(tagId, fileId)
	});
	ipcMain.handle('database:saveFolderToCollection', (event, folderId) => {
		DataHandler.handleSaveFolderToCollection(folderId)
	});
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== PLATFORMS.MACOS) app.quit();
});
