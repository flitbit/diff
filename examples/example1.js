var util = require('util')
, deep   = require('..')
;

var lhs = {
	name: 'my object',
	description: 'it\'s an object!',
	details: {
		it: 'has',
		an: 'array',
		with: ['a', 'few', 'elements']
	}
};

var rhs = {
	name: 'updated object',
	description: 'it\'s an object!',
	details: {
		it: 'has',
		an: 'array',
		with: ['a', 'few', 'more', 'elements', { than: 'before' }]
	}
};

var differences = deep.diff(lhs, rhs);

// Print the differences to the console...
util.log(util.inspect(differences, false, 99));

deep.observableDiff(lhs, rhs, function (d) {
	// Apply all changes except those to the 'name' property...
	if (d.path.length !== 1 || d.path.join('.') !== 'name') {
		deep.applyChange(lhs, rhs, d);
	}
}, function (path, key) {
	var p = (path && path.length) ? path.join('/') : '<no-path>'
	util.log('prefilter: path = ' + p + ' key = ' + key);
}
);

console.log(util.inspect(lhs, false, 99));
