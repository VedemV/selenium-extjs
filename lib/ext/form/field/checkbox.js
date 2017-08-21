
'use strict';

const ExtFormField = require('./base');

class ExtFormFieldCheckbox extends ExtFormField {

	constructor(driver, id){
		super(driver, id);
		this.findElement({css: 'label[data-ref="boxLabelEl"]'}).then( el => (this.boxLabelEl = el) );
	}

	getBoxLabel(){
		return this.boxLabelEl && this.boxLabelEl.getText();
	}

	getValue(){
		return this.getCls().then( cls => cls.indexOf(this.checkedCls) !== -1 );
	}

	get checkedCls(){
		return 'x-form-cb-checked';
	}
};

module.exports = ExtFormFieldCheckbox;

