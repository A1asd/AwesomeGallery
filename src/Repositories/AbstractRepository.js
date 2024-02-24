const sql = require("sqlite3");
const config = require('../app.config');
const path = require("path");
const { ExifImage } = require("exif");

class AbstractRepository {
	openDatabase() {
		let db =  new sql.Database(config.databasePath, (err) => {
			if (err) {
				console.log(err.message);
			}
		});
		db.get("PRAGMA foreign_keys = ON");
		return db
	}

	buildFiles(files) {
		return files.map((file) => {
			if (file.tags) file.tags = file.tags.split(',').map((tag) => {
				return {
					name: tag,
				};
			});
			else file.tags = [];
			new ExifImage(file.path + path.sep + file.name, (err, data) => {
				if (err) return;
				console.log(file.path + path.sep + file.name);
				file.exif = data;
			})
			return file
		});
	}
}

module.exports = AbstractRepository;
