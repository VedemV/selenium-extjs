
'use strict';

const decache = require('decache');
const assert = require('assert');
const configJs = process.cwd()+'/lib/config';

console.log('=>', __filename);

describe('config:', function(){
	let config = null;
	//this.timeout(60000);
	
	after(() => {
		decache(configJs);
		config = require(configJs);
	});

	describe('the default configuration from the file `./test/config.json`:', function(){

		before(() => config = require(configJs) );
		after(() => decache(configJs));

		it('value `timeout` is defined', () => {
			assert.ok(config.timeout);
		});

		it('value of `timeout` is 100000', () => {
			assert.equal(config.timeout, 100000);
		});

		it('value of `explicit` is 120000', () => {
			assert.equal(config.explicit, 120000);
		});

		it('value of `browsers` is [chrome, firefox, edge, ie]', () => {
			assert.deepEqual(config.browsers, [ 'chrome', 'firefox', 'MicrosoftEdge', 'internet explorer' ]);
		});
	});

	describe('configuration from the file `' + __dirname + '/config.json`:', function(){

		before(() => {
			process.env['SEL_EXTJS_CONFIG'] = __dirname;
			config = require(configJs);
		});

		after(() => {
			process.env['SEL_EXTJS_CONFIG'] = undefined;
			decache(configJs);
		});

		it('value `name` is "Test mocha"', () => {
			assert.ok(config.name);
			assert.equal(config.name, 'Test mocha');
		});

		it('value `timeout` is defined', () => {
			assert.ok(config.timeout);
		});

		it('value of `explicit` is the default value (1000)', () => {
			assert.equal(config.explicit, 1000);
		});

		it('value of `browsers` is the default value (firefox)', () => {
			assert.deepEqual(config.browsers, [ 'firefox' ]);
		});
	});

	describe('configuration file not found, default values used', function(){

		before(() => {
			process.env['SEL_EXTJS_CONFIG'] = 'undefined.json';
			config = require(configJs);
		});

		after(() => {
			process.env['SEL_EXTJS_CONFIG'] = undefined;
			decache(configJs);
		});

		it('Value `timeout` is defined on the command line', () => {
			assert.ok(config.timeout);
		});

		it('value of `explicit` is the default value (1000)', () => {
			assert.equal(config.explicit, 1000);
		});

		it('value of `browsers` is the default value (firefox)', () => {
			assert.deepEqual(config.browsers, [ 'firefox' ]);
		});
	});
});
