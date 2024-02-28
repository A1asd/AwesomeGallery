const { app } = require('electron');
const path = require("path");

const config = {
	buildHTML: true,
	buildHTMLPath: path.join(__dirname, "../build/index.html"),
	openDevTools: false,

	preloadDatabase: false,
	databasePath: path.join(app.getPath('userData'), 'database.sqlite'),
	//databasePath: path.join(__dirname, '../database.sqlite'),
	testdatabasePath: path.join(__dirname, 'Tests/data/test.database.sqlite'),
}

module.exports = config;