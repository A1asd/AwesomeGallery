const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const Folder = require("./Folder");
const File = require("./File");
const { FolderRepository } = require('../Repositories/FolderRepository');
const { TagRepository } = require('../Repositories/TagRepository');
const { CollectionRepository } = require('../Repositories/CollectionRepository');
const { FileRepository } = require('../Repositories/FileRepository');

const folderRepository = new FolderRepository();
const fileRepository = new FileRepository();
const tagRepository = new TagRepository();

async function handleFileOpen() {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ['openDirectory'],
	});
	if (!canceled) {
		const directory = getDirectoriesRecursive(filePaths[0]);
		folderRepository.saveFolder(directory);
	}
}

async function handleGetFolders() {
	return folderRepository.getFolders();
}

async function handleGetFoldersByFolder(folderId) {
	return folderRepository.getFoldersByFolder(folderId);
}

async function handleGetFoldersNotEmpty() {
	return folderRepository.getFoldersNotEmpty();
}

async function handleGetFilesByFolder(folderId) {
	return fileRepository.getFilesByFolder(folderId);
}

async function handleGetFiles() {
	return fileRepository.getFiles();
}

async function handleGetFilesByTags(tags) {
	return fileRepository.getFilesByTags(tags);
}

async function handleGetFileById(fileId) {
	return fileRepository.getFileById(fileId);
}

async function handleGetTagsByFolder(folderId) {
	return tagRepository.getTagsByFolder(folderId);
}

async function handleDeleteFolder(folder) {
	folderRepository.deleteFolder(folder)
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
	handleGetFoldersByFolder,
	handleGetFoldersNotEmpty,
	handleGetFiles,
	handleGetFileById,
	handleGetFilesByFolder,
	handleGetFilesByTags,
	handleGetTagsByFolder,
	handleSaveTag,
	handleDeleteFolder,
	handleGetTags,
	handleDeleteTag,
	handleSaveFolderToCollection,
	handleGetCollection,
};