'use strict';

var dd     = require('../'); // deep-diff

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

var revertDiff = function(src, d) {
    d.forEach(function (change) {
        dd.revertChange(src, true, change);
    });
    return src;
};

var clone = function(src) {
    return JSON.parse(JSON.stringify(src));
};

var df = dd.diff(before, after);
var b1 = clone(before);
var a1 = clone(after);

console.log(JSON.stringify(after));
console.log(JSON.stringify(revertDiff(after, df)));
console.log(JSON.stringify(b1 ));