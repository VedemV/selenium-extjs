
/**
 *
 * browsers
 * ========
 *
 * Доступные браузеры для выполнения тестов.
 * Порядок использования браузеров соответствует порядку конфигурации.
 *
 * Параметр перебивается переменной окружения `SELENIUM_BROWSER`.
 *
 * Значение по умолчанию firefox
 *
 *
 * delay
 * =====
 *
 * Ожидание загрузки всех тестов
 * Должно быть установлено параметром запуска --delay
 *
 *
 * timeout
 * =======
 *
 * Время ожидания выполнения тестов.
 * Может быть установлено параметром запуска --timeout
 *
 *
 * explicit
 * ========
 *
 * Время ожидания загрузки страницы.
 * По умолчанию = 1000.
 *
 *
 * screenshots
 * ===========
 *
 * Путь сохранения снимков экрана при ошибке selenium тестов
 *
 *
 * logs
 * ====
 *
 * Путь сохранения логов консоли при ошибке selenium тестов
 *
 *
 * baseurl
 * =======
 *
 * Базовый URL тестируемых страниц
 * 
 */

'use strict';

const path = require('path');
const fs = require('fs');
const stripJsonComments = require('strip-json-comments');
const {Browser} = require('selenium-webdriver');

/**
 * Полный путь к файлу конфига.
 * По умолчанию `./test/config.json`.
 * Может быть изменен в переменной окружения `SEL_EXTJS_CONFIG`
 *
 */
const configFile = (function(){
	let config = process.env['SEL_EXTJS_CONFIG'] || './test';
	if( path.extname(config) === '' )
		config += '/config.json';

	return path.resolve(process.cwd(), config);
})();

/**
 * Возвращает параметры конфигурации,
 * указанные в командной строке.
 *
 * Имеют больший приоритет перед параметрами `config.json`.
 *
 * @return {Object}
 */
function getArgs(){
	let argv = process.argv;
	let delay = undefined;
	let timeout = undefined;

	for( var i = 0; i < argv.length; i++ ){
		if( argv[i] === '--delay' ){
			delay = true;
		} else if( argv[i] === '-t' || argv[i] === '--timeout' ){
			timeout = argv[++i];
		}
	}

	return {
		delay: delay,
		timeout: timeout
	};
}

/**
 * Возвращает список браузеров для выполнения тестов.
 *
 * Приоритет параметров:
 *
 * - SELENIUM_BROWSER если указан, применяется как основной параметр
 * - config.json
 * - FIREFOX по умолчанию
 *
 * @param {Array/String} config
 * @returns {Array}
 */
function browsers(config){
	if( process.env['SELENIUM_BROWSER'] ){
		config = process.env['SELENIUM_BROWSER'];
	};

	if( !config ){
		config = Browser.FIREFOX;
	};

	// config = browsers: ['ie', 'chrome', etc.] or browsers: 'chrome, firefox, etc.'
	// => config = [...]
	config = Array.isArray(config) ? config
		: config.split(',').map(item => String.prototype.trim.call(item));

	config = config.map(item => {
			let parts = item.split(/:/)
				.map(item => String.prototype.trim.call(item));

			if (parts[0] === 'ie') parts[0] = Browser.IE;
			if (parts[0] === 'edge') parts[0] = Browser.EDGE;

			return parts.join(':');
		});
		
	// Все браузеры в конфиге поддерживаются в selenium
    config.forEach(function(browser){
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

	// Загрузка `config.json`
	if( fs.existsSync(configFile) ){
		try {
			options = JSON.parse(
				stripJsonComments(
					String( fs.readFileSync(configFile) ) ) );
		} catch (e) {}
	}
	
	if( !options ){
		options = {};
		console.log('[CONFIG] Use default config');
	}

	let arg = getArgs();

	// Параметры строки запуска
	if( typeof arg.delay !== 'undefined' ){
		options.delay = arg.delay;
	} else {
	//if( typeof (options.delay) !== 'undefined' ){
		options.delay = false;
	}

	if( options.timeout === undefined && arg.timeout !== undefined ){
		options.timeout = parseInt(arg.timeout);
	}
//	if( arg.timeout !== undefined ){
//		options.timeout = parseInt(arg.timeout);
//	}
	if( options.timeout === undefined ){
		options.timeout = 120000;
	}
	
	options.explicit = options.explicit || 1000;

	options.browsers = browsers(options.browsers);

	options.screenshots = options.screenshots || '';

	return options;
})();

