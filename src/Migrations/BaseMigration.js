const config = require("../app.config");
const sql = require("sqlite3");

const migrationList = [
	'Migration2308231323',
]

class BaseMigration {
	db;
	constructor() {
		this.db = new sql.Database(config.databasePath, (err) => {
			if (err) {
				console.err(err.message);
			}
		});
	}

	log(message) {
		console.log(message);
	}

	error(message) {
		console.error(message);
	}

	up() {
		this.error('Missing function: up()')
		return 0;
	}

	down() {
		this.error('Missing function: down()')
		return 0;
	}
}

module.exports = {
	BaseMigration,
	migrationList
}
