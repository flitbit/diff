var deep = require("../");

// https://github.com/flitbit/diff/issues/62#issuecomment-229549984
// 3: appears to be fixed, probably in fixing #74.

var a = {};
var b = {};
a.x = b;
b.x = b;
deep.diff(a, b);  // True

a.x = a;  // Change to a
// No change to b
console.log(deep.diff(a, b));  // Still true...
