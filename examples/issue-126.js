// This example shows how prefiltering can be used.

const diff = require('../'); // deep-diff
const { log, inspect } = require('util');
const assert = require('assert');

const data = {
  issue: 126,
  submittedBy: 'abuzarhamza',
  title: 'readme.md need some additional example prefilter',
  posts: [
    {
      date: '2018-04-16',
      text: `additional example for prefilter for deep-diff would be great.
      https://stackoverflow.com/questions/38364639/pre-filter-condition-deep-diff-node-js`
    }
  ]
};

const clone = JSON.parse(JSON.stringify(data));
clone.title = 'README.MD needs additional example illustrating how to prefilter';
clone.disposition = 'completed';

const two = diff(data, clone);
const none = diff(data, clone,
  (path, key) => path.length === 0 && ~['title', 'disposition'].indexOf(key)
);

assert.equal(two.length, 2, 'should reflect two differences');
assert.ok(typeof none === 'undefined', 'should reflect no differences');

log(inspect(two, false, 9));
log(inspect(none, false, 9));
