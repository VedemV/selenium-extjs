
'use strict';

//const { promise } = require('selenium-webdriver');
const ExtFormFieldText = require('./text');

class ExtFormFieldDate extends ExtFormFieldText {

	getExtValue(){
		return this.executeScript('var value = this.getValue(); return value instanceof Date ? Ext.Date.format(value, "m/d/Y") : value;');
			//.then( time => {
			//	console.log(time);
			//	return typeof time === 'number' ? new Date(time) : time;
			//});
	}

	get listSelector(){
		return {css: '[id="' + this.id + '-picker"]'};
	}

	getBoundlist(){
		return this.driver_.findElements(this.listSelector).then( els => els[0] );
	}

};

module.exports = ExtFormFieldDate;

/*
 * рыба - 1 кг
 * лук - 500 г
 * морковь - 300 г
 * 
 * масло - 1 ст
 * томатпаста - 1/2 ст
 * сахар - 1/2 ст
 * уксус 9% - 1/2 ст
 * вода 1/2 ст
 * соль 2 ст.л.
 * перец душистый
 * лавровый лист
 *
 * слоями лук морковь рыба
 * залить соусом
 * тушить 3 часа
 * добавить перец, лавр. лист
 * тушить 30 мин
 * остудить на ночь
 */
