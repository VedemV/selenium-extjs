
'use strict';

const { promise } = require('selenium-webdriver');
const ExtFormFieldText = require('./text');

class ExtFormFieldComboBox extends ExtFormFieldText {

	constructor(driver, id){
		super(driver, id);

		this.driver_.controlFlow().promise(resolve => resolve(this.id))
			.then(_ => this.getRecords(true) )
			.then( records => this.records = records );
	}

	getRecords( bypassFilters ){
		return this.executeScript([
			'var data = [];',
			'this.store.each(function(item){',
			'var o = {id: item.data.id};',
			'o[this.valueField] = item.data[this.valueField];',
			'o[this.displayField] = item.data[this.displayField];',
			'data.push(o);',
			'}, this, ',
			!!bypassFilters,
			');',
			'return data;'
		].join('\n'));
	}

	getBoundlistSelector(){
		return {css: '[id="' + this.id + '-picker"]'};
	}

	getBoundlist(){
		var listSelector = this.getBoundlistSelector();
		return this.driver_.findElements(listSelector).then( els => els[0] );
	}

	getBoundlistRecords(){
		return this.getBoundlist()
			.then( list => list 
				? list.findElements({css: 'li'})
				: this.driver_.controlFlow().promise(resolve => resolve([])) );
	}

};

module.exports = ExtFormFieldComboBox;

