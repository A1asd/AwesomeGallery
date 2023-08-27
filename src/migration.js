const config = require('./app.config');
const fs = require('fs');
const path = require("path");
const sql = require("sqlite3");

const USAGE = `
use as: node migration.js argument\n
argument can be: init and migrate
`

function printUsage() {
	console.log(USAGE);
}

function initialDatabase() {
	if (config.preloadDatabase) fs.unlinkSync("src/data/test.database.sqlite");
	const db = new sql.Database(path.resolve(__dirname, config.testdatabasePath), (err) => {
		if (err) {
			console.log(err.message);
		}
	});
	console.log('Initializing Database');

	db.get("PRAGMA foreign_keys = ON");
	db.serialize(() => {
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

		db.run(`INSERT INTO folder(name,path) VALUES ("test","c:/te/test")`)

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
				id	INTEGER PRIMARY KEY
			)
		`)

		db.close();

		console.log('Database initialized')
		//if (config.preloadDatabase) populateDatabase();
	});
}

function migration1() {
	const db = new sql.Database(path.resolve(__dirname, config.testdatabasePath), (err) => {
		if (err) {
			console.log(err.message);
		}
	});
	console.log('Migrating first migration')

	db.serialize(() => {
		db.run(`
			ALTER TABLE folder
				ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0
		`)

		/*TODO: läuft noch nich*/
		db.run(`
			BEGIN TRANSACTION;
			DROP TABLE collection;
			CREATE TABLE collection (
				id			INTEGER PRIMARY KEY,
				viewmode	TEXT NOT NULL,
				name		TEXT NOT NULL
			);
			COMMIT;
		`)

		db.close();
	})
	console.log('Migration done')
}

switch (process.argv[2]) {
	case 'init': initialDatabase(); break;
	case 'migrate': migration1(); break;
	default: printUsage();
}
