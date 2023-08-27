const sql = require("sqlite3");
const path = require("path");
const config = require('../app.config');

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

	buildFiles(files) {
		return files.map((file) => {
			if (file.tags) file.tags = file.tags.split(',').map((tag) => {return {name: tag}});
			else file.tags = [];
			return file;
		});
	}
}

module.exports = AbstractRepository;
