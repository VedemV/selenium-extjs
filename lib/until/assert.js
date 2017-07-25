'use strict';

const assert = require('selenium-webdriver/testing/assert');
const assertDeepEqual = require('assert').deepEqual;
const assertStrictEqual = require('assert').strictEqual;
const {evaluate, checkObject, checkNumber } = require('./types');

const assertProto = assert.Assertion.prototype;

assertProto.deepEqual = function(expected, opt_message){
	return evaluate(this.subject_,  function (actual) {
		assertDeepEqual(actual, expected, opt_message);
	});
};

/**
 * Проверяет вхождение точки {x, y } в регион expected
 * @param {Object} expected
 * - top
 * - left
 * - bottom
 * - right
 * @param {String} opt_message
 * @return {Promise}
 */
assertProto.isLocatedRegion = function(expected, opt_message){
	return evaluate(this.subject_,  function (actual) {
		checkObject(actual);
		checkNumber(actual.x);
		checkNumber(actual.y);
		return evaluate(expected, function (region) {
			checkObject(region);
			checkNumber(region.left);
			checkNumber(region.right);
			checkNumber(region.top);
			checkNumber(region.bottom);
			assertStrictEqual(
				(region.left <= actual.x && region.right >= actual.x)
				&& (region.top <= actual.y && region.bottom >= actual.y), true, opt_message);
		});
	});
};

module.exports = assert;
module.exports.Assertion = assert.Assertion;
