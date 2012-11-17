# diff

*diff* is a javascript module providing utility methods for working with the structural differences between two objects.

In order to describe differences, change revolves around an `origin` object. For consistency, the `origin` object is always the operand on the `left-hand-side` of operations. The other object, our `comparand` is always on the `right-hand-side` of operations.

``` javascript
var diff = require('diff').diff;

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
The code snippet above would result in the following structure describing the differences:
``` javascript
[ { kind: 'E',
    path: [ 'name' ],
    lhs: 'my object',
    rhs: 'updated object' },
  { kind: 'A',
    path: [ 'details', 'with' ],
    index: 2,
    item: { kind: 'E', path: [], lhs: 'elements', rhs: 'more' } },
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

Change records are generated for all structural differences between each object's own properties and array elements.
the prototype

### Changes

When two objects differ, you can observe the differences as they are calculated and selectively apply those changes to the origin object (left-hand-side).
``` javascript
var observableDiff = require('diff').observableDiff,
applyChange        = require('diff').applyChange;

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

observableDiff(lhs, rhs, function (d) {
	// Apply all changes except those to the 'name' property...
	if (d.path.length !== 1 || d.path.join('.') !== 'name') {
		applyChange(lhs, rhs, d);	
	}
}); 
```
