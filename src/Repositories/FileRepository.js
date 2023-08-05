const AbstractRepository = require("./AbstractRepository");

class FileRepository extends AbstractRepository {
	populateFileDatabase() {
		const db = this.openDatabase()
		const fileStmt = db.prepare("INSERT INTO file(name, parent) VALUES (?,?)");
		[['cute.png',1],['spoopy.png',2]].forEach(file => {
			fileStmt.run([file[0], file[1]]);
		});
		fileStmt.finalize();
		db.close();
	}
}

module.exports = { FileRepository }
