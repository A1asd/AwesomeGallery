const AbstractRepository = require("./AbstractRepository");

class CollectionRepository extends AbstractRepository {
	textEnum = {
		folder: 'folder',
		file: 'file',
	}

	getCollection() {
		const db = this.openDatabase();
			db.serialize(() => {
				let query = `UPDATE collection SET LABEL = null, viewmode = 'gallery', filter = 3 WHERE id = 1`;
				db.prepare(query).run().finalize();

			})
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				let query = `SELECT * FROM collection c
					ORDER BY id ASC`;
				let stmt = db.prepare(query);
				stmt.all((err, rows) => {
					rows.map(row => row.filter = JSON.parse(row.filter));
					resolve(rows);
				});
				stmt.finalize();
			});
			db.close();
		});
	}

	updateCollection(collection) {
		const db = this.openDatabase();
		const updateCollectionStmt = db.prepare('UPDATE collection SET label = ?, viewmode = ?, filter = ? WHERE id = ?');
		db.serialize(() => {
			updateCollectionStmt.run([collection.label, collection.viewmode, JSON.stringify(collection.filter), collection.id])
			updateCollectionStmt.finalize();
		})
		db.close();
	}

	deleteCollection(collection) {
		const db = this.openDatabase();
		const updateCollectionStmt = db.prepare('DELETE FROM collection WHERE id = ?');
		db.serialize(() => {
			updateCollectionStmt.run([collection.id])
			updateCollectionStmt.finalize();
		})
		db.close();
	}

	//createCollection({filterOptions, viewMode, label}) {
	//	const db = this.openDatabase();
	//	const saveCollectionStmt = db.prepare("INSERT INTO collection(viewmode, filter) VALUES (?,?)");
	//	filterOptions = JSON.stringify(filterOptions);
	//	db.serialize(() => {
	//		saveCollectionStmt.run([viewMode, filterOptions], (err) => {
	//			if (err) {
	//				console.log(err);
	//				return 0;
	//			}
	//		});
	//		saveCollectionStmt.finalize();
	//	});
	//	db.close();
	//}

	saveViewToCollection(viewMode, name, filterOptions) {
		const db = this.openDatabase();
		const saveCollectionStmt = db.prepare("INSERT INTO collection(viewmode, filter) VALUES (?,?)");
		filterOptions = JSON.stringify(filterOptions);
		db.serialize(() => {
			saveCollectionStmt.run([viewMode, filterOptions], (err) => {
				if (err) {
					console.log(err);
					return 0;
				}
			});
			saveCollectionStmt.finalize();
		});
		db.close();
	}
}

module.exports = { CollectionRepository };
