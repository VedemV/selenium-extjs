'use strict';

const {Browser, WebElement, Key} = require('selenium-webdriver');
const config = require(process.cwd()+'/lib/config');
const {suite, before, after, describe, it, ignore} = require(process.cwd()+'');
const {ExtPage} = require(process.cwd()+'/lib/pages');
const assert = require(process.cwd()+'/lib/until/assert');

const ExtComponent = require(process.cwd()+'/lib/ext/component');
const ExtFormField = require(process.cwd()+'/lib/ext/form/field/base');
const ExtFormFieldText = require(process.cwd()+'/lib/ext/form/field/text');

console.log('=>', __filename);

suite(function( env ){
	let page = null;

	before( function*(){
		if( !env.driver ){
			this.skip();
			return;
		}
		if( env.currentBrowser() === Browser.CHROME ){
			yield env.driver.manage().window().maximize();
		}
	});

	describe('TextField', function(){
		this.retries(3);

		describe('user id field register form', function(){
			let el;

			before( () => {
				page = new ExtPage(env, '#form-register', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtFormFieldText.byLocator(env.driver, {css: 'fieldset:nth-child(1) .x-field.x-form-type-text:nth-child(1)'}) );
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

			it('labelEl instance WebElement', function(){
				return assert(el.labelEl).instanceOf(WebElement);
			});

			it('inputEl instance WebElement', function(){
				return assert(el.inputEl).instanceOf(WebElement);
			});

			it('errorEl instance WebElement', function(){
				return assert(el.errorEl).instanceOf(WebElement);
			});

			it('id starts with textfield', function(){
				return assert(el.id).startsWith('textfield-');
			});

			it('is visibled', function(){
				return assert(el.isVisibled()).isTrue();
			});

			it('is not focused', function(){
				return assert(el.isFocused()).isFalse();
			});

			it('verifying size', function(){
				assert(el.location.width).closeTo(300, 10);
				return assert(el.location.height).closeTo(32, 2);
			});

			it('field type equals `text`', function(){
				return assert(el.getType()).equals('text');
			});

			it('emptyText equals `user id`', function(){
				return assert(el.getEmptyText()).equals('user id');
			});

			it('fieldLabel equals `User ID:`', function(){
				return assert(el.getFieldLabel()).equals('User ID:');
			});

			it('initial value is empty', function(){
				return assert(el.getValue()).equals('');
			});

			it('initial value is empty (getExtValue)', function(){
				return assert(el.getExtValue()).equals('');
			});

			it('is valid', function(){
				return assert(el.isValid()).isTrue();
			});

			it('after label click', function*(){
				yield el.labelEl.click();
				yield assert(el.isFocused()).isTrue();
				yield assert(el.isValid()).isTrue();
			});

			it('after remove focus', function*(){
				//yield driver.actions().sendKeys(Key.TAB).perform();
				yield el.inputEl.click();
				yield el.sendKeys(Key.TAB);
				yield assert(el.isFocused()).isFalse();
				yield assert(el.isValid()).isFalse();
				let errors = yield el.getErrors();
				yield assert(errors.length).equals(1, 'expected to be 1 error');
				yield assert(errors[0]).equals('This field is required.', 'expected `This field is required.`');
			});

			it('entering a value', function*(){
				yield el.inputEl.click();
				yield el.sendKeys('Test');
				yield assert(el.isFocused()).isTrue();
				yield assert(el.isValid()).isTrue();
				yield assert(el.getValue()).equals('Test');
			});

			it('clearing the value', function*(){
				yield el.inputEl.click();
				yield el.clear();
				yield assert(el.getValue()).equals('');
				yield assert(el.isValid()).isFalse();
				let errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('This field is required.');
			});

			it('reentering a value', function*(){
				yield el.inputEl.click();
				yield el.inputEl.sendKeys('Test User Name');
				yield assert(el.getValue()).equals('Test User Name');
				yield assert(el.isValid()).isTrue();
			});

		});

		describe('password field register form', function(){
			let el;

			before( () => {
				page = new ExtPage(env, '#form-register', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtFormFieldText.byLocator(env.driver, {css: 'fieldset:nth-child(1) .x-field.x-form-type-password:nth-child(2)'}) );
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

			it('labelEl instance WebElement', function(){
				return assert(el.labelEl).instanceOf(WebElement);
			});

			it('inputEl instance WebElement', function(){
				return assert(el.inputEl).instanceOf(WebElement);
			});

			it('errorEl instance WebElement', function(){
				return assert(el.errorEl).instanceOf(WebElement);
			});

			it('id starts with textfield', function(){
				return assert(el.id).startsWith('textfield-');
			});

			it('is visibled', function(){
				return assert(el.isVisibled()).isTrue();
			});

			it('is not focused', function(){
				return assert(el.isFocused()).isFalse();
			});

			it('verifying size', function(){
				assert(el.location.width).closeTo(300, 10);
				return assert(el.location.height).closeTo(32, 2);
			});

			it('field type equals `password`', function(){
				return assert(el.getType()).equals('password');
			});

			it('emptyText equals `password`', function(){
				return assert(el.getEmptyText()).equals('password');
			});

			it('fieldLabel equals `Password:`', function(){
				return assert(el.getFieldLabel()).equals('Password:');
			});

			it('initial value is empty', function(){
				return assert(el.getValue()).equals('');
			});

			it('is valid', function(){
				return assert(el.isValid()).isTrue();
			});

			it('after label click', function*(){
				yield el.labelEl.click();
				yield assert(el.isFocused()).isTrue('focus expected');
				yield assert(el.isValid()).isTrue('valid expected');
			});

			it('after remove focus', function*(){
				//yield driver.actions().sendKeys(Key.TAB).perform();
				yield el.sendKeys(Key.TAB);
				yield assert(el.isFocused()).isFalse('focus not expected');
				yield assert(el.isValid()).isFalse('expected to be invalid');
				let errors = yield el.getErrors();
				yield assert(errors.length).equals(1, 'expected to be 1 error');
				yield assert(errors[0]).equals('This field is required.', 'expected `This field is required.`');
			});
			
			it('entering a value', function*(){
				yield el.inputEl.click();
				yield el.sendKeys('Test');
				yield assert(el.isFocused()).isTrue('focus expected');
				yield assert(el.isValid()).isTrue('valid expected');
				yield assert(el.getValue()).equals('Test', 'expected `Test`');
			});

			it('clearing the value', function*(){
				yield el.inputEl.click();
				yield el.clear();
				yield assert(el.getValue()).equals('', 'expected empty string');
				yield assert(el.isValid()).isFalse('expected to be invalid');
				let errors = yield el.getErrors();
				yield assert(errors.length).equals(1, 'expected to be 1 error');
				yield assert(errors[0]).equals('This field is required.', 'expected `This field is required.`');
			});

			it('reentering a value', function*(){
				yield el.inputEl.click();
				yield el.inputEl.sendKeys('TestPassword');
				yield assert(el.getValue()).equals('TestPassword', 'expected `TestPassword`');
				yield assert(el.isValid()).isTrue('valid expected');
			});
		});
	});
}, {
//	browsers: [
//		Browser.CHROME
//	]
});
