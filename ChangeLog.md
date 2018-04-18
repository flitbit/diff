# deep-diff Change Log

**deep-diff** is a javascript/node.js module providing utility functions for determining the structural differences between objects and includes some utilities for applying differences across objects.

## Log

`1.0.0` - 2018-04-18

* reverted to [UMD style module](https://github.com/umdjs/umd) rather than the ES6 style, which evidently, broke lots of people's previously working code.
* fixed some bugs... see `examples/issue-XXx.js` for each issue I believe is fixed in this version.
* Closed:
  * [#63 diff of equal objects should return empty array](https://github.com/flitbit/diff/issues/63)
  * [#115 Remove second argument of applyChange from public api](https://github.com/flitbit/diff/issues/115)
* Resolved:
  * [#78 FeatureRequest: change the diff of array elements (or add such an option)](https://github.com/flitbit/diff/issues/78)
* Fixed:
  * [#47 Deleting Array elements](https://github.com/flitbit/diff/issues/47)
  * [#111 Crash when comparing two undefined](https://github.com/flitbit/diff/issues/111)

`0.3.8` - 2017-05-03

* reconciled recently introduced difference between `index.es.js` and `index.js`
* improved npm commands for more reliable contributions
* added a few notes to README regarding contributing.

`0.3.7` - 2017-05-01

* fixed issue #98 by merging @sberan's pull request #99 &mdash; better handling of property with `undefined` value existing on either operand. Unit tests supplied.

`0.3.6` - 2017-04-25 &mdash; Fixed, closed lingering issues:

* fixed #74 &mdash; comparing objects with longer cycles
* fixed #70 &mdash; was not properly detecting a deletion when a property on the operand (lhs) had a value of `undefined` and was _undefined_ on the comparand (rhs). :o).
* WARNING! [Still broken when importing in Typescript](https://github.com/flitbit/diff/issues/97).

`0.3.5` - 2017-04-23 &mdash; Rolled up recent fixes; patches:

* @stevemao &mdash; #79, #80: now testing latest version of node4
* @mortonfox &mdash; #85: referencing mocha's new home
* @tdebarochez &mdash; #90: fixed error when .toString not a function
* @thiamsantos &mdash; #92, #93: changed module system for improved es2015 modules. WARNING! [This PR broke importing `deep-diff` in Typescript as reported by @kgentes in #97](https://github.com/flitbit/diff/issues/97)

`0.3.4` - Typescript users, reference this version until #97 is fixed!

`0.3.3` - Thanks @SimenB: enabled npm script for release (alternate to the Makefile). Also linting as part of `npm test`. Thanks @joeldenning: Fixed issue #35; diffs of top level arrays now working.

`0.3.3` - Thanks @SimenB: enabled npm script for release (alternate to the Makefile). Also linting as part of `npm test`. Thanks @joeldenning: Fixed issue #35; diffs of top level arrays now working.

`0.3.2` - Resolves #46; support more robust filters by including `lhs` and `rhs` in the filter callback. By @Orlando80

`0.3.1` - Better type checking by @Drinks, UMD wrapper by @SimenB. Now certifies against nodejs 12 and iojs (Thanks @SimenB).

`0.2.0` - [Fixes Bug #17](https://github.com/flitbit/diff/issues/17), [Fixes Bug #19](https://github.com/flitbit/diff/issues/19), [Enhancement #21](https://github.com/flitbit/diff/issues/21) Applying changes that are properly structured can now be applied as a change (no longer requires typeof Diff) - supports differences being applied after round-trip serialization to JSON format. Prefilter now reports the path of all changes - it was not showing a path for arrays and anything in the structure below (reported by @ravishvt).

*Breaking Change* &ndash; The structure of change records for differences below an array element has changed. Array indexes are now reported as numeric elements in the `path` if the changes is merely edited (an `E` kind). Changes of kind `A` (array) are only reported for changes in the terminal array itself and will have a nested `N` (new) item or a nested `D` (deleted) item.

`0.1.7` - [Enhancement #11](https://github.com/flitbit/diff/issues/11) Added the ability to filter properties that should not be analyzed while calculating differences. Makes `deep-diff` more usable with frameworks that attach housekeeping properties to existing objects. AngularJS does this, and the new filter ability should ease working with it.

`0.1.6` - Changed objects within nested arrays can now be applied. They were previously recording the changes appropriately but `applyDiff` would error. Comparison of `NaN` works more sanely - comparison to number shows difference, comparison to another `Nan` does not.