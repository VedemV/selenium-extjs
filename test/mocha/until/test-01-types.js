'use strict';

const assertTrue = require('assert').ok;
const assertEqual = require('assert').equal;
const assertDeepEqual = require('assert').deepEqual;
const assertThrows = require('assert').throws;
const assertNotThrows = require('assert').doesNotThrow;
const assertError = require('assert').ifError;

const types = require(process.cwd()+'/lib/until/types');

console.log('=>', __filename);

describe('until.types:', function(){

	describe('trueType', function(){
		it('undefined type of undefined', () => {
			assertEqual(types.trueType(undefined), 'undefined');
		});

		it('null type of null', () => {
			assertEqual(types.trueType(null), 'null');
		});

		it('number type of 1', () => {
			assertEqual(types.trueType(1), 'number');
		});

		it('number type of NaN', () => {
			assertEqual(types.trueType(NaN), 'number');
		});

		it('number type of Infinity', () => {
			assertEqual(types.trueType(Infinity), 'number');
		});

		it('string type of "qwerty"', () => {
			assertEqual(types.trueType('qwerty'), 'string');
		});

		it('string type of "1"', () => {
			assertEqual(types.trueType('1'), 'string');
		});

		it('string type of ""', () => {
			assertEqual(types.trueType(''), 'string');
		});

		it('object type of Date', () => {
			assertEqual(types.trueType(new Date()), 'object');
		});

		it('object type of {}', () => {
			assertEqual(types.trueType({}), 'object');
		});

		it('object type of `types`', () => {
			assertEqual(types.trueType(types), 'object');
		});

		it('object type of `arguments`', () => {
			assertEqual(types.trueType(arguments), 'object');
		});

		it('array type of []', () => {
			assertEqual(types.trueType([]), 'array');
		});

		it('object type of `args`', (...args) => {
			assertEqual(types.trueType(args), 'array');
		});

		it('function type of `function(){...}`', () => {
			assertEqual(types.trueType(function(){}), 'function');
		});

		it('function type of `types.trueType`', () => {
			assertEqual(types.trueType(types.trueType), 'function');
		});

	});

	describe('checkType', function(){
		it('the result of verification undefined as `undefined` -> undefined', () => {
			assertEqual(types.checkType(undefined, 'undefined'), undefined);
		});

		it('TypeError after check undefined as `number`', () => {
			assertThrows(
				() => types.checkType(undefined, 'number'),
				TypeError
			);
		});

		it('the result of verification null as `null` -> null', () => {
			assertEqual(types.checkType(null, 'null'), null);
		});

		it('TypeError after check null as `undefined`', () => {
			assertThrows(
				() => types.checkType(null, 'undefined'),
				TypeError
			);
		});

		it('the result of verification 1 as `number` -> 1', () => {
			assertEqual(types.checkType(1, 'number'), 1);
		});

		it('TypeError after check 1 as `undefined`', () => {
			assertThrows(
				() => types.checkType(1, 'undefined'),
				TypeError
			);
		});

	});

	describe('checkNumber', function(){
		it('1 -> 1', () => {
			assertEqual(types.checkNumber(1), 1);
		});

		it('NaN is number', () => {
			assertNotThrows(
				() => types.checkNumber(NaN),
				TypeError
			);
		});

		it('Infinity -> Infinity', () => {
			assertEqual(types.checkNumber(Infinity), Infinity);
		});

		it('fails if given a non-numeric value', () => {
			assertThrows(
				() => types.checkNumber('1'),
				TypeError
			);
		});
	});

	describe('isNumber', function(){
		it('valid for value 1', () => {
			assertTrue(types.isNumber(1));
		});

		it('valid for value NaN', () => {
			assertTrue(types.isNumber(NaN));
		});

		it('valid for value Infinity', () => {
			assertTrue(types.isNumber(Infinity));
		});

		it('fails if given a non-numeric value', () => {
			assertError(types.isNumber('1'));
		});
	});

	describe('checkFunction', function(){
		const fn = v => v;

		it('fn is a function', () => {
			assertEqual(typeof types.checkFunction(fn), 'function');
		});

		it('fails if given a non-fuction value', () => {
			assertThrows(
				() => types.checkFunction('test'),
				TypeError
			);
		});
	});

	describe('isFunction', function(){
		const fn = v => v;

		it('valid for fn', () => {
			assertTrue(types.isFunction(fn));
		});

		it('fails if given a non-fuction value', () => {
			assertError(types.isFunction(1));
		});
	});

	describe('checkString', function(){
		it('"test" -> "test"', () => {
			assertEqual(types.checkString('test'), 'test');
		});

		it('fails if given a non-string value', () => {
			assertThrows(
				() => types.checkString(1),
				TypeError
			);
		});
	});

	describe('isString', function(){
		it('valid for "1"', () => {
			assertTrue(types.isString('1'));
		});
		it('fails if given a non-string value', () => {
			assertError(types.isString(1));
		});
	});

	describe('checkObject', function(){
		it('{ b: 1 } -> { b: 1 }', () => {
			assertDeepEqual(types.checkObject({ b: 1 }), { b: 1 });
		});

		it('fails if given a non-object value', () => {
			assertThrows(
				() => types.checkObject(1),
				TypeError
			);
		});
	});

	describe('isObject', function(){
		it('valid for { b: 1 }', () => {
			assertTrue(types.isObject({ b: 1 }));
		});
		it('valid for `new Date()`', () => {
			assertTrue(types.isObject(new Date()));
		});
		it('fails if given a non-object value', () => {
			assertError(types.isObject(1));
		});
	});

	describe('evaluate', function(){
		it('valid for primitive bound', () => {
			return types.evaluate(
				true,
				function( actual ){ assertTrue(actual); }
			);
		});

		it('valid for promise bound', () => {
			return types.evaluate(
				Promise.resolve(true),
				function( actual ){ assertTrue(actual); }
			);
		});
	});

});

