/**
 *
 */

'use strict';

const config = require('./config');
const util = require('./util');
const driverPool = require('./until/builder');

const webdriver = require('selenium-webdriver');
const {Browser, Capability, Capabilities} = require('selenium-webdriver');

const testing = require('selenium-webdriver/testing');

const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const ie = require('selenium-webdriver/ie');

const Path = require('path');
const fs = require('fs');
const Suite = require('mocha').Suite;
const Test = require('mocha').Test;
const { map } = require('lodash');

/**
 *
 * @param {type} currentBrowser
 * @param {type} browsersToIgnore
 * @returns {Function}
 */
function browsers(currentBrowser, browsersToIgnore) {
	return function() {
		return browsersToIgnore.indexOf(currentBrowser) !== -1;
	};
}

/**
 *
 */
class TestEnvironment{

	constructor (browserName){
		this.currentBrowser = () => browserName;
		this.driver = null;
		this.tasks = [];
	}

	browsers (var_args){
		let browsersToIgnore = Array.prototype.slice.apply(arguments, [0]);
		return browsers(this.currentBrowser(), browsersToIgnore);
	}

	build (capabilities){
		return driverPool.getDriver(capabilities || new Capabilities());
	}

	/**
	 *
	 * @param {type} task
	 * @returns {undefined}
	 */
	addTask (task){
		this.tasks.push(task);
	}

	/**
	 *
	 * @returns {undefined}
	 */
	run (){
		if( !this.tasks.length ) return;

		let me = this;
		let browser = me.currentBrowser();

		describe('[' + browser + ']', function(){

			if(config.timeout){
				this.timeout(config.timeout);
			}

			after( () => driverPool.removeAll() );

			beforeEach( function(){
				// отмена теста при
				// "живом" удалении браузера из конфигурации
				if( !~config.browsers.indexOf(browser) ){
					this.skip();
				}
			});

			afterEach( function() {
				let test = this.currentTest;
				let screenshot = util.resolveScreenshot(browser, config.screenshots, test.title, false);
				let log = util.resolveScreenshot(browser, config.logs, test.title+'.log', false);

				return util.condition( test.state === 'failed', _ => me.screenshot(screenshot)
					.then( util.condition( me.browsers(webdriver.Browser.CHROME), _ => me.logs(log) ) )
				);
			});

			for( var i = 0; i < me.tasks.length; i++){
				(function(task){
					describe('', function(){

						// Отмена подключения к драйверу браузера при
						// "живом" удалении браузера из конфигурации
						before( function(){ 
							if( ~config.browsers.indexOf(browser) ){
								return me.driver = me.build(task.capabilities);
							}
						});

						task.fn( me );
					});
				})(me.tasks[i]);
			}
		});
	}

	screenshot (filename) {
		return this.driver.takeScreenshot()
			.then( data => data && data.replace('data:image/png;base64', '') )
			.then( data => data && util.writeImage(filename, data) )
			.then(
				name => console.log('Screenshot save to ' + name),
				err => console.log('Screenshot save error ' + err.message)
			);
	}

	logs (filename) {
		return this.driver.manage().logs().get( 'browser' )
			.then( logs => map( logs, log => '[' + log.level.name + '] ' + log.message ) )
			.then( logs => logs.join('\r\n') )
			.then( data => util.writeText(filename, data) )
			.then(
				name => console.log('Browser logs save to ' + name),
				err => console.log('Browser logs save error ' + err.message)
			);
	}

};

let environments = {};

/**
 *
 * @param {type} fn
 *
 * @param {Object} options
 * Пераметры тестов
 *
 * @param {String[]/String} options.browsers
 * Список браузеров
 *
 * @param {Object[]} options.capabilities
 * Список Capabilities браузеров
 *
 * @param {Boolean} options.delay=true
 * Ожидание подкючения всех тестов.
 * false - немедленное выполнение теста
 *
 * @param {Boolean} options.screenshot=false
 * true - создание screenshot при ошибках теста
 *
 */
exports.suite = function(fn, options){
	options = options || {};

	let delay = config.delay && options.delay !== false;
	let browsers = options.browsers;
	
	if( browsers ){
		browsers = util.parseBrowsers(browsers);
		browsers = browsers.filter( function(browser){
			return config.browsers.indexOf(browser) !== -1;
		});
	} else {
		browsers = config.browsers;
	}


	browsers.forEach( function(browser){
		let parts = browser.split(/:/);
		let configCapabilities = config.capabilities || {};
		let optCapabilities = options.capabilities || {};
		let capabilities = new Capabilities(configCapabilities['*'] || {});

		capabilities.merge(optCapabilities['*'] || {});

		if( parts[0] === Browser.IE ){
			capabilities.merge(configCapabilities['ie'] || configCapabilities[Browser.IE] || {});
			capabilities.merge(optCapabilities['ie'] || optCapabilities[Browser.IE] || {});
		} else if( parts[0] === Browser.EDGE ){
			capabilities.merge(configCapabilities['edge'] || configCapabilities[Browser.EDGE] || {});
			capabilities.merge(optCapabilities['edge'] || optCapabilities[Browser.EDGE] || {});
		} else {
			capabilities.merge(configCapabilities[parts[0]] || {});
			capabilities.merge(optCapabilities[parts[0]] || {});
		}

		if( !capabilities.get(Capability.BROWSER_NAME) )
			capabilities.set(Capability.BROWSER_NAME, parts[0]);

		if( !capabilities.get(Capability.VERSION) && parts[1] )
			capabilities.set(Capability.VERSION, parts[1] || null);

		if( !capabilities.get(Capability.PLATFORM) && parts[2] )
			capabilities.set(Capability.PLATFORM, parts[2] || null);

		let env = (function(){
			if( delay ){
				return !!environments[browser]
					? environments[browser]
					: environments[browser] = new TestEnvironment(browser);
			} else {
				return new TestEnvironment(browser);
			}
		})();
		
		env.addTask({fn: fn, capabilities: capabilities});
		if( !delay ){
			env.run();
		}
	});
 
};

process.nextTick(function(){

	for( var env in environments ){
		if( !environments.hasOwnProperty(env) ) continue;

		console.log( env + ': task(s) ' + environments[env].tasks.length );
		environments[env].run();
	}
	try{ run(); } catch(e){}
});

exports.after = testing.after;
exports.afterEach = testing.afterEach;
exports.before = testing.before;
exports.beforeEach = testing.beforeEach;
exports.describe = testing.describe;
exports.it = testing.it;
exports.ignore = testing.ignore;

if (require.main === module) {
	console.log(environments);
}
