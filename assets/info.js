var $ = function(selector, root) {
	if(root == null) {
		root = document.body;
	}
	return Array.prototype.slice.call(root.querySelectorAll(selector));
};
var get = function get(name, cb) {
	var xhr = XMLHttpRequest(),
	res;
	name = unescape(name.replace(/ /g, '+').toLowerCase());
	xhr.open("GET", "http://mal-api.com/anime/search?q=" + name, false);
	xhr.send();
	if(xhr.status === 200) {
		res = JSON.parse(xhr.responseText);
		if(cb) {
			return cb(res);
		} else {
			return cb;
		}
	}
};
var set = function set(info, cb) {
	if(typeof info === 'undefined' && info === null) {
		throw new Error("Info not supplied to set()");
	}
	for(var i in info) {
		console.log(info[i]);
		if(info[i].title === $('div.hero-unit h2')[0].textContent) {
			var img = $('div.hero-unit img')[0],
			    des = $('div.hero-unit p#description')[0];
			    
			var synopsis = info[i].synopsis.replace(/<(.*?)>/gi, '');
			
			if(/\.{3}$/.test(synopsis)) {
				synopsis += " <a href='http://myanimelist.net/anime/" + info[i].id + "' title='lolmal'>[READ MORE]</a>";
			}
			
			img.src = info[i].image_url.replace(/t\.(jpg|png|gif)$/,'\.$1');
			des.innerHTML = "Description: " + synopsis;
			break;
		}
	}
};
document.addEventListener('DOMContentLoaded', function() {
	get($('div.hero-unit h2')[0].textContent, function(data) {
		set(data);
	});
});
