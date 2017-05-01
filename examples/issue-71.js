var deepDiff = require("../");

var left = {
  left: 'yes',
  right: 'no',
};

var right = {
  left: {
    toString: true,
  },
  right: 'no',
};

console.log(deepDiff(left, right));
