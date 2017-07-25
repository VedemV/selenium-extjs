'use strict';

const {WebElement, By, until, Browser} = require('selenium-webdriver');
const test = require(process.cwd()+'');
const {ExtPage} = require(process.cwd()+'/lib/pages');
const { ExtComponent, ExtComponentTextField } = require(process.cwd()+'/lib/ext');
const {assert} = require(process.cwd()+'/lib/until');
const util = require(process.cwd()+'/lib/util');

console.log('=>', __filename);

test.suite(function( env ){

	let page = null;
	let url = 'http://examples.sencha.com/extjs/6.2.0/examples/kitchensink/#form-fieldtypes';


	test.describe('ExtComponent`s', function() {
		this.retries(3);

		before( () =>{
			page = new ExtPage(env, url);
			if(env.currentBrowser() === Browser.FIREFOX) page.empty();
			return page.visit();
		});

		test.describe('compare default properties', function() {
			let cmp = null;
			before( () => page && (cmp = new ExtComponent(page.driver) ) );

			it('componentType = `component`', function(){
				return assert(cmp.componentType).isEqualTo('component');
			});
			it('defaultSelector = { css: \'div.x-component[id^="component"]\' }', function(){
				return assert(cmp.defaultSelector).deepEqual({ css: 'div.x-component[id^="component"]' });
			});
			it('selector = { css: \'div.x-component[id^="component"]\' }', function(){
				return assert(cmp.selector).deepEqual({ css: 'div.x-component[id^="component"]' });
			});
			it('there is no component with default properties on the page', function(){
				return assert(cmp.locateElement()).isNull();
			});
			it('new value of selector = { css: \'div.x-component\' }', function(){
				cmp.selector = { css: 'div.x-component' };
				return assert(cmp.selector).deepEqual({ css: 'div.x-component' });
			});
		});

		test.describe('getting WebElement', function() {
			let cmp = null;
			before( () => page && (cmp = new ExtComponent(page.driver)) );
		
			it('3 items found by selector { css: \'div.x-component\' }', function(){
				cmp.selector = { css: 'div.x-component' };
				return assert(page.driver.findElements(cmp.selector).then( entries => entries.length )).isEqualTo(3);
			});

			it('element was found using selector and index', function(){
				cmp.selector = { css: 'div.x-component' };
				cmp.index = 1;
				return assert(cmp.locateElement()).instanceOf(WebElement);
			});

			it('element was obtained using selector and index', function(){
				cmp.selector = { css: 'div.x-component' };
				cmp.index = 1;
				return assert(cmp.getComponent()).instanceOf(WebElement);
			});

			it('element not received using selector and bad index', function(){
				cmp.selector = { css: 'div.x-component' };
				cmp.index = 3;
				return assert(cmp.getComponent()).isNull();
			});

			it('element properties with id = `app-header-title` using selector and index', function(){
				cmp.selector = { css: 'div.x-component' };
				cmp.index = 1;
				return cmp.getComponent()
					.then( _ => assert(cmp._id).isEqualTo('app-header-title') )
					.then( _ => page.driver.manage().window().getSize() )
					.then( size => assert(cmp.region.width).closeTo(size.width-100, 50) );
			});

			it('getting from an empty htmlElement with an element search by id', function(){
				cmp = new ExtComponent(page.driver, 0, {css: '#app-header-title'});
				return assert(cmp.id).isEqualTo('app-header-title');
			});

			it('Clicking an element', function(){
				cmp = new ExtComponent(page.driver, null, { css: '#app-header-title' });
				cmp.htmlElement.click();
				return cmp.click();
			});

			it('Clicking an element (generators)', function*(){
				cmp = yield new ExtComponent(page.driver, null, { css: '#app-header-title' });
				return yield cmp.htmlElement.click();
			});

		});


	});

}, {
//	browsers: [
//		Browser.IE
//	]
});

