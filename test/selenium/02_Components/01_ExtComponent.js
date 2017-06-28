'use strict';

const {By, until, Browser} = require('selenium-webdriver');
const test = require(process.cwd()+'');
const {ExtPage} = require(process.cwd()+'/lib/pages');
const { ExtComponent } = require(process.cwd()+'/lib/ext');
const {assert} = require(process.cwd()+'/lib/until');

test.suite(function( env ){

	let page = null;


	test.describe('ExtComponent', function() {
		
		before(
			() => env.driver
				&& ( (page = new ExtPage(env, 'http://examples.sencha.com/extjs/6.2.0/examples/kitchensink/#form-fieldtypes') )
					.visit() )
		);

		test.describe('compare default properties', function() {
			let cmp = null;
			before( 
				() => page && (cmp = new ExtComponent(page.driver) )
			);

			it('componentType is `component`', function(){
				return assert(cmp.componentType).isEqualTo('component');
			});
			it('defaultSelector is { css: \'div.x-component[id^="component"]\' }', function(){
				return assert(cmp.defaultSelector).deepEqual({ css: 'div.x-component[id^="component"]' });
			});
			it('selector is { css: \'div.x-component[id^="component"]\' }', function(){
				return assert(cmp.selector).deepEqual({ css: 'div.x-component[id^="component"]' });
			});
			it('elemetnt by selector not found', function(){
				//cmp.locateElement()
				return assert(cmp.locateElement()).isUndefined();
			});
			it('set selector as { css: \'div.x-component\' }', function(){
				cmp.selector = { css: 'div.x-component' };
				return assert(cmp.selector).deepEqual({ css: 'div.x-component' });
			});
			it('found 3 elemetnts by selector', function(){
				cmp.selector = { css: 'div.x-component' };
				return assert(page.driver.findElements(cmp.selector).then( entries => entries.length )).isEqualTo(3);
			});
			it('found elemetnt id = `app-header-title` by selector and index', function(){
				cmp.selector = { css: 'div.x-component' };
				cmp.index = 1;
				return cmp.getComponent()
//					.then( _ => page.driver.manage().window().getSize() )
//					.then( size => console.log(size))
					.then( _ => assert(cmp._id).isEqualTo('app-header-title') )
				;
			});

		});
	});

}, {
	browsers: [
		Browser.FIREFOX
	],
	integrity: false
});

