'use strict';

const AssertionError = require('assert').AssertionError;
const assertTrue = require('assert').ok;
const assertEqual = require('assert').equal;
//const assertDeepEqual = require('assert').deepEqual;
const assertThrows = require('assert').throws;
//const assertNotThrows = require('assert').doesNotThrow;
//const assertError = require('assert').ifError;
const fail = require('assert').fail;

const assert = require(process.cwd()+'/lib/until/assert');

console.log('=>', __filename);

describe('until.assert', function(){

	function assertInstanceOf(ctor, value) {
		assertTrue(value instanceof ctor);
	}

	describe('deepEqual', function(){
		it('compares subject = value', () => {
			assertThrows(() => assert({a: 1, b: 2}).deepEqual({a: 1, b: 1}));
			assertThrows(() => assert({a: 1, c:{b: 2}}).deepEqual({a: 1, b: 2}));
			assert({a: 1, b: 2}).deepEqual({a: 1, b: 2});
		});

		it('compares numeric values', () => {
			return assert(1).deepEqual(1);
		});

		it('accepts failure message', () => {
			assertThrows(
				() => assert({a: 1}).deepEqual({a: 2}, 'hi there!'),
				(error) => error.message.indexOf('hi there!') !== -1
			);
		});

		it('waits for promised subject', () => {
			return assert(Promise.resolve({a: 1})).deepEqual({a: 1});
		});

		it('waits for promised subject (with failure)', () => {
			return assert(Promise.resolve({a: 1})).deepEqual({a: 2})
				.then(
					() => fail(undefined, undefined, 'should have failed'),
					(e) => {
						assertInstanceOf(AssertionError, e);
						assertEqual('{ a: 1 } deepEqual { a: 2 }', e.message);
					}
				);
		});
	});

	describe('isLocatedRegion', function(){
		it('accepts values within region', () => {
			assert({x:0,y:0})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50});
			assert({x:100,y:50})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50});
			assert({x:50,y:50})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50});
			assert({x:50,y:25})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50});
			
			assertThrows( () => assert({x:50,y:60})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50}) );
		});

		it('fails if given a non-object subject', () => {
			assertThrows( () => assert(1)
				.isLocatedRegion({left:0,top:0,right:100,bottom:50}) );
		});

		it('fails if given a subject is not object {x,y}', () => {
			assertThrows( () => assert({x:50})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50}) );
			assertThrows( () => assert({y:25})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50}) );
			assertThrows( () => assert({z:50,y:25})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50}) );
			assertThrows( () => assert({x:50,z:25})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50}) );
			assertThrows( () => assert({x:'50',y:25})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50}) );
			assertThrows( () => assert({x:50,y:'25'})
				.isLocatedRegion({left:0,top:0,right:100,bottom:50}) );
		});

		it('fails if given a non-object bound', () => {
			assertThrows( () => assert({x:50,y:60}).isLocatedRegion(1) );
		});

		it('fails if given a bound is not object {left,top,right,bottom}', () => {
			assertThrows( () => assert({x:50,y:25})
				.isLocatedRegion({top:0,right:100,bottom:50}) );
			assertThrows( () => assert({x:50,y:25})
				.isLocatedRegion({left:0,right:100,bottom:50}) );
			assertThrows( () => assert({x:50,y:25})
				.isLocatedRegion({left:0,top:0,bottom:50}) );
			assertThrows( () => assert({x:50,y:25})
				.isLocatedRegion({left:0,top:0,right:100}) );
			assertThrows( () => assert({x:50,y:25})
				.isLocatedRegion({left:'0',top:0,right:100,bottom:50}) );
			assertThrows( () => assert({x:50,y:25})
				.isLocatedRegion({left:0,top:'0',right:100,bottom:50}) );
			assertThrows( () => assert({x:50,y:25})
				.isLocatedRegion({left:0,top:0,right:'100',bottom:50}) );
			assertThrows( () => assert({x:50,y:25})
				.isLocatedRegion({left:0,top:0,right:100,bottom:'50'}) );
		});

		it('waits for promised subject', () => {
			return assert(Promise.resolve({x:50,y:25}))
				.isLocatedRegion({left:0,top:0,right:100,bottom:50});
		});

		it('waits for promised subject (with failure)', () => {
			return assert(Promise.resolve({x:50,y:60}))
				.isLocatedRegion({left:0,top:0,right:100,bottom:50})
				.then(
					() => fail(undefined, undefined, 'should have failed'),
					(e) => {
						assertInstanceOf(AssertionError, e);
						assertEqual('false === true', e.message);
					}
				);
		});
	});

});

