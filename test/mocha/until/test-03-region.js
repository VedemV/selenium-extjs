'use strict';

//const AssertionError = require('assert').AssertionError;
const assertTrue = require('assert').ok;
const assertEqual = require('assert').equal;
const assertDeepEqual = require('assert').deepEqual;
//const assertThrows = require('assert').throws;
//const assertNotThrows = require('assert').doesNotThrow;
//const assertError = require('assert').ifError;
//const fail = require('assert').fail;

const { Builder, By, WebDriver, promise } = require('selenium-webdriver');
const { isFunction } = require(process.cwd()+'/lib/until/types');
const assert = require(process.cwd()+'/lib/until/assert');

const Region = require(process.cwd()+'/lib/until/region');

console.log('=>', __filename);

describe('until.region', function(){

	function assertInstanceOf(ctor, value) {
		assertTrue(value instanceof ctor);
	}

	describe('checks the constructor', function(){

		it('create with non-params', () => {
			let region = new Region();
			assertEqual(region.left, 0);
			assertEqual(region.top, 0);
			assertEqual(region.width, 0);
			assertEqual(region.height, 0);

			assertDeepEqual(region.location, {x: 0, y: 0});
			assertDeepEqual(region.size, {width: 0, height: 0});
		});

		it('create with params (left, top, width, height)', () => {
			let region = new Region(10, 20, 400, 200);
			assertEqual(region.left, 10);
			assertEqual(region.top, 20);
			assertEqual(region.width, 400);
			assertEqual(region.height, 200);
			assertEqual(region.right, 410);
			assertEqual(region.bottom, 220);

			assertDeepEqual(region.location, {x: 10, y: 20});
			assertDeepEqual(region.size, {width: 400, height: 200});
		});

		it('create with params (left, top, size)', () => {
			let region = new Region(10, 20, {width: 400, height: 200});
			assertEqual(region.left, 10);
			assertEqual(region.top, 20);
			assertEqual(region.width, 400);
			assertEqual(region.height, 200);
			assertEqual(region.right, 410);
			assertEqual(region.bottom, 220);

			assertDeepEqual(region.location, {x: 10, y: 20});
			assertDeepEqual(region.size, {width: 400, height: 200});
		});

		it('create with params (location, width, height)', () => {
			let region = new Region({x: 10, y: 20}, 400, 200);
			assertEqual(region.left, 10);
			assertEqual(region.top, 20);
			assertEqual(region.width, 400);
			assertEqual(region.height, 200);
			assertEqual(region.right, 410);
			assertEqual(region.bottom, 220);

			assertDeepEqual(region.location, {x: 10, y: 20});
			assertDeepEqual(region.size, {width: 400, height: 200});
		});

		it('create with params (location, size)', () => {
			let region = new Region({x: 10, y: 20}, {width: 400, height: 200});
			assertEqual(region.left, 10);
			assertEqual(region.top, 20);
			assertEqual(region.width, 400);
			assertEqual(region.height, 200);
			assertEqual(region.right, 410);
			assertEqual(region.bottom, 220);

			assertDeepEqual(region.location, {x: 10, y: 20});
			assertDeepEqual(region.size, {width: 400, height: 200});
		});
	});

	describe('contains', function(){
		it('', () => {
			let region = new Region({x: 10, y: 20}, {width: 400, height: 200});
			// contains x,y
			assertTrue(region.contains(10, 20));
			assertTrue(region.contains(10, 220));
			assertTrue(region.contains(410, 20));
			assertTrue(region.contains(10, 220));
			assertTrue(region.contains(50, 60));

			// no contains x,y
			assertTrue(!region.contains(10, 0));
			assertTrue(!region.contains(500, 500));
		});
	});

	describe('from WebElement', function(){

		let driver;
		
		this.timeout(100000);
		this.retries(3);

		before( function(){
			driver = new Builder().forBrowser('firefox').build();
			return driver.manage().window().setSize(800, 600)
				.then(_ => driver.get('http://www.google.com/ncr'));
		});
		
		after( () => driver.quit() );

		it('promise of region from google-input', () => {
			let promiseRegion = driver.findElement(By.name('q'))
				.then( element => Region.fromWebElement(element) )
				.then( region => {
					// left = 260(±5), top = 320(±5), right = 720(±5), bottom = 355(±5)
					assert(region.left).closeTo(260, 5);
					assert(region.top).closeTo(320, 5);
					assert(region.right).closeTo(720, 5);
					assert(region.bottom).closeTo(355, 5);
					//600x400 - Region { left: 262.5, top: 323, right: 721.5, bottom: 357 }
					//800x600 - Region { left: 262.5, top: 323, right: 721.5, bottom: 357 }
					//full - Region { left: 413.5, top: 322, right: 972.5, bottom: 356 }
				});

			// Promise
			assertTrue(promise.isPromise(promiseRegion));
			return promiseRegion;
		});

		it('non-promise of region from google-input (async wait of initialized)', done => {
			let element = driver.findElement(By.name('q'));
			let region = Region.regionWebElement(element);

			// no Promise
			assertTrue(!promise.isPromise(region));

			(function check(){

				// wait of initilized
				if( !region.initilized ){
					setTimeout(check, 0);
					return;
				}
				
				// left = 260(±5), top = 320(±5), right = 720(±5), bottom = 355(±5)
				assert(region.left).closeTo(260, 5);
				assert(region.top).closeTo(320, 5);
				assert(region.right).closeTo(720, 5);
				assert(region.bottom).closeTo(355, 5);

				done();
			})();
		});

		it('non-promise of region from google-input (promise wait initialize)', () => {
			let element = driver.findElement(By.name('q'));
			let region = Region.regionWebElement(element);

			// no Promise
			assertTrue(!promise.isPromise(region));

			// Promise initilized
			return region.initialize.then(() => {
				// left = 260(±5), top = 320(±5), right = 720(±5), bottom = 355(±5)
				assert(region.left).closeTo(260, 5);
				assert(region.top).closeTo(320, 5);
				assert(region.right).closeTo(720, 5);
				assert(region.bottom).closeTo(355, 5);
			});
		});
	});
});
