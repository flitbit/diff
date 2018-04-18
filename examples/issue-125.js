var diff = require('../');

const left = {
  nested: {
    param1: null,
    param2: null
  }
};

const right = {
  nested: {
    param1: null,
    param2: null
  }
};

var differences = diff(left, right);
// eslint-disable-next-line no-console
console.log(differences);
