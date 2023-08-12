const sql = require("sqlite3");
const path = require("path");

const config = {
	preloadDatabase: false,
	databasePath: '../../data/database.sqlite'
};

class AbstractRepository {
	openDatabase() {
		let db =  new sql.Database(path.resolve(__dirname, config.databasePath), (err) => {
			if (err) {
				console.log(err.message);
			}
		});
		db.get("PRAGMA foreign_keys = ON");
		return db
	}
}

module.exports = AbstractRepository;
