
'use strict';

const { promise } = require('selenium-webdriver');
const ExtComponent = require('../../component');

class ExtFormField extends ExtComponent {

	constructor(driver, id){
		super(driver, id);
		this.inputEl = undefined;
		this.errorEl = undefined;
		this.findElement({css: 'label'}).then( el => el.isDisplayed().then( visibled => this.labelEl = visibled ? el : undefined ) );
		//this.findElement({css: '[data-ref="labelEl"]'}).then( el => (this.label = el) );
		this.findElements({css: '[data-ref="ariaErrorEl"]'}).then( els => (this.errorEl = els[0]) );
		this.findElements({css: 'input'}).then( els => (this.inputEl = els[0]) );
		this.findElements({css: '[data-ref="triggerWrap"] .x-form-trigger'})
			.then( els => (this.triggers = els.map( item => ExtComponent.fromElement(item) )) );
	}

	getErrors(){
		return this.errorEl
			? promise.map([this.errorEl],
				item => item.getAttribute('innerText')
					.then( str => str.replace('Input error. ', '')))
				.then( arr => arr[0] === '' ? [] : arr)
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
