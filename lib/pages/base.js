
/**
 *
 *
 * На загруженном драйвере из TestEnvironment
 *
 * - открывает URL из конфига, или указанный при создании или вызове visit
 * - заливает на страницу курсор mochaUI
 * - дожидается элемента body или указанного в #locator
 *
 */

'use strict';

const { until, WebElement } = require('selenium-webdriver');
const by = require('selenium-webdriver/lib/by');

const config = require('../config');
const util = require('../util');
const { Region } = require('../until');

const URL = require('url');

let clickWebElement = WebElement.prototype.click;

/**
 * Подмена WebElement.click для выполнения с задержкой,
 * чтобы успевал отработать курсор MochaUI
 *
 * @type Object.prototype.nm$_base.click
 */
WebElement.prototype.click = function(){
	return clickWebElement.call(this).then(_ => this.getDriver().sleep(200) );
};

class BasePage {

	constructor( environment, url='', locator ) {
		this.environment = environment;
		this.driver = environment.driver;
		this.flow = this.driver.controlFlow();
		this.locator = locator;
		this.url = url;
		//this.clickWebElement = clickWebElement;
	}

	/**
	 * Выполняет загрузку станицы, 
	 * ожидание элемента #locator,
	 * подключение `mochaUI`
	 *
	 * @param {String} url
	 *
	 * @return {!Promise}
	 */
	visit(url){
		if( typeof url === 'undefined' ){
			url = this.url;
		} else if( url === null ){
			url = BasePage.EMPTYURL;
		} else {
			url = URL.resolve(config.baseurl, url.toString());
		}

		return this.driver.getCurrentUrl()
			.then( u => u === url ? this.driver.navigate().refresh() : this.driver.get(url) )
			.then( _ => this.expected() )
			.then( _ => this.setMochaUI() );

//		this.driver.get(url);
//		this.driver.executeScript(
//				String(require('fs').readFileSync(__dirname + '/mochaUI.js')));
//		this.driver.findElement({css: '#mocha-mouse-pointer'})
//			.then( element => this.cursorUI = element );
//		return this.expected();
	}

	setMochaUI(){
		return this.driver.executeScript(
			String(require('fs').readFileSync(__dirname + '/mochaUI.js'))
		).then( _ => this.cursorUI = this.driver.findElement({css: '#mocha-mouse-pointer'}) );
	}

	empty(){
		return this.driver.get(BasePage.EMPTYURL);
	}

	get locator(){
		return this._locator;
	}

	set locator(locator){
		if (typeof locator === 'undefined' || locator === null) locator = {css: 'body'};
		this._locator = by.checkedLocator(locator);
	}

	get url(){
		return this._url;
	}

	set url(url){
		if (typeof url === 'undefined' || url === null){
			this._url = url = BasePage.EMPTYURL;
		} else {
			this._url = URL.resolve(config.baseurl, url.toString());
		}
	}

	/**
	 * Получает и возвращает текущие координаты указателя `MochaUI`
	 * в виде {x: значение, y: значение}.
	 *
	 * @return {!Promise<Object>}
	 */
	get positionUI(){
		if( this.cursorUI ){
			return this.cursorUI.getLocation()
				.then( location => ({x: location.x, y: location.y}) );
		}
		return null;
	}

	/**
	 *
	 * @return {!WebElementCondition}
	 */
	condition(){
		return until.elementLocated( this._locator );
	}

	/**
	 * Ожидает появления злемента #locator и возвращает его.
	 *
	 * Время ожидания определяется в параметре конфигурации config#explicit
	 *
	 * @return {!WebElement}
	 */
	expected(){
		return this.driver.wait( this.condition(), config.explicit );
	}

	/**
	 * Запись снимка экрана браузера.
	 *
	 * @param {String} name
	 * @return {!Promise}
	 */
	saveScreenshot(name){
		//return this.driver.call( () => {
		return this.flow.execute( () => {
			let env = this.environment;
			name = util.resolveScreenshot(env.currentBrowser(), config.screenshots, name);
			return env.screenshot(name);
		});
	}

};

BasePage.EMPTYURL = 'about:blank'; //'data:,';
BasePage.clickWebElement = clickWebElement;

module.exports = BasePage;
