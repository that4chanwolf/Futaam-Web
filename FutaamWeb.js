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

if(fs.existsSync(__dirname + '/stats.json')) {
	var hits = JSON.parse(fs.readFileSync(__dirname + '/stats.json', 'utf8').trim())['hits']
	var pushHits = setInterval(function pHits() {
		fs.writeFile(__dirname + '/stats.json', JSON.stringify({
			'hits': hits
		}, null, '\t'), function(err) {
			if(err) console.error(err);
		});
	}, 60000);
} else {
	console.error(new Error("WARNING: stats.json file does not exist, exiting..."));
	process.exit(2);
}

app.configure(function configure() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', ejs.renderFile);
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.logger('dev'));
	app.use('/assets', express.static(__dirname + '/assets'));
	app.use(function(req, res, next) {
		if(/^\/view\/.*/i.test(req.url)) {
			hits++;
		}
		next();
	});
});

app.get('/', function main(req, res) { // Main page
	futaam.parse(db, function(data) {
		res.render('view', {
			dbname: data.name,
			dbdes: data.description,
			list: data.items
		});
	});
});

app.get('/view', function viewmain(req, res) { // Same as /
	futaam.parse(db, function(data) {
		res.render('view', {
			dbname: data.name,
			dbdes: data.description,
			list: data.items
		});
	});
});

app.get('/view/:animu', function viewanime(req, res) {
	futaam.parse(db, function(data) {
		for(var i in data.items) {
			if(data.items[i].name === req.params.animu) {
				var citem = data.items[i];
				res.render('view', {
					selected: citem,
					dbname: data.name,
					dbdes: data.description,
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
			res.status(500).json({
				error: 'unknown error'
			});
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
			res.status(500).json({
				error: 'unknown error'
			});			
		}
	});
});

app.get('/stats', function status(req, res) {
	futaam.parse(db, function fdata(futaamData) {
		info = {};

		info['name'] = futaamData['name'];
		info['des'] = futaamData['description'];

		info['count'] = futaamData['count'];

		info['ratios'] = {
			w: 0,
			c: 0,
			h: 0,
			q: 0,
			d: 0
		};
		info['numbers'] = {
			w: 0,
			c: 0,
			h: 0,
			q: 0,
			d: 0			
		};

		futaamData['items'].forEach(function(item) {
			info['ratios'][item.status]++;
			info['numbers'][item.status]++;
		});
		for(var i in info['ratios']) {
			info['ratios'][i] = (info['ratios'][i]/info['count']) * 100 + '%';
		};

		info['hits'] = hits;

		res.render('stats', info);
	});
});

app.listen(9001);