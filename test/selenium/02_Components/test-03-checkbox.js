'use strict';

const {Browser, WebElement, Key} = require('selenium-webdriver');
const config = require(process.cwd()+'/lib/config');

const {suite, before, after, describe, it, ignore} = require(process.cwd()+'');
const {ExtPage} = require(process.cwd()+'/lib/pages');
const assert = require(process.cwd()+'/lib/until/assert');

const ExtComponent = require(process.cwd()+'/lib/ext/component');
const ExtFormField = require(process.cwd()+'/lib/ext/form/field/base');
const ExtFormFieldText = require(process.cwd()+'/lib/ext/form/field/text');
const ExtFormFieldCheckbox = require(process.cwd()+'/lib/ext/form/field/checkbox');

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

	describe('Checkbox', function(){
		this.retries(3);

		describe('checkbox field', function(){
			let el;

			before( () => {
				//if( !env.driver ) return;
				page = new ExtPage(env, '#form-checkout', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtFormFieldCheckbox.byLocator(env.driver, {css: 'fieldset:nth-child(3) .x-field.x-form-type-checkbox'}) );
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

			it('instance ExtFormFieldCheckbox', function(){
				return assert(el).instanceOf(ExtFormFieldCheckbox);
			});

			it('labelEl is undefined', function(){
				return assert(el.labelEl).isUndefined();
			});

			it('boxLabelEl instance WebElement', function(){
				return assert(el.boxLabelEl).instanceOf(WebElement);
			});

			it('inputEl instance WebElement', function(){
				return assert(el.inputEl).instanceOf(WebElement);
			});

			it('errorEl is undefined', function(){
				return assert(el.errorEl).instanceOf(WebElement);
			});

			it('id starts with checkbox', function(){
				return assert(el.id).startsWith('checkbox-');
			});

			it('is visibled', function(){
				return assert(el.isVisibled()).isTrue();
			});

			it('is not focused', function(){
				return assert(el.isFocused()).isFalse();
			});

			it('field type equals `checkbox`', function(){
				return assert(el.getType()).equals('checkbox');
			});

			it('fieldLabel is undefined', function(){
				return assert(el.getFieldLabel()).isUndefined();
			});

			it('boxLabelEl equals `Same as Mailing Address?`', function(){
				return assert(el.getBoxLabel()).equals('Same as Mailing Address?');
			});

			it('initial value is check', function(){
				return assert(el.getValue()).isTrue();
			});

			it('is valid', function(){
				return assert(el.isValid()).isTrue();
			});

			it('after box label click', function*(){
				yield el.boxLabelEl.click();
				yield assert(el.isFocused()).isTrue();
				yield assert(el.isValid()).isTrue();
				yield assert(el.getValue()).isFalse();
				yield assert(el.isDirty()).isTrue();
				yield el.inputEl.sendKeys(Key.SPACE);
				yield assert(el.getValue()).isTrue();
				yield assert(el.getExtValue()).isTrue();
			});

		});

		describe('radio field (form-checkout)', function(){
			let el1, el2, el3, el4;

			before( () => {
				page = new ExtPage(env, '#form-checkout', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el1 = ExtFormFieldCheckbox.byLocator(env.driver, {css: 'fieldset:nth-child(4) td:nth-child(1) .x-field.x-form-type-radio'}) )
					.then(_ => el2 = ExtFormFieldCheckbox.byLocator(env.driver, {css: 'fieldset:nth-child(4) td:nth-child(2) .x-field.x-form-type-radio'}) )
					.then(_ => el3 = ExtFormFieldCheckbox.byLocator(env.driver, {css: 'fieldset:nth-child(4) td:nth-child(3) .x-field.x-form-type-radio'}) )
					.then(_ => el4 = ExtFormFieldCheckbox.byLocator(env.driver, {css: 'fieldset:nth-child(4) td:nth-child(4) .x-field.x-form-type-radio'}) );
			});

			it('instance WebElement', function(){
				assert(el1).instanceOf(WebElement);
				assert(el2).instanceOf(WebElement);
				assert(el3).instanceOf(WebElement);
				assert(el4).instanceOf(WebElement);
			});

			it('instance ExtComponent', function(){
				assert(el1).instanceOf(ExtComponent);
				assert(el2).instanceOf(ExtComponent);
				assert(el3).instanceOf(ExtComponent);
				assert(el4).instanceOf(ExtComponent);
			});

			it('instance ExtFormField', function(){
				assert(el1).instanceOf(ExtFormField);
				assert(el2).instanceOf(ExtFormField);
				assert(el3).instanceOf(ExtFormField);
				assert(el4).instanceOf(ExtFormField);
			});

			it('instance ExtFormFieldCheckbox', function(){
				assert(el1).instanceOf(ExtFormFieldCheckbox);
				assert(el2).instanceOf(ExtFormFieldCheckbox);
				assert(el3).instanceOf(ExtFormFieldCheckbox);
				assert(el4).instanceOf(ExtFormFieldCheckbox);
			});

			it('boxLabelEl instance WebElement', function(){
				return assert(el1.boxLabelEl).instanceOf(WebElement);
			});

			it('inputEl instance WebElement', function(){
				return assert(el1.inputEl).instanceOf(WebElement);
			});

			it('id starts with radiofield', function(){
				assert(el1.id).startsWith('radiofield-');
				assert(el2.id).startsWith('radiofield-');
				assert(el3.id).startsWith('radiofield-');
				assert(el4.id).startsWith('radiofield-');
			});

			ignore(env.browsers(Browser.EDGE)).it('is visibled', function(){
				return assert(el1.isVisibled()).isTrue();
			});

			it('is not focused', function(){
				assert(el1.isFocused()).isFalse();
				assert(el2.isFocused()).isFalse();
				assert(el3.isFocused()).isFalse();
				assert(el4.isFocused()).isFalse();
			});

			it('field type equals `radio`', function(){
				assert(el1.getType()).equals('radio');
				assert(el2.getType()).equals('radio');
				assert(el3.getType()).equals('radio');
				assert(el4.getType()).equals('radio');
			});

			it('1 boxLabelEl equals `VISA`', function(){
				return assert(el1.getBoxLabel()).equals('VISA');
			});

			it('2 boxLabelEl equals `MasterCard`', function(){
				return assert(el2.getBoxLabel()).equals('MasterCard');
			});

			it('3 boxLabelEl equals `American Express`', function(){
				return assert(el3.getBoxLabel()).equals('American Express');
			});

			it('4 boxLabelEl equals `Discover`', function(){
				return assert(el4.getBoxLabel()).equals('Discover');
			});

			it('initial value is check', function(){
				return assert(el1.getValue()).isTrue();
			});

			it('after #1 box label click', function*(){
				yield el1.boxLabelEl.click();
				yield assert(el1.isFocused()).isTrue('#1 - focus expected');
				yield assert(el2.isFocused()).isFalse('#2 - focus not expected');
				yield assert(el3.isFocused()).isFalse('#3 - focus not expected');
				yield assert(el4.isFocused()).isFalse('#4 - focus not expected');
				yield assert(el1.getValue()).isTrue('#1 - checked expected');
				yield assert(el2.getValue()).isFalse('#2 - checked not expected');
				yield assert(el3.getValue()).isFalse('#3 - checked not expected');
				yield assert(el4.getValue()).isFalse('#4 - checked not expected');
				yield assert(el1.getExtValue()).isTrue('#1 - ext checked expected');
				yield assert(el2.getExtValue()).isFalse('#2 - ext checked not expected');
				yield assert(el3.getExtValue()).isFalse('#3 - ext checked not expected');
				yield assert(el4.getExtValue()).isFalse('#4 - ext checked not expected');
				yield assert(el1.isDirty()).isFalse('#1 - dirty not expected');
				yield assert(el2.isDirty()).isFalse('#2 - dirty not expected');
				yield assert(el3.isDirty()).isFalse('#3 - dirty not expected');
				yield assert(el4.isDirty()).isFalse('#4 - dirty not expected');
			});

			it('after #2 box label click', function*(){
				yield el2.boxLabelEl.click();
				yield assert(el1.isFocused()).isFalse('#1 - focus not expected');
				yield assert(el2.isFocused()).isTrue('#2 - focus expected');
				yield assert(el3.isFocused()).isFalse('#3 - focus not expected');
				yield assert(el4.isFocused()).isFalse('#4 - focus not expected');
				yield assert(el1.getValue()).isFalse('#1 - checked not expected');
				yield assert(el2.getValue()).isTrue('#2 - checked expected');
				yield assert(el3.getValue()).isFalse('#3 - checked not expected');
				yield assert(el4.getValue()).isFalse('#4 - checked not expected');
				yield assert(el1.getExtValue()).isFalse('#1 - ext checked not expected');
				yield assert(el2.getExtValue()).isTrue('#2 - ext checked expected');
				yield assert(el3.getExtValue()).isFalse('#3 - ext checked not expected');
				yield assert(el4.getExtValue()).isFalse('#4 - ext checked not expected');
				yield assert(el1.isDirty()).isTrue('#1 - dirty expected');
				yield assert(el2.isDirty()).isTrue('#2 - dirty expected');
				yield assert(el3.getValue()).isFalse('#3 - checked not expected');
				yield assert(el4.getValue()).isFalse('#4 - checked not expected');
			});

			it('after #3 box label click', function*(){
				yield el3.boxLabelEl.click();
				yield assert(el1.isFocused()).isFalse('#1 - focus not expected');
				yield assert(el2.isFocused()).isFalse('#2 - focus not expected');
				yield assert(el3.isFocused()).isTrue('#3 - focus expected');
				yield assert(el4.isFocused()).isFalse('#4 - focus not expected');
				yield assert(el1.getValue()).isFalse('#1 - checked not expected');
				yield assert(el2.getValue()).isFalse('#2 - checked expected');
				yield assert(el3.getValue()).isTrue('#3 - checked expected');
				yield assert(el4.getValue()).isFalse('#4 - checked not expected');
				yield assert(el1.getExtValue()).isFalse('#1 - ext checked not expected');
				yield assert(el2.getExtValue()).isFalse('#2 - ext checked not expected');
				yield assert(el3.getExtValue()).isTrue('#3 - ext checked expected');
				yield assert(el4.getExtValue()).isFalse('#4 - ext checked not expected');
				yield assert(el1.isDirty()).isTrue('#1 - dirty expected');
				yield assert(el2.isDirty()).isFalse('#2 - dirty not expected');
				yield assert(el3.isDirty()).isTrue('#3 - dirty expected');
				yield assert(el4.getValue()).isFalse('#4 - checked not expected');
			});

		});

		describe('radio field (form-fieldtypes)', function(){
			let elements = [];

			before( () => {
				page = new ExtPage(env, '#form-fieldtypes', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => env.driver.findElements({css: '.x-field.x-form-type-radio'}) )
					.then( els => els.forEach( (item, index) => elements[index] = ExtFormFieldCheckbox.fromElement(item) ));
			});

			it('find 2 elements', function(){
				return assert(elements.length).equals(2);
			});

			it('elements id starts with radiofield', function(){
				elements.forEach( function*(item){
					yield assert(item.id).startsWith('radiofield-');
				});
			});

			it('elements is not focused', function(){
				elements.forEach( function*(item){
					yield assert(item.isFocused()).isFalse();
				});
			});

			it('elements field type equals `radio`', function(){
				elements.forEach( function*(item){
					yield assert(item.getType()).equals('radio');
				});
			});

			it('boxLabelEl equals `radio #`', function(){
				elements.forEach( function*(item, index){
					yield assert(item.getBoxLabel()).equals('radio ' + (index + 1));
				});
			});

			it('initial value is non-check', function(){
				elements.forEach( function*(item, index){
					yield assert(item.getValue()).isFalse();
					yield assert(item.getExtValue()).isFalse();
				});
			});
			
			it('after #1 box label click', function*(){
				yield elements[0].boxLabelEl.click();
				yield assert(elements[0].isFocused()).isTrue('#1 - focus expected');
				yield assert(elements[1].isFocused()).isFalse('#2 - focus not expected');
				yield assert(elements[0].getValue()).isTrue('#1 - checked expected');
				yield assert(elements[1].getValue()).isFalse('#2 - checked not expected');
				yield assert(elements[0].getExtValue()).isTrue('#1 - ext checked expected');
				yield assert(elements[1].getExtValue()).isFalse('#2 - ext checked not expected');
				yield assert(elements[0].isDirty()).isTrue('#1 - dirty expected');
				yield assert(elements[1].isDirty()).isFalse('#2 - dirty not expected');
			});

		});
	});

}, {
//	browsers: [
//		Browser.CHROME
//	]
});

