
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
};

module.exports = ExtButton;

