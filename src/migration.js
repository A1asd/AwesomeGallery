const config = require('./app.config');
const fs = require('fs');
const path = require('path');
const sql = require("sqlite3");
const { migrationList } = require('./Migrations/BaseMigration');

const USAGE = `
use as: node migration.js argument\n
argument can be: init, mockup and migrate
`

function printUsage() {
	console.log(USAGE);
}

function initialDatabase() {
	if (config.preloadDatabase) fs.unlinkSync("src/data/test.database.sqlite");
	const db = new sql.Database(config.testdatabasePath, (err) => {
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
		`);

		db.run(`INSERT INTO folder(name,path) VALUES ("test","c:/te/test")`);

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
		`);

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
		`);

		db.close();

		console.log('Database initialized');
		//if (config.preloadDatabase) populateDatabase();
	});
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
	const db = this.openDatabase();
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

function getDateString() {
	let d = new Date();
	let dateString = d.getUTCFullYear().toString() + prefixZero(d.getUTCMonth()+1) + prefixZero(d.getUTCDate()) + prefixZero(d.getUTCHours()) + prefixZero(d.getUTCMinutes());
	return dateString
}

function prefixZero(dateString) {
	return ('0' + dateString).slice(-2);
}

//TODO: add checkup with database for current version, so the system cannot trash the database and enable future automatic migrations
function migrateUp(migrationClass) {
	try {
		var cl = require(path.join(__dirname, 'Migrations' + path.sep + migrationClass));
		cl = new cl();
		cl.up();
	} catch(e) {
		console.log(e);
		console.log('Choose a migration from this list', migrationList);
	}
}

function migrateDown(migrationClass) {
	try {
		var cl = require(path.join(__dirname, 'Migrations' + path.sep + migrationClass));
		cl = new cl();
		cl.down();
	} catch(e) {
		console.log(e);
		console.log('Choose a migration from this list', migrationList);
	}
}

function migrateCreate() {
	const dateString = getDateString();
	try {
		let skeletonPath = path.join(__dirname, 'Migrations' + path.sep + 'MigrationSkeleton.js');
		let newPath = path.join(__dirname, 'Migrations' + path.sep + 'Migration' + dateString + '.js');
		let baseMigrationPath = path.join(__dirname, 'Migrations' + path.sep + 'BaseMigration.js');
		fs.copyFile(skeletonPath, newPath, (err) => {
			if (err) return console.log(err);
			fs.readFile(newPath, 'utf-8', (err, data) => {
				if (err) return console.log(err);
				let result = data.replace('Skeleton', dateString);
				fs.writeFile(newPath, result, (err) => {
					if (err) console.log(err);
				});
			});
			//TODO: this only works for windows because of new lines
			let searchString = /(const migrationList = \[(\r\n.*)*)(\r\n\])/gm;
			let replaceString = "$1\n\t'Migration" + dateString + "',$3";
			fs.readFile(baseMigrationPath, 'utf-8', (err, data) => {
				if (err) return console.log(err);
				let result = data.replace(searchString, replaceString);
				fs.writeFile(baseMigrationPath, result, (err) => {
					if (err) return console.log(err);
				});
			});
		});

	} catch(e) {
		console.log(e);
		console.log('Choose a migration from this list', migrationList);
	}
}

function runCommand() {
	//TODO
}

function test(arg1,arg2) {
	console.log(arg1,arg2)
}

switch (process.argv[2]) {
	case 'init': initialDatabase(); break;
	case 'mockdata': populateDatabase(); break;
	case 'migrate:up': migrateUp(process.argv[3], process.argv[4]); break;
	case 'migrate:down': migrateDown(process.argv[3], process.argv[4]); break;
	case 'migrate:create': migrateCreate(); break;
	case 'run:command': runCommand(process.argv[3], process.argv[4]); break;
	case 'test': test(process.argv[3], process.argv[4]); break;
	default: printUsage();
}
