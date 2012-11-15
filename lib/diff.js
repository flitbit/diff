({ define: typeof define === "function" 
	? define // browser
	: function(F) { F(require,exports,module); } }).  // Node.js
	define(function (require, exports, module) {
		"use strict";
		
		function arrayRemove(arr, from, to) {
			var rest = arr.slice((to || from) + 1 || arr.length);
			arr.length = from < 0 ? arr.length + from : from;
			arr.push.apply(arr, rest);
			return arr;
		} 

		var recordDifferences;

		function deepDiff(lhs, rhs, changes, path, key, stack) {
			path = path || [];
			var currentPath = path.slice(0);
			if (key) { currentPath.push(key); }
			var ltype = typeof lhs;
			var rtype = typeof rhs;
			if (ltype === 'undefined') {
				if (rtype !== 'undefined') { 
					changes({kind: 'N', path: currentPath, rhs: rhs });
				}
			} else if (rtype === 'undefined') {
				changes({kind: 'D', path: currentPath, lhs: lhs});
			} else if (ltype !== rtype) { 
				changes({kind: 'E', path: currentPath, lhs: lhs, rhs: rhs});
			} else if (ltype === 'object') {
				stack = stack || [];
				if (stack.indexOf(lhs) < 0) {
					stack.push(lhs);
					if (Array.isArray(lhs)) {
						var i, ea = function(d) {
							changes({
								kind: 'A', 
								path: currentPath, 
								index: i,
								item: d
							});
						};
						for(i = 0; i < lhs.length; i++) {
							if (i >= rhs.length) {
								changes({
									kind: 'A', 
									path: currentPath, 
									index: i,
									item: { 
										kind: 'D',
										lhs: lhs[i] }
								});
							} else {
								deepDiff(lhs[i], rhs[i], ea, [], null, stack);
							} 
						}
						while(i < rhs.length) {
							changes({
								kind: 'A', 
								path: currentPath, 
								index: i,
								item: { 
									kind: 'N',
									rhs: rhs[i++] }
							}); 
						}
					} else { 
						var akeys = Object.keys(lhs);
						var pkeys = Object.keys(rhs);
						akeys.forEach(function(k) {
							var i = pkeys.indexOf(k);
							if (i >= 0) {
								deepDiff(lhs[k], rhs[k], changes, currentPath, k, stack);	
								pkeys = arrayRemove(pkeys, i); 
							} else {
								deepDiff(lhs[k], undefined, changes, currentPath, k, stack);	
							}
						});
						pkeys.forEach(function(k) { 
							deepDiff(undefined, rhs[k], changes, currentPath, k, stack);	
						});
					}
					stack.length = stack.length - 1;
				}
			} else if (lhs !== rhs) {
				changes({kind: 'E', path: currentPath, lhs: lhs, rhs: rhs});
			}
		}

		function accumulateDiff(lhs, rhs, accum) {
			accum = accum || [];
			deepDiff(lhs, rhs, function(diff) {
				if (diff) {
					accum.push(diff);
				} 
			});
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
						applyArrayChange(it, change.index, change.item);
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
			if (target && source && change) {
				var it = target, i, u;
				u = change.path.length - 1; 
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

	exports.diff = accumulateDiff;
	exports.observableDiff = deepDiff;
	exports.applyDiff = applyDiff;
	exports.applyChange = applyChange;
	});

