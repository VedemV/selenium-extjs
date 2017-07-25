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


	test.describe('ExtComponentTextField', function() {
		this.retries(3);

		before( () =>{
			page = new ExtPage(env, url);
			if(env.currentBrowser() === Browser.FIREFOX) page.empty();
			return page.visit();
		});

		test.describe('Text Field', function() {
			let cmp = null;
			before( () => page && (cmp = new ExtComponentTextField(page.driver)) );

			it('id of the text field is `textfield-1033`', function(){
				return assert(cmp.id).isEqualTo('textfield-1033');
			});

			it('value is `Text field value`', function(){
				return assert(cmp.getValue()).isEqualTo('Text field value');
			});

			it('label is `Text field:`', function(){
				return assert(cmp.label.getText()).isEqualTo('Text field:');
			});

			it('field is visible', function(){
				return assert(cmp.isVisibled()).isTrue();
			});

			it('field is out of focus', function(){
				return assert(cmp.isFocused()).isFalse();
			});

			it('field in focus after click', function(){
				return cmp.click()
					.then(_ => assert(cmp.isFocused()).isTrue() );
			});

			it('field in focus after clicking on the label', function(){
				return new ExtComponentTextField(page.driver, 1).click()
					.then(_ => assert(cmp.isFocused()).isFalse() )
					.then(_ => cmp.label.click() )
					.then(_ => assert(cmp.isFocused()).isTrue() );
			});
		});

	});

}, {
//	browsers: [
//		Browser.IE
//	],
});


