;(function(undefined) {
	"use strict";

	var $scope
	, conflict, conflictResolution = [];
	if (typeof global == 'object' && global) {
		$scope = global;
	} else if (typeof window !== 'undefined'){
		$scope = window;
	} else {
		$scope = {};
	}
	conflict = $scope.DeepDiff;
	if (conflict) {
		conflictResolution.push(
			function() {
				if ('undefined' !== typeof conflict && $scope.DeepDiff === accumulateDiff) {
					$scope.DeepDiff = conflict;
					conflict = undefined;
				}
			});
	}

	// nodejs compatible on server side and in the browser.
  function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  }

  function Diff(kind, path) {
  	Object.defineProperty(this, 'kind', { value: kind, enumerable: true });
  	if (path && path.length) {
  		Object.defineProperty(this, 'path', { value: path, enumerable: true });
  	}
  }

  function DiffEdit(path, origin, value) {
  	DiffEdit.super_.call(this, 'E', path);
  	Object.defineProperty(this, 'lhs', { value: origin, enumerable: true });
  	Object.defineProperty(this, 'rhs', { value: value, enumerable: true });
  }
  inherits(DiffEdit, Diff);

  function DiffNew(path, value) {
  	DiffNew.super_.call(this, 'N', path);
  	Object.defineProperty(this, 'rhs', { value: value, enumerable: true });
  }
  inherits(DiffNew, Diff);

  function DiffDeleted(path, value) {
  	DiffDeleted.super_.call(this, 'D', path);
  	Object.defineProperty(this, 'lhs', { value: value, enumerable: true });
  }
  inherits(DiffDeleted, Diff);

  function DiffArray(path, index, item) {
  	DiffArray.super_.call(this, 'A', path);
  	Object.defineProperty(this, 'index', { value: index, enumerable: true });
  	Object.defineProperty(this, 'item', { value: item, enumerable: true });
  }
  inherits(DiffArray, Diff);

  function arrayRemove(arr, from, to) {
  	var rest = arr.slice((to || from) + 1 || arr.length);
  	arr.length = from < 0 ? arr.length + from : from;
  	arr.push.apply(arr, rest);
  	return arr;
  }

  function deepDiff(lhs, rhs, changes, prefilter, path, key, stack) {
  	path = path || [];
  	var currentPath = path.slice(0);
  	if (key) {
  		if (prefilter && prefilter(currentPath, key)) return;
  		currentPath.push(key);
  	}
  	var ltype = typeof lhs;
  	var rtype = typeof rhs;
  	if (ltype === 'undefined') {
  		if (rtype !== 'undefined') {
  			changes(new DiffNew(currentPath, rhs ));
  		}
  	} else if (rtype === 'undefined') {
  		changes(new DiffDeleted(currentPath, lhs));
  	} else if (ltype !== rtype) {
  		changes(new DiffEdit(currentPath, lhs, rhs));
  	} else if (lhs instanceof Date && rhs instanceof Date && ((lhs-rhs) != 0) ) {
  		changes(new DiffEdit(currentPath, lhs, rhs));
  	} else if (ltype === 'object' && lhs != null && rhs != null) {
  		stack = stack || [];
  		if (stack.indexOf(lhs) < 0) {
  			stack.push(lhs);
  			if (Array.isArray(lhs)) {
  				var i
  				, len = lhs.length
  				, ea = function(d) {
  					changes(new DiffArray(currentPath, i, d));
  				};
  				for(i = 0; i < lhs.length; i++) {
  					if (i >= rhs.length) {
  						changes(new DiffArray(currentPath, i, new DiffDeleted(undefined, lhs[i])));
  					} else {
  						deepDiff(lhs[i], rhs[i], ea, prefilter, [], null, stack);
  					}
  				}
  				while(i < rhs.length) {
  					changes(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i++])));
  				}
  			} else {
  				var akeys = Object.keys(lhs);
  				var pkeys = Object.keys(rhs);
  				akeys.forEach(function(k) {
  					var i = pkeys.indexOf(k);
  					if (i >= 0) {
  						deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack);
  						pkeys = arrayRemove(pkeys, i);
  					} else {
  						deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack);
  					}
  				});
  				pkeys.forEach(function(k) {
  					deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack);
  				});
  			}
  			stack.length = stack.length - 1;
  		}
  	} else if (lhs !== rhs) {
      if(!(ltype === "number" && isNaN(lhs) && isNaN(rhs))) {
  		  changes(new DiffEdit(currentPath, lhs, rhs));
      }
  	}
  }

  function accumulateDiff(lhs, rhs, prefilter, accum) {
  	accum = accum || [];
  	deepDiff(lhs, rhs,
  		function(diff) {
  			if (diff) {
  				accum.push(diff);
  			}
  		},
  		prefilter);
  	return (accum.length) ? accum : undefined;
  }

	function applyArrayChange(arr, index, change) {
		if (change.path && change.path.length) {
			// the structure of the object at the index has changed...
			var it = arr[index], i, u = change.path.length - 1;
			for(i = 0; i < u; i++){
				it = it[change.path[i]];
			}
			switch(change.kind) {
				case 'A':
					// Array was modified...
					// it will be an array...
					applyArrayChange(it[change.path[i]], change.index, change.item);
					break;
				case 'D':
					// Item was deleted...
					delete it[change.path[i]];
					break;
				case 'E':
				case 'N':
					// Item was edited or is new...
					it[change.path[i]] = change.rhs;
					break;
			}
		} else {
			// the array item is different...
			switch(change.kind) {
				case 'A':
					// Array was modified...
					// it will be an array...
					applyArrayChange(arr[index], change.index, change.item);
					break;
				case 'D':
					// Item was deleted...
					arr = arrayRemove(arr, index);
					break;
				case 'E':
				case 'N':
					// Item was edited or is new...
					arr[index] = change.rhs;
					break;
			}
		}
		return arr;
	}

	function applyChange(target, source, change) {
		if (!(change instanceof Diff)) {
			throw new TypeError('[Object] change must be instanceof Diff');
		}
		if (target && source && change) {
			var it = target, i, u;
			u = change.path.length - 1;
			for(i = 0; i < u; i++){
				if (typeof it[change.path[i]] === 'undefined') {
					it[change.path[i]] = {};
				}
				it = it[change.path[i]];
			}
			switch(change.kind) {
				case 'A':
					// Array was modified...
					// it will be an array...
					applyArrayChange(it[change.path[i]], change.index, change.item);
					break;
				case 'D':
					// Item was deleted...
					delete it[change.path[i]];
					break;
				case 'E':
				case 'N':
					// Item was edited or is new...
					it[change.path[i]] = change.rhs;
					break;
				}
			}
		}

	function applyDiff(target, source, filter) {
		if (target && source) {
			var onChange = function(change) {
				if (!filter || filter(target, source, change)) {
					applyChange(target, source, change);
				}
			};
			deepDiff(target, source, onChange);
		}
	}

	Object.defineProperties(accumulateDiff, {

		diff: { value: accumulateDiff, enumerable:true },
		observableDiff: { value: deepDiff, enumerable:true },
		applyDiff: { value: applyDiff, enumerable:true },
		applyChange: { value: applyChange, enumerable:true },
		isConflict: { get: function() { return 'undefined' !== typeof conflict; }, enumerable: true },
		noConflict: {
			value: function () {
				if (conflictResolution) {
					conflictResolution.forEach(function (it) { it(); });
					conflictResolution = null;
				}
				return accumulateDiff;
			},
			enumerable: true
		}
	});

	if (typeof module != 'undefined' && module && typeof exports == 'object' && exports && module.exports === exports) {
		module.exports = accumulateDiff; // nodejs
	} else {
		$scope.DeepDiff = accumulateDiff; // other... browser?
	}
}());

