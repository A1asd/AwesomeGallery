const { BaseMigration } = require("./BaseMigration");

module.exports = class MigrationSkeleton extends BaseMigration {
	up() {
		this.log('Migrating up');

		this.db.get("PRAGMA foreign_keys = ON");
		this.db.serialize(() => {
			//Migrations go below this line

			this.updateVersion();
			this.db.close();
		})
		this.log('Migration done');
	}

	down() {
		this.log('Migrating down');

		this.db.get("PRAGMA foreign_keys = ON");
		this.db.serialize(() => {
			//Undos go below this line

			this.revertVersion();
			this.db.close();
		})
		this.log('Migration done');
	}
};
