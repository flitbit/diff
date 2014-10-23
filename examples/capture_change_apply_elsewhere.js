/*jshint indent:2, laxcomma:true, laxbreak:true*/
var util = require('util')
, assert = require('assert')
, diff = require('..')
, data = require('./practice-data')
;

var i = Math.floor(Math.random() * data.length) + 1;
var j = Math.floor(Math.random() * data.length) + 1;

while (j === i) {
  j = Math.floor(Math.random() * data.length) + 1;
}

var source = data[i];
var comparand = data[j];

// source and comparand are different objects
assert.notEqual(source, comparand);

// source and comparand have differences in their structure
assert.notDeepEqual(source, comparand);

// record the differences between source and comparand
var changes = diff(source, comparand);

// apply the changes to the source
changes.forEach(function (change) {
  diff.applyChange(source, true, change);
});

// source and copmarand are now deep equal
assert.deepEqual(source, comparand);

// Simulate serializing to a remote copy of the object (we've already go a copy, copy the changes)...

var remote = JSON.parse(JSON.stringify(source));
var remoteChanges = JSON.parse(JSON.stringify(changes));

// source and remote are different objects
assert.notEqual(source, remote);

// changes and remote changes are different objects
assert.notEqual(changes, remoteChanges);

// remote and comparand are different objects
assert.notEqual(remote, comparand);

remoteChanges.forEach(function (change) {
  diff.applyChange(remote, true, change);
});

assert.deepEqual(remote, comparand);
