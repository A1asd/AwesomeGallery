const sql = require("sqlite3");
const path = require("path");

const config = {
	preloadDatabase: false,
	databasePath: '../../data/database.sqlite'
};

class AbstractRepository {
	openDatabase() {
		return new sql.Database(path.resolve(__dirname, config.databasePath), (err) => {
			if (err) {
				console.log(err.message);
			}
		});
	}
}

module.exports = AbstractRepository;
