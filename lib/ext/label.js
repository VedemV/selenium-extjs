'use strict';

const ExtComponent = require('./component');

module.exports = class ExtComponentLabel extends ExtComponent {

	get tag(){
		return 'label';
	}

	get baseCls(){
		return '.x-form-item-label';
	}

	get componentType() {
		return '';
	}

	getText(){
		return this._htmlElement.getText();
	}
};


