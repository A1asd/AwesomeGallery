const path = require("path");

const config = {
	buildHTML: true,
	buildHTMLPath: path.join(__dirname, "../build/index.html"),
	openDevTools: false,

	preloadDatabase: false,
	databasePath: path.join(__dirname, 'data/database.sqlite'),
	testdatabasePath: path.join(__dirname, 'Tests/data/test.database.sqlite'),
}

module.exports = config;