/*jshint indent:2, laxcomma:true, laxbreak:true*/
var util = require('util')
, deep   = require('..')
;

function duckWalk() {
  util.log('right step, left-step, waddle');
}

function quadrapedWalk() {
  util.log('right hind-step, right fore-step, left hind-step, left fore-step');
}

var duck = {
  legs: 2,
  walk: duckWalk
};

var dog = {
  legs: 4,
  walk: quadrapedWalk
};

var diff = deep.diff(duck, dog);

// The differences will include the legs, and walk.
util.log('Differences:\r\n' + util.inspect(diff, false, 9));


// To ignore behavioral differences (functions); use observableDiff and your own accumulator:

var observed = [];
deep.observableDiff(duck, dog, function (d) {
  if (d && d.lhs && typeof d.lhs !== 'function') {
    observed.push(d);
  }
});

util.log('Observed without recording functions:\r\n' + util.inspect(observed, false, 9));

util.log(util.inspect(dog, false, 9) + ' walking: ');
dog.walk();

// The purpose of the observableDiff fn is to allow you to observe and apply differences
// that make sense in your scenario...

// We'll make the dog act like a duck...
deep.observableDiff(dog, duck, function (d) {
  deep.applyChange(dog, duck, d);
});

util.log(util.inspect(dog, false, 9) + ' walking: ');
dog.walk();

// Now there are no differences between the duck and the dog:
if (deep.diff(duck, dog)) {
  util.log("Ooops, that prior statement seems to be wrong! (but it won't be)");
}

// Now assign an "equivalent" walk function...
dog.walk = function duckWalk() {
  util.log('right step, left-step, waddle');
};

if (diff = deep.diff(duck, dog)) {
  // The dog's walk function is an equivalent, but different duckWalk function.
  util.log('Hrmm, the dog walks differently: ' + util.inspect(diff, false, 9));
}

// Use the observableDiff fn to ingore based on behavioral equivalence...

observed = [];
deep.observableDiff(duck, dog, function (d) {
  // if the change is a function, only record it if the text of the fns differ:
  if (d && typeof d.lhs === 'function' && typeof d.rhs === 'function') {
    var leftFnText = d.lhs.toString();
    var rightFnText = d.rhs.toString();
    if (leftFnText !== rightFnText) {
      observed.push(d);
    }
  } else {
    observed.push(d);
  }
});

if (observed.length === 0) {
  util.log('Yay!, we detected that the walk functions are equivalent');
}