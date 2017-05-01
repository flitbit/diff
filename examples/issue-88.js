var diff = require("../");

var before = {
  length: 3,
  data: [1, 2, 3]
};

var after = {
  data: [4, 5, 1, 2, 3],
  count: 5
};

var differences = diff(before, after);
console.log(differences);

function applyChanges(target, changes) {
  return changes.reduce(
    (acc, change) => {
      diff.applyChange(acc, true, change);
      return acc;
    },
    target
  );
}

console.log(applyChanges(before, differences));
