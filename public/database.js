const sqlbuilder = require("sql");
const sql = require("sqlite3");
const path = require("path");

sqlbuilder.setDialect('sqlite');

function initDatabase() {
	const db = new sql.Database(path.resolve(__dirname, 'db/configs.sqlite'), (err) => {
		if (err) {
			console.log(err.message);
		}
		console.log('Connected to database');
	});
	db.serialize(() => {
		var folder = sqlbuilder.define({
			name: 'folder',
			columns: ['id', 'path', 'parent'],
		});
		db.run(`DROP TABLE IF EXISTS folder`).run(`
			CREATE TABLE folder (
				id INTEGER PRIMARY KEY,
				path TEXT NOT NULL,
				parent INTEGER,
				FOREIGN KEY (parent)
					REFERENCES folder (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)
		var file = sqlbuilder.define({
			name: 'file',
			columns: ['id', 'path', 'parent'],
		});
		db.run(`DROP TABLE IF EXISTS file`).run(`
			CREATE TABLE file (
				id INTEGER PRIMARY KEY,
				path TEXT NOT NULL,
				parent INTEGER,
				FOREIGN KEY (parent)
					REFERENCES folder (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)
		var tag = sqlbuilder.define({
			name: 'tag',
			columns: ['id', 'name'],
		});
		db.run(`DROP TABLE IF EXISTS tag`).run(`
			CREATE TABLE tag(
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL
			)
		`)
		var fileTagRelation = sqlbuilder.define({
			name: 'fileTagRelation',
			columns: ['file', 'tag'],
		});
		db.run(`DROP TABLE IF EXISTS fileTagRelation`).run(`
			CREATE TABLE fileTagRelation (
				file INTEGER,
				tag INTEGER,
				PRIMARY KEY (file, tag),
				FOREIGN KEY (file)
					REFERENCES file (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION,
				FOREIGN KEY (tag)
					REFERENCES tag (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)

		//disable in production
		populateDatabase(db);
		db.close();
	})
}

function populateDatabase(db) {
	//Folder
	const folderStmt = db.prepare("INSERT INTO folder(path, parent) VALUES (?,?)");
	[['Japan', null], ['folder', 1], ['to_deep', 2], ['nothing', 3], ['whatever', 2]].forEach(element => {
		folderStmt.run([element[0], element[1]]);
	});
	folderStmt.finalize();
	//Files
	const fileStmt = db.prepare("INSERT INTO file(path, parent) VALUES (?,?)");
	[['cute.png',1],['spoopy.png',2]].forEach(file => {
		fileStmt.run([file[0], file[1]]);
	});
	fileStmt.finalize();
	//Tags
	const tagStmt = db.prepare("INSERT INTO tag(name) VALUES (?)");
	['selfie', 'horror', 'cute'].forEach(tag => {
		tagStmt.run(tag);
	});
	tagStmt.finalize();
	//Tag File Relation
	const fileTagStmt = db.prepare("INSERT INTO fileTagRelation(file, tag) VALUES (?,?)");
	[[1,1],[1,3],[2,1],[2,2]].forEach(relation => {
		fileTagStmt.run([relation[0], relation[1]]);
	});
	fileTagStmt.finalize();
}

function getFolders() {
	const db = new sql.Database(path.resolve(__dirname, 'db/configs.sqlite'), (err) => {
		if (err) {
			console.log(err.message);
		}
		console.log('Connected to database');
	});
	db.serialize(() => {
		let query = `SELECT * FROM folder`;
		db.all(query, [], (err, rows) => {
			if (err) throw err;
			let folders = [];
			rows.forEach((row) => {
				folders.push(row);
			});
			return buildFolderStructure(folders);
		});
	});
	db.close();
}

function buildFolderStructure(folderlist) {
	function addToFolder(fk, list) {
		let l = list.filter(x => x.parent === fk)
			.map(x => { return { id: x.id, path: x.path, parent: x.parent, folders: x.folders}});
		return l;
	}

	function getAllSubfolders(parent, allFolders) {
		console.log(parent);
		console.log(allFolders.filter(folder => folder[2] === parent))
	}

	const hierarchyList = [];
	folderlist.forEach(x => {
		if (!x.parent) {
			hierarchyList.push({
				id: x.id,
				path: x.path,
				parent: x.parent,
				folders: addToFolder(x.id, folderlist),
				//files: [],
			});
		}
	});
	return hierarchyList[0];
}

module.exports = { initDatabase, getFolders };
