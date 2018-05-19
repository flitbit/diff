const { log, inspect } = require('util');
const assert = require('assert');
const diff = require('../');

const o1 = {};
const o2 = {};
o1.foo = o1;
o2.foo = o2;

assert.notEqual(o1, o2, 'not same object');
assert.notEqual(o1.foo, o2.foo, 'not same object');

const differences = diff(o1, o2);
log(inspect(differences, false, 9));
