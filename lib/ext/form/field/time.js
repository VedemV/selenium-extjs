
'use strict';

const ExtFormFieldComboBox = require('./combo');

class ExtFormFieldTime extends ExtFormFieldComboBox {

	getExtValue(){
		return this.executeScript('var value = this.getValue(); return value && value.getTime();')
			.then( time => time && new Date(time) );
	}

};

module.exports = ExtFormFieldTime;

