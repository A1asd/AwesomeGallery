const fs = require("fs");
const AbstractRepository = require("./AbstractRepository");
const Alert = require("../Modules/Alert");
const path = require("path");
const AlertHandler = require("../Modules/AlertHandler");

class FolderRepository extends AbstractRepository {
	saveFolder(folder, parent = null) {
		const self = this;
		const db = this.openDatabase();
		const saveFolderStmt = db.prepare("INSERT INTO folder(name, path, parent) VALUES (?,?,?)");
		db.serialize(() => {
			saveFolderStmt.run([folder.name, folder.path, parent], function(err) {
				folder.files.forEach((file) => {
					const saveFileStmt = db.prepare("INSERT INTO file(name, parent) VALUES (?,?)");
					file.tags.map((tag) => {return {name: tag}});
					saveFileStmt.run(file.name, this.lastID);
					saveFileStmt.finalize();
				});
				folder.folders.forEach((folder) => self.saveFolder(folder, this.lastID));
			});
		});
		saveFolderStmt.finalize();
		db.close()
	}

	saveFolderRecursive(database, folder, parent = null) {
		const saveFolderStmt = database.prepare("INSERT INTO folder(name, path, parent) VALUES (?,?,?)");
		database.serialize(() => {
			saveFolderStmt.run([folder.name, folder.path, parent], function (err) {
				folder.files.forEach((file) => {
					const saveFileStmt = database.prepare("INSERT INTO file(name, parent) VALUES (?,?)");
					file.tags.map((tag) => {return {name: tag}});
					saveFileStmt.run(file.name, this.lastID);
					saveFileStmt.finalize();
				});
				folder.folders.forEach((folder) => this.saveFolder(folder, this.lastID));
			});
		});
		saveFolderStmt.finalize();
	}

	updateFolder(folder, newPath) {
		const self = this;
		const updateFolderPath = function(id, newPath) {
			const db = self.openDatabase();
			db.serialize(() => {
				const updateFolderStmt = db.prepare("UPDATE folder SET path = ? WHERE id = ?");
				updateFolderStmt.run([newPath, id]);
				updateFolderStmt.finalize();

				let query = `SELECT * FROM folder WHERE parent = ?`;
				let stmt = db.prepare(query, [id]);
				stmt.all(function (err, rows) {
					if (rows) rows.forEach(folder => updateFolderPath(folder.id, newPath + path.sep + folder.name));
				});
				stmt.finalize();
			})
			db.close();
		}
		updateFolderPath(folder, newPath);
	}

	getFolders() {
		const db = this.openDatabase();
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				var folders = [];
				var files = [];
				let query = `SELECT * FROM folder ORDER BY name ASC`;
				let stmt = db.prepare(query);
				stmt.all((err, rows) => {
					folders = rows
				});
				stmt.finalize();
				query = `SELECT f.id, f.name, f.parent, folder.path, group_concat(ftr.tag) as tags
					FROM file f
					LEFT JOIN fileTagRelation ftr ON f.id = ftr.file
					LEFT JOIN folder ON f.parent = folder.id
					GROUP BY f.id
					ORDER BY f.name ASC`;
				stmt = db.prepare(query);
				stmt.all((err, rows) => {
					files = this.buildFiles(rows);
					resolve(this.buildFolderStructure(folders, files));
				});
				stmt.finalize();
			});
			db.close();
		});
	}

	getFoldersByFolder(folderId = null) {
		const db = this.openDatabase();
		return new Promise((resolve, reject) => {
			db.serialize(() => {
//						let query1="UPDATE folder SET path = ? WHERE id = ?";
//						let stmt1 = db.run(query1, ['C:\\Users\\Johann\\Desktop\\Testdir', 5])
				var folders = [];
				var files = [];
				let query;
				let stmt;

				if (folderId) {
					query = `SELECT * FROM folder WHERE parent = ? ORDER BY name ASC`;
					stmt = db.prepare(query, [folderId]);
				} else {
					query = `SELECT * FROM folder WHERE parent IS NULL ORDER BY name ASC`;
					stmt = db.prepare(query);
				}
				stmt.all((err, rows) => {
					folders = rows
					rows.forEach(row => {
						if(!fs.existsSync(row.path)) {
							//this.updateFolder(row, '');
							AlertHandler.sendAlert(new Alert('Ordner ' + row.name + ' konnte nicht geladen werden (Falscher Pfad)', Alert.ERROR).withUrl(`myAPI:updateFolderpathWithDialog:${row.id}`, 'Update folderpath'))
						}
					})
				});
				stmt.finalize();
				query = `SELECT f.id, f.name, f.parent, folder.path, group_concat(ftr.tag) as tags
					FROM file f
					LEFT JOIN fileTagRelation ftr ON f.id = ftr.file
					LEFT JOIN folder ON f.parent = folder.id
					WHERE f.parent = ?
					GROUP BY f.id
					ORDER BY f.name ASC`;
				stmt = db.prepare(query, [folderId]);
				stmt.all((err, rows) => {
					files = this.buildFiles(rows);
					this.buildFolderStructure(folders, files);
					resolve(folders)
				});
				stmt.finalize();
			});
			db.close();
		});
	}

	getFoldersNotEmpty() {
		const db = this.openDatabase();
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				var folders = [];
				var files = [];

				let query = `SELECT fo.id, fo.name, fo.path, fo.parent
					FROM folder fo
					JOIN file f ON fo.id = f.parent
					GROUP BY fo.id`;
				let stmt = db.prepare(query);
				stmt.all((err, rows) => {
					folders = rows
				});
				stmt.finalize();
				query = `SELECT f.id, f.name, f.parent, folder.path, group_concat(ftr.tag) as tags
					FROM file f
					LEFT JOIN fileTagRelation ftr ON f.id = ftr.file
					LEFT JOIN folder ON f.parent = folder.id
					GROUP BY f.id
					ORDER BY f.name ASC`;
				stmt = db.prepare(query);
				stmt.all((err, rows) => {
					files = this.buildFiles(rows);
					resolve(this.buildFolderStructure(folders, files));
				});
				stmt.finalize();
			});
			db.close();
		});
	}

	deleteFolder(folderId) {
		const db = this.openDatabase();
		const folderStmt = db.prepare("DELETE FROM folder WHERE id = ?");
		folderStmt.run([folderId]);
		folderStmt.finalize();
		db.close();
	}

	buildFolderStructure(folderlist, filelist) {
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
			hierarchyList.push({
				id: x.id,
				name: x.name,
				path: x.path,
				parent: x.parent,
				folders: addToFolderRecursive(x.id, folderlist),
				files: addFilesToFolder(x.id, filelist),
			});
		});
		return hierarchyList;
	}
}

module.exports = { FolderRepository };
