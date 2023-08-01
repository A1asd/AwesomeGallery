const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require("path");
const fs = require('fs');
const initDatabase = require("./database");
//const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

initDatabase.initDatabase();

const PLATFORMS = {
	MACOS: 'darwin',
	WINDOWS: 'win',
	LINUX: 'linux',
}

async function handleFileOpen() {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ['openDirectory'],
	});
	if (!canceled) {
		const directory = getDirectoriesRecursive(filePaths[0]);
		return {
			parent: filePaths[0].split(path.sep).pop(),
			folders: directory[1],//directory.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name),
			files: directory[2],//directory.filter(dirent => dirent.isFile()).map(dirent => dirent.name),
			absolute: directory[3],
		}
	}
}

async function handleGetFolders() {
	return initDatabase.getFolders();
}

function getDirectories(srcpath) {
	return fs.readdirSync(srcpath, { withFileTypes:true })
		.map(dirent => path.join(srcpath, dirent.name))
		.filter(path => fs.statSync(path).isDirectory());
}

function getFiles(srcpath) {
	return fs.readdirSync(srcpath)
		//.map(dirent => path.join(srcpath, dirent.name))
		.filter(dirent => fs.statSync(path.join(srcpath, dirent)).isFile());
}

function getDirectoriesRecursive(srcpath) {
	let splitPath = srcpath.split(path.sep);
	return [splitPath[splitPath.length-1], getDirectories(srcpath).map(getDirectoriesRecursive), getFiles(srcpath), srcpath];
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
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== PLATFORMS.MACOS) app.quit();
})
