
'use strict';

const { promise } = require('selenium-webdriver');
const ExtComponent = require('../component');

class ExtButton extends ExtComponent {

	constructor(driver, id){
		super(driver, id);
		this.iconEl = undefined;
		this.textEl = undefined;
		this.getIconEl().then(el => this.iconEl = el);
		this.getTextEl().then(el => this.textEl = el);
	}

	getIconEl(){
		return this.findElements({css: '[data-ref="btnIconEl"]'})
			.then( els => els[0] && ExtComponent.fromElement(els[0]) );
	}

	getTextEl(){
		return this.findElements({css: '[data-ref="btnInnerEl"]'})
			.then( els => els[0] && ExtComponent.fromElement(els[0]) );
	}

	getCls(){
		return this.getAttribute('class').then( cls => cls.split(' ') );
	}

	isEnabled(){
		return this.getCls()
			.then( cls => cls.indexOf('x-item-disabled') === -1
				&& cls.indexOf('x-btn-disabled') === -1);
	}

	isFocused(){
		return this.getCls()
			.then( cls => cls.indexOf('x-focus') !== -1
				|| cls.indexOf('x-btn-focus') !== -1);
	}

	isPressed(){
		return this.getCls()
			.then( cls => cls.indexOf('x-btn-pressed') !== -1);
	}
	
	getText(){
		// EDGE returned non-icon text as ' '
		return this.textEl.getText().then(text => text.trim());
	}
	
	getScale(){
		return this.getAttribute('class')
			.then( cls => /small/.test(cls) ? 'small' 
				: (/medium/.test(cls) ? 'medium' 
					: (/large/.test(cls) ? 'large' : undefined)));
	}
};

module.exports = ExtButton;

