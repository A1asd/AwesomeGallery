class Folder {
	constructor(name, path, parent, folders = [], files = []) {
		this.name = name;
		this.path = path;
		this.parent = parent;
		this.folders = folders;
		this.files = files;
		return this;
	}

	addFolder(folder) {
		this.folders.push(folder);
		return this;
	}

	addFile(file) {
		this.files.push(file);
		return this;
	}

	setFolders(folderArray) {
		this.folders = folderArray;
		return this;
	}

	setFiles(fileArray) {
		this.files = fileArray;
		return this;
	}
}

module.exports = Folder;
