'use strict';

const {WebElement, Condition, promise} = require('selenium-webdriver');
const {Region} = require('./../until');
const util = require('./../util');

module.exports = class ExtComponent {

	constructor (driver, index, selector, parent){
		this.driver = driver;
		//console.log(driver.flow_);
		this._flow = driver.controlFlow();
		this._htmlElement = null;
		this.selector = selector || this.defaultSelector;
		this.index = index || 0;
		this.parent = parent || driver;
		//console.dir(this.defaultSelector);
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
		return util.condition(!this._htmlElement, _ => this.getComponent() )
			.then( _ => this._htmlElement );
	}

	conditionLocated(){
		return new Condition('for located element ' + this.selector, () => this.locateElement() );
	}

	locateElement(){
		return this.parent.findElements(this.selector)
			.then( entries => entries[this.index] );
	}

	getComponent(){
		return this.locateElement()
			.then( html => this._htmlElement = html )
			.then( _ => this.getProperties() );
	}

	fulfilled(value){
		if( promise.isPromise(value) ){
			return value;
		}
		return this._flow.promise( resolver => resolver(value) );
	}

	receiveId(){
		return this.fulfilled(this._htmlElement)
			.then( cmp => cmp.getAttribute('id') )
			.then( id => this._id = id );
	}

	receiveRegion(){
		return Region.fromWebElement(this._htmlElement)
			.then( region => this.region = region);
	}

//	receiveOffset(){
//		promise.fulfilled(this.htmlElement)
//			.then( cmp => cmp.getLocation() )
//			.then( location => this.offset = {x: location.x, y: location.y} )
//			.then( _ => this._htmlElement );
//	}
//
//	receiveSize(){
//		promise.fulfilled(this.htmlElement)
//			.then( cmp => cmp.getSize() )
//			.then( size => this.size = {width: size.width, height: size.height} )
//			.then( _ => this._htmlElement );
//	}

	getProperties(){
		return this._flow.execute(() => {
			this.receiveId();
			this.receiveRegion();
		}); //.then( _ => this._htmlElement );//.then( _ => console.log(this.offset, this.size, this.id) );
	}

	click (){
		return promise.fulfilled(this._htmlElement)
//		this.htmlElement
			.then( cmp => cmp.click() );
	}

	sendKeys(keys){
		return this._htmlElement.sendKeys(keys);
	}
};
