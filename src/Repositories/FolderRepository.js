const AbstractRepository = require("./AbstractRepository");

class FolderRepository extends AbstractRepository {
	saveFolder(folder, parent = null) {
		const self = this;
		const db = this.openDatabase();
		const saveFolderStmt = db.prepare("INSERT INTO folder(name, path, parent) VALUES (?,?,?)");
		db.serialize(() => {
			saveFolderStmt.run([folder.name, folder.path, parent], function (err) {
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

	getFolders() {
		const db = this.openDatabase();
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				var folders = [];
				var files = [];
				let query = `SELECT * FROM folder`;
				let stmt = db.prepare(query);
				stmt.all((err, rows) => {
					folders = rows
				});
				stmt.finalize();
				query = `SELECT f.id, f.name, f.parent, folder.path, group_concat(ftr.tag) as tags
					FROM file f
					LEFT JOIN fileTagRelation ftr ON f.id = ftr.file
					LEFT JOIN folder ON f.parent = folder.id
					GROUP BY f.id`;
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

	buildFiles(files) {
		return files.map((file) => {
			if (file.tags) file.tags = file.tags.split(',').map((tag) => {return {name: tag}});
			else file.tags = [];
			return file;
		});
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

	populateFolderDatabase() {
		const db = this.openDatabase();
		const folderStmt = db.prepare("INSERT INTO folder(name, parent) VALUES (?,?)");
		[['Japan', null], ['folder', 1], ['to_deep', 2], ['nothing', 3], ['whatever', 2]].forEach(element => {
			folderStmt.run([element[0], element[1]]);
		});
		folderStmt.finalize();
		db.close();
	}
}

module.exports = { FolderRepository };