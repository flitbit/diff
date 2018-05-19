# deep-diff

[![CircleCI](https://circleci.com/gh/flitbit/diff.svg?style=svg)](https://circleci.com/gh/flitbit/diff)

[![NPM](https://nodei.co/npm/deep-diff.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/deep-diff/)

**deep-diff** is a javascript/node.js module providing utility functions for determining the structural differences between objects and includes some utilities for applying differences across objects.

## Install

```bash
npm install deep-diff
```

Possible v1.0.0 incompatabilities:

* elements in arrays are now processed in reverse order, which fixes a few nagging bugs but may break some users
  * If your code relied on the order in which the differences were reported then your code will break. If you consider an object graph to be a big tree, then `deep-diff` does a [pre-order traversal of the object graph](https://en.wikipedia.org/wiki/Tree_traversal), however, when it encounters an array, the array is processed from the end towards the front, with each element recursively processed in-order during further descent.

## Features

* Get the structural differences between two objects.
* Observe the structural differences between two objects.
* When structural differences represent change, apply change from one object to another.
* When structural differences represent change, selectively apply change from one object to another.

## Installation

```bash
npm install deep-diff
```

### Importing

#### nodejs

```javascript
var diff = require('deep-diff')
// or:
// const diff = require('deep-diff');
// const { diff } = require('deep-diff');
// or:
// const DeepDiff = require('deep-diff');
// const { DeepDiff } = require('deep-diff');
// es6+:
// import diff from 'deep-diff';
// import { diff } from 'deep-diff';
// es6+:
// import DeepDiff from 'deep-diff';
// import { DeepDiff } from 'deep-diff';
```

#### browser

```html
<script src="https://cdn.jsdelivr.net/npm/deep-diff@1/dist/deep-diff.min.js"></script>
```

> In a browser, `deep-diff` defines a global variable `DeepDiff`. If there is a conflict in the global namespace you can restore the conflicting definition and assign `deep-diff` to another variable like this: `var deep = DeepDiff.noConflict();`.

## Simple Examples

In order to describe differences, change revolves around an `origin` object. For consistency, the `origin` object is always the operand on the `left-hand-side` of operations. The `comparand`, which may contain changes, is always on the `right-hand-side` of operations.

``` javascript
var diff = require('deep-diff').diff;

var lhs = {
  name: 'my object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'elements']
  }
};

var rhs = {
  name: 'updated object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'more', 'elements', { than: 'before' }]
  }
};

var differences = diff(lhs, rhs);
```

*v 0.2.0 and above* The code snippet above would result in the following structure describing the differences:

``` javascript
[ { kind: 'E',
    path: [ 'name' ],
    lhs: 'my object',
    rhs: 'updated object' },
  { kind: 'E',
    path: [ 'details', 'with', 2 ],
    lhs: 'elements',
    rhs: 'more' },
  { kind: 'A',
    path: [ 'details', 'with' ],
    index: 3,
    item: { kind: 'N', rhs: 'elements' } },
  { kind: 'A',
    path: [ 'details', 'with' ],
    index: 4,
    item: { kind: 'N', rhs: { than: 'before' } } } ]
```

### Differences

Differences are reported as one or more change records. Change records have the following structure:

* `kind` - indicates the kind of change; will be one of the following:
  * `N` - indicates a newly added property/element
  * `D` - indicates a property/element was deleted
  * `E` - indicates a property/element was edited
  * `A` - indicates a change occurred within an array
* `path` - the property path (from the left-hand-side root)
* `lhs` - the value on the left-hand-side of the comparison (undefined if kind === 'N')
* `rhs` - the value on the right-hand-side of the comparison (undefined if kind === 'D')
* `index` - when kind === 'A', indicates the array index where the change occurred
* `item` - when kind === 'A', contains a nested change record indicating the change that occurred at the array index

Change records are generated for all structural differences between `origin` and `comparand`. The methods only consider an object's own properties and array elements; those inherited from an object's prototype chain are not considered.

Changes to arrays are recorded simplistically. We care most about the shape of the structure; therefore we don't take the time to determine if an object moved from one slot in the array to another. Instead, we only record the structural
differences. If the structural differences are applied from the `comparand` to the `origin` then the two objects will compare as "deep equal" using most `isEqual` implementations such as found in [lodash](https://github.com/bestiejs/lodash) or [underscore](http://underscorejs.org/).

### Changes

When two objects differ, you can observe the differences as they are calculated and selectively apply those changes to the origin object (left-hand-side).

``` javascript
var observableDiff = require('deep-diff').observableDiff;
var applyChange = require('deep-diff').applyChange;

var lhs = {
  name: 'my object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'elements']
  }
};

var rhs = {
  name: 'updated object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'more', 'elements', { than: 'before' }]
};

observableDiff(lhs, rhs, function (d) {
  // Apply all changes except to the name property...
  if (d.path[d.path.length - 1] !== 'name') {
    applyChange(lhs, rhs, d);
  }
});
```

## API Documentation

A standard import of `var diff = require('deep-diff')` is assumed in all of the code examples. The import results in an object having the following public properties:

* `diff(lhs, rhs, prefilter, acc)` &mdash; calculates the differences between two objects, optionally prefiltering elements for comparison, and optionally using the specified accumulator.
* `observableDiff(lhs, rhs, observer, prefilter)` &mdash; calculates the differences between two objects and reports each to an observer function, optionally, prefiltering elements for comparison.
* `applyDiff(target, source, filter)` &mdash; applies any structural differences from a source object to a target object, optionally filtering each difference.
* `applyChange(target, source, change)` &mdash; applies a single change record to a target object. NOTE: `source` is unused and may be removed.
* `revertChange(target, source, change)` reverts a single change record to a target object. NOTE: `source` is unused and may be removed.

### `diff`

The `diff` function calculates the difference between two objects.

#### Arguments

* `lhs` - the left-hand operand; the origin object.
* `rhs` - the right-hand operand; the object being compared structurally with the origin object.
* `prefilter` - an optional function that determines whether difference analysis should continue down the object graph.
* `acc` - an optional accumulator/array (requirement is that it have a `push` function). Each difference is pushed to the specified accumulator.

Returns either an array of changes or, if there are no changes, `undefined`. This was originally chosen so the result would be pass a truthy test:

```javascript
var changes = diff(obja, objb);
if (changes) {
  // do something with the changes.
}
```

#### Pre-filtering Object Properties

The `prefilter`'s signature should be `function(path, key)` and it should return a truthy value for any `path`-`key` combination that should be filtered. If filtered, the difference analysis does no further analysis of on the identified object-property path.

```javascript
const diff = require('deep-diff');
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
```

## Contributing

When contributing, keep in mind that it is an objective of `deep-diff` to have no package dependencies. This may change in the future, but for now, no-dependencies.

Please run the unit tests before submitting your PR: `npm test`. Hopefully your PR includes additional unit tests to illustrate your change/modification!

When you run `npm test`, linting will be performed and any linting errors will fail the tests... this includes code formatting.

> Thanks to all those who have contributed so far!
