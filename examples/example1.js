var util = require('util'),
diff     = require('../index');

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

var differences = diff.diff(lhs, rhs);

// Print the differences to the console...
util.log(util.inspect(differences, false, 99));

diff.observableDiff(lhs, rhs, function (d) {
	// Apply all changes except those to the 'name' property...
	if (d.path.length !== 1 || d.path.join('.') !== 'name') {
		diff.applyChange(lhs, rhs, d);	
	}
});

console.log(util.inspect(lhs, false, 99));
