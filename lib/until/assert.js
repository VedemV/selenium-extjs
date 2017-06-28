'use strict';

const assert = require('selenium-webdriver/testing/assert');
const _assert = require('assert');
const types = require('./types');

const assertProto = assert.Assertion.prototype;

assertProto.deepEqual = function(expected, opt_message){
	return types.evaluate(this.subject_,  function (actual) {
		_assert.deepEqual(actual, expected, opt_message);
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
	return types.evaluate(this.subject_,  function (actual) {
		types.checkObject(actual);
		types.checkNumber(actual.x);
		types.checkNumber(actual.y);
		return types.evaluate(expected, function (region) {
			types.checkObject(region);
			types.checkNumber(region.left);
			types.checkNumber(region.right);
			types.checkNumber(region.top);
			types.checkNumber(region.bottom);
			_assert.strictEqual(
				(region.left <= actual.x && region.right >= actual.x)
				&& (region.top <= actual.y && region.bottom >= actual.y), true, opt_message);
		});
	});
};

module.exports = assert;
module.exports.Assertion = assert.Assertion;
