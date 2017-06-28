'use strict';

const path = require('path');
const fs = require('fs');
const stripJsonComments = require('strip-json-comments');
const {Browser} = require('selenium-webdriver');

/**
 * Полный путь к файлу конфига.
 * По умолчанию `./test/config.json`.
 * Может быть передан в переменной окружения `SEL_EXTJS_CONFIG`
 *
 */
const configFile = (function(){
	let config = process.env['SEL_EXTJS_CONFIG'] || './test';
	if( path.extname(config) === '' )
		config += '/config.json';

	return path.resolve(process.cwd(), config);
})();

function getArgs(){
	let argv = process.argv;
	let integrity = undefined;
	let timeout = undefined;
	for( var i = 0; i < argv.length; i++ ){
		if( argv[i] === '--delay' ){
			integrity = true;
		} else if( argv[i] === '-t' || argv[i] === '--timeout' ){
			timeout = argv[++i];
		}
	}
	return {
		integrity: integrity,
		timeout: timeout
	};
}

function browsers(config){
	if( process.env['SELENIUM_BROWSER'] ){
		config = process.env['SELENIUM_BROWSER'];
	};

	if( !config ){
		config = Browser.FIREFOX;
	};

	config = (
		Array.isArray(config)
			? config
			: config.split(',')
				.map(item => String.prototype.trim.call(item))
	).map(item => {
		let parts = item.split(/:/)
			.map(item => String.prototype.trim.call(item));

		if (parts[0] === 'ie') parts[0] = Browser.IE;
		if (parts[0] === 'edge') parts[0] = Browser.EDGE;

		return parts.join(':');
	});

    config.forEach(function(browser) {
        let parts = browser.split(/:/, 3);
        let recognized = false;

        for (let prop in Browser) {
            if( Browser.hasOwnProperty(prop) && Browser[prop] === parts[0] ){
                recognized = true;
                break;
            }
        }

		if( !recognized ){
			throw new Error('Invalid configuration of browsers. "'+browser+'" is not recognized.');
		}
    });

	return config;

};

module.exports = (function(){
	let options = null;

	if( fs.existsSync(configFile) ){
		try {
			options = JSON.parse(
				stripJsonComments(
					String( fs.readFileSync(configFile) ) ) );

			//console.log('[CONFIG] Use config from', configFile);
		} catch (e) {
			//
		}
	}
	
	if( !options ){
		options = {};
		//console.log('[CONFIG] Use default config');
	}

	let arg = getArgs();

	if( !arg.integrity && options.integrity ){
		//throw new Error("errorMessage");
	} else {
		if( typeof (options.integrity) === 'undefined' ){
			options.integrity = arg.integrity;
		}
	}

	if( typeof (options.timeout) === 'undefined' && arg.timeout !== undefined ){
		options.timeout = parseInt(arg.timeout);
	}
	
	options.explicit = options.explicit || 1000;

	options.browsers = browsers(options.browsers);

	options.screenshots = options.screenshots || '';

	return options;
})();

