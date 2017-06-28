/**
 *
 */

'use strict';

const config = require('./config');
const util = require('./util');

const webdriver = require('selenium-webdriver');
const testing = require('selenium-webdriver/testing');

const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const ie = require('selenium-webdriver/ie');

const Path = require('path');
const fs = require('fs');
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

	/**
	 *
	 */
	browsers (var_args){
		let browsersToIgnore = Array.prototype.slice.apply(arguments, [0]);
		return browsers(this.currentBrowser(), browsersToIgnore);
	}

	ignoreBrowsers (var_args){
		return this.browsers.apply(this, arguments)();
	};

	/**
	 *
	 * @returns {nm$_environment.webdriver.Builder|TestEnvironment.builder.builder|nm$_environment.TestEnvironment.builder.builder}
	 */
	builder (){
		let builder = new webdriver.Builder();
		let realBuild = builder.build;
/*

var webdriver = require('selenium-webdriver');

var Capabilities = require('selenium-webdriver/lib/capabilities').Capabilities;
var capabilities = Capabilities.firefox();
capabilities.set('marionette', true);

var driver = new webdriver.Builder().withCapabilities(capabilities).build();

 */
		builder.build = () => {
			let parts = this.currentBrowser().split(/:/, 3);
			let options;
			
			builder
				.withCapabilities({
					acceptSslCerts : true,
					takesScreensot: true,
					nativeEvents: true
				})
				.forBrowser(parts[0], parts[1], parts[2]);

			builder.setChromeOptions(
					new chrome.Options()
					.setLoggingPrefs(new webdriver.logging.Preferences()
						.setLevel( 'browser', webdriver.logging.Level.ALL )
					)
			);

			builder.setFirefoxOptions(
				new firefox.Options()
					.useGeckoDriver(true)
			);

			builder.setIeOptions(new ie.Options()
				.requireWindowFocus(true)
				//.setLogFile(util.resolveScreenshot('ie', config.logs, 'console.log'))
				//.setLogLevel('INFO')
			);

			return realBuild.call(builder);
			
		};

		return builder;
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

			before(
				// Отмена подключения к драйверу браузера при
				// "живом" удалении браузера из конфигурации
				() => {
					return ~config.browsers.indexOf(browser)
						&& ( me.driver = me.builder().build() );
				}
			);

			after( () => me.driver && me.driver.quit() );

			beforeEach( function(){
				// отмена теста при
				// "живом" удалении браузера из конфигурации
				if( config.browsers.indexOf(browser) === -1 ){
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
				me.tasks[i]( me );
			}
		});
	}

	screenshot (filename) {
		return this.driver.takeScreenshot()
			.then( data => data.replace('data:image/png;base64', '') )
			.then( data => util.writeImage(filename, data) )
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


exports.suite = function(fn, options){
	options = options || {};
	let browsers = options.browsers;
	if( browsers ){
		browsers = browsers.filter( function(browser){
			return config.browsers.indexOf(browser) !== -1;
		});
	} else {
		browsers = config.browsers;
	}
	let integrity = config.integrity && options.integrity !== false;

	browsers.forEach( function(browser){

		let env = (function(){
			if( integrity ){
				return !!environments[browser]
					? environments[browser]
					: environments[browser] = new TestEnvironment(browser);
			} else {
				return new TestEnvironment(browser);
			}
		})();
		env.addTask(fn);
		if( !integrity ){
			env.run();
		}
	});
 
};

process.nextTick( function(){

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

