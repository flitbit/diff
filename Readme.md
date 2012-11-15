# diff

Calculates the difference between two javascript objects.

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

### Differences

Differences are reported as one or more change records. Change records have the following structure:

* `kind` - indicates the kind of change; will be one of the following:
** `N` - indicates a newly added property/element
** `D` - indicates a property/element was deleted
** `E` - indicates a property/element was edited
** `A` - indicates a change occurred within an array
* `path` - the property path (from the left-hand-side root)
* `lhs` - the value on the left-hand-side of the comparison (undefined if kind === 'N')
* `rhs` - the value on the right-hand-side of the comparison (undefined if kind === 'D')
* `index` - when kind === 'A', indicates the array index where the change occurred
* `item` - when kind === 'A', contains a nested change record indicating the change that occurred at the array index 

Change records are generated for all structural differences between each object's own properties and array elements.
the prototype 
