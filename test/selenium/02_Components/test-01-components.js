'use strict';

const { Browser, WebElement } = require('selenium-webdriver');
const config = require(process.cwd()+'/lib/config');

const {suite, before, after, describe, it, ignore} = require(process.cwd()+'');
const {ExtPage} = require(process.cwd()+'/lib/pages');
const assert = require(process.cwd()+'/lib/until/assert');

const ExtComponent = require(process.cwd()+'/lib/ext/component');

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

	describe('Component', function(){
		this.retries(3);

		describe('app header', function(){
			let el;

			before( () => {
				//if( !env.driver ) return;
				page = new ExtPage(env, '#form-register', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtComponent.byLocator(env.driver, {css: '#app-header'}) );
			});

			it('instance ExtComponent', function(){
				return assert(el).instanceOf(ExtComponent);
			});

			it('id equals app-header', function(){
				return assert(el.id).equals('app-header');
			});

			it('is visibled', function(){
				return assert(el.isVisibled()).isTrue();
			});

			it('is not focused', function(){
				return assert(el.isFocused()).isFalse();
			});

			it('width page width', function(){
				return assert(el.location.width).closeTo(pageSize.width, 20);
			});

		});

		describe('app header title', function(){
			let el;

			before( () => {
				page = new ExtPage(env, '#form-register', {css: '#app-header-title'});
				return page.driver.get(config.baseurl + '#')
					.then(_ => page.visit() )
					.then(_ => el = ExtComponent.byLocator(env.driver, {css: '#app-header-title'}) );
			});

			it('instance ExtComponent', function(){
				return assert(el).instanceOf(ExtComponent);
			});

			it('id equals app-header', function(){
				return assert(el.id).equals('app-header-title');
			});

			it('is visibled', function(){
				return assert(el.isVisibled()).isTrue();
			});
			it('is not focused', function(){
				return assert(el.isFocused()).isFalse();
			});

			it('verifying width', function(){
				return assert(el.location.width).closeTo(pageSize.width-100, 20);
			});

			it('text is `Ext JS Kitchen Sink`', function(){
				return assert(el.getAttribute('innerText')).equals('Ext JS Kitchen Sink');
			});

			it('execute script', function*(){
				var text = yield el.executeScript('this.update("Test Selenium Webdriver");return this.el.dom.innerText;');
				yield assert(text).equals('Test Selenium Webdriver');
			});

		});
	});

}, {
//	browsers: [
//		Browser.CHROME
//	]
});

