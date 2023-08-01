class TagManager {
	CUTE = 0
	HORROR = 1
	SELFIE = 2

	tags = ["cute", "horror", "selfie"]

	constructor() {
		this.count = new Array(this.tags.length).fill(0);
	}
	
	getName(index) {
		return this.tags[index];
	}

	getCount(index) {
		return this.count[index];
	}
	
	incrementCount(index) {
		this.count[index] += 1;
	}
}

let Tags = new TagManager();

export default Tags;
