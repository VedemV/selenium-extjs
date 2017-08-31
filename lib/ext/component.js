
'use strict';

var { WebElement } = require('selenium-webdriver');

/**
 *
 */
class ExtComponent extends WebElement {

	/**
	 * @param {!WebDriver} driver the parent WebDriver instance for this element.
	 * @param {(!IThenable<string>|string)} id The server-assigned opaque ID for
	 *        the underlying DOM element.
	 */
	constructor(driver, id){
		super(driver, id);
		
		this.location = {};
		this.getPosition().then( l => this.location = l );
		this.getAttribute('id').then( id => (this.id = id) );
	}

	static fromElement(el){
		return new this(el.getDriver(), el.getId());
	}
	static byLocator(driver, locator){
		return this.fromElement(driver.findElement(locator));
		//return driver.findElement(locator).then( el => new this(driver, el ) );
	}

	/**
	 * @return {!Promise<Object>}
	 */
	getPosition(){
		let location = {};
		return this.getLocation()
			.then( l => {location.x = l.x; location.y = l.y;} )
			.then(_ => this.getSize())
			.then( l => {location.width = l.width; location.height = l.height;} )
			.then(_ => location);
	}
	
	/**
	 * @return {!Promise<[String]>}
	 */
	getCls(){
		return this.getAttribute('class').then( cls => cls.split(' ') );
	}

	/**
	 * @return {!Promise<Boolean>}
	 */
	isVisibled(){
		return this.isDisplayed();
	}

	/**
	 * @return {!Promise<Boolean>}
	 */
	isFocused(){
		/*
		// This is not work in IE after labelEl.click()
		return this.getAttribute('class')
			.then( cls => /x-.*focus/.test(cls) );
		*/
		return this.findElements({css: ':focus'})
			.then(els => els.length > 0);
	}

	executeScript(script, ...var_args){
		return this.driver_.executeAsyncScript([
			'var callback = arguments[arguments.length - 1];',
			'var cmp = Ext.getCmp(\'' + this.id + '\');',
			'callback((function(){',
			script,
			'}).call(cmp, arguments))'
		].join('\n'), var_args);
	}

};

module.exports = ExtComponent;
