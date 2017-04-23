var deepDiff = require("../");

var a = {prop: {}};
var b = {prop: {}};

a.prop.circ = a.prop;
b.prop.circ = b;

console.log(deepDiff.diff(a, b));
