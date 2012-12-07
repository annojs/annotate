# annotate.js - Asserts your function invariants

`annotate.js` allows you to attach certain metadata to your functions. For
instance you could document invariants of your function this way. In
addition you can attach an optional description you can access later on.

This metadata can be used by tools such as [suite.js](https://github.com/bebraw/suite.js)
in order to generate tests. In addition you can access the metadata via REPL.

The usage is quite simple as the following example illustrates:

```javascript
// let's define some function to annotate
function add(a, b) {
    return a + b;
}

// type checkers from is-js (https://npmjs.org/package/is-js)
var addNumbers = annotate(add, is.number, is.number, "Adds numbers");
var addStrings = annotate(add, is.string, is.string, "Adds strings");

// you can assert invariants too
var addPositiveNumbers = annotate(add, isPositive, isPositive, "Adds positive");

function isPositive(a) {
    return a >= 0;
}
```

The `annotate` function will create a new function that contains the metadata as
properties `\_doc` and `\_invariants`. In case an invariant does not pass during
execution, it won't execute. You will also receive a warning showing the status
of invariants.

## License

`annotate.js` is available under MIT. See LICENSE for more details.

