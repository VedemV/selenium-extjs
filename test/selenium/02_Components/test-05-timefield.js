'use strict';

const { Browser, WebElement, Key } = require('selenium-webdriver');
const config = require(process.cwd()+'/lib/config');

const {suite, before, after, describe, it, ignore} = require(process.cwd()+'');
const {ExtPage} = require(process.cwd()+'/lib/pages');
const assert = require(process.cwd()+'/lib/until/assert');

const ExtComponent = require(process.cwd()+'/lib/ext/component');
const ExtFormField = require(process.cwd()+'/lib/ext/form/field/base');
const ExtFormFieldText = require(process.cwd()+'/lib/ext/form/field/text');
const ExtFormFieldComboBox = require(process.cwd()+'/lib/ext/form/field/combo');
const ExtFormFieldTime = require(process.cwd()+'/lib/ext/form/field/time');

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

	describe('TimeField', function(){
		this.retries(3);

		describe('time field', function(){
			let el;

			before( () => {
				page = new ExtPage(env, '#form-fieldtypes', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtFormFieldTime.byLocator(page.driver, {css: '.x-field.x-form-type-text[id^=timefield]'}) );
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

			it('instance ExtFormFieldComboBox', function(){
				return assert(el).instanceOf(ExtFormFieldComboBox);
			});

			it('instance ExtFormFieldTime', function(){
				return assert(el).instanceOf(ExtFormFieldTime);
			});

			ignore(env.browsers(Browser.EDGE)).
			it('labelEl instance WebElement', function(){
				return assert(el.labelEl).instanceOf(WebElement);
			});

			it('inputEl instance WebElement', function(){
				return assert(el.inputEl).instanceOf(WebElement);
			});

			it('errorEl instance WebElement', function(){
				return assert(el.errorEl).instanceOf(WebElement);
			});

			it('id starts with timefield', function(){
				return assert(el.id).startsWith('timefield-');
			});

			ignore(env.browsers(Browser.EDGE)).
			it('is visibled', function(){
				return assert(el.isVisibled()).isTrue();
			});

			it('is not focused', function(){
				return assert(el.isFocused()).isFalse();
			});

			it('records count', function(){
				return assert(el.records.length).equals(96);
			});

			it('is valid', function(){
				return assert(el.isValid()).isTrue();
			});

			it('initial value is empty', function(){
				return assert(el.getValue()).equals('');
			});

			it('initial value is empty (getExtValue)', function(){
				return assert(el.getExtValue()).isNull();
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
						assert(list.isDisplayed()).isTrue('expected list visibled');
					})
					.then(_ => el.getBoundlistRecords() )
					.then( records => assert(records.length).equals(80) )
					.then(_ => assert(el.getValue()).equals('') )
					.then(_ => assert(el.getExtValue()).isNull() )
					.then(_ => el.triggers[0].click() )
					.then(_ => el.getBoundlist() )
					.then( list => {
						assert(list).instanceOf(WebElement);
						assert(list.isDisplayed()).isFalse('expected list hidden');
					})
					.then(_ => el.getBoundlistRecords() )
					.then( records => assert(records.length).equals(80) )
					.then(_ => assert(el.getValue()).equals('') )
					.then(_ => assert(el.getExtValue()).isNull() )
				;
			});

			it('entering a value', function*(){
				let records;

				yield el.inputEl.click();
				yield el.sendKeys('T'); //
				yield el.sendKeys('e'); //
				yield el.sendKeys('s'); //
				yield el.sendKeys('t'); // for FF and EDGE
				yield assert(el.getBoundlist()).instanceOf(WebElement);
				yield assert(el.isFocused()).isTrue('focus expected');
				yield assert(el.getValue()).equals('Test', 'expected `Test`');
				yield assert(el.getExtValue()).isNull();
				//yield env.driver.sleep(200);
				records = yield el.getBoundlistRecords();
				yield assert(records.length).equals(80);
				records = yield el.getRecords();
				yield assert(records.length).equals(0);
			});

			it('typeahead a value', function*(){
				let records, errors;

				yield el.inputEl.click();
				yield el.clear();
				yield el.sendKeys('3');
				//yield env.driver.sleep(200);
				yield assert(el.isValid()).isTrue();
				yield el.sendKeys(':');
				yield assert(el.isValid()).isFalse();
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('3: is not a valid time.');
				records = yield el.getBoundlistRecords();
				yield assert(records.length).equals(8);
				records = yield el.getRecords();
				yield assert(records.length).equals(8);
				yield el.sendKeys('4');
				yield assert(el.isValid()).isFalse();
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('3: is not a valid time.');
				records = yield el.getRecords();
				yield assert(records.length).equals(2);
				records = yield el.getBoundlistRecords();
				yield assert(records.length).equals(2);
				yield el.sendKeys('5');
				//yield env.driver.sleep(200);
				yield assert(el.isValid()).isTrue();
				records = yield el.getBoundlistRecords();
				yield assert(records.length).equals(2);
				yield records[1].click();
				yield assert(el.getValue()).equals('3:45 PM');
				yield assert(el.getExtValue()).dateEqual(new Date('01/01/2008 3:45 PM'));
			});

			it('min value', function*(){
				let errors;

				yield el.inputEl.click();
				yield el.clear();
				yield el.sendKeys('0:30 AM');
				yield assert(el.isValid()).isFalse();
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('The time in this field must be equal to or after 1:30 AM.');
			});

			it('max value', function*(){
				let errors;

				yield el.inputEl.click();
				yield el.clear();
				yield el.sendKeys('10:00 PM');
				yield assert(el.isValid()).isFalse();
				errors = yield el.getErrors();
				yield assert(errors.length).equals(1);
				yield assert(errors[0]).equals('The time in this field must be equal to or before 9:15 PM.');
			});

			it('reentering a value', function*(){
				yield el.inputEl.click();
				yield el.clear();
				yield el.sendKeys('1:30 AM');
				yield assert(el.isValid()).isTrue();
				yield assert(el.getValue()).equals('1:30 AM');
				yield assert(el.getExtValue()).dateEqual(new Date('01/01/2008 1:30 AM'));
			});

		});
	});

}, {
//	browsers: [
//		Browser.EDGE
//	]
});

