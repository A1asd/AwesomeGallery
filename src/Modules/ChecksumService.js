var fs = require('fs');
var crypto = require('crypto');

class ChecksumService {
	// slower version because of sync. TODO: implement lower commented version for speed
	getChecksum(filePath, algorithm, encoding) {
		let file = fs.readFileSync(filePath)
	    return crypto
	        .createHash(algorithm || 'md5')
	        .update(file, 'utf8')
	        .digest(encoding || 'hex');
	}
	//generateChecksum(fileInputStream, algorithm, encoding) {
	//    return crypto
	//        .createHash(algorithm || 'md5')
	//        .update(fileInputStream, 'utf8')
	//        .digest(encoding || 'hex');
	//}
}

module.exports = ChecksumService;
