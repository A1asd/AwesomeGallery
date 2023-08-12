const AbstractRepository = require("./AbstractRepository");

class FileRepository extends AbstractRepository {
	getFiles() {
		const db = this.openDatabase();
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				let query = `SELECT f.id, f.name, f.parent, folder.path, group_concat(ftr.tag) as tags
					FROM file f
					LEFT JOIN fileTagRelation ftr ON f.id = ftr.file
					LEFT JOIN folder ON f.parent = folder.id
					GROUP BY f.id
					ORDER BY f.name ASC`;
				let stmt = db.prepare(query);
				stmt.all((err, rows) => {
					resolve(this.buildFiles(rows));
				});
				stmt.finalize();
			});
			db.close();
		});
	}

	getFileById(fileId) {
		const db = this.openDatabase();
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				let query = `SELECT f.id, f.name, f.parent, group_concat(ftr.tag) as tags
					FROM file f
					LEFT JOIN fileTagRelation ftr ON f.id = ftr.file
					WHERE f.id = ?
					GROUP BY f.id`;
				let stmt = db.prepare(query, [fileId]);
				stmt.all((err, rows) => {
					resolve(rows);
				});
				stmt.finalize();
			});
			db.close();
		});
	}

	getFilesByFolder(folderId = null) {
		const db = this.openDatabase();
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				let query = `SELECT f.id, f.name, f.parent, folder.path, count(ftr.tag) as total, group_concat(ftr.tag) as tags
					FROM file f
					LEFT JOIN fileTagRelation ftr ON f.id = ftr.file
					LEFT JOIN folder ON f.parent = folder.id
					WHERE f.parent = ?
					GROUP BY f.id
					ORDER BY f.name ASC`;
				let stmt = db.prepare(query, [folderId]);
				stmt.all((err, rows) => {
					resolve(this.buildFiles(rows));
				});
				stmt.finalize();
			});
			db.close();
		});
	}

	getFilesByTags(tags) {
		tags = tags.map((tag) => {
			return '"' + tag + '"';
		})
		const db = this.openDatabase();
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				let query = `SELECT f.id, f.name, f.parent, fo.path, (SELECT group_concat(tag,',')
						FROM fileTagRelation ftr
						WHERE ftr.file = f.id) AS tags
					FROM fileTagRelation ftr
					INNER JOIN file f ON ftr.file = f.id
					INNER JOIN folder fo ON f.parent = fo.id
					WHERE ftr.tag IN (${tags.join(',')})
					GROUP BY ftr.file
					having count(*) >= ${tags.length}
					ORDER BY file`;

				let stmt = db.prepare(query);
				stmt.all((err, rows) => {
					resolve(this.buildFiles(rows));
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

	populateFileDatabase() {
		const db = this.openDatabase()
		const fileStmt = db.prepare("INSERT INTO file(name, parent) VALUES (?,?)");
		[['cute.png',1],['spoopy.png',2]].forEach(file => {
			fileStmt.run([file[0], file[1]]);
		});
		fileStmt.finalize();
		db.close();
	}
}

module.exports = { FileRepository }
