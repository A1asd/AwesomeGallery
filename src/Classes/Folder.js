class Folder {
	folders = [];
	files = [];
	constructor(name, path) {
		this.name = name;
		this.path = path;
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
}

export default Folder;
