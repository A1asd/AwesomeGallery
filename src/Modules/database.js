const sql = require("sqlite3");
const path = require("path");
const fs = require('fs');
const { FolderRepository } = require("../Repositories/FolderRepository");
const { TagRepository } = require("../Repositories/TagRepository");
const { FileRepository } = require("../Repositories/FileRepository");
const { CollectionRepository } = require("../Repositories/CollectionRepository");

const config = {
	preloadDatabase: false,
	databasePath: '../../data/database.sqlite'
};

function initDatabase() {
	if (config.preloadDatabase) fs.unlinkSync("data/database.sqlite");
	const db = new sql.Database(path.resolve(__dirname, config.databasePath), (err) => {
		if (err) {
			console.log(err.message);
		}
	});
	db.get("PRAGMA foreign_keys = ON");
	db.serialize(() => {
		//db.run(`DROP TABLE IF EXISTS folder`).run(`
		db.run(`
			CREATE TABLE IF NOT EXISTS folder (
				id			INTEGER	PRIMARY KEY,
				name		TEXT	NOT NULL,
				path		TEXT,
				parent		INTEGER	DEFAULT NULL,
				FOREIGN KEY (parent)
					REFERENCES folder(id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)

		db.run(`
			CREATE TABLE IF NOT EXISTS file (
				id		INTEGER	PRIMARY KEY,
				name	TEXT	NOT NULL,
				parent	INTEGER,
				FOREIGN KEY (parent)
					REFERENCES folder (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)

		db.run(`
			CREATE TABLE IF NOT EXISTS fileTagRelation (
				file	INTEGER	NOT NULL,
				tag		TEXT	NOT NULL,
				PRIMARY KEY (file, tag),
				FOREIGN KEY (file)
					REFERENCES file (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)

		db.run(`
			CREATE TABLE IF NOT EXISTS collection (
				folder	INTEGER	PRIMARY KEY,
				FOREIGN KEY (folder)
					REFERENCES folder (id)
						ON DELETE NO ACTION
						ON UPDATE NO ACTION
			)
		`)

		db.close();
		//if (config.preloadDatabase) populateDatabase();
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

	new CollectionRepository().populateCollectionDatabase();
}



module.exports = {
	initDatabase,
};
