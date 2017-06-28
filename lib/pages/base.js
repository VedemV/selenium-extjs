'use strict';

const { until, WebElement } = require('selenium-webdriver');
const by = require('selenium-webdriver/lib/by');

const config = require('../config');
const util = require('../util');
const { Region } = require('../until');

const URL = require('url');

let click = WebElement.prototype.click;
WebElement.prototype.click = function(){
	return click.call(this).then(_ => this.getDriver().sleep(200) );
};

module.exports = class BasePage {

	constructor( environment, url='', locator ) {
		this.environment = environment;
		this.driver = environment.driver;
		this.flow = this.driver.controlFlow();
		this.locator = locator;
		this.url = url;
	}

	visit(url){
		if( typeof url === 'undefined' ) url = this.url;
			else if( url === null ) url = 'about:blank';
				else url = URL.resolve(config.baseurl, url.toString());

		return this.driver.get(url)
			.then( _ => this.driver.executeScript(
				String( require('fs').readFileSync( __dirname + '/mochaUI.js' ) ) ))
			.then( _ => /*this.cursorUI = */this.driver.findElement({css: '#mocha-mouse-pointer'}) )
			.then( element => this.cursorUI = element )
			.then( _ => this.expected() );
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
			this._url = url = 'data:,';
		} else {
			this._url = URL.resolve(config.baseurl, url.toString());
		}
	}

	get positionUI(){
		if( this.cursorUI ){
			return this.cursorUI.getLocation()
				.then( location => ({x: location.x, y: location.y}) );
		}
		return null;
	}

	condition(){
		return until.elementLocated( this._locator );
	}

	expected(){
		return this.driver.wait( this.condition(), config.explicit );
	}

	saveScreenshot(name){
		//return this.driver.call( () => {
		return this.flow.execute( () => {
			let env = this.environment;
			name = util.resolveScreenshot(env.currentBrowser(), config.screenshots, name);
			return env.screenshot(name);
		});
	}
};
