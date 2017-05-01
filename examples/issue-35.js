var deep = require("../");

var lhs = ["a","a"];
var rhs = ["a"];
var differences = deep.diff(lhs, rhs);
differences.forEach(function (change) {
        deep.applyChange(lhs, true, change);
});

console.log(lhs);
console.log(rhs);
