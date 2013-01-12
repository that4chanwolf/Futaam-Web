/*
 * Library to parse Futaam databases
 */

var fs = require('fs'),
    pickle = require('pickle');

/*
 * Determine which database type we're using
 * Arguments:
 * 	database name
 * Returns:
 * 	'pickle' for pickle databases
 * 	'json' for json databases
 * 	null for non-databases
 * Throws:
 * 	Error if argument supplied isn't a string
 */
var type = function type(dbname) {
	if(typeof dbname !== 'string') {
		throw new Error(".type() function not supplied valid database name");
	} else {
		var data = fs.readFileSync(dbname, 'utf8');
		var dbtype = [
			'pickle',
			'json'
		].indexOf(data.match(/^\[.*?\]\n/)[0].replace(/\[(.*)\]\n$/, '$1')); // Don't you just love the simplicity of regular expressions?
		if(dbtype !== -1) {
			return [
				'pickle',
				'json'
			][dbtype];
		} else {
			return null;
		}
	}
};

/*
 * Parse the database
 * Arguments:
 * 	database name
 * Returns:
 * 	Database object
 * Throws: 
 * 	Error if 1st argument supplied isn't a string
 * 	Error if 2nd argument supplied isn't a function
 * 	Error if database type of dbname is null
 */
var parse = function parse(dbname, cb) {
	if(typeof dbname !== 'string') {
		throw new Error(".parse() function not supplied valid database name");
	} else if(typeof cb !== 'function') {
		throw new Error(".parse() function not supplied valid callback");
	} else {
		if(typeof type(dbname) === null) {
			throw new Error("Database not a valid pickle or json database");
		} else {
			var data = fs.readFileSync(dbname, 'utf8').replace(/^\[.*?\]\n/, '').trim();
			switch(type(dbname)) {
				case "json":
					return cb(JSON.parse(data)); // Easy enough...
					break;
				case "pickle":
					pickle.loads(data, function UNPICKLETHATBITCH(unpickled) {
						cb(unpickled);
					});
					break;
				default:
					break;
			}
		}
	}
};

module.exports = { // Export functions and shit.
	type: type,
	parse: parse
};