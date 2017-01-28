'use strict';

const stage = require('../'); //require('extjs-selenium-stage');

console.log('file test1');
stage.suite();

var value = 'qwerty,asdfg,zxcv';
console.log( Array.from( 
	Array.isArray(value)
		? value
		: value.split(',')
			.map(item => String.prototype.trim.call(item))
			.map(item => {
				var parts = item.split(/:/)
					.map(item => String.prototype.trim.call(item));

				//if (parts[0] === 'ie')
				//	parts[0] = webdriver.Browser.IE;
				//if (parts[0] === 'edge')
				//	parts[0] = webdriver.Browser.EDGE;

				return parts.join(':');
			} ) ) );


