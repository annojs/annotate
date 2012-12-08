#!/usr/bin/env node
var suite = require('suite.js');
var is = require('is-js');
var partial = require('funkit').partial;
var annotate = require('./annotate');

function add(a, b) {
    return a + b;
}

var addNumbers = annotate(add, is.number, is.number);

suite(partial(getMeta, addNumbers), [
    '_doc', undefined,
    '_invariants', [is.number, is.number],
    '_name', 'add'
]);

var addStrings = annotate(add, is.string, is.string, 'Appends two strings');

suite(partial(getMeta, addStrings), [
    '_doc', 'Appends two strings',
    '_invariants', [is.string, is.string],
    '_name', 'add'
]);

function getMeta(fn, name) {
    return fn[name];
}

// these yield warnings on purpose
addNumbers(5, 'a');
addNumbers('a', 'b');
