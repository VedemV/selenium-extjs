
/*
 * Singleton object - ?
 *
 * getDriver(Capabilities)
 *
 * createDriver
 *
 * removeDriver
 *
 * protected String createKey(Capabilities capabilities, URL hub) {
    return capabilities.toString() + (hub == null ? "" : ":" + hub.toString());
}
 *
 * закрытие драйверов при завершении

function beforeExit(code){
	console.log(`BEFORE EXIT ${code}`);
}
process.once('beforeExit', beforeExit);

process.on('uncaughtException', function(error){
	console.log(`Exception ${error}`);
	beforeExit(process.exitCode);
	process.exit();
});

process.on('exit', function(code){
	console.log(`EXIT ${code}`);
});

 *
 *
 */

'use strict';

const { Builder, Capabilities } = require('selenium-webdriver');
const crypto = require('crypto');


class AbstractDriverPool {

	constructor(){
		this.shutdownHook();
	}

	createKey(capabilities){
		let entries = [];
		for (var [key, value] of capabilities.entries()) {
			entries.push(key + ":" + value);
		}
		console.dir(entries.join());
		return crypto.createHash('md5').update(entries.join()).digest('hex');
	}

	getDriver(capabilities){}

	createDriver(capabilities){}

	removeDriver(driver){}

	removeAll(){}

	shutdownHook(){
		process.once('beforeExit', () => this.removeAll());
		process.on('uncaughtException', (error) => {
			this.removeAll();
			console.error(error);
			process.exit(1);
		});
	}

};

let _singleInstance = null;

class SingleDriverPool extends AbstractDriverPool {

	constructor(){
		if( !_singleInstance ){
			super();
			this._key = null;
			this._driver = null;
			_singleInstance = this;
		}
		return _singleInstance;
	}

	getDriver(capabilities){
		let newKey = this.createKey(capabilities);

		if( !this._driver ){
			return this.createDriver(capabilities);
		} else if( newKey !== this._key ){
			this.removeDriver(this._driver);
			return this.createDriver(capabilities);
		}
		return this._driver;
	}

	createDriver(capabilities){
		this._key = this.createKey(capabilities);
		this._driver = new Builder()
			.withCapabilities(capabilities)
			.build();
		return this._driver;
	}

	removeDriver(driver){
		if( driver !== this._driver ){
			throw 'No driver';
		}
		driver.quit();
		this._driver = null;
		this._key = null;
	}

	removeAll(){
		if(this._driver){
			this.removeDriver(this._driver);
		}
		this._driver = null;
		this._key = null;
	}

}

var capabilities = Capabilities.edge();
console.log(capabilities);
console.log(new SingleDriverPool().createKey(capabilities));
console.log(new SingleDriverPool().createKey(Capabilities.edge()));
console.log(new SingleDriverPool().createKey(Capabilities.android()));
console.log(new SingleDriverPool().createKey(Capabilities.firefox()));
console.log(new SingleDriverPool().createKey(Capabilities.ie()));
console.log(new SingleDriverPool().createKey(Capabilities.chrome()));

new SingleDriverPool().getDriver(Capabilities.edge());

// generate uncaughtException
//var i = qwerty;

new SingleDriverPool().getDriver(Capabilities.ie());
