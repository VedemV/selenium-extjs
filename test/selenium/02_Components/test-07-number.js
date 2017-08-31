'use strict';

const { Browser, WebElement, Key } = require('selenium-webdriver');
const config = require(process.cwd()+'/lib/config');

const {suite, before, after, describe, it, ignore} = require(process.cwd()+'');
const {ExtPage} = require(process.cwd()+'/lib/pages');
const assert = require(process.cwd()+'/lib/until/assert');

const ExtComponent = require(process.cwd()+'/lib/ext/component');
const ExtFormField = require(process.cwd()+'/lib/ext/form/field/base');
const ExtFormFieldText = require(process.cwd()+'/lib/ext/form/field/text');
const ExtFormFieldNumber = require(process.cwd()+'/lib/ext/form/field/number');

console.log('=>', __filename);

suite(function( env ){

	let page = null;
	let pageSize;

	before( function*(){
		if( !env.driver ){
			this.skip();
			return;
		}
		if( env.currentBrowser() === Browser.CHROME ){
			yield env.driver.manage().window().maximize();
		}
		pageSize = yield env.driver.manage().window().getSize();
	});

	describe('NumberField', function(){
		this.retries(3);

		describe('fieldtypes', function(){
			let el;

			before( () => {
				page = new ExtPage(env, '#form-fieldtypes', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtFormFieldNumber.byLocator(page.driver, {css: '.x-field.x-form-type-text[id^=numberfield-]'}) );
			});

			it('instance WebElement', function(){
				return assert(el).instanceOf(WebElement);
			});

			it('instance ExtComponent', function(){
				return assert(el).instanceOf(ExtComponent);
			});

			it('instance ExtFormField', function(){
				return assert(el).instanceOf(ExtFormField);
			});

			it('instance ExtFormFieldText', function(){
				return assert(el).instanceOf(ExtFormFieldText);
			});

			it('instance ExtFormFieldNumber', function(){
				return assert(el).instanceOf(ExtFormFieldNumber);
			});

			it('labelEl instance WebElement', function(){
				return assert(el.labelEl).instanceOf(WebElement);
			});

			it('inputEl instance WebElement', function(){
				return assert(el.inputEl).instanceOf(WebElement);
			});

			it('errorEl instance WebElement', function(){
				return assert(el.errorEl).instanceOf(WebElement);
			});

			it('id starts with numberfield', function(){
				return assert(el.id).startsWith('numberfield-');
			});

			it('is visibled', function(){
				return assert(el.isVisibled()).isTrue();
			});

			it('is not focused', function(){
				return assert(el.isFocused()).isFalse();
			});

			it('triggers count', function(){
				return assert(el.triggers.length).equals(1);
			});

			it('initial value', function(){
				return assert(el.getValue()).equals('5');
			});

			it('initial extjs value', function(){
				return assert(el.getExtValue()).equals(5);
			});

			it('sets value', function(){
				return el.click()
					.then(_ => el.clear() )
					.then(_ => assert(el.getValue()).equals('') )
					.then(_ => assert(el.getExtValue()).isNull() )
					.then(_ => el.sendKeys('0') )
					.then(_ => assert(el.getValue()).equals('0') )
					.then(_ => assert(el.getExtValue()).equals(0) )
					.then(_ => el.sendKeys('1') )
					.then(_ => assert(el.getValue()).equals('01') )
					.then(_ => assert(el.getExtValue()).equals(1) )
					.then(_ => el.sendKeys('7') )
					.then(_ => assert(el.getValue()).equals('017') )
					.then(_ => assert(el.getExtValue()).equals(17) )
				;
			});

			//ignore(env.browsers(Browser.IE)).
			it('spinner up click', function(){
				return el.click()
					.then(_ => el.clear() )
					.then(_ => el.sendKeys('5') )
					.then(_ => el.spinnerUp.click() )
					.then(_ => assert(el.getValue()).equals('6') )
					.then(_ => assert(el.getExtValue()).equals(6) )
					.then(_ => el.spinnerUp.click() )
					.then(_ => assert(el.getValue()).equals('7') )
					.then(_ => assert(el.getExtValue()).equals(7) )
					.then(_ => el.spinnerUp.click() )
					.then(_ => assert(el.getValue()).equals('8') )
					.then(_ => assert(el.getExtValue()).equals(8) )
					.then(_ => el.spinnerUp.click() )
					.then(_ => assert(el.getValue()).equals('9') )
					.then(_ => assert(el.getExtValue()).equals(9) )
					;
			});

			//ignore(env.browsers(Browser.IE)).
			it('spinner down click', function(){
				return el.click()
					.then(_ => el.clear() )
					.then(_ => el.sendKeys('5') )
					.then(_ => el.spinnerDown.click() )
					.then(_ => assert(el.getValue()).equals('4') )
					.then(_ => assert(el.getExtValue()).equals(4) )
					.then(_ => el.spinnerDown.click() )
					.then(_ => assert(el.getValue()).equals('3') )
					.then(_ => assert(el.getExtValue()).equals(3) )
					.then(_ => el.spinnerDown.click() )
					.then(_ => el.spinnerDown.click() )
					.then(_ => assert(el.getValue()).equals('1') )
					.then(_ => assert(el.getExtValue()).equals(1) )
					.then(_ => el.spinnerDown.click() )
					.then(_ => assert(el.getValue()).equals('0') )
					.then(_ => assert(el.getExtValue()).equals(0) )
					.then(_ => el.spinnerDown.click() )
					.then(_ => assert(el.getValue()).equals('0') )
					.then(_ => assert(el.getExtValue()).equals(0) )
					;
			});

			it('validate', function*(){
				var errors;
				yield el.click();
				yield el.clear();
				yield assert(el.isValid()).isTrue();
				yield assert(el.getValue()).equals('');
				yield assert(el.getExtValue()).isNull();

				yield el.sendKeys('foo');
				yield assert(el.isValid()).isTrue();
				yield assert(el.getValue()).equals('');
				yield assert(el.getExtValue()).isNull();

				yield el.sendKeys('-1');
				yield assert(el.isValid()).isFalse();
				yield assert(el.getValue()).equals('-1');
				yield assert(el.getExtValue()).equals(-1);
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('The value cannot be negative.');

				yield el.clear();
				yield el.sendKeys('51');
				yield assert(el.isValid()).isFalse();
				yield assert(el.getValue()).equals('51');
				yield assert(el.getExtValue()).equals(51);
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('The maximum value for this field is 50.');
			});

		});
	});

}, {
//	browsers: [
//		Browser.IE
//	]
});

