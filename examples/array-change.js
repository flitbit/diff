/*jshint indent:2, laxcomma:true, laxbreak:true*/
var util = require('util');
var expect = require('expect.js');
var deep = require('..');

var lhs = {
  'id': 'Release',
  'phases': [{
    'id': 'Phase1',
    'tasks': [
      { 'id': 'Task1' },
      { 'id': 'Task2' }
    ]
  }, {
    'id': 'Phase2',
    'tasks': [
      { 'id': 'Task3' }
    ]
  }]
};
var rhs = {
  'id': 'Release',
  'phases': [{
    // E: Phase1 -> Phase2
    'id': 'Phase2',
    'tasks': [
      { 'id': 'Task3' }
    ]
  }, {
    'id': 'Phase1',
    'tasks': [
      { 'id': 'Task1' },
      { 'id': 'Task2' }
    ]
  }]
};

var diff = deep.diff(lhs, rhs);
console.log(util.inspect(diff, false, 9)); // eslint-disable-line no-console

deep.applyDiff(lhs, rhs);
console.log(util.inspect(lhs, false, 9)); // eslint-disable-line no-console

expect(lhs).to.be.eql(rhs);

