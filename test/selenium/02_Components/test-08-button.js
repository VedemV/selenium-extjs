
'use strict';

const { Browser, WebElement, Key, promise } = require('selenium-webdriver');
const config = require(process.cwd()+'/lib/config');

const {suite, before, after, describe, it, ignore} = require(process.cwd()+'');
const {ExtPage} = require(process.cwd()+'/lib/pages');
const assert = require(process.cwd()+'/lib/until/assert');

const ExtComponent = require(process.cwd()+'/lib/ext/component');
const ExtFormFieldCheckbox = require(process.cwd()+'/lib/ext/form/field/checkbox');
const ExtButton = require(process.cwd()+'/lib/ext/button/button');

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

	describe('Button', function(){
		this.retries(3);
		
		describe('basic buttons', function(){
			const names = ['text only', 'icon only', 'left icon', 'top icon', 'right icon', 'bottom icon'];
			const sizes = ['small', 'medium', 'large'];
			
			let buttons = [];
			let check;

			before( () => {
				let i = -1;
				page = new ExtPage(env, '#basic-buttons', {css: '#app-header-title'});
				return page.visit()
					.then(_ => check = ExtFormFieldCheckbox.byLocator(page.driver, {css: '.x-form-type-checkbox'}))
					.then(_ => page.driver.findElements({css: 'table a.x-btn'}))
					.then(els => promise.map(els, item => ExtButton.fromElement(item)))
					.then(els => els.forEach((item, index) => {
						if( index % 3 === 0 ){
							i++;
							buttons[i] = [];
						}
						buttons[i][index % 3] = item;
					}));
			});
			
			for( var i = 0; i < 6; i++ ){
				for( var j = 0; j < 3; j++ ){
					(function(row,col){
						describe(names[row] + ' ' + sizes[col], function(){
							let el;
							before(() => el = buttons[row][col]);
							
							it('instance WebElement', function(){
								assert(el).instanceOf(WebElement);
							});

							it('instance ExtComponent', function(){
								assert(el).instanceOf(ExtComponent);
							});

							it('instance ExtButton', function(){
								assert(el).instanceOf(ExtButton);
							});
							
							it('icon instance WebElement', function(){
								assert(el.iconEl).instanceOf(WebElement);
							});
							
							it('text element instance WebElement', function(){
								assert(el.textEl).instanceOf(WebElement);
							});
							
							it('text is ', function(){
								let name = row !== 1 ? sizes[col].charAt(0).toUpperCase() + sizes[col].slice(1) : '';
								this.test.title += '`' + name + '`';
								assert(el.getText()).equals(name);
							});
							
							it('scale is ', function(){
								this.test.title += sizes[col];
								assert(el.getScale()).equals(sizes[col]);
							});
							
							ignore(env.browsers(Browser.EDGE))
							.it('focused after click', function(){
								el.click().then(_ => assert(el.isFocused()).isTrue());
							});
							
							ignore(env.browsers(Browser.FIREFOX))
							.it('pressed', function(){
								page.driver.actions().mouseDown(el).perform()
									.then(_ => assert(el.isPressed()).isTrue())
									.then(_ => page.driver.actions().mouseUp().perform());
							});
						});
					})(i,j);
				}
			}
			
			describe('disabled', function(){
			
				before(()=>check.click());
				
				after(()=>check.click());
				
				for( var i = 0; i < 6; i++ ){
					for( var j = 0; j < 3; j++ ){
						(function(row,col){
							it(names[row] + ' ' + sizes[col], function(){
								let el = buttons[row][col];
								assert(el.isEnabled()).isFalse();
							});
						})(i,j);
					}
				} 
			});

		});
		
	});

}, {
//	browsers: [
//		Browser.EDGE
//	]
});



