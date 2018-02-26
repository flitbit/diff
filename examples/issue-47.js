var diff = require('../');
var expect = require('expect.js');

var thing1 = 'this';
var thing2 = 'that';
var thing3 = 'other';
var thing4 = 'another';

var oldArray = [thing1, thing2, thing3, thing4];
var newArray = [thing1, thing2];

diff.observableDiff(oldArray, newArray,
  function (d) {
    diff.applyChange(oldArray, newArray, d);
  });

expect(oldArray).to.eql(newArray);
