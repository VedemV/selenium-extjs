
'use strict';

const ExtFormField = require('./base');

class ExtFormFieldText extends ExtFormField {

	getEmptyText(){
		return this.inputEl && this.inputEl.getAttribute('placeholder');
	}

};

module.exports = ExtFormFieldText;
