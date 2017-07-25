'use strict';

const config = require(process.cwd()+'/lib/config');
const {By, until, Browser} = require('selenium-webdriver');
const test = require(process.cwd()+'');
const { Region, assert } = require(process.cwd()+'/lib/until');

console.log('=>', __filename);

test.suite(function( env ){
	// В IE после создания webdriver заголовок - WebDriver,
	// в остальных - пустая строка
	let emtyPage = env.currentBrowser() === Browser.IE ? 'WebDriver': '';

	test.describe('BasePage', function() {
		let page;
		this.retries(3);

		test.it('создание с пустыми параметрами', function() {
			page = new test.BasePage(env);
			
			assert(page.url).equals(config.baseurl);
			return assert(page.driver.getTitle()).equals(emtyPage, 'title <> "'+emtyPage+'"')
				.then(_ => assert(page.positionUI).isNull() );
		});

		test.it('значения сойства `url`', function() {
			let saveUrl = test.config.baseurl;
			page = new test.BasePage(env);

			test.config.baseurl = 'http://www.google.com/';
			page.url = 'ncr';
			assert(page.url).equals('http://www.google.com/ncr');
			test.config.baseurl = 'http://www.google.com';
			page.url = 'ncr';
			assert(page.url).equals('http://www.google.com/ncr');
			test.config.baseurl = saveUrl;
			page.url = 'http://www.google.com/ncr';
		});

		test.it('значения сойства `locator`', function() {
			page = new test.BasePage(env);

			assert(page.locator).deepEqual({ using: 'css selector', value: 'body' });
			page.locator = {name: 'q'};
			assert(page.locator).deepEqual({ using: 'css selector', value: '*[name="q"]' });
			page.locator = By.name('q');
			assert(page.locator).deepEqual({ using: 'css selector', value: '*[name="q"]' });
		});

		test.it('visit', function() {

			page = new test.BasePage( env, 'http://www.google.com/ncr', {name: 'q'} );
			assert(page.url).equals('http://www.google.com/ncr');
			
			return assert(page.driver.getTitle()).equals(emtyPage, 'initialize: title <> "'+emtyPage+'"')
				.then(_ => page.visit() )
				.then(_ => assert(page.driver.getTitle()).equals('Google', 'title <> ""Google') )
				.then(_ => assert(page.positionUI).deepEqual({x:0, y:0}, 'Google: positionUI <> {x:0, y:0}') )
				.then(_ => page.locator = {css: 'body'} )
				.then(_ => page.visit(null) )
				.then(_ => assert(page.driver.getTitle()).equals('', 'empty: title <> ""') )
				.then(_ => assert(page.positionUI).deepEqual({x:0, y:0}, 'empty: positionUI <> {x:0, y:0}') );
		});

		test.it('MochaUI с использованием promises вызовов', () => {
			page = new test.BasePage(env, 'http://www.google.com/ncr', {css: 'input[name=q]'});
			return page.visit()
				.then( input => input.click()
					.then(_ => assert(page.positionUI).isLocatedRegion(Region.regionWebElement(input), 'positionUI not in `input`') )
					.then(_ => input => input.clear() )
					.then(_ => input.sendKeys('webdriver') ) )
				.then(_ => page.driver.findElement({name: 'btnG'}) )
					.then( btn => btn.click()
					.then(_ => assert(page.positionUI).isLocatedRegion(Region.regionWebElement(btn), 'positionUI not in `btnG`')) )
				.then(_ => page.driver.wait(until.titleIs('webdriver - Google Search'), 2000) )
				.then(_ => page.locator = {css: 'body'} )
				.then(_ => page.visit(null) );
		});

		test.it('MochaUI с использованием generators вызовов', function*() {
			let region;
			let input;
			let btn;

			page = new test.BasePage(env, 'http://www.google.com/ncr', {css: 'input[name=q]'});
			yield page.visit();

			input = yield page.driver.findElement(By.name('q'));
			region = yield Region.regionWebElement(input);
			yield input.click();
			yield assert(page.positionUI).isLocatedRegion(region, 'positionUI not in `input`');
			yield input.clear();
			yield input.sendKeys('webdriver');

			btn = yield page.driver.findElement({name: 'btnG'});
			region = yield Region.regionWebElement(btn);
			yield btn.click();
			let pos = yield page.positionUI;
			yield assert(region.contains(pos.x, pos.y)).isTrue('region `btnG` not contais pos');
			yield page.driver.wait(until.titleIs('webdriver - Google Search'), 2000);
			yield page.locator = {css: 'body'};
			yield page.visit(null);
		});

		test.it('MochaUI с использованием ControlFlow', () => {
			page = new test.BasePage(env, 'http://www.google.com/ncr', {css: 'input[name=q]'});
			page.visit();

			let input = page.driver.findElement({name: 'q'});
			page.flow.execute( _ => {
				let region = Region.regionWebElement(input);
				input.click();
				assert(page.positionUI).isLocatedRegion(region, 'positionUI not in `input`');
			});
			input.clear();
			input.sendKeys('webdriver');

			let btn = page.driver.findElement({name: 'btnG'});
			page.flow.execute( _ => {
				let region = Region.regionWebElement(btn);
				btn.click();
				assert(page.positionUI).isLocatedRegion(region, 'positionUI not in `btnG`');
			});
			
			page.driver.wait(until.titleIs('webdriver - Google Search'), 2000);
			page.locator = {css: 'body'};
			page.visit(null);
		});

	});
	
});
