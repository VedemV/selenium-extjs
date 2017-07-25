'use strict';

const {WebElement, WebElementPromise, Condition, promise} = require('selenium-webdriver');
const {Region} = require('./../until');
const util = require('./../util');

module.exports = class ExtComponent {

	constructor (driver, index, selector, parent){
		this.driver = driver;
		this._flow = driver.controlFlow();
		this._htmlElement = null;
		this.selector = selector || this.defaultSelector;
		this.index = index || 0;
		this.parent = parent || driver;
	}

	get tag(){
		return 'div';
	}

	get baseCls(){
		return '.x-component';
	}

	get defaultSelector(){
		return {css: this.tag + this.baseCls + (this.componentType ? '[id^="' + this.componentType + '"]' : '')};
	}

	get componentType() {
		return this.constructor.name.replace(/.*Component/, '').toLowerCase() || 'component';
	}

	get htmlElement(){
		if( this._htmlElement instanceof WebElement ){
			return this._htmlElement;
		} else {
			return this.getComponent();
		}

//		return this._htmlElement || this.getComponent();
//		return util.condition(
//			this._htmlElement,
//			_ => this._htmlElement,
//			_ => this.getComponent()
//		);
	}

	get id(){
		return this.htmlElement.then( _ => this._id );
	}

	isVisibled(){
		return this.htmlElement.then( el => el.isDisplayed() );
	}

	isFocused(){
		return this.htmlElement
			.then( el => el.getAttribute('class') )
			.then( cls => /x-.*focus/.test(cls));
	}

	conditionLocated(){
		return new Condition('for located element ' + this.selector, () => this.locateElement() );
	}

	locateElement(){
		return this.parent.findElements(this.selector)
			.then( entries => entries[this.index] || null );
	}

	getComponent(){
		this._htmlElement = new WebElementPromise(this.driver, this.locateElement());
		this.getProperties();
		return this._htmlElement;
	}

	fulfilled(value){
		return this._flow.promise( resolver => resolver(value) );
	}

	receiveId(){
		return this._htmlElement //this.fulfilled(this._htmlElement)
			.then( cmp => this._id = cmp && cmp.getAttribute('id') );
	}

	receiveRegion(){
		return Region.fromWebElement(this._htmlElement)
			.then( region => this.region = region);
	}

	getProperties(){
		return this.receiveId().then( _ => this.receiveRegion() );
	}

	click (){
		return this.htmlElement
			.then( cmp => cmp.click() );
	}

	sendKeys(keys){
		return this._htmlElement.sendKeys(keys);
	}
};
