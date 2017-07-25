/**
 *
 */

'use strict';

const config = require('../../lib/config');
const { Browser, promise } = require('selenium-webdriver');
const fs = require('fs');
const Path = require('path');

const assert = require(process.cwd()+'/lib/until/assert');
const AssertionError = require('assert').AssertionError;
const fail = require('assert').fail;
const assertTrue = require('assert').ok;
const assertEqual = require('assert').equal;


const util = require(process.cwd()+'/lib/util');

console.log('=>', __filename);

describe('util', function(){
	describe('padStart', function(){
		it('"1" => "0001"',
			() => assertEqual(util.padStart('1', 4, '0'), '0001')
		);

		it('"2017" => "2017"',
			() => assertEqual(util.padStart('2017', 4, '0'), '2017')
		);

		it('"2017" => "2017", length 2',
			() => assertEqual(util.padStart('2017', 2, '0'), '2017')
		);

		it('"1" => " 1"',
			() => assertEqual(util.padStart('1', 2, ' '), ' 1')
		);

		it('"1" => "0001", not fill',
			() => assertEqual(util.padStart('1', 4), '0001')
		);

		it('"2017" => "2017", not fill and not length',
			() => assertEqual(util.padStart('2017'), '2017')
		);

		it('non-string value', () => {
			assert(util.padStart(2017)).equals('2017');
			assert(util.padStart()).equals('');
			assert(util.padStart(null, 5)).equals('00000');
			assert(util.padStart(NaN)).equals('NaN');
			assert(util.padStart(Infinity)).equals('Infinity');
			assert(util.padStart(Infinity, 10)).equals('00Infinity');
			assert(util.padStart({})).equals('[object Object]');
			assert(util.padStart([1, 2, 3])).equals('1,2,3');
		});
	});

	describe('resolveScreenshot', function(){
		it('`testname.log` with timestamp for chrome whith used config params',
			() => assert(util.resolveScreenshot('chrome', './screen', 'testname.log'))
					.matches(/[\/\\]screen[\/\\]chrome[\/\\]testname_\d{17}\.log/)
		);

		it('`testname.png` with timestamp for chrome whith used path, extention default',
			() => assert(util.resolveScreenshot('chrome', './screen', 'testname'))
					.matches(/[\/\\]screen[\/\\]chrome[\/\\]testname_\d{17}\.png/)
		);

		it('`testname.png` with timestamp for ie whith used path, extention default',
			() => assert(util.resolveScreenshot(Browser.IE, './screen', 'testname'))
					.matches(/[\/\\]screen[\/\\]ie[\/\\]testname_\d{17}\.png/)
		);

		it('`testname.png` with timestamp for edge whith used path, extention default',
			() => assert(util.resolveScreenshot(Browser.EDGE, './screen', 'testname'))
					.matches(/[\/\\]screen[\/\\]edge[\/\\]testname_\d{17}\.png/)
		);

		it('non-timestamp `testname.png` for chrome whith used path, extention default, non-timestamp flag',
			() => assert(util.resolveScreenshot('chrome', './screen', 'testname', false))
					.matches(/[\/\\]screen[\/\\]chrome[\/\\]testname\.png/)
		);

		it('timestamp name for chrome whith used path, extention default',
			() => assert(util.resolveScreenshot('chrome', './screen'))
					.matches(/[\/\\]screen[\/\\]chrome[\/\\]\d{17}\.png/)
		);

		it('timestamp name for chrome whith used path, extention default, non-timestamp flag',
			() => assert(util.resolveScreenshot('chrome', './screen', undefined, false))
					.matches(/[\/\\]screen[\/\\]chrome[\/\\]\d{17}\.png/)
		);

		it('timestamp name for chrome whith used path from config params, extention default',
			() => assert(util.resolveScreenshot('chrome'))
					.matches(/[\/\\]screenshots[\/\\]chrome[\/\\]\d{17}\.png/)
		);

		it('timestamp name whith used path from config params, extention default',
			() => assert(util.resolveScreenshot())
					.matches(/[\/\\]screenshots[\/\\]\d{17}\.png/)
		);

		it('`testname.png` whith used path from config params, extention default',
			() => assert(util.resolveScreenshot(null, null, 'testname'))
					.matches(/[\/\\]screenshots[\/\\]testname_\d{17}\.png/)
		);
	});

	describe('accessPromise', function(){

		it('failed new folder', () => {
			let path = Path.dirname(util.resolveScreenshot('test/folder/', './screen'));

			return util.accessPromise(path).then(
				() => fail(undefined, undefined, 'should have failed'),
				e => assertTrue( e instanceof Error)
			);
		});

		it('success for an existing folder', () => {
			// TODO: предусмотреть сосздание папки перед тестом
			let path = Path.dirname(util.resolveScreenshot('chrome'));

			return util.accessPromise(path)
				.then( result => assertTrue(result) );
		});
	});

	describe('mkdirPromise', function(){
		let path = Path.dirname(util.resolveScreenshot('test/folder/', './test/screen'));

		it('create new folder',
			() => util.accessPromise(path)
				.then(
					() => fail(undefined, undefined, 'should have failed'),
					() => path
				)
				.then(_ => util.mkdirPromise(path))
				.then(folder => util.accessPromise(folder))
				.then(result => assertTrue(result) )
		);

		it('success for an existing folder',
			() => util.accessPromise(path)
				.then( null,() => fail(undefined, undefined, 'should have failed') )
				.then(_ => util.mkdirPromise(path))
				.then(folder => {
					assertEqual(folder, path);
					assert(util.accessPromise(path)).isTrue();
				})
				.then(_ => {
					fs.rmdirSync(path); // ./test/screen/test/folder
					fs.rmdirSync(path = Path.dirname(path)); // ./test/screen/test
					fs.rmdirSync(path = Path.dirname(path)); // ./test/screen
				})
		);
	});

	describe('writeFilePromise', function(){
		let name = util.resolveScreenshot(null, './temp', 'test.txt', false);
		it('write text file to "./temp/test.txt"',
			() => util.writeText(name, 'Test string\r\nCreated from file test-util.js')
				.then( f => {
					assertEqual(f, name);
					assert(util.accessPromise(name)).isTrue();
					fs.unlinkSync(name);
				})
		);
	});

	describe('ifPromise and condition', function(){

		const failFn = () => fail(null, null, 'should have failed');
		const thenFn = () => 'It`s true';
		const elseFn = () => 'It`s false';

		const failPromise = () => Promise.resolve(fail(null, null, 'should have failed'));
		const thenPromise = () => Promise.resolve('It`s true');
		const elsePromise = () => Promise.resolve('It`s false');

		it('`if` returned Promise, condition = true, non-promise condition and function', () => {
			let ifRes = util.condition(true, thenFn, failFn);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assertEqual(result, 'It`s true') );
		});

		it('`if` returned Promise, condition = false, non-promise condition and function', () => {
			let ifRes = util.condition(false, failFn, elseFn);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assertEqual(result, 'It`s false') );
		});

		it('`if` returned Promise, condition = true, non-promise condition and function (not doElse)', () => {
			let ifRes = util.condition(true, thenFn);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assertEqual(result, 'It`s true') );;
		});

		it('`if` returned Promise, condition = false, non-promise condition and function (not doElse)', () => {
			let ifRes = util.condition(false, failFn);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assert(result).isUndefined() );;
		});

		it('`if` returned Promise, condition = true, promise if-else', () => {
			let ifRes = util.condition(true, thenPromise, failFn);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assertEqual(result, 'It`s true') );
		});

		it('`if` returned Promise, condition = false, promise if-else', () => {
			let ifRes = util.condition(false, failFn, elsePromise);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assertEqual(result, 'It`s false') );
		});

		it('`if` returned Promise, condition function', () => {
			let ifRes = util.condition(() => true, thenFn, failFn);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assertEqual(result, 'It`s true') );
		});

		it('`if` returned Promise, condition function', () => {
			let ifRes = util.condition(() => false, failFn, elseFn);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assertEqual(result, 'It`s false') );
		});

		it('`if` returned Promise, condition promise value', () => {
			let ifRes = util.condition(Promise.resolve(true), thenFn, failFn);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assertEqual(result, 'It`s true') );
		});

		it('`if` returned Promise, condition promise value', () => {
			let ifRes = util.condition(Promise.resolve(false), failFn, elseFn);
			assertTrue(promise.isPromise(ifRes));
			return ifRes.then( result => assertEqual(result, 'It`s false') );
		});

		it('condition', () => {
			return Promise.resolve(true)
				.then( util.ifPromise(thenFn, failFn) )
				.then( result => assertEqual(result, 'It`s true') )
				.then( _ => Promise.resolve(false) )
				.then( util.ifPromise(failFn, elseFn) )
				.then( result => assertEqual(result, 'It`s false') );
		});

	});

});

