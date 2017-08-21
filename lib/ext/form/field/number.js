
'use strict';

const { promise } = require('selenium-webdriver');
const ExtFormFieldText = require('./text');

class ExtFormFieldNumber extends ExtFormFieldText {

	constructor(driver, id){
		super(driver, id);

		this.findElement({css: '[data-ref="triggerWrap"] .x-form-trigger-spinner'})
			.then( trigger => {
				trigger.findElement({css: '.x-form-spinner.x-form-spinner-up'})
					.then( el => (this.spinnerUp = el) );
				trigger.findElement({css: '.x-form-spinner.x-form-spinner-down'})
					.then( el => (this.spinnerDown = el) );
			});

	}

};

module.exports = ExtFormFieldNumber;


