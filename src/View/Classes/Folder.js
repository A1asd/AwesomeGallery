class Folder {
	folders = [];
	files = [];
	constructor(name, parent) {
		this.name = name;
		this.parent = parent;
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
