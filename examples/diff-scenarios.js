var util = require('util'),
expect   = require('expect.js'),
eql      = require('deep-equal'),
deep     = require('..')
extend   = util._extend;
diff     = deep.diff,
apply    = deep.applyDiff;

function f0() {};
function f1() {};

var one = { it: 'be one', changed: false, with: { nested: 'data'}, f: f1};
var two = { it: 'be two', updated: true, changed: true, with: {nested: 'data', and: 'other', plus: one} };
var circ = {};
var other = { it: 'be other', numero: 34.29, changed: [ { it: 'is the same' }, 13.3, 'get some' ], with: {nested: 'reference', plus: circ} };
var circular = extend(circ, { it: 'be circ', updated: false, changed: [ { it: 'is not same' }, 13.3, 'get some!', {extra: 'stuff'}], with: { nested: 'reference', circular: other } });

util.log(util.inspect(diff(one, two), false, 99));
util.log(util.inspect(diff(two, one), false, 99));

util.log(util.inspect(diff(other, circular), false, 99));

var clone = extend({}, one);
apply(clone, two);
util.log(util.inspect(clone, false, 99));

expect(eql(clone, two)).to.be(true);
expect(eql(clone, one)).to.be(false);

clone = extend({}, circular);
apply(clone, other);
util.log(util.inspect(clone, false, 99));
expect(eql(clone, other)).to.be(true);
expect(eql(clone, circular)).to.be(false);


var array = { name: 'array two levels deep', item: { arr: ['it', { has: 'data' }]}};
var arrayChange = { name: 'array change two levels deep', item: { arr: ['it', { changes: 'data' }]}};

util.log(util.inspect(diff(array, arrayChange), false, 99));
clone = extend({}, array);
apply(clone, arrayChange);
util.log(util.inspect(clone, false, 99));
expect(eql(clone, arrayChange)).to.be(true);

var one_prop = { one: 'property' };
var d = diff(one_prop, {});
expect(d.length).to.be(1);

