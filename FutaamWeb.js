var futaam = require('./lib/futaam'),
    express = require('express'),
    fs = require('fs'),
    app = express(),
    args = require('argparser').vals("db").parse(),
    db;

// Test to see if our database actually exists
if(!fs.existsSync(args.opt("db"))) {
	console.error(new Error("WARNING: Database file does not exist, exiting..."));
	process.exit(1);
} else {
	db = args.opt("db")
}

app.get('/json', function(req, res) {
	futaam.parse(db, function(test) {
		if(typeof test === 'object') {
			res.json(test.items);
		} else {
			res.send('whoops');
		}
	});
});

app.get('/json/:animu', function(req, res) {
	futaam.parse(db, function(test) {
		if(typeof test === 'object') {
			for(var i in test.items) {
				if(test.items[i].name === req.params.animu) {
					res.json(test.items[i]);
					break;
				}
			}
		} else {
			res.status(500).send('whoops');
		}
	});
});

app.listen(9001);