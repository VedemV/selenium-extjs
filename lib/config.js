'use strict';

const path = require('path');
const fs = require('fs');
const stripJsonComments = require('strip-json-comments');

const configFile = (function(){
	var parent = module;
	var filename;

	while( !!parent && !parent.loaded ){
		filename = parent.filename;
		parent = parent.parent;
	}
	return path.resolve(path.dirname(filename), 'config.json');
})();


module.exports = (function(){
	var options;
	if( fs.existsSync(configFile) ){
		try {
			options = JSON.parse(
				stripJsonComments(
					String( fs.readFileSync(configFile) ) ) );

			console.log('Use config from', configFile);
		} catch (e) {
			//
		}
	}
	if( !options ){
		options = {};
		console.log('Use default config');
	}

	return options;
})();

