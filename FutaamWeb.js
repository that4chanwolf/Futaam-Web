var futaam = require('./lib/futaam'),
    express = require('express'),
    fs = require('fs'),
    args = require('argparser').vals("db", "interface").parse();

// Test to see if our database actually exists
if(!fs.existsSync(args.opt("db"))) {
	console.error(new Error("WARNING: Database file does not exist, exiting..."));
	process.exit(1);
}

