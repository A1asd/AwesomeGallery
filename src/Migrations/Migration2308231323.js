const { BaseMigration } = require("./BaseMigration");

class Migration2308231323 extends BaseMigration {
	up() {
		this.log('Migrating up')

		this.db.get("PRAGMA foreign_keys = ON");
		this.db.serialize(() => {
			this.db.run(`
				ALTER TABLE folder
					ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0
			`)

			this.db.run(`
				CREATE TABLE collection (
					id			INTEGER PRIMARY KEY,
					viewmode	TEXT,
					name		TEXT,
					UNIQUE(viewmode, name)
				)
			`)

			this.db.run(`
				CREATE TABLE app (
					field	TEXT PRIMARY KEY,
					value	TEXT
				)
			`)
			this.db.run(`
				INSERT INTO app (field, value) VALUES ("db_version", 2308231323)
			`)

			this.db.close();
		})
		this.log('Migration done')
	}

	down() {
		this.log('Migrating down')

		this.db.get("PRAGMA foreign_keys = ON");
		this.db.serialize(() => {
			this.db.run(`
				ALTER TABLE folder
					DROP COLUMN hidden
			`)

			this.db.run(`
				DROP TABLE collection
			`)

			this.db.run(`
				DROP TABLE app
			`)

			this.db.close();
		})
		this.log('Migration done')
	}
}

module.exports = Migration2308231323
