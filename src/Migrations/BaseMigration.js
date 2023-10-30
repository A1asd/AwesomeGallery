const config = require("../app.config");
const sql = require("sqlite3");

const migrationList = [
	'Migration202310232308',
	'Migration202310241742',
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

	updateVersion() {
		const migrationStmt = this.db.prepare(`
			UPDATE app SET value = ? WHERE field = "db_version"
		`);
		migrationStmt.run([this.constructor.name.split('Migration')[1]]);
		migrationStmt.finalize();
	}

	revertVersion() {
		const migrationStmt = this.db.prepare(`
			UPDATE app SET value = ? WHERE field = "db_version"
		`);
		migrationStmt.run([migrationList[migrationList.indexOf(this.constructor.name) - 1].split('Migration')[1]]);
		migrationStmt.finalize();
	}

	log(message) {
		console.log(message);
	}

	error(message) {
		console.error(message);
	}

	up() {
		this.error('Missing function: up()');
		return 0;
	}

	down() {
		this.error('Missing function: down()');
		return 0;
	}
}

module.exports = {
	BaseMigration,
	migrationList
};
