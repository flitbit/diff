var deep = require("../");

var a = {};
var b = {};
a.x = b;
b.x = b;
deep.diff(a, b);  // True

a.x = a;  // Change to a
// No change to b
console.log(deep.diff(a, b));  // Still true...
