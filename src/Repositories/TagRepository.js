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

	populateTagDatabase() {
		const db = this.openDatabase()
		const fileTagStmt = db.prepare("INSERT INTO fileTagRelation(file, tag) VALUES (?,?)");
		[[1,1],[1,3],[2,1],[2,2]].forEach(relation => {
			fileTagStmt.run([relation[0], relation[1]]);
		});
		fileTagStmt.finalize();
		db.close();
	}
}


module.exports = { TagRepository };
