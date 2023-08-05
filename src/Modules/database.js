const sql = require("sqlite3");
const path = require("path");
const { FolderRepository } = require("../Repositories/FolderRepository");
const { TagRepository } = require("../Repositories/TagRepository");
const { FileRepository } = require("../Repositories/FileRepository");

const config = {
	preloadDatabase: false,
	databasePath: '../../data/database.sqlite'
};

function initDatabase() {
	const db = new sql.Database(path.resolve(__dirname, config.databasePath), (err) => {
		if (err) {
			console.log(err.message);
		}
	});
	db.serialize(() => {
		//db.run(`DROP TABLE IF EXISTS folder`).run(`
		db.run(`
			CREATE TABLE IF NOT EXISTS folder (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL,
				path TEXT,
				parent INTEGER,
				FOREIGN KEY (parent)
					REFERENCES folder (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)
		//db.run(`DROP TABLE IF EXISTS file`).run(`
		db.run(`
			CREATE TABLE IF NOT EXISTS file (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL,
				parent INTEGER,
				FOREIGN KEY (parent)
					REFERENCES folder (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)
		//db.run(`DROP TABLE IF EXISTS fileTagRelation`).run(`
		db.run(`
			CREATE TABLE IF NOT EXISTS fileTagRelation (
				file INTEGER NOT NULL,
				tag TEXT NOT NULL,
				PRIMARY KEY (file, tag),
				FOREIGN KEY (file)
					REFERENCES file (id)
						ON UPDATE NO ACTION
			)
		`)

		if (config.preloadDatabase) populateDatabase();
		db.close();
	});
}

function populateDatabase() {
	//TODO: Redo inserts to reflect real folderstructures
	//Folder
	new FolderRepository().populateFolderDatabase();
	//Files
	new FileRepository().populateFileDatabase();
	//Tag File Relation
	new TagRepository().populateTagDatabase();
}



module.exports = {
	initDatabase,
};
