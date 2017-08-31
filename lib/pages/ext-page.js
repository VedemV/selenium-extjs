'use strict';

const config = require('./../config');
const BasePage = require('./base');
const { Condition } = require('selenium-webdriver');
const { isString } = require('lodash');

class ExtPage extends BasePage {

	constructor( environment, url = null, expected = {css: '.x-viewport'}, namespaces = 'Ext' ) {
		super(environment, url, expected);
		this.namespaces = isString(namespaces) ? namespaces.split(',') : namespaces;
	}

	conditionNamespaces(){
		function testNS( ns ){
			var result = true;
			for( var i = 0; i < ns.length; i++ ){
				result = result && !!window[ns[i]];
			}
			return result;
		}

		return new Condition(
			'for namespaces ' + this.namespaces.join(','),
			driver => driver.executeScript( testNS, this.namespaces )
		);
	}

	expected(){
		return this.driver.wait( this.conditionNamespaces(), config.explicit )
			.then( _ => super.expected() );
	}

};

module.exports = ExtPage;

