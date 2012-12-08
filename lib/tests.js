#!/usr/bin/env node
var suite = require('suite.js');
var is = require('is-js');
var partial = require('funkit').partial;
var annotate = require('./annotate');

var noDispatch = annotate('noDispatch', 'No dispatch');
noDispatch(); // should yield a warning (no operation)

var addNumber = annotate('addNumber').on(is.number, add);
aSuite(addNumber, '', [[is.number]], 'addNumber');
suite(addNumber, [
    [1, 'a'], '1a'
]);

addNumber('foo', 'bar'); // should yield a warning

var addNumbers = annotate('addNumbers', 'Adds numbers')
    .on(is.number, is.number, add);
aSuite(addNumbers, 'Adds numbers', [[is.number, is.number]], 'addNumbers');
suite(addNumbers, [
    [1, 2], 3
]);

var addString = annotate().on(is.string, add);
aSuite(addString, '', [[is.string]], '');
suite(addString, [
    ['a', 1], 'a1'
]);

var addStrings = annotate('addStrings', 'Appends two strings')
    .on(is.string, is.string, add);
aSuite(addStrings, 'Appends two strings', [[is.string, is.string]], 'addStrings');
suite(addStrings, [
    ['a', 'b'], 'ab'
]);

var addMultiple = annotate('addMultiple', 'Adds multiple')
    .on(is.number, is.number, add)
    .on(is.string, is.string, add);
aSuite(addMultiple, 'Adds multiple', [[is.number, is.number], [is.string, is.string]], 'addMultiple');
suite(addMultiple, [
    ['a', 'b'], 'ab',
    [1, 2], 3
]);

var fib = annotate('fib', 'Calculates Fibonacci numbers').on(0, 0).on(1, 1)
    .on(is.number, function(n) {
        return fib(n - 1) + fib(n - 2);
    });
aSuite(fib, 'Calculates Fibonacci numbers', [[0], [1], [is.number]], 'fib');
suite(fib, [
    0, 0,
    1, 1,
    2, 1,
    12, 144
]);

fib('foobar'); // should yield a warning

function aSuite(fn, doc, invariants, name) {
    suite(partial(getMeta, fn), [
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
