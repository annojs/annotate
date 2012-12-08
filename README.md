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
var addNumbers = annotate('addNumbers', 'Adds numbers')
    .on(is.number, is.number, add);
var addStrings = annotate('addStrings', 'Adds strings')
    .on(is.string, is.string, add);

// you can assert invariants too
var addPositive = annotate('addPositive', 'Adds positive')
    .on(isPositive, isPositive, add);

// it is possible to chain guards
var fib = annotate('fib', 'Calculates Fibonacci numbers')
    .on(0, 0).on(1, 1)
    .on(is.number, function(n) {
        return fib(n - 1) + fib(n - 2);
    });

function isPositive(a) {
    return a >= 0;
}
```

The `annotate` function will create a new function that contains the metadata as
properties `\_name`, `\_doc` and `\_invariants`. In case an invariant does not
pass during execution, it won't execute and gives a warning instead.

## Acknowledgements

* [Kris Jordan](http://krisjordan.com/)'s [multimethod.js](http://krisjordan.com/multimethod-js) - Provided inspiration for the API

## License

`annotate.js` is available under MIT. See LICENSE for more details.

