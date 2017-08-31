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

	describe('ComboBox', function(){
		this.retries(3);

		describe('state field', function(){
			let el;

			before( () => {
				//if( !env.driver ) return;
				page = new ExtPage(env, '#form-register', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtFormFieldComboBox.byLocator(env.driver, {css: 'fieldset:nth-child(2) .x-field.x-form-type-text[id^="combo"]'}) );
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

			it('labelEl instance WebElement', function(){
				return assert(el.labelEl).instanceOf(WebElement);
			});

			it('inputEl instance WebElement', function(){
				return assert(el.inputEl).instanceOf(WebElement);
			});

			it('errorEl instance WebElement', function(){
				return assert(el.errorEl).instanceOf(WebElement);
			});

			it('id starts with combo', function(){
				return assert(el.id).startsWith('combo-');
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

			it('emptyText equals `Select a state...`', function(){
				return assert(el.getEmptyText()).equals('Select a state...');
			});

			it('fieldLabel equals `State:`', function(){
				return assert(el.getFieldLabel()).equals('State:');
			});

			it('initial value is empty', function(){
				return assert(el.getValue()).equals('');
			});

			it('initial value is empty (getExtValue)', function(){
				return assert(el.getExtValue()).isNull();
			});

			it('is valid', function(){
				return assert(el.isValid()).isTrue();
			});

			it('records count', function(){
				return assert(el.records.length).equals(51);
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
					.then( records => assert(records.length).equals(51) )
					.then(_ => assert(el.getValue()).equals('') )
					.then(_ => assert(el.getExtValue()).isNull() )
					.then(_ => el.triggers[0].click() )
					.then(_ => el.getBoundlist() )
					.then( list => {
						assert(list).instanceOf(WebElement);
						assert(list.isDisplayed()).isFalse('expected list hidden');
					})
					.then(_ => el.getBoundlistRecords() )
					.then( records => assert(records.length).equals(51) )
					.then(_ => assert(el.getValue()).equals('') )
					.then(_ => assert(el.getExtValue()).isNull() );
			});

			it('after label click', function*(){
				yield el.labelEl.click();
				yield assert(el.isFocused()).isTrue();
				yield assert(el.isValid()).isTrue();
				yield assert(el.getBoundlist()).instanceOf(WebElement);
				yield assert(el.getValue()).equals('');
				yield assert(el.getExtValue()).isNull();
			});

			it('after remove focus', function*(){
				yield el.sendKeys(Key.TAB);
				yield assert(el.isFocused()).isFalse();
				yield assert(el.getBoundlist()).instanceOf(WebElement);
				yield assert(el.getValue()).equals('');
				yield assert(el.getExtValue()).isNull();
			});

			it('entering a value', function*(){
				let records;

				yield el.clear();
				yield el.inputEl.click();
				yield el.sendKeys('T'); //
				yield el.sendKeys('e'); //
				yield el.sendKeys('s'); //
				yield el.sendKeys('t'); // for FF and EDGE
				yield assert(el.getBoundlist()).instanceOf(WebElement);
				yield assert(el.isFocused()).isTrue();
				yield assert(el.getValue()).equals('Test');
				yield assert(el.getExtValue()).equals('Test');
				records = yield el.getBoundlistRecords();
				yield assert(records.length)
					.equals(env.currentBrowser() === Browser.FIREFOX ? 51 : 2); // store last filtered
				records = yield el.getRecords();
				yield assert(records.length).equals(0);
			});

			it('clearing the value', function*(){
				let records;
				
				yield el.inputEl.click();
				yield el.clear();
				records = yield el.getBoundlistRecords();
				yield assert(records.length)
					.equals(env.currentBrowser() === Browser.FIREFOX ? 51 : 2); // not modified !!!
				records = yield el.getRecords();
				yield assert(records.length).equals(51);
			});

			it('typeahead a value', function*(){
				let records, list;

				yield el.inputEl.click();
				yield el.clear();
				yield el.sendKeys('N');
				yield assert(el.getValue()).equals('N');
				yield assert(el.getExtValue()).equals('N');
				list = yield el.getBoundlist();
				yield assert(list.isDisplayed()).isTrue();
				records = yield el.getBoundlistRecords();
				yield assert(records.length).equals(8);
				records = yield el.getRecords();
				yield assert(records.length).equals(8);
				yield el.sendKeys('e');
				yield assert(el.getValue()).equals('Ne');
				yield assert(el.getExtValue()).equals('Ne');
				list = yield el.getBoundlist();
				yield assert(list.isDisplayed()).isTrue();
				records = yield el.getBoundlistRecords();
				yield assert(records.length).equals(6);
				records = yield el.getRecords();
				yield assert(records.length).equals(6);
				yield el.sendKeys('w');
				yield assert(el.getValue()).equals('New');
				yield assert(el.getExtValue()).equals('New');
				list = yield el.getBoundlist();
				yield assert(list.isDisplayed()).isTrue();
				records = yield el.getBoundlistRecords();
				yield assert(records.length).equals(4);
				records = yield el.getRecords();
				yield assert(records.length).equals(4);
				records = yield el.getBoundlistRecords();
				yield records[2].click();
				list = yield el.getBoundlist();
				yield assert(list.isDisplayed()).isFalse();
				yield assert(el.getValue()).equals('New Mexico');
				yield assert(el.getExtValue()).equals('NM');
			});

		});
	});

}, {
//	browsers: [
//		Browser.CHROME
//	]
});

