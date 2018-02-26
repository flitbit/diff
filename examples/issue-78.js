
const diff = require('../');
const ptr = require('json-ptr');

const inspect = require('util').inspect;


const objA = { array: [{ a: 1 }] };
const objB = { array: [{ a: 2 }] };

let changes = diff(objA, objB);
if (changes) {
  // decorate the changes using json-pointers
  for (let i = 0; i < changes.length; ++i) {
    let change = changes[i];
    // get the parent path:
    let pointer = ptr.create(change.path.slice(0, change.path.length - 1));
    if (change.kind === 'E') {
      change.elementLeft = pointer.get(objA);
      change.elementRight = pointer.get(objB);
    }
  }
}
console.log(inspect(changes, false, 9)); // eslint-disable-line no-console
