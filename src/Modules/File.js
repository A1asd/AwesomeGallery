class File {
	constructor(name, absolute, tags = []) {
		this.name = name;
		this.absolute = absolute;
		this.tags = tags;
	}
}

module.exports = File;
