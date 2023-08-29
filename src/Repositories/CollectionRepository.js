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

	saveViewToCollection(viewMode, name, filterOptions) {
		const db = this.openDatabase();
		const saveCollectionStmt = db.prepare("INSERT INTO collection(viewmode, name) VALUES (?,?)");
		db.serialize(() => {
			saveCollectionStmt.run([viewMode, name], (err) => {
				if (err) {
					console.log(err);
					return 0;
				}
				const saveCollectionFilterStmt = db.prepare("INSERT INTO collectionFilter(collection, filter) VALUES (?,?)");
				saveCollectionFilterStmt.run([this.lastId, filterOptions]);
			});
		});
		//saveCollectionStmt.finalize();
		db.close()
	}
}

module.exports = { CollectionRepository }
