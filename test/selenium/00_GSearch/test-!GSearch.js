/**
 * # Проверка запуска Selenium WebDriver.
 *
 * При ошибке теста текущий браузер вынимается из конфигурации.
 * 
 * Тест введен для обхода проблемы
 * (#683)[https://github.com/mozilla/geckodriver/issues/683].
 *
 */

'use strict';

const until = require('selenium-webdriver').until;
const Browser = require('selenium-webdriver').Browser;
const test = require(process.cwd()+'');
const config = require(process.cwd()+'/lib/config');

console.log('=>', __filename);

test.suite(function( env ){
	test.describe('Проверка выполнения SendKeys', function(){
		test.it('WebDriver успешно выполнил поиск в Google', function(){
			this.retries(3);
			return env.driver.get('http://www.google.com/ncr')
				.then( _ => env.driver.findElement({name: 'q'}).clear() )
				.then( _ => env.driver.findElement({name: 'q'}).sendKeys('webdriver') )
				.then( _ => env.driver.findElement({name: 'btnG'}).click() )
				.then( _ => env.driver.wait(until.titleIs('webdriver - Google Search'), 1000) )
				.then( null, e => {
					let index = config.browsers.indexOf(env.currentBrowser());
					if( ~index ){
						config.browsers.splice(index, 1);
						this.test.title = 'Ошибка при выполнении поиска Google. Браузер '
							+ env.currentBrowser()
							+ '`  исключен из тестов.';
					}
					console.error(e);
					this.skip();
				});
		});
	});
}, {
	delay: false
});


