const { log, inspect } = require('util');
const diff = require('../');

var o1 = {};
var o2 = {};
o1.foo = o1;
o2.foo = {foo: o2};
const differences = diff(o1, o2);

log(inspect(differences, false, 9));

