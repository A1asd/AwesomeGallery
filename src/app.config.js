const path = require("path");

const config = {
	buildHTML: true,
	buildHTMLPath: path.join(__dirname, "../build/index.html"),
	openDevTools: false,

	preloadDatabase: false,
	databasePath: '../data/database.sqlite',
	testdatabasePath: './Tests/data/test.database.sqlite',
}

module.exports = config;