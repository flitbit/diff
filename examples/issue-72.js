var diff = require('../');

var before = {
  data: [1, 2, 3]
};

var after = {
  data: [4, 5, 1]
};

var differences = diff(before, after);
console.log(differences); // eslint-disable-line no-console
differences.reduce(
  (acc, change) => {
    diff.revertChange(acc, true, change);
    return acc;
  },
  after
);

console.log(after); // eslint-disable-line no-console
