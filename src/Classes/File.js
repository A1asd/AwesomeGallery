import Tags from "../Services/TagManager";

class File {
	constructor(name, absolute, tags = []) {
		this.name = name;
		this.absolute = absolute;
		this.tags = tags;
		tags.forEach(tag => {
			Tags.incrementCount(tag);
		})
	}
}

export default File;
