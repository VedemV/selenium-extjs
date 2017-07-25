'use strict';

const {WebElement, Condition, promise} = require('selenium-webdriver');

const ExtComponent = require('./component');
const ExtComponentLabel = require('./label');

module.exports = class ExtComponentTextField extends ExtComponent {

	get baseCls(){
		return '.x-field';
	}

	getProperties(){
		return super.getProperties()
			.then(_ => (this.label = new ExtComponentLabel(this.driver, 0, null, this._htmlElement)).getComponent() );
	}

	getInput(){
		return this.htmlElement.findElement({ css: 'input' });
	}

	getValue(){
		return this.getInput().getAttribute('value');
	}

	isFocused(){

		function focused(parent_id){
			var el =document.querySelector('#' + parent_id).querySelector(':focus');
			return el && el.id;
		}

		return super.isFocused()
			.then( result => this.driver.executeScript(focused, this._id )
			.then( id => this.getInput()
				.then( el => el.getAttribute('id') )
				.then( input_id => input_id === id )
			)
			.then( id => id || result )
		);
	}

	isSelected(){
		return this.htmlElement
			.then( el => el.findElement({ css: 'input' }) )
			.then( el => el.isSelected() )
		;
	}

};
