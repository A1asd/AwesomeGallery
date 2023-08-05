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

		//disable in production
		populateDatabase(db);
		db.close();
	});
}

function populateDatabase(db) {
	//Folder
	//const folderStmt = db.prepare("INSERT INTO folder(name, parent) VALUES (?,?)");
	//[['Japan', null], ['folder', 1], ['to_deep', 2], ['nothing', 3], ['whatever', 2]].forEach(element => {
	//	folderStmt.run([element[0], element[1]]);
	//});
	//folderStmt.finalize();
	////Files
	//const fileStmt = db.prepare("INSERT INTO file(name, parent) VALUES (?,?)");
	//[['cute.png',1],['spoopy.png',2]].forEach(file => {
	//	fileStmt.run([file[0], file[1]]);
	//});
	//fileStmt.finalize();
	//Tag File Relation
	//const fileTagStmt = db.prepare("INSERT INTO fileTagRelation(file, tag) VALUES (?,?)");
	//[[1,1],[1,3],[2,1],[2,2]].forEach(relation => {
	//	fileTagStmt.run([relation[0], relation[1]]);
	//});
	//fileTagStmt.finalize();
}

function saveFolder(folder, parent = null) {
	const db = new sql.Database(path.resolve(__dirname, 'db/configs.sqlite'), (err) => {
		if (err) {
			console.log(err.message);
		}
	});

	const saveFolderStmt = db.prepare("INSERT INTO folder(name, path, parent) VALUES (?,?,?)");
	db.serialize(() => {
		saveFolderStmt.run([folder.name, folder.path, parent], function (err) {
			folder.files.forEach((file) => {
				const saveFileStmt = db.prepare("INSERT INTO file(name, parent) VALUES (?,?)");
				file.tags.map((tag) => {return {name: tag}});
				saveFileStmt.run(file.name, this.lastID);
				saveFileStmt.finalize();
			});
			folder.folders.forEach((folder) => saveFolder(folder, this.lastID));
		});
	});
	saveFolderStmt.finalize();
	db.close()
}

function getTags() {
	const db = new sql.Database(path.resolve(__dirname, 'db/configs.sqlite'), (err) => {
		if (err) {
			console.log(err.message);
		}
	});
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			let query = `SELECT ftr.tag, count(*) as total
			FROM fileTagRelation ftr
			GROUP BY ftr.tag`;
			let stmt = db.prepare(query);
			stmt.all((err, rows) => {
				/**
				 * [ { tag: 'name', total: int}, ... ]
				 */
				resolve(rows)
			});
		});
		//db.close();
	});
};

function saveTag(tag, fileId) {
	const db = new sql.Database(path.resolve(__dirname, 'db/configs.sqlite'), (err) => {
		if (err) {
			console.log(err.message);
		}
	});
	const saveTagStmt = db.prepare("INSERT INTO fileTagRelation(tag, file) VALUES (?,?)");
	saveTagStmt.run([tag, fileId]);
	saveTagStmt.finalize();
	db.close();
}

function deleteTag(tagId, fileId) {
	const db = new sql.Database(path.resolve(__dirname, 'db/configs.sqlite'), (err) => {
		if (err) {
			console.log(err.message);
		}
	});
	const deleteTagStmt = db.prepare("DELETE FROM fileTagRelation WHERE file = ? AND tag = ?");
	deleteTagStmt.run([fileId, tagId]);
	deleteTagStmt.finalize();
	db.close();
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
			query = `SELECT f.id, f.name, f.parent, folder.path, group_concat(ftr.tag) as tags
				FROM file f
				LEFT JOIN fileTagRelation ftr ON f.id = ftr.file
				LEFT JOIN folder ON f.parent = folder.id
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
		if (file.tags) file.tags = file.tags.split(',').map((tag) => {return {name: tag}});
		else file.tags = [];
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
				path: newFolder.path,
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
				path: x.path,
				parent: x.parent,
				folders: addToFolderRecursive(x.id, folderlist),
				files: addFilesToFolder(x.id, filelist),
			});
		}
	});
	return hierarchyList;
}

module.exports = {
	initDatabase,
	getFolders,
	saveFolder,
	saveTag,
	getTags,
	deleteTag,
};
