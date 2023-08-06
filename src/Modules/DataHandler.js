const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const Folder = require("./Folder");
const File = require("./File");
const { FolderRepository } = require('../Repositories/FolderRepository');
//const { FileRepository } = require('../Repositories/FileRepository');
const { TagRepository } = require('../Repositories/TagRepository');
const { CollectionRepository } = require('../Repositories/CollectionRepository');

const folderRepository = new FolderRepository();
//const fileRepository = new FileRepository();
const tagRepository = new TagRepository();

async function handleFileOpen() {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ['openDirectory'],
	});
	if (!canceled) {
		const directory = getDirectoriesRecursive(filePaths[0]);
		folderRepository.saveFolder(directory);
		return folderRepository.getFolders();
	}
}

async function handleGetFolders() {
	return folderRepository.getFolders();
}

async function handleSaveTag(tag, fileId) {
	tagRepository.saveTag(tag, fileId)
}

async function handleDeleteTag(tagId, fileId) {
	tagRepository.deleteTag(tagId, fileId);
}

async function handleGetTags() {
	return tagRepository.getTags();
}

async function handleSaveFolderToCollection(folderId) {
	new CollectionRepository().saveToCollection(folderId)
}

async function handleGetCollection() {
	return new CollectionRepository().getCollection();
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
	handleSaveFolderToCollection,
	handleGetCollection,
};