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
		initDatabase.saveFolder(directory);
		return initDatabase.getFolders();
	}
}

async function handleGetFolders() {
	let folders = initDatabase.getFolders();
	return folders;
}

async function handleSaveTag(tag, fileId) {
	initDatabase.saveTag(tag, fileId);
}

async function handleDeleteTag(tagId, fileId) {
	initDatabase.deleteTag(tagId, fileId);
}

async function handleGetTags() {
	return initDatabase.getTags();
}

function getDirectories(srcpath) {
	return fs.readdirSync(srcpath, { withFileTypes:true })
		.map(dirent => path.join(srcpath, dirent.name))
		.filter(path => fs.statSync(path).isDirectory());
}

function getFiles(srcpath) {
	return fs.readdirSync(srcpath)
		.filter(dirent => fs.statSync(path.join(srcpath, dirent)).isFile())
		.map(filepath => new File(filepath, srcpath));
}

function getDirectoriesRecursive(srcpath) {
	let name = srcpath.split(path.sep).pop();
	return new Folder(
		name,
		srcpath,
		srcpath,
		getDirectories(srcpath).map(getDirectoriesRecursive),
		getFiles(srcpath)
	)
}

module.exports = {
	handleFileOpen,
	handleGetFolders,
	handleSaveTag,
	handleGetTags,
	handleDeleteTag,
};