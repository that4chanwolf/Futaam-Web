/*
 * Library to parse Futaam databases
 */

var fs = require('fs');

/*
 * Determine which database type we're using
 * Arguments:
 * 	database name
 * Returns:
 * 	'pickle' for pickle databases
 * 	'json' for json databases
 * 	null for non-databases
 */
var type = function type(dbname) {
	if(typeof dbname !== 'string') {
		throw new Error(".type() function not supplied valid database name");
	} else {
		fs.readFile(dbname, function(err, data) {
			if(err) {
				throw err;
			} else {
				var dbtype = [
					'pickle',
					'json'
				].indexOf(data.match(/^\[.*?\]\n/)[0].replace(/\[(.*)\]\n$/, '$1'));
				if(dbtype !== -1) {
					return [
						'pickle',
						'json'
					][dbtype];
				} else {
					return null;
				}
			}
		});
	}
};

module.exports = { // Export functions and shit.
	type: type
};