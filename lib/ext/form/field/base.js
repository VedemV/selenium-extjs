
'use strict';

const { promise } = require('selenium-webdriver');
const ExtComponent = require('../../component');

class ExtFormField extends ExtComponent {

	constructor(driver, id){
		super(driver, id);
		
		this.inputEl = undefined;
		this.errorEl = undefined;
		
		this.getLabelEl().then(el => this.labelEl = el);
		this.getErrorEl().then(el => this.errorEl = el);
		this.getInputEl().then(el => this.inputEl = el);
		this.getTriggersEl().then(els => this.triggers = els);
	}

	getLabelEl(){
		return this.findElement({css: 'label'})
			.then(el => el.isDisplayed().then(visibled => visibled ? el : undefined));
	}
	getErrorEl(){
		return this.findElements({css: '[data-ref="ariaErrorEl"]'}).then(els => els[0]);
	}
	getInputEl(){
		return this.findElements({css: 'input'}).then(els => els[0]);
	}
	getTriggersEl(){
		return this.findElements({css: '[data-ref="triggerWrap"] .x-form-trigger'})
			.then(els => els.map(item => ExtComponent.fromElement(item)));
	}
	
	getErrors(){
		return this.errorEl
			? this.errorEl.getAttribute('innerText')
				.then( str => str.replace('Input error. ', ''))
				.then( str => str === '' ? [] : [str])
			: this.driver_.controlFlow().promise(resolve => resolve([]));

		//return this.errorEl
		//	? promise.map(this.errorEl.findElements({css: 'li'}), item => item.getAttribute('innerText'))
		//		: this.driver_.controlFlow().promise(resolve => resolve([]));
	}

	getFieldLabel(){
		return this.labelEl && this.labelEl.findElement({css: 'span > span'}).getText();
	}

	getType(){
		return this.inputEl && this.inputEl.getAttribute('type');
	}

	getValue(){
		return this.inputEl && this.inputEl.getAttribute('value');
	}
	
	getExtValue(){
		return this.executeScript('return this.getValue();');
	}

	isDirty(){
		return this.getCls().then( cls => cls.indexOf(this.dirtyCls) !== -1 );
	}

	isValid(){
		return this.driver_.sleep(100)
			.then( _ => this.getErrors() )
			.then( errors => errors.length === 0 );
	}

	sendKeys(keys){
		return this.inputEl && this.inputEl.sendKeys(keys);
	}

	clear(){
		return this.inputEl && this.inputEl.clear();
	}

	get dirtyCls(){
		return 'x-form-dirty';
	}

};

module.exports = ExtFormField;
