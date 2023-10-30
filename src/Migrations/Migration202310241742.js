const { BaseMigration } = require("./BaseMigration");

module.exports = class Migration202310241742 extends BaseMigration {
	up() {
		this.log('Migrating up')

		this.db.get("PRAGMA foreign_keys = ON");
		this.db.serialize(() => {

			this.db.run(`
				ALTER TABLE collection ADD COLUMN label TEXT
			`)

			this.updateVersion();

			this.db.close();
		})
		this.log('Migration done')
	}

	down() {
		this.log('Migrating down')

		this.db.get("PRAGMA foreign_keys = ON");
		this.db.serialize(() => {

			this.db.run(`
				ALTER TABLE collection DROP COLUMN label
			`)

			this.revertVersion();

			this.db.close();
		})
		this.log('Migration done')
	}
}
