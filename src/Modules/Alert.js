class Alert {
	static ERROR = 'error'
	static WARNING = 'warning'
	static NOTICE = 'notice'

	constructor(label, type) {
		this.label = label;
		this.type = type;

		return this;
	}

	withUrl(link, label) {
		this.link = link;
		this.linkLabel = label;

		return this;
	}
}

module.exports = Alert;
