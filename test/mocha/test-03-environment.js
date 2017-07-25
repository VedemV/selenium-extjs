
'use strict';

const config = require('../../lib/config');
const { Browser, promise } = require('selenium-webdriver');
const fs = require('fs');
const Path = require('path');

const assert = require(process.cwd()+'/lib/until/assert');
const AssertionError = require('assert').AssertionError;
const fail = require('assert').fail;
const assertTrue = require('assert').ok;
const assertEqual = require('assert').equal;


const util = require(process.cwd()+'/lib/environment');

console.log('=>', __filename);

var test = describe('environment', function(){
	describe('suite options', function(){

		it('options browsers is [crome, edge, ie]', () => {
			let check = [ 'chrome', 'internet explorer', 'MicrosoftEdge' ];

			util.suite( function(env){
				assertTrue(check.indexOf(env.currentBrowser()) !== -1, env.currentBrowser() + ' not found!');
			},{
				browsers: [
					'chrome',
					'edge',
					'ie'
				]
			});
		});

		it('options browsers is `crome, edge, ie`', () => {
			let check = [ 'chrome', 'internet explorer', 'MicrosoftEdge' ];

			util.suite( function(env){
				assertTrue(check.indexOf(env.currentBrowser()) !== -1, env.currentBrowser() + ' not found!');
			},{
				browsers: 'crome, edge, ie'
			});
		});

		it('options browsers empty', () => {
			let check = [ 'chrome', 'firefox', 'internet explorer', 'MicrosoftEdge' ];

			util.suite( function(env){
				assertTrue(check.indexOf(env.currentBrowser()) !== -1, env.currentBrowser() + ' not found!');
			});
		});
	});
});
//test.delayed = true;
//console.log(test.root, test.delayed);
//console.dir(test.parent);


