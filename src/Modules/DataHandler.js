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
const collectionRepository = new CollectionRepository();

class DataHandler {
	async handleFileOpen() {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ['openDirectory'],
		});
		if (!canceled) {
			const directory = this.getDirectoriesRecursive(filePaths[0]);
			folderRepository.saveFolder(directory);
		}
	}

	async handleUpdateFolderpathWithDialog(folderId) {
		const { canceled, filePaths } = await dialog.showOpenDialog({
			properties: ['openDirectory'],
		});
		if (!canceled) {
			folderRepository.updateFolder(folderId, filePaths[0]);
		}
	}

	async handleGetFolders() {
		return folderRepository.getFolders();
	}

	async handleGetFoldersByFolder(folderId) {
		return folderRepository.getFoldersByFolder(folderId);
	}

	async handleGetFoldersNotEmpty() {
		return folderRepository.getFoldersNotEmpty();
	}

	async handleGetFilesByFolder(folderId) {
		return fileRepository.getFilesByFolder(folderId);
	}

	async handleGetFiles() {
		return fileRepository.getFiles();
	}

	async handleGetFilesByTags(tags) {
		return fileRepository.getFilesByTags(tags);
	}

	async handleGetFileById(fileId) {
		return fileRepository.getFileById(fileId);
	}

	async handleGetTagsByFolder(folderId) {
		return tagRepository.getTagsByFolder(folderId);
	}

	async handleDeleteFolder(folder) {
		folderRepository.deleteFolder(folder)
	}

	async handleSaveTag(tag, fileId) {
		tagRepository.saveTag(tag, fileId)
	}

	async handleDeleteTag(tagId, fileId) {
		tagRepository.deleteTag(tagId, fileId);
	}

	async handleGetTags() {
		return tagRepository.getTags();
	}

	async handleSaveViewToCollection(viewMode, name, filterOptions) {
		collectionRepository.saveViewToCollection(viewMode, name, filterOptions);
	}

	async handleGetCollection() {
		return collectionRepository.getCollection();
	}

	getDirectories(srcpath) {
		return fs.readdirSync(srcpath, { withFileTypes:true })
			.map(dirent => path.join(srcpath, dirent.name))
			.filter(path => fs.statSync(path).isDirectory());
	}

	getFiles(srcpath) {
		return fs.readdirSync(srcpath)
			.filter(dirent => fs.statSync(path.join(srcpath, dirent)).isFile())
			.map(filepath => new File(filepath, srcpath));
	}

	getDirectoriesRecursive(srcpath) {
		let name = srcpath.split(path.sep).pop();
		return new Folder(
			name,
			srcpath,
			srcpath,
			this.getDirectories(srcpath).map(this.getDirectoriesRecursive),
			this.getFiles(srcpath)
		)
	}
}

module.exports = new DataHandler();