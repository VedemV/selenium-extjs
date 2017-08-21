
'use strict';

var { WebElement } = require('selenium-webdriver');

class ExtComponent extends WebElement {

	constructor(driver, id){
		super(driver, id);
		this.location = {};
		//this.location = this.driver_.controlFlow().promise(resolve => resolve(this.getLocation()));
		//this.location = this.getLocation();
		this.getLocation().then( l => {this.location.x = l.x; this.location.y = l.y;} );
		this.getSize().then( l => {this.location.width = l.width; this.location.height = l.height;} );
		//this.id = this.getAttribute('id');
		this.getAttribute('id').then( id => (this.id = id) );
	}

	static fromElement(el){
		return new this(el.getDriver(), el.getId());
	}
	static byLocator(driver, locator){
		return this.fromElement(driver.findElement(locator));
		//return driver.findElement(locator).then( el => new this(driver, el ) );
	}

	isVisibled(){
		return this.isDisplayed();
	}

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
