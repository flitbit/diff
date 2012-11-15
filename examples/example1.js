var util = require('util'),
diff     = require('../index').diff;

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

var differences = diff(lhs, rhs);
util.log(util.inspect(differences, false, 99));

