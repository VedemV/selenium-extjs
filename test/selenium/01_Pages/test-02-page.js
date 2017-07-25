'use strict';

const {By, until, Browser/*, promise*/} = require('selenium-webdriver');
const test = require(process.cwd()+'');
const {assert} = require(process.cwd()+'/lib/until');

//const util = require(process.cwd()+'/lib/util');
//const { ExtComponent, ExtComponentTextField } = require(process.cwd()+'/lib/ext');

const url = 'http://examples.sencha.com/extjs/6.2.0/examples/kitchensink/#form-fieldtypes';

console.log('=>', __filename);

test.suite(function( env ){
	
	test.describe('ExtPage KitchenSink', function() {

		test.it('open form field types page with promises', function(){
			let page = new test.ExtPage(env, url, undefined, 'Ext,KitchenSink');
			page.visit()
				.then( _ => page.driver.findElement({css: 'div.x-field[id^="checkbox"]'}).getAttribute('id') )
				.then( id => assert(id).contains('checkbox', 'Expected contain "checkbox"') );
		});

		test.it('open form field types page use ControlFlow', function(){
			let page = new test.ExtPage(env, url, undefined, 'Ext,KitchenSink');
			if( env.currentBrowser() === Browser.FIREFOX ) page.empty(); // for FF
			page.visit();
			let id = page.driver.findElement({css: 'div.x-field[id^="checkbox"]'}).getAttribute('id');
			assert(id).matches(/^checkbox-[0-9]+/, 'Expected contain "checkbox"');
		});

		test.it('open form field types page with generators', function*(){
			let page = new test.ExtPage(env, url);
			if( env.currentBrowser() === Browser.FIREFOX ) yield page.empty(); // for FF
			yield page.visit();
			let id = yield page.driver.findElement({css: 'div.x-field[id^="checkbox"]'}).getAttribute('id');
			yield assert(id).contains('checkbox', 'Expected contain "checkbox"');
		});

		test.it('mochaUI click fields use ControlFlow', () => {
			let page = new test.ExtPage(env, url);
			if( env.currentBrowser() === Browser.FIREFOX ) page.empty(); // for FF
			page.visit();
			let panel = page.driver.findElement({css: 'div.x-panel[id*="form-fieldtypes"]'});
			panel.findElement({css: '.x-field:nth-of-type(1)'}).click();
			let element = panel.findElement({css: '.x-field:nth-of-type(2)'});
			assert(element.isDisplayed()).isFalse();
			
			// пароль в FF выдает предупреждение, вторым кликом скрываем его
			panel.findElement({css: '.x-field:nth-of-type(3)'}).click();
			panel.findElement({css: '.x-field:nth-of-type(3)'}).click();

			panel.findElement({css: '.x-field:nth-of-type(4)'}).click();
			panel.findElement({css: '.x-field:nth-of-type(5)'}).click();
			panel.findElement({css: '.x-field:nth-of-type(6)'}).click();
			panel.findElement({css: '.x-field:nth-of-type(7)'}).click();
			panel.findElement({css: '.x-field:nth-of-type(8)'}).click();
			panel.findElement({css: '.x-field:nth-of-type(9)'}).click();
			panel.findElement({css: '.x-field:nth-of-type(10)'}).click();
			panel.findElement({css: '.x-field:nth-of-type(11)'}).click();
			panel.findElement({css: '.x-field:nth-of-type(12)'}).click();
			page.driver.sleep(1000);
		});

		test.it('mochaUI click fields with generators', function*(){
			let page = new test.ExtPage(env, url);
			if( env.currentBrowser() === Browser.FIREFOX ) yield page.empty(); // for FF
			yield page.visit();
			let panel = yield page.driver.findElement({css: 'div.x-panel[id*="form-fieldtypes"]'});
			yield panel.findElement({css: '.x-field:nth-of-type(1)'}).click();
			let element = yield panel.findElement({css: '.x-field:nth-of-type(2)'});
			yield assert(element.isDisplayed()).isFalse();
			
			yield panel.findElement({css: '.x-field:nth-of-type(3)'}).click();
			yield panel.findElement({css: '.x-field:nth-of-type(3)'}).click();

			yield panel.findElement({css: '.x-field:nth-of-type(4)'}).click();
			yield panel.findElement({css: '.x-field:nth-of-type(5)'}).click();
			yield panel.findElement({css: '.x-field:nth-of-type(6)'}).click();
			yield panel.findElement({css: '.x-field:nth-of-type(7)'}).click();
			yield panel.findElement({css: '.x-field:nth-of-type(8)'}).click();
			yield panel.findElement({css: '.x-field:nth-of-type(9)'}).click();
			yield panel.findElement({css: '.x-field:nth-of-type(10)'}).click();
			yield panel.findElement({css: '.x-field:nth-of-type(11)'}).click();
			yield panel.findElement({css: '.x-field:nth-of-type(12)'}).click();
			yield page.driver.sleep(1000);
		});
	});

}, {
	browsers: [
		Browser.FIREFOX
	]
});
