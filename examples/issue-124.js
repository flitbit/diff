var diff = require('../');

var left = { key: [ {A: 0, B: 1}, {A: 2, B: 3} ] };
var right = { key: [ {A: 9, B: 1}, {A: 2, B: 3} ] };

var differences = diff(left, right);
// eslint-disable-next-line no-console
console.log(differences);
