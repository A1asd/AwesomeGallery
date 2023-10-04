const config = require('./app.config');
const fs = require('fs');
const path = require("path");
const sql = require("sqlite3");

const USAGE = `
use as: node migration.js argument\n
argument can be: init, mockup and migrate
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

	db.get("PRAGMA foreign_keys = ON");
	db.serialize(() => {
		db.run(`
			ALTER TABLE folder
				ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0
		`)

		/*TODO: läuft noch nich*/
		db.run(`
			DROP TABLE collection
		`)
		db.run(`
			CREATE TABLE collection (
				id			INTEGER PRIMARY KEY,
				viewmode	TEXT,
				name		TEXT,
				UNIQUE(viewmode, name)
			)
		`)

		db.close();
	})
	console.log('Migration done')
}

function populateFolderDatabase() {
	const db = this.openDatabase();
	const folderStmt = db.prepare("INSERT INTO folder(name, parent) VALUES (?,?)");
	[['Japan', null], ['folder', 1], ['to_deep', 2], ['nothing', 3], ['whatever', 2]].forEach(element => {
		folderStmt.run([element[0], element[1]]);
	});
	folderStmt.finalize();
	db.close();
}

function populateFileDatabase() {
	const db = this.openDatabase()
	const fileStmt = db.prepare("INSERT INTO file(name, parent) VALUES (?,?)");
	[['cute.png',1],['spoopy.png',2]].forEach(file => {
		fileStmt.run([file[0], file[1]]);
	});
	fileStmt.finalize();
	db.close();
}

function populateTagDatabase() {
	const db = this.openDatabase()
	const fileTagStmt = db.prepare("INSERT INTO fileTagRelation(file, tag) VALUES (?,?)");
	[[1,'selfie'],[1,'cutieee'],[2,'selfie'],[2,'spoopy']].forEach(relation => {
		fileTagStmt.run([relation[0], relation[1]]);
	});
	fileTagStmt.finalize();
	db.close();
}

function populateCollectionDatabase() {
	const db = this.openDatabase()
	const fileStmt = db.prepare("INSERT INTO collection(folder) VALUES (?)");
	//[['cute.png',1],['spoopy.png',2]].forEach(file => {
	//	fileStmt.run([file[0], file[1]]);
	//});
	fileStmt.finalize();
	db.close();
}

function populateDatabase() {
	//TODO: Redo inserts to reflect real folderstructures
	//Folder
	populateFolderDatabase();
	//Files
	populateFileDatabase();
	//Tag File Relation
	populateTagDatabase();

	populateCollectionDatabase();
}

switch (process.argv[2]) {
	case 'init': initialDatabase(); break;
	case 'mockdata': populateDatabase(); break;
	case 'migrate': migration1(); break;
	default: printUsage();
}
