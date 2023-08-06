const AbstractRepository = require("./AbstractRepository");
//name(string), type(text(folder, file))
class CollectionRepository extends AbstractRepository {
	textEnum = {
		folder: 'folder',
		file: 'file',
	}
	
	getCollection() {
		const db = this.openDatabase();
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				let query = `SELECT * FROM collection c
					LEFT JOIN folder f ON f.id = c.folder
					ORDER BY name ASC`;
				let stmt = db.prepare(query);
				stmt.all((err, rows) => {
					//files = this.buildFiles(rows);
					resolve(rows);
				});
				stmt.finalize();
			});
			db.close();
		});
	}

	saveToCollection(folderId) {
		const db = this.openDatabase();
		const saveCollectionStmt = db.prepare("INSERT INTO collection(folder) VALUES (?)");
		saveCollectionStmt.run([folderId]);
		saveCollectionStmt.finalize();
		db.close()
	}

	populateFileDatabase() {
		const db = this.openDatabase()
		const fileStmt = db.prepare("INSERT INTO collection(folder) VALUES (?)");
		//[['cute.png',1],['spoopy.png',2]].forEach(file => {
		//	fileStmt.run([file[0], file[1]]);
		//});
		fileStmt.finalize();
		db.close();
	}
}

module.exports = { CollectionRepository }
