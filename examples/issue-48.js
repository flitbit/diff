
var dd = require('../'); // deep-diff
var inspect = require('util').inspect;
var expect = require('expect.js');

var before = {
  name: 'my object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'elements']
  }
};

var after = {
  name: 'updated object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'more', 'elements', { than: 'before' }]
  }
};

var revertDiff = function (src, d) {
  d.forEach(function (change) {
    dd.revertChange(src, true, change);
  });
  return src;
};

var clone = function (src) {
  return JSON.parse(JSON.stringify(src));
};

var df = dd.diff(before, after);
var b1 = clone(before);
var a1 = clone(after);

console.log(inspect(a1, false, 9)); // eslint-disable-line no-console

var reverted = revertDiff(a1, df);
console.log(inspect(reverted, false, 9)); // eslint-disable-line no-console
console.log(inspect(b1, false, 9)); // eslint-disable-line no-console

expect(reverted).to.eql(b1);

