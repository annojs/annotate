#!/usr/bin/env node
var suite = require('suite.js');
var is = require('is-js');
var partial = require('funkit').partial;
var annotate = require('./annotate');

var noDispatch = annotate('noDispatch', 'No dispatch');
noDispatch(); // should yield a warning (no operation)

var addNumber = annotate('addNumber').on(is.number, add);
aSuite(addNumber, '', [[is.number]], 'addNumber');

var addNumbers = annotate('addNumbers', 'Adds numbers')
    .on(is.number, is.number, add);
aSuite(addNumbers, 'Adds Numbers', [[is.number, is.number]], 'addNumbers');

var addString = annotate().on(is.string, add);
aSuite(addString, '', [[is.string]], '');

var addStrings = annotate('addStrings', 'Appends two strings')
    .on(is.string, is.string, add);
aSuite(addStrings, 'Appends two strings', [[is.string, is.string]], 'addStrings');

var fib = annotate('fib', 'Calculates Fibonacci numbers').on(0, 0).on(1, 1)
    .on(is.number, function(n) {
        return fib(n - 1) + fib(n - 2);
    });
aSuite(fib, 'Calculates Fibonacci numbers', [[0], [1], [is.number]], 'fib');

fibo('foobar'); // should yield a warning

function aSuite(fn, doc, invariants, name) {
    return suite(partial(getMeta, fn), [
        '_doc', doc,
        '_invariants', invariants,
        '_name', name
    ]);
}

function add(a, b) {
    return a + b;
}

function getMeta(fn, name) {
    return fn[name];
}
