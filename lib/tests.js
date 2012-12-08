#!/usr/bin/env node
var suite = require('suite.js');
var is = require('is-js');
var partial = require('funkit').partial;
var annotate = require('./annotate');

var noDispatch = annotate('noDispatch', 'No dispatch');
noDispatch(); // should yield a warning (no operation)

var addNumber = annotate('addNumber').on(is.number, add);

suite(partial(getMeta, addNumber), [
    '_doc', '',
    '_invariants', [[is.number]],
    '_name', 'addNumber'
]);

var addNumbers = annotate('addNumbers', 'Adds numbers')
    .on(is.number, is.number, add);

suite(partial(getMeta, addNumbers), [
    '_doc', 'Adds numbers',
    '_invariants', [[is.number, is.number]],
    '_name', 'addNumbers'
]);

var addString = annotate()
    .on(is.string, add);

suite(partial(getMeta, addString), [
    '_doc', '',
    '_invariants', [[is.string]],
    '_name', ''
]);

var addStrings = annotate('addStrings', 'Appends two strings')
    .on(is.string, is.string, add);

suite(partial(getMeta, addStrings), [
    '_doc', 'Appends two strings',
    '_invariants', [[is.string, is.string]],
    '_name', 'addStrings'
]);

var fib = annotate('fib', 'Calculates Fibonacci numbers').on(0, 0).on(1, 1)
    .on(is.number, function(n) {
        return fib(n - 1) + fib(n - 2);
    });

suite(partial(getMeta, fib), [
    '_doc', 'Calculates Fibonacci numbers',
    '_invariants', [[0], [1], [is.number]],
    '_name', 'fib'
]);

fibo('foobar'); // should yield a warning

function add(a, b) {
    return a + b;
}

function getMeta(fn, name) {
    return fn[name];
}
