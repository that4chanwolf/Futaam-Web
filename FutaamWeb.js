var futaam = require('./lib/futaam'),
    express = require('express'),
    fs = require('fs'),
    ejs = require('ejs'),
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

app.configure(function configure() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', ejs.renderFile);
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.logger('dev'));
	app.use('/assets', express.static(__dirname + '/assets'));
});

app.get('/', function main(req, res) { // Main page
	futaam.parse(db, function(data) {
		res.render('view', {
			name: data.name,
			list: data.items
		});
	});
});

app.get('/view', function main(req, res) { // Same as /
	futaam.parse(db, function(data) {
		res.render('view', {
			name: data.name,
			list: data.items
		});
	});
});

app.get('/view/:animu', function(req, res) {
	futaam.parse(db, function(data) {
		for(var i in data.items) {
			if(data.items[i].name === req.params.animu) {
				var citem = data.items[i];
				res.render('view', {
					selected: citem,
					name: data.name,
					list: data.items
				});
				break;
			}
		}		
	});
});

app.get('/json', function jsonall(req, res) {
	futaam.parse(db, function(data) {
		if(typeof data === 'object') {
			res.json(data.items);
		} else {
			res.send('whoops');
		}
	});
});

app.get('/json/:animu', function jsonsingle(req, res) {
	futaam.parse(db, function(data) {
		if(typeof data === 'object') {
			for(var i in data.items) {
				if(data.items[i].name === req.params.animu) {
					res.json(data.items[i]);
					break;
				}
			}
		} else {
			res.status(500).send('whoops');
		}
	});
});

app.listen(9001);