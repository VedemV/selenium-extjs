'use strict';

const config = require('./lib/config');
const environment = require('./lib/environment');
const BasePage = require('./lib/pages/base');
const ExtPage = require('./lib/pages/ext-page');

module.exports = {
	config: config,
    suite: environment.suite,
	
	after: environment.after,
	afterEach: environment.afterEach,
	before: environment.before,
	beforeEach: environment.beforeEach,
	describe: environment.describe,
	it: environment.it,
	ignore: environment.ignore,

	BasePage: BasePage,
	ExtPage: ExtPage
};


