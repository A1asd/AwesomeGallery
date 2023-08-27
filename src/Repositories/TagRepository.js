const AbstractRepository = require("./AbstractRepository");

class TagRepository extends AbstractRepository {
	getTags() {
		const db = this.openDatabase()
		let promise = new Promise((resolve, reject) => {
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
				stmt.finalize()
			});
			db.close();
		});
		return promise;
	};
	
	getTagsByFolder(folderId) {
		const db = this.openDatabase()
		new Promise((resolve, reject) => {
			db.serialize(() => {
				let query = `SELECT ftr.tag
					from file f
					JOIN folder fo ON fo.id = f.parent
					JOIN fileTagRelation ftr ON ftr.file = f.id
					WHERE fo.id = ?
					GROUP BY ftr.tag`;
				let stmt = db.prepare(query, [folderId]);
				stmt.all((err, rows) => {
					console.log(rows)
					resolve(rows)
				});
				stmt.finalize()
			});
			db.close();
		});
	}

	saveTag(tag, fileId) {
		const db = this.openDatabase()
		const saveTagStmt = db.prepare("INSERT INTO fileTagRelation(tag, file) VALUES (?,?)");
		saveTagStmt.run([tag, fileId]);
		saveTagStmt.finalize();
		db.close();
	}

	deleteTag(tagId, fileId) {
		const db = this.openDatabase()
		const deleteTagStmt = db.prepare("DELETE FROM fileTagRelation WHERE file = ? AND tag = ?");
		deleteTagStmt.run([fileId, tagId]);
		deleteTagStmt.finalize();
		db.close();
	}
}


module.exports = { TagRepository };
