/**
 * # Проверка запуска Selenium WebDriver с выполнением SendKeys на webElement.
 *
 * При ошибке теста текущий браузер вынимается из конфигурации.
 * 
 * Тест введен для обхода проблемы
 * (#683)[https://github.com/mozilla/geckodriver/issues/683].
 *
 */

'use strict';

const { suite, describe, it } = require(process.cwd()+'');
const config = require(process.cwd()+'/lib/config');

console.log('=>', __filename);

suite(function( env ){
	it('checking the execution of SendKeys', function(){
		this.retries(3);
		return env.driver.get('http://www.google.com/ncr')
			.then( _ => env.driver.findElement({name: 'q'}).clear() )
			.then( _ => env.driver.findElement({name: 'q'}).sendKeys('webdriver') )
			.then( null, e => {
				let index = config.browsers.indexOf(env.currentBrowser());
				if( ~index ){
					config.browsers.splice(index, 1);
					this.test.title = 'An error occurred while performing a Google search. The browser `'
						+ env.currentBrowser()
						+ '` is excluded from the tests.';
				}
				console.error(e);
				this.skip();
			});
	});
}, {
	delay: false
});


