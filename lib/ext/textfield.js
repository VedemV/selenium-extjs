'use strict';

const ExtComponent = require('./component');
const ExtComponentLabel = require('./label');

module.exports = class ExtComponentTextField extends ExtComponent {

	get baseCls(){
		return '.x-field';
	}

	getProperties(){
		return super.getProperties()
			.then( _ => new ExtComponentLabel(this.driver, 0, null, this._htmlElement).getComponent() )
			.then( cmp => this.label = cmp );
	}
};
