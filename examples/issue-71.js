var diff = require('../');

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

console.log(diff(left, right)); // eslint-disable-line no-console
