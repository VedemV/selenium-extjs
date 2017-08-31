'use strict';

const { Browser, WebElement, Key } = require('selenium-webdriver');
const config = require(process.cwd()+'/lib/config');

const {suite, before, after, describe, it, ignore} = require(process.cwd()+'');
const {ExtPage} = require(process.cwd()+'/lib/pages');
const assert = require(process.cwd()+'/lib/until/assert');

const ExtComponent = require(process.cwd()+'/lib/ext/component');
const ExtFormField = require(process.cwd()+'/lib/ext/form/field/base');
const ExtFormFieldText = require(process.cwd()+'/lib/ext/form/field/text');
const ExtFormFieldDate = require(process.cwd()+'/lib/ext/form/field/date');

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

	describe('DateField', function(){
		this.retries(3);

		describe('default settings', function(){
			let el;

			before( () => {
				page = new ExtPage(env, '#form-fieldtypes', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtFormFieldDate.byLocator(env.driver, {css: '.x-field.x-form-field-date'}) );
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

			it('instance ExtFormFieldDate', function(){
				return assert(el).instanceOf(ExtFormFieldDate);
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

			it('id starts with datefield', function(){
				return assert(el.id).startsWith('datefield-');
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

			it('trigger click', function(){
				return el.click()
					.then(_ => el.triggers[0].click() )
					.then(_ => el.getBoundlist() )
					.then( list => {
						assert(list).instanceOf(WebElement);
						assert(list.isDisplayed()).isTrue('expected date picker visibled');
					})
					.then(_ => assert(el.getValue()).equals('') )
					.then(_ => assert(el.getExtValue()).isNull() )
					.then(_ => el.triggers[0].click() )
					.then(_ => el.getBoundlist() )
					.then( list => {
						assert(list).instanceOf(WebElement);
						assert(list.isDisplayed()).isFalse('expected date picker hidden');
					})
					.then(_ => assert(el.getValue()).equals('') )
					.then(_ => assert(el.getExtValue()).isNull() );
			});

			it('after label click', function*(){
				yield el.labelEl.click();
				yield assert(el.isFocused()).isTrue('focus expected');
				yield assert(el.isValid()).isTrue('valid expected');
				yield assert(el.getBoundlist()).instanceOf(WebElement);
				yield assert(el.getValue()).equals('');
				yield assert(el.getExtValue()).isNull();
			});

			it('after remove focus', function*(){
				yield el.sendKeys(Key.TAB);
				yield assert(el.isFocused()).isFalse('focus not expected');
				yield assert(el.getBoundlist()).instanceOf(WebElement);
				yield assert(el.getValue()).equals('');
				yield assert(el.getExtValue()).isNull();
			});

			it('entering novalid value', function*(){
				let errors;

				yield el.clear();
				yield el.inputEl.click();
				yield el.sendKeys('T'); //
				yield el.sendKeys('e'); //
				yield el.sendKeys('s'); //
				yield el.sendKeys('t'); // for FF and EDGE
				yield assert(el.getBoundlist()).instanceOf(WebElement);
				yield assert(el.isFocused()).isTrue();
				yield assert(el.getValue()).equals('Test');
				yield env.driver.sleep(50);
				yield assert(el.getExtValue()).equals('Test');
				yield assert(el.isValid()).isFalse();
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('Test is not a valid date - it must be in the format m/d/y.');
			});

			it('entering 01/01/1970 value', function*(){
				yield el.inputEl.click();
				yield el.clear();
				yield env.driver.sleep(50);
				yield assert(el.getValue()).equals('');
				yield assert(el.getExtValue()).isNull();
				yield el.sendKeys('01/01/1970');
				yield env.driver.sleep(50);
				yield assert(el.getValue()).equals('01/01/1970');
				yield assert(el.getExtValue()).dateEqual(new Date('01/01/1970 00:00'));
				yield el.sendKeys(Key.TAB);
				yield env.driver.sleep(50);
				yield assert(el.getValue()).equals('01/01/70');
				yield assert(el.getExtValue()).dateEqual(new Date('01/01/1970 00:00'));
			});

			it('entering 01/01/2070 value', function*(){
				yield el.inputEl.click();
				yield el.clear();
				yield el.sendKeys('01/01/2070');
				yield env.driver.sleep(50);
				yield assert(el.getValue()).equals('01/01/2070');
				yield assert(el.getExtValue()).dateEqual(new Date('01/01/2070 00:00'));
				yield el.sendKeys(Key.TAB);
				yield env.driver.sleep(50);
				yield assert(el.getValue()).equals('01/01/70');
				yield assert(el.getExtValue()).dateEqual(new Date('01/01/2070 00:00'));
				yield el.inputEl.click();
			});

			it('entering 11/22/21 value', function*(){
				yield el.inputEl.click();
				yield el.clear();
				yield el.sendKeys('11/22/21');
				yield env.driver.sleep(50);
				yield assert(el.getValue()).equals('11/22/21');
				yield assert(el.getExtValue()).dateEqual(new Date('11/22/2021'));
				yield el.sendKeys(Key.TAB);
				yield env.driver.sleep(50);
				yield assert(el.getValue()).equals('11/22/21');
				yield assert(el.getExtValue()).dateEqual(new Date('11/22/2021'));
				yield el.inputEl.click();
			});

			it('entering 23/09/17 value', function*(){
				let errors;

				yield el.inputEl.click();
				yield el.clear();
				yield el.sendKeys('23/09/17');
				yield env.driver.sleep(50);
				yield assert(el.getValue()).equals('23/09/17');
				yield assert(el.getExtValue()).equals('23/09/17');
				yield assert(el.isValid()).isFalse('valid not expected');
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('23/09/17 is not a valid date - it must be in the format m/d/y.');

				yield el.sendKeys(Key.TAB);
				yield env.driver.sleep(50);
				yield assert(el.getValue()).equals('23/09/17');
				yield assert(el.getExtValue()).equals('23/09/17');
			});

		});

		describe('date of birth', function(){
			let el;
			const curDate = function(){
					let date = new Date();
					return ('0'+(date.getMonth()+1)).substring().slice(-2) + '/' +
						('0'+(date.getDate())).substring().slice(-2) + '/' +
						('0'+date.getYear()).substring().slice(-2);
				}();
			const badDate = function(){
					let date = new Date(new Date().getTime() + 2 * 24 * 60 * 60 *1000);
					return ('0'+(date.getMonth()+1)).substring().slice(-2) + '/' +
						('0'+(date.getDate())).substring().slice(-2) + '/' +
						date.getFullYear();
				}();

			before( () => {
				page = new ExtPage(env, '#form-register', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtFormFieldDate.byLocator(env.driver, {css: '.x-field.x-form-field-date'}) );
			});

			it('is visibled', function(){
				return assert(el.isVisibled()).isTrue();
			});

			it('is not focused', function(){
				return assert(el.isFocused()).isFalse();
			});

			it('inputEl instance WebElement', function(){
				return assert(el.inputEl).instanceOf(WebElement);
			});

			it('entering a value, an inappropriate format', function*(){
				var errors;
				//yield el.sendKeys(Key.ESCAPE);
				//yield el.inputEl.click();
				yield el.clear();
				yield el.sendKeys('13/09/17');
				yield assert(el.getValue()).equals('13/09/17');
				yield env.driver.sleep(50);
				yield assert(el.getExtValue()).equals('13/09/17');
				yield assert(el.isValid()).isFalse();
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('13/09/17 is not a valid date - it must be in the format m/d/y.');
			});

			it('entering a value greater than the current date', function*(){
				var errors;
				yield el.clear();
				//yield el.inputEl.click();
				yield el.sendKeys(badDate);
				yield assert(el.getValue()).equals(badDate);
				yield env.driver.sleep(50);
				yield assert(el.getExtValue()).dateEqual(new Date(badDate));
				yield assert(el.isValid()).isFalse();
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('The date in this field must be before ' + curDate + '.');
			});

			it('entering the correct value', function*(){
				var errors;
				yield el.clear();
				//yield el.inputEl.click();
				yield el.sendKeys('07/07/02');
				yield assert(el.getValue()).equals('07/07/02');
				yield env.driver.sleep(50);
				yield assert(el.getExtValue()).dateEqual(new Date('07/07/02'));
				yield assert(el.isValid()).isTrue();
				errors = yield el.getErrors();
				yield assert(errors.length).equals(0);
			});

		});
	});

}, {
//	browsers: [
//		Browser.EDGE
//	]
});

