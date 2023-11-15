const { app, BrowserWindow, ipcMain, systemPreferences, Menu, shell } = require('electron');
const path = require("path");
const initDatabase = require("./Modules/database");
const DataHandler = require('./Modules/DataHandler');
const config = require('./app.config');

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

	initiateContextMenus(mainWindow);
	mainWindow.maximize();

	if (config.buildHTML) mainWindow.loadFile(config.buildHTMLPath);
	else mainWindow.loadURL('http://localhost:3000');
	if (config.openDevTools) mainWindow.webContents.openDevTools();

	mainWindow.webContents.on('did-finish-load', function() {
		//TODO: make a alert interface
		//mainWindow.webContents.send('add-alert', new Alert('started succesfully but with minor hiccups', Alert.NOTICE))
	});
}

function testLog(item) {
	console.log(item)
}

function initiateContextMenus(mainWindow) {
	ipcMain.on('show-image-context-menu', (event, file) => {
		const defaultTagOptions = [
			{ label: 'Analyze Picture' },
			{ label: 'Manage Tags' },
			{ type: 'separator' },
		];
		const tagButtons = file.tags.map(tag => {
			return {
				label: tag.name,
				type: 'checkbox',
				checked: true,
				click: () => {
					console.log('toggle tag');
					this.checked = false;
				},
			}
		});
		const template = [
			{
				label: 'Test (File ' + file.id + ')',
				click: () => {
					testLog(file);
					event.sender.send('context-menu-command', 'menu-item-1')
				},
			},
			{ label: 'Move' },
			{ label: 'Copy' },
			{ label: 'Copy Path' },
			{ label: 'Rename' },
			{ label: 'Delete', enabled: false },
			{ type: 'separator' },
			{ label: 'Tags', type: 'submenu', submenu: defaultTagOptions.concat(tagButtons) },
			{ type: 'separator' },
			{ label: 'Open', click: () => {
				shell.openPath(file.path + path.sep + file.name);
			} },
			{ label: 'Open in Explorer', click: () => {
				shell.showItemInFolder(file.path + path.sep + file.name);
			} },
			{ label: 'Properties' },
		];
		const menu = Menu.buildFromTemplate(template)
		menu.popup(mainWindow)//BrowserWindow.fromWebContents(event.sender))
	});

	ipcMain.on('show-folder-context-menu', (event, folder) => {
		const template = [
			{
				label: 'Test (Folder ' + folder.id + ')',
				click: () => {
					testLog(folder);
					event.sender.send('context-menu-command', 'menu-item-1')
				}
			},
			{ label: 'Move', role: 'normal' },
			{ label: 'Copy', role: 'normal' },
			{ label: 'Copy Path', role: 'normal' },
			{ label: 'Rename', role: 'normal' },
			{ label: 'Delete', role: 'normal' },
			{ type: 'separator' },
			{ label: 'Manage Tags', role: 'normal' },
			{ type: 'separator' },
			{ label: 'Open with...', role: 'normal' },
			{ label: 'Open in Explorer', role: 'normal' },
		];
		const menu = Menu.buildFromTemplate(template)
		menu.popup(mainWindow)//BrowserWindow.fromWebContents(event.sender))
	})
}

function createHandlers() {
	ipcMain.handle('dialog:openFile', DataHandler.handleFileOpen);
	ipcMain.handle('dialog:updateFolderpathWithDialog', (event, folderId) => {
		return DataHandler.handleUpdateFolderpathWithDialog(folderId)
	});
	ipcMain.handle('database:getFolders', DataHandler.handleGetFolders);
	ipcMain.handle('database:getFoldersNotEmpty', DataHandler.handleGetFoldersNotEmpty);
	ipcMain.handle('database:getFiles', DataHandler.handleGetFiles);
	ipcMain.handle('database:getTags', DataHandler.handleGetTags);
	ipcMain.handle('database:getCollection', DataHandler.handleGetCollection);
	ipcMain.handle('system:getAccent', handleAccent);
	ipcMain.handle('database:getFoldersByFolder', (event, folderId) => {
		return DataHandler.handleGetFoldersByFolder(folderId)
	});
	ipcMain.handle('database:getGetFileById', (event, fileId) => {
		return DataHandler.handleGetFileById(fileId)
	});
	ipcMain.handle('database:getFilesByFolder', (event, folderId) => {
		return DataHandler.handleGetFilesByFolder(folderId)
	});
	ipcMain.handle('database:getFilesByTags', (event, tags) => {
		return DataHandler.handleGetFilesByTags(tags)
	});
	ipcMain.handle('database:getTagsByFolder', (event, folder) => {
		return DataHandler.handleGetTagsByFolder(folder)
	});
	ipcMain.handle('database:saveTag', (event, tag, fileId) => {
		DataHandler.handleSaveTag(tag, fileId)
	});
	ipcMain.handle('database:deleteFolder', (event, folder) => {
		DataHandler.handleDeleteFolder(folder)
	});
	ipcMain.handle('database:deleteTag', (event, tagId, fileId) => {
		DataHandler.handleDeleteTag(tagId, fileId)
	});
	ipcMain.handle('database:saveViewToCollection', (event, viewMode, name, filterOptions) => {
		DataHandler.handleSaveViewToCollection(viewMode, name, filterOptions)
	});
	ipcMain.handle('database:updateCollection', (event, collection) => {
		DataHandler.handleUpdateCollection(collection)
	});
	ipcMain.handle('database:deleteCollection', (event, collection) => {
		DataHandler.handleDeleteCollection(collection)
	});
}

app.on("ready", () => {
	createHandlers();
	createWindow();
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
});

app.on('window-all-closed', () => {
	if (process.platform !== PLATFORMS.MACOS) app.quit();
});
