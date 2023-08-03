const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const initDatabase = require("../../public/database");
const Folder = require("./Folder");
const File = require("./File")

async function handleFileOpen() {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ['openDirectory'],
	});
	if (!canceled) {
		const directory = getDirectoriesRecursive(filePaths[0]);
		let root = new Folder(
			filePaths[0].split(path.sep).pop(),
			directory.parent,
			directory.folders,
			directory.files
		)
		return root
	}
}

async function handleGetFolders() {
	let folders = initDatabase.getFolders();
	console.log(folders);
	return folders;
}

function getDirectories(srcpath) {
	return fs.readdirSync(srcpath, { withFileTypes:true })
		.map(dirent => path.join(srcpath, dirent.name))
		.filter(path => fs.statSync(path).isDirectory());
}

function getFiles(srcpath) {
	return fs.readdirSync(srcpath)
		//.map(dirent => path.join(srcpath, dirent.name))
		.filter(dirent => fs.statSync(path.join(srcpath, dirent)).isFile())
		.map(filepath => new File(filepath, srcpath));
}

function getDirectoriesRecursive(srcpath) {
	let name = srcpath.split(path.sep).pop();
	return new Folder(
		name,
		srcpath,
		getDirectories(srcpath).map(getDirectoriesRecursive),
		getFiles(srcpath)
	)
}

module.exports = { handleFileOpen, handleGetFolders};