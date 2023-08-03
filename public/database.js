//const sqlbuilder = require("sql");
const sql = require("sqlite3");
const path = require("path");

const { Folder } = require("../src/Modules/Folder");

//sqlbuilder.setDialect('sqlite');
//var folderQB = sqlbuilder.define({
//	name: 'folder',
//	columns: ['id', 'path', 'parent'],
//});
//var fileQB = sqlbuilder.define({
//	name: 'file',
//	columns: ['id', 'path', 'parent'],
//});
//var tagQB = sqlbuilder.define({
//	name: 'tag',
//	columns: ['id', 'name'],
//});
//var fileTagQB = sqlbuilder.define({
//	name: 'fileTagRelation',
//	columns: ['file', 'tag'],
//});

function initDatabase() {
	const db = new sql.Database(path.resolve(__dirname, 'db/configs.sqlite'), (err) => {
		if (err) {
			console.log(err.message);
		}
	});
	db.serialize(() => {
		db.run(`DROP TABLE IF EXISTS folder`).run(`
			CREATE TABLE folder (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL,
				parent INTEGER,
				FOREIGN KEY (parent)
					REFERENCES folder (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)
		db.run(`DROP TABLE IF EXISTS file`).run(`
			CREATE TABLE file (
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL,
				parent INTEGER,
				FOREIGN KEY (parent)
					REFERENCES folder (id)
						ON DELETE CASCADE
						ON UPDATE NO ACTION
			)
		`)
		db.run(`DROP TABLE IF EXISTS tag`).run(`
			CREATE TABLE tag(
				id INTEGER PRIMARY KEY,
				name TEXT NOT NULL
			)
		`)
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
	});
}

function populateDatabase(db) {
	//Folder
	const folderStmt = db.prepare("INSERT INTO folder(name, parent) VALUES (?,?)");
	[['Japan', null], ['folder', 1], ['to_deep', 2], ['nothing', 3], ['whatever', 2]].forEach(element => {
		folderStmt.run([element[0], element[1]]);
	});
	folderStmt.finalize();
	//Files
	const fileStmt = db.prepare("INSERT INTO file(name, parent) VALUES (?,?)");
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
	});
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			var folders = [];
			var files = [];
			let query = `SELECT * FROM folder`;
			let stmt = db.prepare(query);
			stmt.all((err, rows) => {
				folders = rows
			});
			query = `SELECT f.name, f.parent, group_concat(t.name) as tags
				FROM file f
				INNER JOIN fileTagRelation ftr ON f.id = ftr.file
				INNER JOIN tag t ON t.id = ftr.tag
				GROUP BY f.id`;
			stmt = db.prepare(query);
			stmt.all((err, rows) => {
				files = buildFiles(rows);
				resolve(buildFolderStructure(folders, files));
			});
		});
		//db.close();
	});
}

function buildFiles(files) {
	return files.map((file) => {
		file.tags = file.tags.split(',').map((tag) => {return {name: tag}});
		return file;
	});
}

function buildFolderStructure(folderlist, filelist) {
	//console.log(folderlist, filelist);
	function addToFolderRecursive(parent, folders) {
		return folders.filter((folder) => folder.parent === parent).map((newFolder) => {
			newFolder = {
				id: newFolder.id,
				name: newFolder.name,
				parent: newFolder.parent,
				folders: addToFolderRecursive(newFolder.id, folderlist),
				files: addFilesToFolder(newFolder.id, filelist),
			}
			return newFolder;
		})
	}

	function addFilesToFolder(folder, files) {
		return files.filter((file) => file.parent === folder);
	}

	const hierarchyList = [];
	folderlist.forEach(x => {
		if (!x.parent) {
			hierarchyList.push({
				id: x.id,
				name: x.name,
				parent: x.parent,
				folders: addToFolderRecursive(x.id, folderlist),
				files: addFilesToFolder(x.id, filelist),
			});
		}
	});
	return hierarchyList;
}

module.exports = { initDatabase, getFolders };
